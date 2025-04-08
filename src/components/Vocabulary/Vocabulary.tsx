
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, Search, BookText, Check } from "lucide-react";
import { useModuleContext, VocabularyItem } from "@/contexts/ModuleContext";
import VocabularyList from "./VocabularyList";
import VocabularyForm from "./VocabularyForm";
import VocabularyQuiz from "./VocabularyQuiz";

const Vocabulary = () => {
  const { vocabularyItems } = useModuleContext();
  const [activeTab, setActiveTab] = useState("list");
  const [isAddingWord, setIsAddingWord] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItem, setSelectedItem] = useState<VocabularyItem | null>(null);

  const filteredItems = vocabularyItems.filter(
    (item) =>
      item.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.definition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-2xl font-bold">英文單字學習</CardTitle>
          {activeTab === "list" && !isAddingWord && (
            <Button onClick={() => setIsAddingWord(true)}>
              <Plus className="mr-2 h-4 w-4" />
              新增單字
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {isAddingWord ? (
            <VocabularyForm 
              onCancel={() => {
                setIsAddingWord(false);
                setSelectedItem(null);
              }} 
              onComplete={() => {
                setIsAddingWord(false);
                setSelectedItem(null);
              }}
              item={selectedItem}
            />
          ) : (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="list">
                  <BookText className="mr-2 h-4 w-4" />
                  單字列表
                </TabsTrigger>
                <TabsTrigger value="review">
                  <Search className="mr-2 h-4 w-4" />
                  單字复習
                </TabsTrigger>
                <TabsTrigger value="quiz">
                  <Check className="mr-2 h-4 w-4" />
                  自我測試
                </TabsTrigger>
              </TabsList>
              <TabsContent value="list" className="mt-4">
                <div className="mb-4">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="搜索單字或定義..."
                      className="pl-8 h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <VocabularyList 
                  items={filteredItems} 
                  onEdit={(item) => {
                    setSelectedItem(item);
                    setIsAddingWord(true);
                  }}
                />
              </TabsContent>
              <TabsContent value="review" className="mt-4">
                <VocabularyList 
                  items={vocabularyItems} 
                  reviewMode
                  onEdit={(item) => {
                    setSelectedItem(item);
                    setIsAddingWord(true);
                  }}
                />
              </TabsContent>
              <TabsContent value="quiz" className="mt-4">
                <VocabularyQuiz />
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Vocabulary;
