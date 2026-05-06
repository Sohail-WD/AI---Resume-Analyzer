"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Briefcase, BarChart3, Target, Star, TrendingUp, Zap } from "lucide-react";
import { GithubIcon } from "@/components/icons/GithubIcon";

import ResumeUploadCard from "@/components/dashboard/ResumeUploadCard";
import GitHubInputCard from "@/components/dashboard/GitHubInputCard";
import RoleDropdown from "@/components/dashboard/RoleDropdown";
import AnalyzeButton from "@/components/dashboard/AnalyzeButton";
import AnalyticsCard from "@/components/dashboard/AnalyticsCard";
import SkillsChart from "@/components/dashboard/SkillsChart";
import ScoreCard from "@/components/dashboard/ScoreCard";
import JobDescriptionInput from "@/components/dashboard/JobDescriptionInput";
import JobMatchDisplay from "@/components/dashboard/JobMatchDisplay";

import { analyzeResume } from "@/services/analyzeService";
import { matchJobDescription } from "@/services/jobMatchService";
import { DashboardState, ResumeData, TargetRole } from "@/types";

export default function DashboardPage() {
  const router = useRouter();
  const [state, setState] = useState<DashboardState>({
    resumeData: null,
    githubUsername: "",
    targetRole: "",
    isAnalyzing: false,
    analysisResult: null,
    jobMatchResult: null,
    jobDescription: "",
    isMatching: false,
    error: null,
  });

  const [activeTab, setActiveTab] = useState<"general" | "jd">("general");

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

  const handleJobMatch = async () => {
    if (!state.resumeData?.rawText || !state.jobDescription) return;

    setState((prev) => ({ ...prev, isMatching: true, error: null }));

    try {
      const result = await matchJobDescription(state.resumeData.rawText, state.jobDescription);
      setState((prev) => ({ ...prev, jobMatchResult: result, isMatching: false }));
      
      // Scroll to results
      setTimeout(() => {
        const el = document.getElementById("job-match-results");
        el?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (err) {
      setState((prev) => ({
        ...prev,
        isMatching: false,
        error: err instanceof Error ? err.message : "Job match failed",
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

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 bg-white/5 rounded-2xl w-fit border border-white/5 no-print">
        <button
          onClick={() => setActiveTab("general")}
          className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
            activeTab === "general"
              ? "bg-[#00D4FF] text-black shadow-[0_0_15px_rgba(0,212,255,0.3)]"
              : "text-white/40 hover:text-white/70"
          }`}
        >
          General Analysis
        </button>
        <button
          onClick={() => setActiveTab("jd")}
          className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
            activeTab === "jd"
              ? "bg-[#F472B6] text-black shadow-[0_0_15px_rgba(244,114,182,0.3)]"
              : "text-white/40 hover:text-white/70"
          }`}
        >
          Job Match (ATS)
        </button>
      </div>

      {/* Input grid */}
      <AnimatePresence mode="wait">
        {activeTab === "general" ? (
          <motion.div
            key="general"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          >
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
          </motion.div>
        ) : (
          <motion.div
            key="jd"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-5"
          >
            <ResumeUploadCard
              onResumeLoaded={handleResumeLoaded}
              resumeData={state.resumeData}
            />
            <JobDescriptionInput
              value={state.jobDescription}
              onChange={(val) => setState((p) => ({ ...p, jobDescription: val }))}
              disabled={state.isMatching}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Analyze button */}
      <div className="no-print">
        {activeTab === "general" ? (
          <AnalyzeButton
            onClick={handleAnalyze}
            isLoading={state.isAnalyzing}
            disabled={missingFields.length > 0}
            missingFields={missingFields}
          />
        ) : (
          <div className="flex flex-col items-center gap-4">
            <button
              onClick={handleJobMatch}
              disabled={state.isMatching || !state.resumeData || !state.jobDescription}
              className={`group relative flex items-center justify-center gap-3 px-10 py-4 rounded-2xl text-base font-black uppercase tracking-widest transition-all duration-300 overflow-hidden ${
                state.isMatching || !state.resumeData || !state.jobDescription
                  ? "bg-white/5 text-white/10 cursor-not-allowed border border-white/5"
                  : "bg-gradient-to-r from-[#F472B6] to-[#7C3AED] text-white shadow-[0_0_30px_rgba(244,114,182,0.3)] hover:shadow-[0_0_50px_rgba(244,114,182,0.5)] hover:scale-[1.02] active:scale-[0.98]"
              }`}
            >
              <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
              {state.isMatching ? (
                <>
                  <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Analyzing Match...
                </>
              ) : (
                <>
                  <Zap className="h-5 w-5" />
                  Analyze Job Match
                </>
              )}
            </button>
            {!state.resumeData && <p className="text-[10px] text-white/20 uppercase font-bold">Please upload a resume first</p>}
          </div>
        )}
      </div>

      {/* Results for JD Match */}
      {activeTab === "jd" && state.jobMatchResult && (
        <motion.div
          id="job-match-results"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6 pt-4"
        >
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-white/5" />
            <span className="text-xs text-[#F472B6] uppercase tracking-[0.2em] font-black">Match Results</span>
            <div className="flex-1 h-px bg-white/5" />
          </div>
          <JobMatchDisplay result={state.jobMatchResult} />
        </motion.div>
      )}

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
          value={state.analysisResult?.overallScore || state.jobMatchResult?.matchScore}
          suffix="%"
          description="Combined AI score"
          accent="blue"
          delay={0}
          isEmpty={!state.analysisResult && !state.jobMatchResult}
        />
        <AnalyticsCard
          title="Resume Score"
          icon={FileText}
          value={state.analysisResult?.resumeScore || (state.jobMatchResult ? Math.round(state.jobMatchResult.matchScore * 0.9) : undefined)}
          suffix="%"
          description="Resume quality"
          accent="purple"
          delay={0.08}
          isEmpty={!state.analysisResult && !state.jobMatchResult}
        />
        <AnalyticsCard
          title="GitHub Score"
          icon={GithubIcon}
          value={state.analysisResult?.githubScore ?? (state.githubUsername ? undefined : 0)}
          suffix="%"
          description={state.githubUsername ? "Fetching stats..." : "Link GitHub for score"}
          accent="green"
          delay={0.16}
          isEmpty={!state.analysisResult && !state.githubUsername}
        />
        <AnalyticsCard
          title="Role Match"
          icon={Target}
          value={state.analysisResult?.matchScore || state.jobMatchResult?.matchScore}
          suffix="%"
          description={state.analysisResult?.targetRole || (state.jobMatchResult ? "Job Match" : "Target alignment")}
          accent="pink"
          delay={0.24}
          isEmpty={!state.analysisResult && !state.jobMatchResult}
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <SkillsChart
          data={state.analysisResult?.radarData || [
            { subject: "Technical", A: state.jobMatchResult?.matchScore || 0, fullMark: 100 },
            { subject: "Keywords", A: (state.jobMatchResult?.matchedKeywords.length || 0) * 10, fullMark: 100 },
            { subject: "Role Fit", A: state.jobMatchResult?.matchScore || 0, fullMark: 100 },
            { subject: "Experience", A: 70, fullMark: 100 },
            { subject: "Soft Skills", A: 85, fullMark: 100 },
          ]}
          isEmpty={!state.analysisResult && !state.jobMatchResult}
        />
        <ScoreCard
          score={state.analysisResult?.overallScore || state.jobMatchResult?.matchScore}
          isEmpty={!state.analysisResult && !state.jobMatchResult}
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
