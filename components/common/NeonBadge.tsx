"use client";

import { cn } from "@/lib/utils";

type NeonBadgeProps = {
  label: string;
  variant?: "blue" | "purple" | "green" | "pink" | "muted";
  size?: "sm" | "md";
  dot?: boolean;
  className?: string;
};

const variantStyles = {
  blue: "bg-[#00D4FF]/10 text-[#00D4FF] border border-[#00D4FF]/25",
  purple: "bg-[#7C3AED]/10 text-[#7C3AED] border border-[#7C3AED]/25",
  green: "bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/25",
  pink: "bg-[#F472B6]/10 text-[#F472B6] border border-[#F472B6]/25",
  muted: "bg-white/5 text-white/50 border border-white/10",
};

const dotColors = {
  blue: "bg-[#00D4FF]",
  purple: "bg-[#7C3AED]",
  green: "bg-[#10B981]",
  pink: "bg-[#F472B6]",
  muted: "bg-white/40",
};

export default function NeonBadge({
  label,
  variant = "blue",
  size = "sm",
  dot = false,
  className,
}: NeonBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-medium",
        size === "sm" ? "px-2.5 py-0.5 text-xs" : "px-3 py-1 text-sm",
        variantStyles[variant],
        className
      )}
    >
      {dot && (
        <span
          className={cn(
            "h-1.5 w-1.5 rounded-full animate-pulse-glow",
            dotColors[variant]
          )}
        />
      )}
      {label}
    </span>
  );
}
