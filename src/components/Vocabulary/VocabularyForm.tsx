
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useModuleContext, VocabularyItem } from "@/contexts/ModuleContext";
import { X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface VocabularyFormProps {
  onCancel: () => void;
  onComplete: () => void;
  item?: VocabularyItem | null;
}

const VocabularyForm = ({ onCancel, onComplete, item }: VocabularyFormProps) => {
  const { addVocabularyItem, updateVocabularyItem } = useModuleContext();
  const { toast } = useToast();
  const [word, setWord] = useState(item?.word || "");
  const [definition, setDefinition] = useState(item?.definition || "");
  const [example, setExample] = useState(item?.example || "");
  const [notes, setNotes] = useState(item?.notes || "");

  useEffect(() => {
    if (item) {
      setWord(item.word);
      setDefinition(item.definition);
      setExample(item.example);
      setNotes(item.notes || "");
    }
  }, [item]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!word.trim() || !definition.trim()) {
      toast({
        title: "請填寫必填欄位",
        description: "單字和定義是必填欄位",
        variant: "destructive",
      });
      return;
    }

    if (item) {
      updateVocabularyItem(item.id, {
        word,
        definition,
        example,
        notes: notes || undefined,
      });
      toast({
        title: "單字已更新",
        description: `「${word}」已成功更新`,
      });
    } else {
      addVocabularyItem(word, definition, example, notes || undefined);
      toast({
        title: "新單字已添加",
        description: `「${word}」已成功添加到您的單字列表`,
      });
    }
    
    onComplete();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">{item ? "編輯單字" : "新增單字"}</h3>
        <Button 
          type="button" 
          variant="ghost" 
          size="icon" 
          onClick={onCancel}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="word">單字 *</Label>
        <Input
          id="word"
          value={word}
          onChange={(e) => setWord(e.target.value)}
          placeholder="輸入英文單字"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="definition">定義 *</Label>
        <Textarea
          id="definition"
          value={definition}
          onChange={(e) => setDefinition(e.target.value)}
          placeholder="輸入中文定義"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="example">例句</Label>
        <Textarea
          id="example"
          value={example}
          onChange={(e) => setExample(e.target.value)}
          placeholder="輸入例句"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="notes">筆記</Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="添加任何其他筆記或記憶提示"
        />
      </div>
      
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          取消
        </Button>
        <Button type="submit">
          {item ? "更新" : "保存"}
        </Button>
      </div>
    </form>
  );
};

export default VocabularyForm;
