
import React, { useState } from 'react';
import { Download, Upload, FileCheck } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useModuleContext } from "@/contexts/ModuleContext";

const BackupRestore = () => {
  const { toast } = useToast();
  const [isRestoring, setIsRestoring] = useState(false);
  const moduleContext = useModuleContext();
  
  // 收集所有要備份的資料
  const prepareBackupData = () => {
    const backupData = {
      todos: localStorage.getItem('todos'),
      diaryEntries: localStorage.getItem('diaryEntries'),
      countdowns: localStorage.getItem('countdowns'),
      worldClocks: localStorage.getItem('worldClocks'),
      vocabulary: localStorage.getItem('vocabulary'),
      stickyNotes: localStorage.getItem('stickyNotes'),
      version: '1.0.0',
      timestamp: new Date().toISOString()
    };
    
    return JSON.stringify(backupData, null, 2);
  };
  
  // 下載備份檔案
  const downloadBackup = () => {
    const backupData = prepareBackupData();
    const blob = new Blob([backupData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    
    const date = new Date();
    const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    
    a.href = url;
    a.download = `modulear-backup-${formattedDate}.json`;
    document.body.appendChild(a);
    a.click();
    
    // 清理
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 0);
    
    toast({
      title: "備份成功",
      description: "已成功下載備份檔案",
    });
  };
  
  // 恢復資料
  const restoreBackup = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setIsRestoring(true);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const backupData = JSON.parse(e.target?.result as string);
        
        // 驗證備份檔案格式
        if (!backupData.version || !backupData.timestamp) {
          throw new Error("無效的備份檔案格式");
        }
        
        // 恢復資料到 localStorage
        if (backupData.todos) localStorage.setItem('todos', backupData.todos);
        if (backupData.diaryEntries) localStorage.setItem('diaryEntries', backupData.diaryEntries);
        if (backupData.countdowns) localStorage.setItem('countdowns', backupData.countdowns);
        if (backupData.worldClocks) localStorage.setItem('worldClocks', backupData.worldClocks);
        if (backupData.vocabulary) localStorage.setItem('vocabulary', backupData.vocabulary);
        if (backupData.stickyNotes) localStorage.setItem('stickyNotes', backupData.stickyNotes);
        
        toast({
          title: "恢復成功",
          description: `已從 ${new Date(backupData.timestamp).toLocaleString()} 的備份中恢復資料`,
          variant: "default",
        });
        
        // 重新整理頁面以載入恢復的資料
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } catch (error) {
        console.error("恢復備份時出錯:", error);
        toast({
          title: "恢復失敗",
          description: "無法恢復備份檔案，可能是檔案格式無效",
          variant: "destructive",
        });
      } finally {
        setIsRestoring(false);
      }
    };
    
    reader.onerror = () => {
      toast({
        title: "恢復失敗",
        description: "讀取備份檔案時發生錯誤",
        variant: "destructive",
      });
      setIsRestoring(false);
    };
    
    reader.readAsText(file);
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>備份資料</CardTitle>
          <CardDescription>
            下載您在此應用程式中的所有資料。包括待辦事項、日記、倒數計時、世界時鐘和單字學習資料。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            建議在更新程式或清除瀏覽器快取前進行備份，以防資料遺失。
          </p>
        </CardContent>
        <CardFooter>
          <Button onClick={downloadBackup} className="w-full sm:w-auto">
            <Download className="mr-2 h-4 w-4" />
            下載備份檔案
          </Button>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>恢復資料</CardTitle>
          <CardDescription>
            從先前建立的備份檔案中恢復您的資料。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            注意：恢復備份將覆蓋當前的所有資料，此操作無法撤銷。
          </p>
        </CardContent>
        <CardFooter className="flex flex-col items-start space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
          <div className="w-full sm:w-auto">
            <label htmlFor="backup-file">
              <div className={`flex items-center justify-center px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer ${isRestoring ? 'opacity-50 cursor-not-allowed' : ''}`}>
                <Upload className="mr-2 h-4 w-4" />
                上傳備份檔案
              </div>
              <input
                id="backup-file"
                type="file"
                accept=".json"
                onChange={restoreBackup}
                disabled={isRestoring}
                className="hidden"
              />
            </label>
          </div>
          {isRestoring && (
            <div className="flex items-center text-sm text-muted-foreground">
              <FileCheck className="mr-2 h-4 w-4 animate-pulse" />
              正在恢復資料...
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default BackupRestore;
