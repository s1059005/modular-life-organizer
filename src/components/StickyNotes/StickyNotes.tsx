import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Edit, Save, X, Maximize2 } from "lucide-react";
import { useModuleContext, StickyNote } from "@/contexts/ModuleContext";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const colorOptions = [
  { name: "黃色", value: "bg-yellow-200" },
  { name: "藍色", value: "bg-blue-200" },
  { name: "綠色", value: "bg-green-200" },
  { name: "粉色", value: "bg-pink-200" },
  { name: "紫色", value: "bg-purple-200" },
];

const DEFAULT_WIDTH = 300;  // in pixels
const DEFAULT_HEIGHT = 300; // in pixels

const StickyNotes = () => {
  const { stickyNotes, addStickyNote, updateStickyNote, deleteStickyNote } = useModuleContext();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [noteContent, setNoteContent] = useState("");
  const [selectedColor, setSelectedColor] = useState(colorOptions[0].value);
  const [noteWidth, setNoteWidth] = useState(DEFAULT_WIDTH);
  const [noteHeight, setNoteHeight] = useState(DEFAULT_HEIGHT);

  const handleAddNote = () => {
    if (noteContent.trim()) {
      addStickyNote(noteContent, selectedColor, noteWidth, noteHeight);
      setNoteContent("");
      setIsAdding(false);
      setSelectedColor(colorOptions[0].value);
      setNoteWidth(DEFAULT_WIDTH);
      setNoteHeight(DEFAULT_HEIGHT);
    }
  };

  const handleUpdateNote = (id: string) => {
    if (noteContent.trim()) {
      updateStickyNote(id, noteContent, selectedColor, noteWidth, noteHeight);
      setNoteContent("");
      setEditingId(null);
      setSelectedColor(colorOptions[0].value);
      setNoteWidth(DEFAULT_WIDTH);
      setNoteHeight(DEFAULT_HEIGHT);
    }
  };

  const startEditing = (note: StickyNote) => {
    setEditingId(note.id);
    setNoteContent(note.content);
    setSelectedColor(note.color);
    setNoteWidth(note.width || DEFAULT_WIDTH);
    setNoteHeight(note.height || DEFAULT_HEIGHT);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setNoteContent("");
    setSelectedColor(colorOptions[0].value);
    setNoteWidth(DEFAULT_WIDTH);
    setNoteHeight(DEFAULT_HEIGHT);
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
              
              <div className="space-y-3 mb-4">
                <h4 className="text-sm font-medium">顏色</h4>
                <div className="flex flex-wrap gap-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => setSelectedColor(color.value)}
                      className={`w-8 h-8 rounded-full ${color.value} border ${selectedColor === color.value ? "ring-2 ring-offset-2 ring-black" : ""}`}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
              
              <div className="space-y-3 mb-4">
                <h4 className="text-sm font-medium">尺寸設定</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="width" className="text-sm">寬度 (像素): {noteWidth}</label>
                    <Slider
                      id="width"
                      value={[noteWidth]}
                      min={150}
                      max={500}
                      step={10}
                      onValueChange={(value) => setNoteWidth(value[0])}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label htmlFor="height" className="text-sm">高度 (像素): {noteHeight}</label>
                    <Slider
                      id="height"
                      value={[noteHeight]}
                      min={100}
                      max={400}
                      step={10}
                      onValueChange={(value) => setNoteHeight(value[0])}
                      className="mt-1"
                    />
                  </div>
                </div>
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
            {stickyNotes.map((note) => (
              <div
                key={note.id}
                className={`${note.color} p-4 rounded-lg shadow-md relative flex flex-col break-words`}
                style={{ 
                  width: `${note.width || DEFAULT_WIDTH}px`, 
                  height: `${note.height || DEFAULT_HEIGHT}px`,
                  minHeight: '100px'
                }}
              >
                <div className="absolute top-2 right-2 flex space-x-1">
                  <button
                    onClick={() => startEditing(note)}
                    className="p-1 rounded-full bg-white bg-opacity-50 hover:bg-opacity-70 transition-colors"
                    title="編輯"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => deleteStickyNote(note.id)}
                    className="p-1 rounded-full bg-white bg-opacity-50 hover:bg-opacity-70 transition-colors"
                    title="刪除"
                  >
                    <Trash2 size={16} />
                  </button>
                  <Popover>
                    <PopoverTrigger asChild>
                      <button
                        className="p-1 rounded-full bg-white bg-opacity-50 hover:bg-opacity-70 transition-colors"
                        title="調整尺寸"
                      >
                        <Maximize2 size={16} />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-60">
                      <div className="space-y-3">
                        <h4 className="text-sm font-semibold">調整尺寸</h4>
                        <div className="space-y-2">
                          <label htmlFor={`width-${note.id}`} className="text-xs">寬度: {note.width || DEFAULT_WIDTH}px</label>
                          <Slider
                            id={`width-${note.id}`}
                            value={[note.width || DEFAULT_WIDTH]}
                            min={150}
                            max={500}
                            step={10}
                            onValueChange={(value) => updateStickyNote(
                              note.id, 
                              note.content, 
                              note.color, 
                              value[0], 
                              note.height || DEFAULT_HEIGHT
                            )}
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor={`height-${note.id}`} className="text-xs">高度: {note.height || DEFAULT_HEIGHT}px</label>
                          <Slider
                            id={`height-${note.id}`}
                            value={[note.height || DEFAULT_HEIGHT]}
                            min={100}
                            max={400}
                            step={10}
                            onValueChange={(value) => updateStickyNote(
                              note.id, 
                              note.content, 
                              note.color, 
                              note.width || DEFAULT_WIDTH, 
                              value[0]
                            )}
                          />
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
                <p className="whitespace-pre-wrap pt-6 overflow-auto">{note.content}</p>
                <div className="mt-auto pt-2 text-xs text-gray-600">
                  {new Date(note.createdAt).toLocaleDateString()}
                </div>
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
