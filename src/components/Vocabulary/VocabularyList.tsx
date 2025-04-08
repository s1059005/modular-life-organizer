import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, ChevronDown, ChevronUp, Volume2 } from "lucide-react";
import { useModuleContext, VocabularyItem } from "@/contexts/ModuleContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

interface VocabularyListProps {
  items: VocabularyItem[];
  reviewMode?: boolean;
  onEdit: (item: VocabularyItem) => void;
  onSpeak: (word: string) => void;
}

const VocabularyList = ({ items, reviewMode = false, onEdit, onSpeak }: VocabularyListProps) => {
  const { deleteVocabularyItem } = useModuleContext();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleItem = (id: string) => {
    setExpandedItems(prev => 
      prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]
    );
  };

  const masteryLevelColor = (level: number) => {
    switch (level) {
      case 0: return "bg-red-100 text-red-800";
      case 1: return "bg-orange-100 text-orange-800";
      case 2: return "bg-yellow-100 text-yellow-800";
      case 3: return "bg-green-100 text-green-800";
      case 4: return "bg-blue-100 text-blue-800";
      case 5: return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };
  
  const sortedItems = [...items].sort((a, b) => {
    if (reviewMode) {
      // In review mode, sort by mastery level (lowest first)
      return a.masteryLevel - b.masteryLevel;
    }
    // Otherwise sort by creation date (newest first)
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  if (sortedItems.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">還沒有單字，請添加一些單字開始學習。</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {sortedItems.map((item) => {
        const isExpanded = expandedItems.includes(item.id);
        
        if (reviewMode) {
          // Review mode: Only show word, need to click to reveal definition
          return (
            <div 
              key={item.id} 
              className="border rounded-md overflow-hidden"
            >
              <div
                className={`flex items-center justify-between p-4 cursor-pointer ${
                  isExpanded ? "bg-muted/50" : ""
                }`}
                onClick={() => toggleItem(item.id)}
              >
                <div className="flex items-center gap-3">
                  <Badge 
                    variant="outline"
                    className={`${masteryLevelColor(item.masteryLevel)}`}
                  >
                    {item.masteryLevel}
                  </Badge>
                  <h3 className="font-medium text-lg">{item.word}</h3>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-gray-500 hover:text-blue-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSpeak(item.word);
                    }}
                  >
                    <Volume2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center">
                  {isExpanded ? (
                    <ChevronUp className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  )}
                </div>
              </div>
              {isExpanded && (
                <div className="p-4 pt-0 border-t">
                  <p className="text-gray-700 mb-2">{item.definition}</p>
                  {item.example && (
                    <p className="text-sm text-gray-600 italic mb-3">
                      "{item.example}"
                    </p>
                  )}
                  <div className="flex justify-end space-x-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(item)}
                    >
                      <Edit className="mr-2 h-3 w-3" /> 編輯
                    </Button>
                  </div>
                </div>
              )}
            </div>
          );
        }
        
        // List mode: Show both word and definition
        return (
          <div key={item.id} className="border rounded-md p-4">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <h3 className="font-medium text-lg">{item.word}</h3>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-gray-500 hover:text-blue-600"
                  onClick={() => onSpeak(item.word)}
                >
                  <Volume2 className="h-4 w-4" />
                </Button>
                <Badge 
                  variant="outline"
                  className={`${masteryLevelColor(item.masteryLevel)} ml-2`}
                >
                  熟練度: {item.masteryLevel}
                </Badge>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(item)}
                >
                  <Edit className="mr-2 h-3 w-3" /> 編輯
                </Button>
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 border-red-200 hover:bg-red-50"
                    >
                      <Trash2 className="mr-2 h-3 w-3" /> 刪除
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>確認刪除</DialogTitle>
                    </DialogHeader>
                    <p>確定要刪除單字 "{item.word}" 嗎？此操作無法撤銷。</p>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline">取消</Button>
                      </DialogClose>
                      <Button 
                        variant="destructive"
                        onClick={() => deleteVocabularyItem(item.id)}
                      >
                        刪除
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            <p className="text-gray-700 mt-2">{item.definition}</p>
            {item.example && (
              <p className="text-sm text-gray-600 italic mt-2">
                例句: "{item.example}"
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default VocabularyList;
