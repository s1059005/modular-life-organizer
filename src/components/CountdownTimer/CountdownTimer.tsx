
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Calendar, Trash2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useModuleContext, CountdownTimer as CountdownTimerType } from '@/contexts/ModuleContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { Progress } from '@/components/ui/progress';

interface TimeRemaining {
  total: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const CountdownTimer = () => {
  const { countdowns, addCountdown, deleteCountdown } = useModuleContext();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [now, setNow] = useState(new Date());
  const { toast } = useToast();

  // Update current time every second
  useEffect(() => {
    const intervalId = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const handleAddCountdown = () => {
    if (title.trim() && targetDate) {
      const targetDateObj = new Date(targetDate);
      
      if (targetDateObj > now) {
        addCountdown(title.trim(), targetDateObj);
        setTitle('');
        setTargetDate('');
        setIsAddDialogOpen(false);
        toast({
          title: '已新增倒數計時',
          description: title,
        });
      } else {
        toast({
          title: '無法新增',
          description: '目標日期必須在未來',
          variant: 'destructive',
        });
      }
    }
  };

  const handleDeleteCountdown = (id: string, title: string) => {
    deleteCountdown(id);
    toast({
      title: '已刪除倒數計時',
      description: title,
      variant: 'destructive',
    });
  };

  const calculateTimeRemaining = (targetDate: Date): TimeRemaining => {
    const total = targetDate.getTime() - now.getTime();
    
    if (total <= 0) {
      return { total: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
    }
    
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
    const days = Math.floor(total / (1000 * 60 * 60 * 24));
    
    return { total, days, hours, minutes, seconds };
  };

  // Sort countdowns by nearest target date first
  const sortedCountdowns = [...countdowns].sort((a, b) => a.targetDate.getTime() - b.targetDate.getTime());
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-modulear-primary">倒數計時器</h2>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          新增計時器
        </Button>
      </div>

      {sortedCountdowns.length === 0 ? (
        <div className="text-center py-12 border border-dashed rounded-lg">
          <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-500 mb-2">沒有計時器</h3>
          <p className="text-gray-400 mb-4">新增一個倒數計時器！</p>
          <Button variant="outline" onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            新增計時器
          </Button>
        </div>
      ) : (
        <div className="grid gap-6">
          {sortedCountdowns.map((countdown) => {
            const timeRemaining = calculateTimeRemaining(countdown.targetDate);
            const isExpired = timeRemaining.total <= 0;
            
            // Calculate progress percentage (inverted, as we want to show time passed)
            const totalDuration = countdown.targetDate.getTime() - countdown.createdAt.getTime();
            const elapsedTime = now.getTime() - countdown.createdAt.getTime();
            const progress = Math.min(100, Math.max(0, (elapsedTime / totalDuration) * 100));
            
            return (
              <div 
                key={countdown.id} 
                className={`p-5 border rounded-lg ${isExpired ? 'bg-red-50 border-red-100' : 'bg-white'}`}
              >
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold text-lg">{countdown.title}</h3>
                      <button
                        onClick={() => handleDeleteCountdown(countdown.id, countdown.title)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    
                    <div className="text-sm text-gray-500 mb-3">
                      目標日期: {format(countdown.targetDate, 'yyyy/MM/dd HH:mm')}
                    </div>
                    
                    <Progress value={progress} className="h-2 mb-3" />
                    
                    {isExpired ? (
                      <div className="text-red-500 font-medium">已過期！</div>
                    ) : (
                      <div className="grid grid-cols-4 gap-2 text-center">
                        <div className="bg-modulear-accent rounded p-2">
                          <div className="text-xl font-bold">{timeRemaining.days}</div>
                          <div className="text-xs text-gray-600">天</div>
                        </div>
                        <div className="bg-modulear-accent rounded p-2">
                          <div className="text-xl font-bold">{timeRemaining.hours}</div>
                          <div className="text-xs text-gray-600">時</div>
                        </div>
                        <div className="bg-modulear-accent rounded p-2">
                          <div className="text-xl font-bold">{timeRemaining.minutes}</div>
                          <div className="text-xs text-gray-600">分</div>
                        </div>
                        <div className="bg-modulear-accent rounded p-2">
                          <div className="text-xl font-bold">{timeRemaining.seconds}</div>
                          <div className="text-xs text-gray-600">秒</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Countdown Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>新增倒數計時器</DialogTitle>
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
                placeholder="輸入事件標題..."
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="targetDate" className="text-sm font-medium">
                目標日期
              </label>
              <Input
                id="targetDate"
                type="datetime-local"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                min={format(now, "yyyy-MM-dd'T'HH:mm")}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleAddCountdown}>新增</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CountdownTimer;
