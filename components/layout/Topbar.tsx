"use client";

import { Menu, Bell, Search, Sparkles } from "lucide-react";
import NeonBadge from "@/components/common/NeonBadge";
import { usePathname } from "next/navigation";

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/dashboard/results": "Analysis Results",
  "/dashboard/history": "History",
  "/dashboard/settings": "Settings",
};

interface TopbarProps {
  onMenuClick: () => void;
}

export default function Topbar({ onMenuClick }: TopbarProps) {
  const pathname = usePathname();
  const title = PAGE_TITLES[pathname] ?? "Dashboard";

  return (
    <header
      className="sticky top-0 z-30 flex items-center gap-4 px-4 sm:px-6 py-4 border-b border-white/5"
      style={{ background: "rgba(5, 5, 8, 0.85)", backdropFilter: "blur(20px)" }}
    >
      {/* Mobile menu button */}
      <button
        id="topbar-menu-btn"
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-lg text-white/50 hover:text-white/80 hover:bg-white/5 transition-colors"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Title + breadcrumb */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold text-white/90 truncate">{title}</h1>
          <NeonBadge label="Beta" variant="purple" dot size="sm" />
        </div>
        <p className="text-xs text-white/30 hidden sm:block">
          AI-powered resume & portfolio analysis
        </p>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2">
        <button
          id="topbar-search-btn"
          className="hidden sm:flex p-2 rounded-lg text-white/40 hover:text-white/70 hover:bg-white/5 transition-colors"
          aria-label="Search"
        >
          <Search className="h-4 w-4" />
        </button>

        <button
          id="topbar-notify-btn"
          className="relative p-2 rounded-lg text-white/40 hover:text-white/70 hover:bg-white/5 transition-colors"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-[#00D4FF] animate-pulse-glow" />
        </button>

        <div className="flex items-center gap-2 pl-2 border-l border-white/10">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#00D4FF] flex items-center justify-center">
            <Sparkles className="h-3.5 w-3.5 text-white" />
          </div>
        </div>
      </div>
    </header>
  );
}
