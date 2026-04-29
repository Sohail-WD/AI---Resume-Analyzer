import { Bell, Search, User, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function TopNavbar({ setSidebarOpen }: { setSidebarOpen: (v: boolean) => void }) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/5 bg-background/50 px-4 backdrop-blur-xl md:px-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setSidebarOpen(true)}>
          <Menu className="h-5 w-5" />
        </Button>
        <div className="relative hidden md:flex items-center">
          <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            type="search" 
            placeholder="Search reports..." 
            className="w-64 rounded-full bg-white/5 border-white/10 pl-9 text-sm focus-visible:ring-primary/50 focus-visible:border-primary/50 focus-visible:shadow-[0_0_15px_rgba(56,189,248,0.2)] transition-all text-white"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-white rounded-full bg-white/5 border border-white/10 glass-card group">
          <Bell className="h-5 w-5 group-hover:text-white transition-colors" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary shadow-[0_0_8px_rgba(56,189,248,0.8)] animate-bounce" style={{ animationDuration: '2s' }} />
        </Button>
        
        <div className="rounded-full p-[2px] bg-gradient-to-r from-primary/50 to-accent/50 cursor-pointer hover:shadow-[0_0_15px_rgba(168,85,247,0.3)] transition-all">
          <Avatar className="h-8 w-8 border border-background">
            <AvatarImage src="https://i.pravatar.cc/150?u=a042581f4e29026024d" />
            <AvatarFallback className="bg-primary/20 text-primary">JD</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
