"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glow?: "blue" | "purple" | "none";
  animate?: boolean;
  onClick?: () => void;
}

export default function GlassCard({
  children,
  className,
  hover = true,
  glow = "none",
  animate = false,
  onClick,
}: GlassCardProps) {
  const glowClass =
    glow === "blue"
      ? "neon-glow-blue"
      : glow === "purple"
      ? "neon-glow-purple"
      : "";

  const Wrapper = animate ? motion.div : "div";
  const animProps = animate
    ? {
        initial: { opacity: 0, y: 16 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.4, ease: "easeOut" },
      }
    : {};

  return (
    <Wrapper
      {...(animProps as object)}
      onClick={onClick}
      className={cn(
        "glass rounded-2xl p-6",
        hover && "glass-hover cursor-default",
        glowClass,
        onClick && "cursor-pointer",
        className
      )}
    >
      {children}
    </Wrapper>
  );
}
