import { useState } from "react";
import { useLocation } from "wouter";
import { Bell, ShoppingBag, Search, Moon, Sun, ChevronDown, LogOut, User, Settings, Menu, Tag } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Map paths to pretty titles
const PATH_TITLES: Record<string, string> = {
  "/": "Home",
  "/deals": "Deals",
  "/favorites": "Favorites",
  "/settings": "Settings",
};

// Notification indicator component
const NotificationIndicator = ({ count = 0 }: { count?: number }) => {
  if (!count) return null;
  
  return (
    <span className="absolute -top-1 -right-1 h-2.5 w-2.5 bg-primary rounded-full shadow-glow">
      {count > 1 && (
        <span className="absolute -top-3 -right-3 bg-primary text-[10px] font-bold text-primary-foreground rounded-full h-4 w-4 flex items-center justify-center">
          {count > 9 ? '9+' : count}
        </span>
      )}
    </span>
  );
};

interface HeaderProps {
  onToggleSidebar?: () => void;
}

const getTitleFromPath = (path: string): string => {
  if (path === "/") return "Home";
  // Remove the leading slash and capitalize
  return path.slice(1).charAt(0).toUpperCase() + path.slice(2);
};

export default function Header({ onToggleSidebar }: HeaderProps) {
  const [location] = useLocation();
  const { theme, setTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [notificationCount] = useState(3); // This would come from a notification service/context
  
  const getTitle = (): string => {
    return PATH_TITLES[location] || location.slice(1).charAt(0).toUpperCase() + location.slice(2);
  };

  const title = getTitle();
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
  };
  
  return (
    <header className="bg-gradient-to-r from-card to-background backdrop-blur-sm sticky top-0 z-50 border-b border-border/40 px-4 py-3 flex justify-between items-center shadow-sm">
      <div className="flex items-center gap-3">
        {onToggleSidebar && (
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onToggleSidebar}
            className="rounded-full hover:bg-muted/50 transition-all duration-300 mr-1"
          >
            <Menu className="h-5 w-5 text-muted-foreground" />
          </Button>
        )}
      
        <div className="p-2 bg-gradient-to-br from-primary to-primary/80 rounded-lg shadow-md">
          <Tag className="h-4 w-4 text-primary-foreground" />
        </div>
        
        <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-foreground md:hidden">Smart Deal</h1>
        
        <h2 className="text-xl font-bold hidden md:block border-none">
          <span className="text-primary">{title.slice(0, 1)}</span>
          <span>{title.slice(1)}</span>
        </h2>
      </div>
      
      <form onSubmit={handleSearch} className="hidden md:block mx-auto max-w-md w-full px-4">
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-muted-foreground" />
          </div>
          <input
            type="text"
            placeholder="Search deals..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input w-full pl-10 pr-4 bg-muted/30 border-muted/40 focus-visible:border-primary/50"
          />
        </div>
      </form>
      
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="rounded-full hover:bg-muted/50 transition-all duration-300"
          title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        >
          {theme === "dark" ? (
            <Sun className="h-5 w-5 text-muted-foreground" />
          ) : (
            <Moon className="h-5 w-5 text-muted-foreground" />
          )}
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon"
          className="rounded-full hover:bg-muted/50 transition-all duration-300 relative"
          title="Notifications"
        >
          <Bell className="h-5 w-5 text-muted-foreground" />
          <NotificationIndicator count={notificationCount} />
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="rounded-full p-0 hover:bg-transparent focus:ring-0">
              <Avatar className="h-9 w-9 ring-2 ring-background shadow-md transition-transform hover:scale-105">
                <AvatarFallback className="bg-gradient-to-br from-primary/20 to-accent/30 text-foreground font-medium">
                  U
                </AvatarFallback>
              </Avatar>
              <ChevronDown className="ml-1 h-4 w-4 text-muted-foreground md:inline-block hidden" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
