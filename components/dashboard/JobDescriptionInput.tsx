"use client";

import { motion } from "framer-motion";
import { Briefcase, AlertCircle } from "lucide-react";
import GlassCard from "@/components/common/GlassCard";

interface JobDescriptionInputProps {
  value: string;
  onChange: (val: string) => void;
  disabled?: boolean;
}

export default function JobDescriptionInput({ value, onChange, disabled }: JobDescriptionInputProps) {
  return (
    <GlassCard animate className="flex flex-col gap-4 h-full min-h-[300px]">
      <div className="flex items-center gap-2 mb-1">
        <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
          <Briefcase className="h-4 w-4 text-[#00D4FF]" />
        </div>
        <h3 className="text-sm font-semibold text-white/90">Job Description</h3>
      </div>
      
      <p className="text-[11px] text-white/40 leading-relaxed -mt-2">
        Paste the target job description here to see how well your resume matches the specific requirements.
      </p>

      <div className="relative flex-1">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          placeholder="Paste Job Description here..."
          className="w-full h-full min-h-[180px] p-4 rounded-xl bg-black/20 border border-white/5 text-sm text-white/70 placeholder:text-white/10 focus:outline-none focus:border-[#00D4FF]/30 focus:bg-black/30 transition-all resize-none scrollbar-thin"
        />
        {value.length > 0 && value.length < 50 && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-[10px] text-amber-400/70">
            <AlertCircle className="h-3 w-3" />
            Provide more detail for better accuracy
          </div>
        )}
      </div>

      <div className="flex items-center justify-between text-[10px] text-white/20 uppercase tracking-widest font-bold pt-2 border-t border-white/5">
        <span>ATS Ready</span>
        <span>{value.length} characters</span>
      </div>
    </GlassCard>
  );
}
