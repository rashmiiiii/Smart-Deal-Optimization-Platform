import { useTheme } from "@/hooks/use-theme";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
  condensed?: boolean;
}

export function ThemeToggle({ className, condensed = false }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();

  // Condensed version just shows an icon button
  if (condensed) {
    return (
      <button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className={cn(
          "p-2 rounded-full hover:bg-muted/50 transition-colors",
          className
        )}
        title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
      >
        {theme === "dark" ? (
          <Sun className="h-5 w-5 text-muted-foreground" />
        ) : (
          <Moon className="h-5 w-5 text-muted-foreground" />
        )}
      </button>
    );
  }

  // Full toggle with label
  return (
    <div className={cn("flex items-center justify-between", className)}>
      <span className="text-sm text-muted-foreground">Dark Mode</span>
      <button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className={cn(
          "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
          theme === "dark" ? "bg-primary" : "bg-muted"
        )}
      >
        <span
          className={cn(
            "inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform",
            theme === "dark" ? "translate-x-6" : "translate-x-1"
          )}
        />
      </button>
    </div>
  );
}
