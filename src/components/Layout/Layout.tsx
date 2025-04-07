
import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useIsMobile } from "@/hooks/use-mobile";

const Layout = () => {
  const isMobile = useIsMobile();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(!isMobile);

  return (
    <div className="flex min-h-screen bg-modulear-background">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <main className={`flex-1 p-4 md:p-8 transition-all duration-300 ${isSidebarOpen && !isMobile ? "ml-64" : ""}`}>
        <div className="max-w-5xl mx-auto">
          {isMobile && (
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="mb-4 bg-modulear-primary text-white p-2 rounded-md"
            >
              Open Menu
            </button>
          )}
          <div className="animate-fade-in">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;
