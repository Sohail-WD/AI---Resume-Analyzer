"use client";

import { motion } from "framer-motion";
import { CheckCircle2, AlertTriangle, Lightbulb, Target, ArrowRight, Tag, Zap, Shield } from "lucide-react";
import GlassCard from "@/components/common/GlassCard";
import NeonBadge from "@/components/common/NeonBadge";
import { JobMatchResult } from "@/types";
import { getScoreColor } from "@/utils/constants";
import { RadialBarChart, RadialBar, ResponsiveContainer } from "recharts";

interface JobMatchDisplayProps {
  result: JobMatchResult;
}

export default function JobMatchDisplay({ result }: JobMatchDisplayProps) {
  const scoreColor = getScoreColor(result.matchScore);
  const chartData = [
    { name: "Score", value: result.matchScore, fill: scoreColor },
    { name: "Empty", value: 100 - result.matchScore, fill: "rgba(255,255,255,0.03)" }
  ];

  return (
    <div className="space-y-6">
      {/* ── Summary & Score ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <GlassCard animate className="flex items-center gap-6 lg:col-span-2">
          <div className="h-32 w-32 shrink-0 relative">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart cx="50%" cy="50%" innerRadius="70%" outerRadius="100%" barSize={8} data={chartData} startAngle={90} endAngle={-270}>
                <RadialBar dataKey="value" cornerRadius={10} />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-black" style={{ color: scoreColor }}>{result.matchScore}%</span>
              <span className="text-[10px] text-white/30 uppercase font-bold tracking-widest">Match</span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-4 w-4 text-[#00D4FF]" />
              <h3 className="text-lg font-bold text-white/90">Job Fit Summary</h3>
            </div>
            <p className="text-sm text-white/50 leading-relaxed italic">
              "{result.jdSummary}"
            </p>
            {result.isMock && (
              <div className="mt-3">
                <NeonBadge label="Simulated Analysis" variant="pink" size="xs" dot />
              </div>
            )}
          </div>
        </GlassCard>

        <div className="grid grid-cols-1 gap-4">
          <div className="glass rounded-2xl p-4 border-l-4 border-l-[#10B981]">
            <p className="text-[10px] text-white/30 uppercase font-bold tracking-tighter mb-1">Status</p>
            <p className="text-sm font-bold text-white/90 flex items-center gap-2">
              {result.matchScore > 75 ? "Excellent Match" : result.matchScore > 50 ? "Good Match" : "Needs Work"}
              <CheckCircle2 className="h-4 w-4 text-[#10B981]" />
            </p>
          </div>
          <div className="glass rounded-2xl p-4 border-l-4 border-l-[#F472B6]">
            <p className="text-[10px] text-white/30 uppercase font-bold tracking-tighter mb-1">ATS Optimization</p>
            <p className="text-sm font-bold text-white/90">Ready for Submission</p>
          </div>
        </div>
      </div>

      {/* ── Keyword Comparison ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <GlassCard animate>
          <div className="flex items-center gap-2 mb-4">
            <div className="p-1.5 rounded-lg bg-[#10B981]/10 border border-[#10B981]/20">
              <Tag className="h-3.5 w-3.5 text-[#10B981]" />
            </div>
            <h4 className="text-sm font-bold text-white/90">Matched Keywords</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {result.matchedKeywords.map((kw, i) => (
              <span key={kw} className="px-3 py-1 text-[10px] font-bold rounded-lg bg-[#10B981]/5 text-[#10B981] border border-[#10B981]/20">
                {kw}
              </span>
            ))}
          </div>
        </GlassCard>

        <GlassCard animate>
          <div className="flex items-center gap-2 mb-4">
            <div className="p-1.5 rounded-lg bg-red-400/10 border border-red-400/20">
              <Tag className="h-3.5 w-3.5 text-red-400" />
            </div>
            <h4 className="text-sm font-bold text-white/90">Missing Critical Keywords</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {result.missingKeywords.map((kw, i) => (
              <span key={kw} className="px-3 py-1 text-[10px] font-bold rounded-lg bg-red-400/5 text-red-400 border border-red-400/20">
                {kw}
              </span>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* ── Edits & Suggestions ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <GlassCard animate className="lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="h-4 w-4 text-[#00D4FF]" />
            <h4 className="text-sm font-bold text-white/90">Recommended Resume Edits</h4>
          </div>
          <div className="space-y-3">
            {result.resumeEdits.map((edit, i) => (
              <div key={i} className="flex gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5 group hover:border-[#00D4FF]/20 transition-all">
                <div className="mt-0.5 h-5 w-5 rounded-full bg-[#00D4FF]/10 flex items-center justify-center shrink-0">
                  <ArrowRight className="h-3 w-3 text-[#00D4FF]" />
                </div>
                <p className="text-xs text-white/60 leading-relaxed group-hover:text-white/80 transition-colors">{edit}</p>
              </div>
            ))}
          </div>
        </GlassCard>

        <div className="space-y-5">
          <GlassCard animate>
            <div className="flex items-center gap-2 mb-4">
              <Shield className="h-4 w-4 text-purple-400" />
              <h4 className="text-sm font-bold text-white/90">ATS Strategy</h4>
            </div>
            <ul className="space-y-3">
              {result.optimizationTips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-[11px] text-white/40 leading-relaxed">
                  <span className="mt-1.5 h-1 w-1 rounded-full bg-purple-400 shrink-0" />
                  {tip}
                </li>
              ))}
            </ul>
          </GlassCard>

          <GlassCard animate>
            <div className="flex items-center gap-2 mb-3">
              <Target className="h-4 w-4 text-pink-400" />
              <h4 className="text-sm font-bold text-white/90">Strengths</h4>
            </div>
            <div className="space-y-2">
              {result.strengths.slice(0, 3).map((s, i) => (
                <div key={i} className="px-3 py-2 rounded-lg bg-pink-400/5 border border-pink-400/10 text-[11px] text-pink-400/80">
                  {s}
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
