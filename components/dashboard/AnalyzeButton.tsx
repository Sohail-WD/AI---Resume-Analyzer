"use client";

import { motion } from "framer-motion";
import { Sparkles, ArrowRight, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface AnalyzeButtonProps {
  onClick: () => void;
  isLoading: boolean;
  disabled: boolean;
  missingFields: string[];
}

export default function AnalyzeButton({
  onClick,
  isLoading,
  disabled,
  missingFields,
}: AnalyzeButtonProps) {
  return (
    <div className="flex flex-col gap-3">
      <motion.button
        id="analyze-btn"
        onClick={onClick}
        disabled={disabled || isLoading}
        whileHover={!disabled && !isLoading ? { scale: 1.01 } : {}}
        whileTap={!disabled && !isLoading ? { scale: 0.99 } : {}}
        className={cn(
          "relative w-full h-14 rounded-2xl font-semibold text-sm flex items-center justify-center gap-3 overflow-hidden transition-all duration-300",
          disabled || isLoading
            ? "bg-white/5 border border-white/8 text-white/30 cursor-not-allowed"
            : "text-white cursor-pointer"
        )}
        style={
          !disabled && !isLoading
            ? {
                background:
                  "linear-gradient(135deg, #00D4FF 0%, #7C3AED 50%, #F472B6 100%)",
                boxShadow:
                  "0 0 30px rgba(0, 212, 255, 0.25), 0 0 60px rgba(124, 58, 237, 0.15)",
              }
            : {}
        }
      >
        {/* Animated shimmer on enabled */}
        {!disabled && !isLoading && (
          <motion.div
            className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity"
            style={{
              background:
                "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.15) 50%, transparent 60%)",
            }}
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
          />
        )}

        {isLoading ? (
          <>
            <div className="h-5 w-5 rounded-full border-2 border-white/40 border-t-white animate-spin" />
            <span>Analyzing your profile…</span>
          </>
        ) : (
          <>
            <Sparkles className="h-5 w-5" />
            <span>Analyze with AI</span>
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </motion.button>

      {/* Missing fields warning */}
      {missingFields.length > 0 && !isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-start gap-2 text-xs text-white/35 px-1"
        >
          <AlertCircle className="h-3.5 w-3.5 text-amber-400/60 mt-0.5 shrink-0" />
          <span>
            Required:{" "}
            <span className="text-amber-400/70">{missingFields.join(", ")}</span>
          </span>
        </motion.div>
      )}
    </div>
  );
}
