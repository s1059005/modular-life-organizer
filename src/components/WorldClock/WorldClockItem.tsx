
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { WorldClock } from "@/contexts/ModuleContext";
import { format } from "date-fns";

interface WorldClockItemProps {
  clock: WorldClock;
  currentTime: Date;
  onDelete: (id: string) => void;
}

const WorldClockItem = ({ clock, currentTime, onDelete }: WorldClockItemProps) => {
  // 使用原生的 Intl.DateTimeFormat 處理時區轉換
  const getTimeInTimezone = () => {
    try {
      return new Intl.DateTimeFormat("zh-TW", {
        timeZone: clock.timezone,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }).format(currentTime);
    } catch (error) {
      console.error("Invalid timezone:", error);
      return "-- : -- : --";
    }
  };

  // 取得日期
  const getDateInTimezone = () => {
    try {
      return new Intl.DateTimeFormat("zh-TW", {
        timeZone: clock.timezone,
        year: "numeric",
        month: "long",
        day: "numeric",
        weekday: "long",
      }).format(currentTime);
    } catch (error) {
      console.error("Invalid timezone:", error);
      return "日期錯誤";
    }
  };

  // 計算與本地時間的時差
  const getTimeDifference = () => {
    try {
      const localTime = new Date();
      const localHours = localTime.getHours();
      
      const targetTime = new Intl.DateTimeFormat("en-US", {
        timeZone: clock.timezone,
        hour: "numeric",
        hour12: false,
      }).format(localTime);
      
      const targetHour = parseInt(targetTime);
      
      let diff = targetHour - localHours;
      
      // 處理跨日的情況
      if (diff > 12) diff -= 24;
      if (diff < -12) diff += 24;
      
      return diff === 0 
        ? "與本地時間相同" 
        : diff > 0 
          ? `比本地時間快 ${diff} 小時` 
          : `比本地時間慢 ${Math.abs(diff)} 小時`;
    } catch (error) {
      console.error("Error calculating time difference:", error);
      return "時差計算錯誤";
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="relative pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{clock.city}</CardTitle>
            {clock.label && (
              <CardDescription>{clock.label}</CardDescription>
            )}
          </div>
          <Button 
            variant="ghost" 
            size="icon"
            className="h-8 w-8 absolute top-2 right-2"
            onClick={() => onDelete(clock.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center py-4">
          <div className="text-4xl font-bold mb-2">{getTimeInTimezone()}</div>
          <div className="text-sm text-gray-600 mb-1">{getDateInTimezone()}</div>
          <div className="text-xs text-gray-500">{getTimeDifference()}</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WorldClockItem;
