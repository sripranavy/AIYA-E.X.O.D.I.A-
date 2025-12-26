import { Link, useLocation } from "wouter";
import { Activity, Scan, Brain, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [location] = useLocation();

  const navItems = [
    { href: "/", label: "Home", icon: Activity },
    { href: "/analysis", label: "Analysis", icon: Scan },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/">
          <a className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center text-primary border border-primary/50 group-hover:bg-primary/30 transition-colors">
              <Brain size={18} />
            </div>
            <span className="font-sans font-bold text-lg tracking-tight">
              Pneumo<span className="text-primary">Scan</span> AI
            </span>
          </a>
        </Link>

        <div className="flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = location === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <a
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-primary/10 text-primary border border-primary/20"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                  )}
                >
                  <item.icon size={16} />
                  {item.label}
                </a>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
