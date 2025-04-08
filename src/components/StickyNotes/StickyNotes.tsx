
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Edit, Save, X, ChevronDown, ChevronRight } from "lucide-react";
import { useModuleContext, StickyNote } from "@/contexts/ModuleContext";
import { Textarea } from "@/components/ui/textarea";
import { ResizablePanel, ResizablePanelGroup, ResizableHandle } from "@/components/ui/resizable";

// 修改 StickyNote 介面，增加尺寸參數
interface ResizableStickyNote extends StickyNote {
  width?: number;
  height?: number;
}

const colorOptions = [
  { name: "黃色", value: "bg-yellow-200" },
  { name: "藍色", value: "bg-blue-200" },
  { name: "綠色", value: "bg-green-200" },
  { name: "粉色", value: "bg-pink-200" },
  { name: "紫色", value: "bg-purple-200" },
];

const StickyNotes = () => {
  const { stickyNotes, addStickyNote, updateStickyNote, deleteStickyNote } = useModuleContext();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [noteContent, setNoteContent] = useState("");
  const [selectedColor, setSelectedColor] = useState(colorOptions[0].value);

  // 將 StickyNote[] 轉換為 ResizableStickyNote[]
  const notesWithSize: ResizableStickyNote[] = stickyNotes.map(note => {
    const savedNote = localStorage.getItem(`sticky-note-size-${note.id}`);
    if (savedNote) {
      const { width, height } = JSON.parse(savedNote);
      return { ...note, width, height };
    }
    return { ...note, width: 100, height: 100 };
  });

  const handleAddNote = () => {
    if (noteContent.trim()) {
      addStickyNote(noteContent, selectedColor);
      setNoteContent("");
      setIsAdding(false);
      setSelectedColor(colorOptions[0].value);
    }
  };

  const handleUpdateNote = (id: string) => {
    if (noteContent.trim()) {
      updateStickyNote(id, noteContent, selectedColor);
      setNoteContent("");
      setEditingId(null);
      setSelectedColor(colorOptions[0].value);
    }
  };

  const startEditing = (note: StickyNote) => {
    setEditingId(note.id);
    setNoteContent(note.content);
    setSelectedColor(note.color);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setNoteContent("");
    setSelectedColor(colorOptions[0].value);
  };

  // 儲存便利貼尺寸
  const saveNoteSize = (id: string, width: number, height: number) => {
    localStorage.setItem(`sticky-note-size-${id}`, JSON.stringify({ width, height }));
  };

  // 處理調整大小後事件
  const handleResizeStop = (id: string, width: number, height: number) => {
    saveNoteSize(id, width, height);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-2xl font-bold">便利貼</CardTitle>
          {!isAdding && !editingId && (
            <Button onClick={() => setIsAdding(true)}>
              <Plus className="mr-2 h-4 w-4" />
              新增便利貼
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {(isAdding || editingId) && (
            <div className="mb-6 p-4 border rounded-lg">
              <h3 className="text-lg font-medium mb-2">
                {isAdding ? "新增便利貼" : "編輯便利貼"}
              </h3>
              <Textarea
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                placeholder="輸入便利貼內容..."
                className="min-h-[120px] mb-3"
              />
              <div className="flex flex-wrap gap-2 mb-4">
                {colorOptions.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => setSelectedColor(color.value)}
                    className={`w-8 h-8 rounded-full ${color.value} border ${selectedColor === color.value ? "ring-2 ring-offset-2 ring-black" : ""}`}
                    title={color.name}
                  />
                ))}
              </div>
              <div className="flex space-x-2">
                {isAdding ? (
                  <>
                    <Button onClick={handleAddNote}>
                      <Save className="mr-2 h-4 w-4" />
                      保存
                    </Button>
                    <Button variant="outline" onClick={() => setIsAdding(false)}>
                      <X className="mr-2 h-4 w-4" />
                      取消
                    </Button>
                  </>
                ) : (
                  <>
                    <Button onClick={() => editingId && handleUpdateNote(editingId)}>
                      <Save className="mr-2 h-4 w-4" />
                      更新
                    </Button>
                    <Button variant="outline" onClick={cancelEditing}>
                      <X className="mr-2 h-4 w-4" />
                      取消
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {notesWithSize.map((note) => (
              <div
                key={note.id}
                className="relative"
              >
                <ResizablePanelGroup
                  direction="horizontal"
                  className="w-full rounded-lg overflow-hidden"
                  onLayout={(sizes) => {
                    saveNoteSize(note.id, sizes[0], note.height || 100);
                  }}
                >
                  <ResizablePanel
                    defaultSize={note.width || 100}
                    minSize={20}
                  >
                    <ResizablePanelGroup
                      direction="vertical"
                      onLayout={(sizes) => {
                        saveNoteSize(note.id, note.width || 100, sizes[0]);
                      }}
                    >
                      <ResizablePanel
                        defaultSize={note.height || 100}
                        minSize={20}
                      >
                        <div className={`${note.color} p-4 rounded-lg shadow-md relative min-h-[150px] h-full flex flex-col break-words`}>
                          <div className="absolute top-2 right-2 flex space-x-1">
                            <button
                              onClick={() => startEditing(note)}
                              className="p-1 rounded-full bg-white bg-opacity-50 hover:bg-opacity-70 transition-colors"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => deleteStickyNote(note.id)}
                              className="p-1 rounded-full bg-white bg-opacity-50 hover:bg-opacity-70 transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                          <p className="whitespace-pre-wrap pt-6">{note.content}</p>
                          <div className="mt-auto pt-2 text-xs text-gray-600">
                            {new Date(note.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </ResizablePanel>
                      <ResizableHandle withHandle />
                    </ResizablePanelGroup>
                  </ResizablePanel>
                  <ResizableHandle withHandle />
                </ResizablePanelGroup>
              </div>
            ))}
          </div>

          {stickyNotes.length === 0 && !isAdding && (
            <div className="text-center py-10 text-gray-500">
              <p>還沒有便利貼，點擊「新增便利貼」按鈕開始添加</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StickyNotes;
