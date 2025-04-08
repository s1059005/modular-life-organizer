
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useModuleContext, VocabularyItem } from "@/contexts/ModuleContext";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight, Check, X, Volume2 } from "lucide-react";

interface VocabularyQuizProps {
  onSpeak: (word: string) => void;
}

const VocabularyQuiz = ({ onSpeak }: VocabularyQuizProps) => {
  const { vocabularyItems, updateMasteryLevel } = useModuleContext();
  const { toast } = useToast();
  const [quizItems, setQuizItems] = useState<VocabularyItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [quizMode, setQuizMode] = useState<"word-to-def" | "def-to-word">("word-to-def");

  // 準備測驗
  const prepareQuiz = (mode: "word-to-def" | "def-to-word") => {
    if (vocabularyItems.length < 5) {
      toast({
        title: "單字不足",
        description: "您需要至少5個單字才能開始測驗",
        variant: "destructive",
      });
      return;
    }

    // 隨機選擇10個單字進行測驗，如果單字總數少於10，則全部使用
    const itemCount = Math.min(vocabularyItems.length, 10);
    const shuffled = [...vocabularyItems]
      .sort(() => 0.5 - Math.random())
      .slice(0, itemCount);
    
    setQuizItems(shuffled);
    setCurrentIndex(0);
    setShowAnswer(false);
    setQuizStarted(true);
    setQuizFinished(false);
    setScore({ correct: 0, total: 0 });
    setQuizMode(mode);
  };

  const handleAnswer = (correct: boolean) => {
    if (correct) {
      setScore(prev => ({ ...prev, correct: prev.correct + 1 }));
      const currentItem = quizItems[currentIndex];
      // 如果答對了，增加熟練度（最高到5）
      if (currentItem.masteryLevel < 5) {
        updateMasteryLevel(currentItem.id, currentItem.masteryLevel + 1);
      }
    } else {
      const currentItem = quizItems[currentIndex];
      // 如果答錯了，減少熟練度（最低到0）
      if (currentItem.masteryLevel > 0) {
        updateMasteryLevel(currentItem.id, currentItem.masteryLevel - 1);
      }
    }

    setScore(prev => ({ ...prev, total: prev.total + 1 }));
    
    if (currentIndex < quizItems.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowAnswer(false);
    } else {
      setQuizFinished(true);
    }
  };

  if (!quizStarted) {
    return (
      <div className="space-y-4">
        <p className="text-center mb-4">選擇測驗模式：</p>
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="cursor-pointer hover:bg-muted/30 transition-colors" 
                onClick={() => prepareQuiz("word-to-def")}>
            <CardHeader>
              <CardTitle className="text-center">英文 → 中文</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center">看到英文單字，回答中文定義</p>
            </CardContent>
          </Card>
          
          <Card className="cursor-pointer hover:bg-muted/30 transition-colors"
                onClick={() => prepareQuiz("def-to-word")}>
            <CardHeader>
              <CardTitle className="text-center">中文 → 英文</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center">看到中文定義，回答英文單字</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (quizFinished) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-center">測驗完成！</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-xl mb-2">
            得分: {score.correct} / {score.total}
          </p>
          <p className="text-muted-foreground">
            正確率: {Math.round((score.correct / score.total) * 100)}%
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button onClick={() => setQuizStarted(false)}>
            回到測驗選擇
          </Button>
        </CardFooter>
      </Card>
    );
  }

  const currentItem = quizItems[currentIndex];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">
          {quizMode === "word-to-def" ? "英文 → 中文" : "中文 → 英文"}
        </CardTitle>
        <p className="text-center text-sm text-muted-foreground">
          第 {currentIndex + 1} 題，共 {quizItems.length} 題
        </p>
      </CardHeader>
      <CardContent className="text-center py-8">
        <div className="mb-6">
          <div className="flex items-center justify-center gap-2">
            <h3 className="text-xl font-medium mb-2">
              {quizMode === "word-to-def" ? currentItem.word : currentItem.definition}
            </h3>
            {quizMode === "word-to-def" && (
              <Button 
                variant="ghost" 
                size="sm"
                className="h-8 w-8 p-0" 
                onClick={() => onSpeak(currentItem.word)}
              >
                <Volume2 className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          {showAnswer && (
            <div className="mt-4 p-4 bg-muted rounded-md">
              <p className="font-medium">答案:</p>
              <div className="flex items-center justify-center gap-2 mt-1">
                <p className="text-lg">
                  {quizMode === "word-to-def" ? currentItem.definition : currentItem.word}
                </p>
                {quizMode === "def-to-word" && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="h-8 w-8 p-0" 
                    onClick={() => onSpeak(currentItem.word)}
                  >
                    <Volume2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
              {currentItem.example && (
                <p className="mt-2 text-sm italic">
                  例句: {currentItem.example}
                </p>
              )}
            </div>
          )}
        </div>
        
        {!showAnswer ? (
          <Button onClick={() => setShowAnswer(true)}>
            顯示答案
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <div className="flex justify-center gap-4">
            <Button 
              variant="outline" 
              className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
              onClick={() => handleAnswer(false)}
            >
              <X className="mr-2 h-4 w-4" />
              不會
            </Button>
            <Button 
              variant="outline"
              className="border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
              onClick={() => handleAnswer(true)}
            >
              <Check className="mr-2 h-4 w-4" />
              會了
            </Button>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <div>
          <p className="text-sm text-muted-foreground">
            得分: {score.correct}/{score.total}
          </p>
        </div>
        <Button variant="ghost" onClick={() => setQuizStarted(false)}>
          退出測驗
        </Button>
      </CardFooter>
    </Card>
  );
};

export default VocabularyQuiz;
