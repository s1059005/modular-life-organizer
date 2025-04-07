
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Calendar, Plus, Edit2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useModuleContext, DiaryEntry } from '@/contexts/ModuleContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';

const Diary = () => {
  const { diaryEntries, addDiaryEntry, updateDiaryEntry, deleteDiaryEntry } = useModuleContext();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [currentEntryId, setCurrentEntryId] = useState<string | null>(null);
  const { toast } = useToast();

  const handleAddEntry = () => {
    if (title.trim() && content.trim()) {
      addDiaryEntry(title.trim(), content.trim());
      setTitle('');
      setContent('');
      setIsAddDialogOpen(false);
      toast({
        title: '已新增日記',
        description: title,
      });
    }
  };

  const handleEditEntry = () => {
    if (currentEntryId && title.trim() && content.trim()) {
      updateDiaryEntry(currentEntryId, title.trim(), content.trim());
      setTitle('');
      setContent('');
      setCurrentEntryId(null);
      setIsEditDialogOpen(false);
      toast({
        title: '已更新日記',
        description: title,
      });
    }
  };

  const handleDeleteEntry = (id: string, title: string) => {
    deleteDiaryEntry(id);
    toast({
      title: '已刪除日記',
      description: title,
      variant: 'destructive',
    });
  };

  const openEditDialog = (entry: DiaryEntry) => {
    setTitle(entry.title);
    setContent(entry.content);
    setCurrentEntryId(entry.id);
    setIsEditDialogOpen(true);
  };

  const openAddDialog = () => {
    setTitle('');
    setContent('');
    setIsAddDialogOpen(true);
  };

  const sortedEntries = [...diaryEntries].sort((a, b) => b.date.getTime() - a.date.getTime());

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-modulear-primary">我的日記</h2>
        <Button onClick={openAddDialog}>
          <Plus className="h-4 w-4 mr-2" />
          新增日記
        </Button>
      </div>

      {sortedEntries.length === 0 ? (
        <div className="text-center py-12 border border-dashed rounded-lg">
          <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-500 mb-2">沒有日記記錄</h3>
          <p className="text-gray-400 mb-4">開始記錄您的第一篇日記吧！</p>
          <Button variant="outline" onClick={openAddDialog}>
            <Plus className="h-4 w-4 mr-2" />
            新增日記
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {sortedEntries.map(entry => (
            <div key={entry.id} className="p-4 border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-lg truncate flex-1">{entry.title}</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => openEditDialog(entry)}
                    className="text-gray-400 hover:text-modulear-primary transition-colors"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteEntry(entry.id, entry.title)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="text-gray-500 text-sm mb-2">
                {format(entry.date, 'yyyy/MM/dd HH:mm')}
              </div>
              <div className="text-gray-700 line-clamp-3">{entry.content}</div>
            </div>
          ))}
        </div>
      )}

      {/* Add Entry Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>新增日記</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="title" className="text-sm font-medium">
                標題
              </label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="輸入標題..."
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="content" className="text-sm font-medium">
                內容
              </label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="輸入內容..."
                rows={10}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleAddEntry}>儲存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Entry Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>編輯日記</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="edit-title" className="text-sm font-medium">
                標題
              </label>
              <Input
                id="edit-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="輸入標題..."
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="edit-content" className="text-sm font-medium">
                內容
              </label>
              <Textarea
                id="edit-content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="輸入內容..."
                rows={10}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleEditEntry}>更新</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Diary;
