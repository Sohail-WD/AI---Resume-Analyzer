"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FileText, Briefcase, BarChart3, Target, Star, TrendingUp } from "lucide-react";
import { GithubIcon } from "@/components/icons/GithubIcon";

import ResumeUploadCard from "@/components/dashboard/ResumeUploadCard";
import GitHubInputCard from "@/components/dashboard/GitHubInputCard";
import RoleDropdown from "@/components/dashboard/RoleDropdown";
import AnalyzeButton from "@/components/dashboard/AnalyzeButton";
import AnalyticsCard from "@/components/dashboard/AnalyticsCard";
import SkillsChart from "@/components/dashboard/SkillsChart";
import ScoreCard from "@/components/dashboard/ScoreCard";

import { analyzeResume } from "@/services/analyzeService";
import { DashboardState, ResumeData, TargetRole } from "@/types";

export default function DashboardPage() {
  const router = useRouter();
  const [state, setState] = useState<DashboardState>({
    resumeData: null,
    githubUsername: "",
    targetRole: "",
    isAnalyzing: false,
    analysisResult: null,
    error: null,
  });

  const handleResumeLoaded = useCallback((data: ResumeData) => {
    setState((prev) => ({
      ...prev,
      resumeData: data.rawText ? data : null,
      error: null,
    }));
  }, []);

  const handleAnalyze = async () => {
    if (!state.resumeData?.rawText || !state.targetRole) return;

    setState((prev) => ({ ...prev, isAnalyzing: true, error: null }));

    try {
      const result = await analyzeResume({
        resumeText: state.resumeData.rawText,
        githubUsername: state.githubUsername,
        targetRole: state.targetRole as TargetRole,
      });

      // Store in sessionStorage to pass to results page
      sessionStorage.setItem("analysisResult", JSON.stringify(result));
      setState((prev) => ({ ...prev, analysisResult: result, isAnalyzing: false }));
      router.push("/dashboard/results");
    } catch (err) {
      setState((prev) => ({
        ...prev,
        isAnalyzing: false,
        error: err instanceof Error ? err.message : "Analysis failed",
      }));
    }
  };

  const missingFields: string[] = [];
  if (!state.resumeData?.rawText) missingFields.push("Resume PDF");
  if (!state.targetRole) missingFields.push("Target Role");

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h2 className="text-2xl font-black text-white/90">
          Analyze Your Profile
        </h2>
        <p className="text-sm text-white/40 mt-1">
          Upload your resume, optionally link GitHub, and select your target role to begin.
        </p>
      </motion.div>

      {/* Error banner */}
      {state.error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass rounded-xl px-4 py-3 text-sm text-red-400 border border-red-400/20 bg-red-400/5"
        >
          ⚠ {state.error}
        </motion.div>
      )}

      {/* Input grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <ResumeUploadCard
          onResumeLoaded={handleResumeLoaded}
          resumeData={state.resumeData}
        />
        <GitHubInputCard
          value={state.githubUsername}
          onChange={(val) => setState((p) => ({ ...p, githubUsername: val }))}
        />
        <RoleDropdown
          value={state.targetRole}
          onChange={(role) => setState((p) => ({ ...p, targetRole: role }))}
        />
      </div>

      {/* Analyze button */}
      <AnalyzeButton
        onClick={handleAnalyze}
        isLoading={state.isAnalyzing}
        disabled={missingFields.length > 0}
        missingFields={missingFields}
      />

      {/* Divider */}
      <div className="flex items-center gap-4">
        <div className="flex-1 h-px bg-white/5" />
        <span className="text-xs text-white/25 uppercase tracking-wider">Analytics Overview</span>
        <div className="flex-1 h-px bg-white/5" />
      </div>

      {/* Analytics cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <AnalyticsCard
          title="Overall Score"
          icon={Star}
          value={state.analysisResult?.overallScore}
          suffix="%"
          description="Combined AI score"
          accent="blue"
          delay={0}
          isEmpty={!state.analysisResult}
        />
        <AnalyticsCard
          title="Resume Score"
          icon={FileText}
          value={state.analysisResult?.resumeScore}
          suffix="%"
          description="Resume quality"
          accent="purple"
          delay={0.08}
          isEmpty={!state.analysisResult}
        />
        <AnalyticsCard
          title="GitHub Score"
          icon={GithubIcon}
          value={state.analysisResult?.githubScore ?? undefined}
          suffix="%"
          description="Portfolio strength"
          accent="green"
          delay={0.16}
          isEmpty={!state.analysisResult}
        />
        <AnalyticsCard
          title="Role Match"
          icon={Target}
          value={state.analysisResult?.matchScore}
          suffix="%"
          description={state.analysisResult?.targetRole ?? "Target alignment"}
          accent="pink"
          delay={0.24}
          isEmpty={!state.analysisResult}
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <SkillsChart
          data={state.analysisResult?.radarData}
          isEmpty={!state.analysisResult}
        />
        <ScoreCard
          score={state.analysisResult?.overallScore}
          isEmpty={!state.analysisResult}
        />
      </div>

      {/* Stats footer */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pb-4">
        {[
          { icon: BarChart3, label: "Analyses Run", value: "2,419", accent: "#00D4FF" },
          { icon: TrendingUp, label: "Avg Score Boost", value: "+23%", accent: "#10B981" },
          { icon: Briefcase, label: "Roles Supported", value: "12+", accent: "#7C3AED" },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.1, duration: 0.4 }}
              className="glass rounded-xl p-4 flex items-center gap-3"
            >
              <Icon className="h-5 w-5 shrink-0" style={{ color: stat.accent }} />
              <div>
                <p className="text-base font-bold text-white/90">{stat.value}</p>
                <p className="text-xs text-white/35">{stat.label}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
