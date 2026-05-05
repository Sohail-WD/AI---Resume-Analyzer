"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import AnimatedCounter from "@/components/common/AnimatedCounter";
import { getScoreColor } from "@/utils/constants";

interface AnalyticsCardProps {
  title: string;
  icon: LucideIcon;
  value?: number;
  suffix?: string;
  prefix?: string;
  description?: string;
  accent?: "blue" | "purple" | "pink" | "green";
  children?: ReactNode;
  delay?: number;
  isEmpty?: boolean;
}

const ACCENT_STYLES = {
  blue: {
    bg: "bg-[#00D4FF]/10",
    border: "border-[#00D4FF]/20",
    icon: "text-[#00D4FF]",
    glow: "0 0 20px rgba(0, 212, 255, 0.08)",
  },
  purple: {
    bg: "bg-[#7C3AED]/10",
    border: "border-[#7C3AED]/20",
    icon: "text-[#7C3AED]",
    glow: "0 0 20px rgba(124, 58, 237, 0.08)",
  },
  pink: {
    bg: "bg-[#F472B6]/10",
    border: "border-[#F472B6]/20",
    icon: "text-[#F472B6]",
    glow: "0 0 20px rgba(244, 114, 182, 0.08)",
  },
  green: {
    bg: "bg-[#10B981]/10",
    border: "border-[#10B981]/20",
    icon: "text-[#10B981]",
    glow: "0 0 20px rgba(16, 185, 129, 0.08)",
  },
};

export default function AnalyticsCard({
  title,
  icon: Icon,
  value,
  suffix = "",
  prefix = "",
  description,
  accent = "blue",
  children,
  delay = 0,
  isEmpty = false,
}: AnalyticsCardProps) {
  const styles = ACCENT_STYLES[accent];
  const scoreColor = value !== undefined ? getScoreColor(value) : undefined;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
      className="glass glass-hover rounded-2xl p-5 flex flex-col gap-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div
          className={cn(
            "p-2 rounded-lg border",
            styles.bg,
            styles.border
          )}
        >
          <Icon className={cn("h-4 w-4", styles.icon)} />
        </div>
        {!isEmpty && value !== undefined && (
          <div
            className="h-1.5 w-16 rounded-full overflow-hidden"
            style={{ background: "rgba(255,255,255,0.06)" }}
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${value}%` }}
              transition={{ duration: 1, delay: delay + 0.3, ease: "easeOut" }}
              className="h-full rounded-full"
              style={{ background: scoreColor }}
            />
          </div>
        )}
      </div>

      {/* Value */}
      <div>
        {isEmpty || value === undefined ? (
          <div className="space-y-2">
            <div className="h-8 w-20 rounded-lg bg-white/5 animate-pulse" />
            <div className="h-3 w-28 rounded bg-white/4 animate-pulse" />
          </div>
        ) : (
          <>
            <div className="flex items-baseline gap-1">
              <AnimatedCounter
                target={value}
                suffix={suffix}
                prefix={prefix}
                className="text-3xl font-bold text-white/90"
                delay={delay * 1000 + 200}
              />
            </div>
            <p className="text-xs text-white/40 mt-1">{description}</p>
          </>
        )}
      </div>

      <div className="h-px w-full bg-white/5" />

      <p className="text-xs font-medium text-white/50">{title}</p>

      {children}
    </motion.div>
  );
}
