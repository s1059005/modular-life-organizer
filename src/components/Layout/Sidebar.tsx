
import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { BookOpenText, CheckSquare, Clock, Globe, X, PlusCircle, BookText, Save, Volume2, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

interface NavItem {
  id: string;
  title: string;
  path: string;
  icon: React.ReactNode;
  description: string;
  order: number;
}

const defaultNavItems: NavItem[] = [
  {
    id: "todo",
    title: "待辦事項",
    path: "/todo",
    icon: <CheckSquare className="h-5 w-5" />,
    description: "管理您的日常任務和待辦事項",
    order: 0
  },
  {
    id: "diary",
    title: "日記",
    path: "/diary",
    icon: <BookOpenText className="h-5 w-5" />,
    description: "記錄您的日常思想和經歷",
    order: 1
  },
  {
    id: "countdown",
    title: "倒數計時器",
    path: "/countdown",
    icon: <Clock className="h-5 w-5" />,
    description: "為重要事件設置倒數計時",
    order: 2
  },
  {
    id: "worldclock",
    title: "全球時鐘",
    path: "/worldclock",
    icon: <Globe className="h-5 w-5" />,
    description: "查看世界各地的精確時間",
    order: 3
  },
  {
    id: "vocabulary",
    title: "英文單字",
    path: "/vocabulary",
    icon: <BookText className="h-5 w-5" />,
    description: "英文單字學習與測驗",
    order: 4
  },
  {
    id: "backup",
    title: "備份還原",
    path: "/backup",
    icon: <Save className="h-5 w-5" />,
    description: "備份和恢復您的資料",
    order: 5
  }
];

const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  const isMobile = useIsMobile();
  const [navItems, setNavItems] = useState<NavItem[]>([]);
  const [dragItem, setDragItem] = useState<NavItem | null>(null);
  const [dragging, setDragging] = useState(false);
  
  // Load saved menu order from localStorage, or use default order
  useEffect(() => {
    const savedNavItems = localStorage.getItem('navItems');
    if (savedNavItems) {
      setNavItems(JSON.parse(savedNavItems));
    } else {
      setNavItems(defaultNavItems);
    }
  }, []);
  
  // Save menu order to localStorage whenever it changes
  useEffect(() => {
    if (navItems.length > 0) {
      localStorage.setItem('navItems', JSON.stringify(navItems));
    }
  }, [navItems]);

  const handleDragStart = (item: NavItem) => {
    setDragItem(item);
    setDragging(true);
  };

  const handleDragOver = (e: React.DragEvent, targetItem: NavItem) => {
    e.preventDefault();
    if (!dragItem || targetItem.id === dragItem.id) return;

    const updatedNavItems = [...navItems];
    const dragItemIndex = updatedNavItems.findIndex(item => item.id === dragItem.id);
    const targetItemIndex = updatedNavItems.findIndex(item => item.id === targetItem.id);

    // Remove drag item
    const [reorderedItem] = updatedNavItems.splice(dragItemIndex, 1);
    // Insert drag item at target position
    updatedNavItems.splice(targetItemIndex, 0, reorderedItem);
    
    // Update order fields
    const ordered = updatedNavItems.map((item, index) => ({
      ...item,
      order: index
    }));
    
    setNavItems(ordered);
  };

  const handleDragEnd = () => {
    setDragging(false);
    setDragItem(null);
  };
  
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
        <p className="text-xs text-gray-500 mb-2 px-3">功能模組 <span className="text-xs text-gray-400">(拖動排序)</span></p>
        <nav className="space-y-1">
          {navItems.sort((a, b) => a.order - b.order).map((item) => (
            <div 
              key={item.id} 
              className="flex items-center group"
              draggable
              onDragStart={() => handleDragStart(item)}
              onDragOver={(e) => handleDragOver(e, item)}
              onDragEnd={handleDragEnd}
            >
              <div className="cursor-grab pr-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <GripVertical className="h-4 w-4 text-gray-400" />
              </div>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex flex-1 items-center px-3 py-2 rounded-md transition-colors ${
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
            </div>
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
