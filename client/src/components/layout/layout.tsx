import { useState, useEffect } from "react";
import Sidebar from "./sidebar";
import MobileNav from "./mobile-nav";
import Header from "./header";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Handle responsive behavior
  useEffect(() => {
    const checkWidth = () => {
      const isMobileView = window.innerWidth < 768;
      setIsMobile(isMobileView);
      setIsSidebarOpen(!isMobileView);
    };

    // Set initial state
    checkWidth();

    // Add event listener
    window.addEventListener("resize", checkWidth);
    
    // Clean up event listener
    return () => window.removeEventListener("resize", checkWidth);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen flex bg-background/95 overflow-hidden">
      {/* Sidebar with transition */}
      <div 
        className={`transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0 w-64" : "-translate-x-full w-0 md:translate-x-0 md:w-20"
        }`}
      >
        <Sidebar collapsed={!isSidebarOpen && !isMobile} />
      </div>
      
      {/* Main content area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden transition-all duration-300">
        <Header onToggleSidebar={toggleSidebar} />
        
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
          {children}
        </div>
      </main>
      
      {/* Mobile navigation */}
      {isMobile && <MobileNav />}
    </div>
  );
}
