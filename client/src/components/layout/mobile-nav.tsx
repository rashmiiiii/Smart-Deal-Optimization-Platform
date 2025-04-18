import { Link, useLocation } from "wouter";
import { Home, PlusCircle, BarChart2, Bell, User } from "lucide-react";
import { cn } from "@/lib/utils";

export default function MobileNav() {
  const [location] = useLocation();

  const isActive = (path: string) => location === path;

  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: PlusCircle, label: "Track", path: "/track" },
    { icon: BarChart2, label: "Dashboard", path: "/dashboard" },
    { icon: Bell, label: "Alerts", path: "/notifications" },
    { icon: User, label: "Profile", path: "/profile" },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-card/90 backdrop-blur-sm border-t border-border/40 shadow-lg z-10">
      <div className="flex justify-around py-2">
        {navItems.map((item) => (
          <Link key={item.path} href={item.path}>
            <a
              className={cn(
                "flex flex-col items-center p-3 rounded-lg transition-all duration-200",
                isActive(item.path)
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground"
              )}
            >
              <div className={cn(
                "relative",
                isActive(item.path) && "after:content-[''] after:absolute after:-bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:bg-primary after:rounded-full"
              )}>
                <item.icon className={cn(
                  "h-5 w-5 transition-transform",
                  isActive(item.path) && "text-primary scale-110"
                )} />
              </div>
              <span className="text-xs mt-1 font-medium">{item.label}</span>
            </a>
          </Link>
        ))}
      </div>
    </div>
  );
}
