import { Link, useLocation } from "wouter";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Home, PlusCircle, BarChart2, Bell, Settings, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  collapsed?: boolean;
}

export default function Sidebar({ collapsed = false }: SidebarProps) {
  const [location] = useLocation();

  const isActive = (path: string) => location === path;

  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: PlusCircle, label: "Track Product", path: "/track" },
    { icon: BarChart2, label: "Dashboard", path: "/dashboard" },
    { icon: Bell, label: "Notifications", path: "/notifications" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  return (
    <aside 
      className={cn(
        "h-screen flex flex-col bg-card/90 backdrop-blur-sm border-r border-border/40 shadow-sm transition-all duration-300 overflow-hidden",
        collapsed ? "w-20" : "w-64"
      )}
    >
      <div className={cn(
        "p-4 flex items-center border-b border-border/40",
        collapsed ? "justify-center" : "space-x-3"
      )}>
        <div className="p-2 bg-gradient-to-br from-primary to-primary/80 rounded-lg shadow-md shrink-0">
          <ShoppingBag className="text-primary-foreground" size={18} />
        </div>
        {!collapsed && (
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-foreground truncate">
            Smart Deal
          </h1>
        )}
      </div>
      
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-muted/50">
        {navItems.map((item) => (
          <Link key={item.path} href={item.path}>
            <a
              className={cn(
                "flex items-center px-3 py-3 rounded-lg transition-all duration-200",
                collapsed ? "justify-center" : "",
                isActive(item.path)
                  ? "text-primary bg-primary/10 font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className={cn(
                "w-5 h-5",
                collapsed ? "" : "mr-3",
                isActive(item.path) && "text-primary"
              )} />
              {!collapsed && <span>{item.label}</span>}
            </a>
          </Link>
        ))}
      </nav>
      
      <div className={cn(
        "p-4 border-t border-border/40",
        collapsed && "flex justify-center"
      )}>
        <ThemeToggle condensed={collapsed} />
      </div>
    </aside>
  );
}
