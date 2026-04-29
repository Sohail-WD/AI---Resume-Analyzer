import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { LayoutDashboard, FileText, Github, ShieldCheck, Settings, Menu, X, Hexagon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Resume Analysis", href: "/dashboard?tab=resume", icon: FileText },
  { name: "GitHub Analysis", href: "/dashboard?tab=github", icon: Github },
  { name: "ATS Score", href: "/dashboard?tab=ats", icon: ShieldCheck },
  { name: "Settings", href: "/dashboard?tab=settings", icon: Settings },
];

export function Sidebar({ open, setOpen }: { open: boolean; setOpen: (v: boolean) => void }) {
  const [location, setLocation] = useLocation();

  // Basic check for active state
  const isActiveRoute = (href: string) => {
    if (href === "/dashboard" && location === "/dashboard" && !window.location.search) return true;
    if (href.includes("?")) {
      const tab = href.split("=")[1];
      return window.location.search.includes(`tab=${tab}`);
    }
    return location === href;
  };

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div 
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={() => setOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside className={cn(
        "fixed top-0 left-0 z-50 h-screen w-64 flex-col border-r border-white/5 bg-background/50 backdrop-blur-xl transition-transform duration-300 ease-in-out md:flex md:relative md:translate-x-0",
        open ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex h-16 items-center justify-between px-6 border-b border-white/5">
          <Link href="/" className="flex items-center gap-2 group cursor-pointer">
            <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors shadow-[0_0_15px_rgba(56,189,248,0.1)] group-hover:shadow-[0_0_20px_rgba(56,189,248,0.3)]">
              <Hexagon className="h-5 w-5" />
              <div className="absolute inset-0 rounded-lg blur-[8px] bg-primary/20 group-hover:bg-primary/40 transition-all opacity-0 group-hover:opacity-100" />
            </div>
            <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">NEXUS</span>
          </Link>
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setOpen(false)}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-2">
          {navItems.map((item) => {
            const isActive = isActiveRoute(item.href);
            return (
              <div
                key={item.name}
                onClick={() => {
                  const url = new URL(window.location.href);
                  if (item.href.includes('?')) {
                    const tab = item.href.split('=')[1];
                    url.searchParams.set('tab', tab);
                    setLocation(url.pathname + url.search);
                  } else {
                    url.search = '';
                    setLocation(item.href);
                  }
                  if (window.innerWidth < 768) setOpen(false);
                }}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 cursor-pointer group relative overflow-hidden",
                  isActive ? "text-white bg-gradient-to-r from-primary/10 to-transparent" : "text-muted-foreground hover:text-white hover:bg-white/5"
                )}
              >
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary to-accent shadow-[0_0_10px_rgba(56,189,248,0.5)] rounded-r-full" />
                )}
                <item.icon className={cn("h-4 w-4", isActive ? "text-primary" : "text-muted-foreground group-hover:text-primary transition-colors")} />
                {item.name}
              </div>
            );
          })}
        </div>
        
        <div className="p-4 border-t border-white/5">
          <div className="rounded-xl glass-card p-4 bg-gradient-to-br from-primary/10 to-accent/10 border-white/5 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 blur-xl opacity-50" />
            <h4 className="font-medium text-sm text-white mb-1 relative z-10">Pro Plan</h4>
            <p className="text-xs text-muted-foreground mb-3 relative z-10">Unlimited AI analysis & ATS checks.</p>
            <Button size="sm" className="w-full relative z-10 bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow-[0_0_15px_rgba(56,189,248,0.2)]">Upgrade</Button>
          </div>
        </div>
      </aside>
    </>
  );
}
