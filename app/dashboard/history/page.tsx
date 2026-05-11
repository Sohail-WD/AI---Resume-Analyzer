"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, ExternalLink, Calendar, FileText, ChevronRight, Loader2, History } from "lucide-react";
import { GithubIcon as Github } from "@/components/icons/GithubIcon";
import GlassCard from "@/components/common/GlassCard";
import NeonBadge from "@/components/common/NeonBadge";
import { StoredAnalysis } from "@/types";
import { getScoreColor } from "@/utils/constants";

export default function HistoryPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [analyses, setAnalyses] = useState<StoredAnalysis[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    } else if (status === "authenticated") {
      fetchHistory();
    }
  }, [status]);

  const fetchHistory = async () => {
    try {
      const res = await fetch("/api/history");
      const data = await res.json();
      if (Array.isArray(data)) {
        setAnalyses(data);
      }
    } catch (err) {
      console.error("Failed to fetch history:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteAnalysis = async (id: string) => {
    if (!confirm("Are you sure you want to delete this analysis?")) return;

    try {
      const res = await fetch(`/api/history?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setAnalyses(analyses.filter((a: any) => a._id !== id));
      }
    } catch (err) {
      console.error("Failed to delete:", err);
    }
  };

  const openAnalysis = (analysis: StoredAnalysis) => {
    sessionStorage.setItem("analysisResult", JSON.stringify(analysis));
    router.push("/dashboard/results");
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="h-8 w-8 text-[#00D4FF] animate-spin" />
        <p className="text-white/40 animate-pulse">Loading your history...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-4">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-white/90">Analysis History</h2>
          <p className="text-sm text-white/40 mt-1">
            Track your career growth and resume improvements over time.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <NeonBadge label={`${analyses.length} Reports`} variant="blue" dot />
        </div>
      </div>

      <AnimatePresence mode="popLayout">
        {analyses.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {analyses.map((analysis: any, index) => (
              <motion.div
                key={analysis._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.05 }}
              >
                <GlassCard className="group hover:border-[#00D4FF]/30 transition-all cursor-pointer p-0 overflow-hidden" onClick={() => openAnalysis(analysis)}>
                  <div className="flex flex-col md:flex-row md:items-center p-5 gap-6">
                    {/* Score Circle */}
                    <div className="flex flex-col items-center justify-center h-16 w-16 rounded-2xl bg-white/[0.03] border border-white/5 shrink-0 group-hover:bg-[#00D4FF]/5 group-hover:border-[#00D4FF]/20 transition-all">
                      <span className="text-xl font-black" style={{ color: getScoreColor(analysis.overallScore) }}>
                        {analysis.overallScore}
                      </span>
                      <span className="text-[8px] text-white/30 uppercase font-bold">Score</span>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-white/90 group-hover:text-[#00D4FF] transition-colors truncate">
                          {analysis.targetRole}
                        </h3>
                        {analysis.isMock && <NeonBadge label="Demo" variant="pink" size="xs" />}
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-white/30">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="h-3 w-3" />
                          {new Date(analysis.timestamp).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                            year: "numeric"
                          })}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <FileText className="h-3 w-3" />
                          {analysis.resumeFileName || "Unknown Resume"}
                        </span>
                        {analysis.github && (
                          <span className="flex items-center gap-1.5 text-[#10B981]">
                            <Github className="h-3 w-3" />
                            @{analysis.github.username}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-8 md:px-6">
                      <div className="hidden lg:block text-center">
                        <p className="text-[10px] text-white/20 uppercase font-bold mb-1">Resume</p>
                        <p className="text-sm font-bold text-white/70">{analysis.resumeScore}%</p>
                      </div>
                      <div className="hidden lg:block text-center">
                        <p className="text-[10px] text-white/20 uppercase font-bold mb-1">ATS</p>
                        <p className="text-sm font-bold text-white/70">{analysis.atsScore}%</p>
                      </div>
                      <div className="hidden lg:block text-center">
                        <p className="text-[10px] text-white/20 uppercase font-bold mb-1">GitHub</p>
                        <p className="text-sm font-bold text-white/70">{analysis.githubScore}%</p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 border-t md:border-t-0 md:border-l border-white/5 pt-4 md:pt-0 md:pl-6">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteAnalysis(analysis._id);
                        }}
                        className="p-2.5 rounded-xl text-red-400 hover:bg-red-400/10 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                        title="Delete Analysis"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <div className="p-2.5 rounded-xl text-white/20 group-hover:text-[#00D4FF] group-hover:translate-x-1 transition-all">
                        <ChevronRight className="h-5 w-5" />
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        ) : (
          <GlassCard className="flex flex-col items-center justify-center py-20 text-center space-y-4">
            <div className="h-20 w-20 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
              <History className="h-10 w-10 text-white/20" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white/80">No History Yet</h3>
              <p className="text-sm text-white/30 max-w-xs mt-2">
                Run your first AI analysis to start tracking your progress and improvements.
              </p>
            </div>
            <button
              onClick={() => router.push("/dashboard")}
              className="px-8 py-3 rounded-xl bg-[#00D4FF] text-black font-bold shadow-[0_0_20px_rgba(0,212,255,0.3)] hover:scale-105 transition-all"
            >
              Start First Analysis
            </button>
          </GlassCard>
        )}
      </AnimatePresence>
    </div>
  );
}
