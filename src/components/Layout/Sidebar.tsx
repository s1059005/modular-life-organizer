
import React from "react";
import { NavLink } from "react-router-dom";
import { BookOpenText, CheckSquare, Clock, Globe, X, PlusCircle, BookText, Save, StickyNote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

interface NavItem {
  title: string;
  path: string;
  icon: React.ReactNode;
  description: string;
}

const navItems: NavItem[] = [
  {
    title: "便利貼",
    path: "/stickynotes",
    icon: <StickyNote className="h-5 w-5" />,
    description: "創建和管理您的便利貼"
  },
  {
    title: "待辦事項",
    path: "/todo",
    icon: <CheckSquare className="h-5 w-5" />,
    description: "管理您的日常任務和待辦事項"
  },
  {
    title: "日記",
    path: "/diary",
    icon: <BookOpenText className="h-5 w-5" />,
    description: "記錄您的日常思想和經歷"
  },
  {
    title: "倒數計時器",
    path: "/countdown",
    icon: <Clock className="h-5 w-5" />,
    description: "為重要事件設置倒數計時"
  },
  {
    title: "全球時鐘",
    path: "/worldclock",
    icon: <Globe className="h-5 w-5" />,
    description: "查看世界各地的精確時間"
  },
  {
    title: "英文單字",
    path: "/vocabulary",
    icon: <BookText className="h-5 w-5" />,
    description: "英文單字學習與測驗"
  },
  {
    title: "備份還原",
    path: "/backup",
    icon: <Save className="h-5 w-5" />,
    description: "備份和恢復您的資料"
  }
];

const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  const isMobile = useIsMobile();
  
  const sidebarClasses = `
    fixed top-0 left-0 z-40 h-screen
    ${isOpen ? "translate-x-0" : "-translate-x-full"}
    transition-transform duration-300 ease-in-out
    bg-white border-r border-gray-200 
    w-64 p-4 flex flex-col
  `;

  return (
    <aside className={sidebarClasses}>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-modulear-primary">模組化生活管理</h1>
        {isMobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
            className="md:hidden"
          >
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>

      <div className="space-y-1">
        <p className="text-xs text-gray-500 mb-2 px-3">功能模組</p>
        <nav className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center px-3 py-2 rounded-md transition-colors ${
                  isActive
                    ? "bg-modulear-accent text-modulear-primary font-medium"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
              onClick={() => isMobile && setIsOpen(false)}
            >
              <span className="mr-3">{item.icon}</span>
              <span>{item.title}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="mt-auto pt-4 border-t border-gray-200">
        <Button
          variant="outline"
          className="w-full justify-start text-gray-700"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          新增模組
        </Button>
        <p className="text-xs text-gray-500 mt-4 text-center">
          v1.0.0 | 模組化生活管理
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
