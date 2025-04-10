
import React from "react";
import { Outlet, useLocation, Navigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { ChevronLeft, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

const Layout = () => {
  const isMobile = useIsMobile();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(!isMobile);
  const location = useLocation();

  // Check if current module is hidden
  React.useEffect(() => {
    const hiddenModules = JSON.parse(localStorage.getItem("hiddenModules") || "[]");
    const currentPath = location.pathname.slice(1); // Remove leading slash
    
    // If trying to access a hidden module directly, we still allow it
    // This is a design decision - modules are just visually hidden in the sidebar
    // but still accessible by direct URL
  }, [location]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex min-h-screen bg-modulear-background">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      
      <main className={`flex-1 transition-all duration-300 ${isSidebarOpen && !isMobile ? "ml-64" : ""}`}>
        <div className="p-4 md:p-8">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center mb-4">
              {!isMobile && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleSidebar}
                  className="mr-2"
                  aria-label={isSidebarOpen ? "收起側欄" : "展開側欄"}
                >
                  {isSidebarOpen ? <ChevronLeft className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
              )}
              
              {isMobile && !isSidebarOpen && (
                <Button
                  onClick={() => setIsSidebarOpen(true)}
                  variant="ghost"
                  size="icon"
                  className="mr-2"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              )}
            </div>
            <div className="animate-fade-in">
              <Outlet />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;
