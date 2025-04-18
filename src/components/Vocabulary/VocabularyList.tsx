
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useModuleContext, VocabularyItem } from "@/contexts/ModuleContext";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Eye, EyeOff, Star, Volume2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";

interface VocabularyListProps {
  items: VocabularyItem[];
  reviewMode?: boolean;
  onEdit: (item: VocabularyItem) => void;
}

const VocabularyList = ({ items, reviewMode = false, onEdit }: VocabularyListProps) => {
  const { deleteVocabularyItem, updateMasteryLevel } = useModuleContext();
  const { toast } = useToast();
  const [selectedItem, setSelectedItem] = useState<VocabularyItem | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showDefinition, setShowDefinition] = useState<Record<string, boolean>>({});
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);

  const handleDeleteConfirm = () => {
    if (selectedItem) {
      deleteVocabularyItem(selectedItem.id);
      toast({
        title: "單字已刪除",
        description: `「${selectedItem.word}」已從您的單字列表中刪除`,
      });
      setShowDeleteDialog(false);
      setSelectedItem(null);
    }
  };

  const toggleDefinition = (id: string) => {
    setShowDefinition((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleMasteryUpdate = (id: string, level: number) => {
    updateMasteryLevel(id, level);
    toast({
      title: "熟練度已更新",
      description: `單字熟練度已更新為 ${level}`,
    });
  };

  const playWordAudio = (word: string) => {
    const speak = () => {
      const voices = speechSynthesis.getVoices();
      const voice = voices.find(v => v.lang === 'en-US') || null;
  
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = 'en-US';
      if (voice) utterance.voice = voice;
  
      setPlayingAudio(word);
      utterance.onend = () => setPlayingAudio(null);
  
      speechSynthesis.speak(utterance);
    };
  
    // 如果語音列表已經存在，直接播放
    if (speechSynthesis.getVoices().length > 0) {
      speak();
    } else {
      // 如果尚未載入語音，等待 voiceschanged 後再播放一次
      const handleVoicesChanged = () => {
        speechSynthesis.removeEventListener('voiceschanged', handleVoicesChanged);
        speak();
      };
  
      speechSynthesis.addEventListener('voiceschanged', handleVoicesChanged);
    }
  };

  const getMasteryLabel = (level: number) => {
    switch (level) {
      case 0: return "未掌握";
      case 1: return "初學";
      case 2: return "學習中";
      case 3: return "熟悉";
      case 4: return "精通";
      case 5: return "完全掌握";
      default: return "未知";
    }
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">尚未添加任何單字</p>
        {!reviewMode && (
          <p className="mt-2 text-sm text-muted-foreground">
            點擊"新增單字"按鈕開始建立您的單字庫
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviewMode ? (
        <div className="grid gap-4 md:grid-cols-2">
          {items.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="p-4 bg-muted/30 flex justify-between items-center">
                  <div className="flex items-center">
                    <h3 className="text-lg font-semibold">{item.word}</h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="ml-2"
                      onClick={() => playWordAudio(item.word)}
                      disabled={playingAudio === item.word}
                    >
                      <Volume2 className={`h-4 w-4 ${playingAudio === item.word ? 'text-primary animate-pulse' : ''}`} />
                      <span className="sr-only">播放發音</span>
                    </Button>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleDefinition(item.id)}
                  >
                    {showDefinition[item.id] ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {showDefinition[item.id] && (
                  <div className="p-4">
                    <p className="mb-2"><span className="font-medium">定義:</span> {item.definition}</p>
                    {item.example && (
                      <p className="mb-2"><span className="font-medium">例句:</span> {item.example}</p>
                    )}
                  </div>
                )}
                <div className="p-4 border-t">
                  <p className="text-sm mb-1">熟練度: {getMasteryLabel(item.masteryLevel)}</p>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <Button
                        key={level}
                        variant={item.masteryLevel >= level ? "default" : "outline"}
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => handleMasteryUpdate(item.id, level)}
                      >
                        {level}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>單字</TableHead>
              <TableHead>定義</TableHead>
              <TableHead>熟練度</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center">
                    {item.word}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="ml-2"
                      onClick={() => playWordAudio(item.word)}
                      disabled={playingAudio === item.word}
                    >
                      <Volume2 className={`h-4 w-4 ${playingAudio === item.word ? 'text-primary animate-pulse' : ''}`} />
                      <span className="sr-only">播放發音</span>
                    </Button>
                  </div>
                </TableCell>
                <TableCell>{item.definition}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < item.masteryLevel ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                        }`}
                      />
                    ))}
                    <span className="ml-2 text-xs text-muted-foreground">
                      {getMasteryLabel(item.masteryLevel)}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(item)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedItem(item);
                        setShowDeleteDialog(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>確認刪除</DialogTitle>
            <DialogDescription>
              您確定要刪除單字 "{selectedItem?.word}" 嗎？此操作無法撤銷。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              取消
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
            >
              刪除
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VocabularyList;
