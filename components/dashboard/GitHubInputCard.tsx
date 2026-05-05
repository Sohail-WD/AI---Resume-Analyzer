"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { GithubIcon } from "@/components/icons/GithubIcon";
import GlassCard from "@/components/common/GlassCard";
import NeonBadge from "@/components/common/NeonBadge";

interface GitHubInputCardProps {
  value: string;
  onChange: (val: string) => void;
}

export default function GitHubInputCard({ value, onChange }: GitHubInputCardProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [isValid, setIsValid] = useState<boolean | null>(null);

  const isValidUsername = (name: string) =>
    /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?$/.test(name);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    onChange(val);
    setIsValid(null);
    if (val && !isValidUsername(val)) setIsValid(false);
  };

  const verifyUser = async () => {
    if (!value || !isValidUsername(value)) return;
    
    setIsChecking(true);
    setIsValid(null);
    
    try {
      const res = await fetch(`/api/github/verify?username=${encodeURIComponent(value)}`);
      const data = await res.json();
      
      if (res.ok) {
        setIsValid(data.exists);
      } else {
        setIsValid(false);
      }
    } catch (err) {
      setIsValid(false);
    } finally {
      setIsChecking(false);
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const statusIcon = () => {
    if (isChecking) return <Loader2 className="h-4 w-4 text-[#00D4FF] animate-spin" />;
    if (isValid === true) return <CheckCircle2 className="h-4 w-4 text-[#10B981]" />;
    if (isValid === false) return <AlertCircle className="h-4 w-4 text-red-400" />;
    return null;
  };

  return (
    <GlassCard animate className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-[#7C3AED]/10 border border-[#7C3AED]/20">
            <GithubIcon className="h-4 w-4 text-[#7C3AED]" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white/90">GitHub Profile</h3>
            <p className="text-xs text-white/40">Optional but recommended</p>
          </div>
        </div>
        {isValid === true && <NeonBadge label="Verified" variant="green" dot />}
      </div>

      {/* Input + Verify Button */}
      <div className="flex gap-2">
        <div
          className="flex-1 flex items-center rounded-xl border transition-all duration-200 overflow-hidden relative"
          style={{
            borderColor: isFocused
              ? "rgba(124, 58, 237, 0.5)"
              : isValid === true
              ? "rgba(16, 185, 129, 0.35)"
              : isValid === false
              ? "rgba(239, 68, 68, 0.35)"
              : "rgba(255,255,255,0.08)",
            background: isFocused
              ? "rgba(124, 58, 237, 0.06)"
              : "rgba(255,255,255,0.03)",
            boxShadow: isFocused ? "0 0 20px rgba(124, 58, 237, 0.12)" : "none",
          }}
        >
          <span className="pl-3 pr-1 text-white/30 text-sm select-none font-mono">
            github.com/
          </span>
          <input
            id="github-username-input"
            type="text"
            placeholder="yourusername"
            value={value}
            onChange={handleChange}
            onFocus={() => setIsFocused(true)}
            onBlur={handleBlur}
            className="flex-1 bg-transparent py-3 pr-10 text-sm text-white/90 placeholder:text-white/25 outline-none font-mono"
            autoComplete="off"
            spellCheck={false}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {statusIcon()}
          </div>
        </div>
        
        <button
          onClick={verifyUser}
          disabled={!value || isChecking || !isValidUsername(value)}
          className="px-4 rounded-xl text-xs font-bold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 hover:border-white/20 active:scale-95"
        >
          {isChecking ? "..." : "Verify"}
        </button>
      </div>

      {/* Status message */}
      <AnimatePresence>
        {isValid === false && value && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="text-xs text-red-400 flex items-center gap-1.5"
          >
            <AlertCircle className="h-3 w-3" />
            User not found or invalid format
          </motion.p>
        )}
        {isValid === true && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="text-xs text-[#10B981] flex items-center gap-1.5"
          >
            <CheckCircle2 className="h-3 w-3" />
            GitHub profile linked successfully
          </motion.p>
        )}
      </AnimatePresence>

      <p className="text-[11px] text-white/25 leading-relaxed">
        We&apos;ll analyze your public repositories and languages to boost your score.
      </p>
    </GlassCard>
  );
}
