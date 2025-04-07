
import React, { useState, useEffect } from "react";
import { useModuleContext } from "@/contexts/ModuleContext";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import WorldClockItem from "./WorldClockItem";

// 預設的時區列表
const TIMEZONES = [
  { label: "台北 (UTC+8)", value: "Asia/Taipei" },
  { label: "東京 (UTC+9)", value: "Asia/Tokyo" },
  { label: "紐約 (UTC-4)", value: "America/New_York" },
  { label: "倫敦 (UTC+1)", value: "Europe/London" },
  { label: "悉尼 (UTC+10)", value: "Australia/Sydney" },
  { label: "洛杉磯 (UTC-7)", value: "America/Los_Angeles" },
  { label: "巴黎 (UTC+2)", value: "Europe/Paris" },
  { label: "香港 (UTC+8)", value: "Asia/Hong_Kong" },
  { label: "新加坡 (UTC+8)", value: "Asia/Singapore" },
  { label: "柏林 (UTC+2)", value: "Europe/Berlin" },
  { label: "莫斯科 (UTC+3)", value: "Europe/Moscow" },
  { label: "迪拜 (UTC+4)", value: "Asia/Dubai" },
];

const WorldClock = () => {
  const { worldClocks, addWorldClock, deleteWorldClock } = useModuleContext();
  const [city, setCity] = useState("");
  const [timezone, setTimezone] = useState("");
  const [label, setLabel] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());

  // 每秒更新當前時間
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleAddClock = () => {
    if (!timezone) {
      toast.error("請選擇時區");
      return;
    }

    const selectedCity = city || TIMEZONES.find(tz => tz.value === timezone)?.label.split(" ")[0] || "未命名城市";
    addWorldClock(selectedCity, timezone, label || undefined);
    toast.success("已新增世界時鐘");
    
    // 清除表單
    setCity("");
    setTimezone("");
    setLabel("");
  };

  return (
    <div className="container py-6 mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-modulear-primary">全球時鐘</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              新增時鐘
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>新增世界時鐘</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="timezone">時區 *</Label>
                <Select value={timezone} onValueChange={setTimezone}>
                  <SelectTrigger id="timezone">
                    <SelectValue placeholder="選擇時區" />
                  </SelectTrigger>
                  <SelectContent>
                    {TIMEZONES.map((tz) => (
                      <SelectItem key={tz.value} value={tz.value}>
                        {tz.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="city">城市名稱 (選填)</Label>
                <Input
                  id="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="自訂城市名稱"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="label">標籤 (選填)</Label>
                <Input
                  id="label"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  placeholder="例如：總部、分公司"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <DialogClose asChild>
                <Button variant="outline">取消</Button>
              </DialogClose>
              <DialogClose asChild>
                <Button onClick={handleAddClock}>新增</Button>
              </DialogClose>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {worldClocks.length === 0 ? (
        <div className="text-center py-12 border rounded-lg border-dashed">
          <h3 className="text-lg font-medium text-gray-600 mb-2">未設置任何全球時鐘</h3>
          <p className="text-gray-500 mb-4">點擊「新增時鐘」按鈕開始創建全球時鐘</p>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                新增時鐘
              </Button>
            </DialogTrigger>
            <DialogContent>
              {/* 與上方相同的對話框內容 */}
            </DialogContent>
          </Dialog>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {worldClocks.map((clock) => (
            <WorldClockItem
              key={clock.id}
              clock={clock}
              currentTime={currentTime}
              onDelete={deleteWorldClock}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default WorldClock;
