"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import Image from "next/image";
import {
  LayoutDashboard,
  BarChart3,
  Clock,
  Settings,
  Zap,
  X,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import NeonBadge from "@/components/common/NeonBadge";
import { useState } from "react";
import { useRouter } from "next/navigation";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Results", href: "/dashboard/results", icon: BarChart3 },
  { label: "History", href: "/dashboard/history", icon: Clock },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const router = useRouter();

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex items-center justify-between px-5 py-6 border-b border-white/5">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#00D4FF]/20 to-[#7C3AED]/20 border border-[#00D4FF]/25">
            <Zap className="h-4.5 w-4.5 text-[#00D4FF]" />
            <div className="absolute inset-0 rounded-xl bg-[#00D4FF]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div>
            <span className="text-base font-bold gradient-text-blue tracking-tight">
              ResumeAI
            </span>
            <p className="text-[10px] text-white/30 -mt-0.5 font-medium tracking-wider uppercase">
              Analyzer
            </p>
          </div>
        </Link>
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-white/40 hover:text-white/70 hover:bg-white/5 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto scrollbar-thin px-3 py-4 space-y-1">
        <p className="px-3 text-[10px] font-semibold text-white/25 uppercase tracking-widest mb-3">
          Navigation
        </p>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ x: 2 }}
                transition={{ duration: 0.15 }}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative",
                  active
                    ? "bg-[#00D4FF]/10 text-[#00D4FF] border border-[#00D4FF]/20"
                    : "text-white/50 hover:text-white/80 hover:bg-white/5"
                )}
              >
                {active && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute inset-0 rounded-xl bg-[#00D4FF]/5"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                  />
                )}
                <Icon
                  className={cn(
                    "h-4 w-4 shrink-0 relative z-10",
                    active ? "text-[#00D4FF]" : "text-white/40 group-hover:text-white/60"
                  )}
                />
                <span className="relative z-10">{item.label}</span>
                {active && (
                  <ChevronRight className="ml-auto h-3.5 w-3.5 text-[#00D4FF]/50 relative z-10" />
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Footer / Plan Info */}
      <div className="p-4 border-t border-white/5">
        <button 
          onClick={() => {
            router.push("/dashboard/pricing");
            if (onClose) onClose();
          }}
          className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:bg-white/5 hover:border-white/10 transition-all text-left group"
        >
          {session?.user?.image ? (
            <Image
              src={session.user.image}
              alt={session.user.name || "User"}
              width={32}
              height={32}
              className="rounded-full border border-white/10"
            />
          ) : (
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#00D4FF] flex items-center justify-center text-xs font-bold text-white shrink-0">
              {session?.user?.name?.[0] || "U"}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white/80 truncate">
              {session?.user?.name || "Guest User"}
            </p>
            <div className="flex items-center gap-2">
              <NeonBadge 
                label={session ? "Basic Plan" : "Sign In Required"} 
                variant={session ? "muted" : "pink"} 
                size="sm" 
              />
              <TrendingUp className="h-3 w-3 text-[#00D4FF] opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        </button>
      </div>

    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 shrink-0 flex-col h-screen sticky top-0 border-r border-white/5"
        style={{ background: "rgba(7, 7, 12, 0.95)", backdropFilter: "blur(20px)" }}>
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", bounce: 0, duration: 0.35 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 z-50 w-64 flex flex-col border-r border-white/5"
              style={{ background: "rgba(7, 7, 12, 0.98)", backdropFilter: "blur(20px)" }}
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
