"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Tag,
  Star,
  FileText,
  Target,
  ArrowLeft,
  Brain,
  Zap,
  GraduationCap,
  TrendingUp,
  Shield,
  BookOpen,
} from "lucide-react";
import Link from "next/link";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  RadialBarChart,
  RadialBar,
} from "recharts";

import { AnalysisResult } from "@/types";
import GlassCard from "@/components/common/GlassCard";
import NeonBadge from "@/components/common/NeonBadge";
import SkillsChart from "@/components/dashboard/SkillsChart";
import ScoreCard from "@/components/dashboard/ScoreCard";
import GitHubCard from "@/components/github/GitHubCard";
import { getScoreColor, getScoreLabel } from "@/utils/constants";

// ── Sub-components ─────────────────────────────────────────────────────────────

function InternshipReadinessBanner({ level }: { level: string }) {
  const config: Record<
    string,
    { color: string; bg: string; border: string; icon: typeof Shield; label: string }
  > = {
    High: {
      color: "#10B981",
      bg: "rgba(16,185,129,0.08)",
      border: "rgba(16,185,129,0.25)",
      icon: TrendingUp,
      label: "High — You're internship-ready!",
    },
    Moderate: {
      color: "#00D4FF",
      bg: "rgba(0,212,255,0.06)",
      border: "rgba(0,212,255,0.2)",
      icon: Zap,
      label: "Moderate — A few improvements needed",
    },
    Low: {
      color: "#F59E0B",
      bg: "rgba(245,158,11,0.07)",
      border: "rgba(245,158,11,0.2)",
      icon: AlertTriangle,
      label: "Low — Significant work required",
    },
    "Not Ready": {
      color: "#EF4444",
      bg: "rgba(239,68,68,0.07)",
      border: "rgba(239,68,68,0.2)",
      icon: Shield,
      label: "Not Ready — Focus on core skills first",
    },
  };

  const c = config[level] ?? config["Moderate"];
  const Icon = c.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-3 px-5 py-4 rounded-2xl border"
      style={{ background: c.bg, borderColor: c.border }}
    >
      <div
        className="p-2.5 rounded-xl border"
        style={{ background: `${c.color}18`, borderColor: `${c.color}30` }}
      >
        <Icon className="h-5 w-5" style={{ color: c.color }} />
      </div>
      <div>
        <p className="text-xs text-white/40 uppercase tracking-wider font-medium">
          Internship Readiness
        </p>
        <p className="text-sm font-bold mt-0.5" style={{ color: c.color }}>
          {c.label}
        </p>
      </div>
    </motion.div>
  );
}

function ATSScoreRing({ score }: { score: number }) {
  const color = getScoreColor(score);
  const data = [{ name: "ATS", value: score, fill: color }, { name: "gap", value: 100 - score, fill: "transparent" }];

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative">
        <ResponsiveContainer width={100} height={100}>
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius={32}
            outerRadius={48}
            startAngle={90}
            endAngle={-270}
            data={data}
          >
            <RadialBar dataKey="value" cornerRadius={6} background={{ fill: "rgba(255,255,255,0.04)" }} />
          </RadialBarChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg font-black" style={{ color }}>{score}</span>
          <span className="text-[9px] text-white/30">ATS</span>
        </div>
      </div>
      <p className="text-xs text-white/50 text-center">ATS Score</p>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────

export default function ResultsPage() {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = sessionStorage.getItem("analysisResult");
    if (stored) {
      try {
        setResult(JSON.parse(stored));
      } catch {
        /* ignore */
      }
    }
  }, []);

  if (!mounted) return null;

  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 px-4">
        <div className="text-center">
          <div className="h-20 w-20 rounded-full bg-white/4 border border-white/8 flex items-center justify-center mx-auto mb-5">
            <FileText className="h-8 w-8 text-white/20" />
          </div>
          <h2 className="text-xl font-bold text-white/70 mb-2">No Results Yet</h2>
          <p className="text-sm text-white/35 max-w-sm">
            Run an analysis from the Dashboard to see your AI-powered results here.
          </p>
        </div>
        <Link href="/dashboard">
          <button className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium text-white bg-[#00D4FF]/10 border border-[#00D4FF]/25 hover:bg-[#00D4FF]/15 transition-colors">
            <ArrowLeft className="h-4 w-4" /> Go to Dashboard
          </button>
        </Link>
      </div>
    );
  }

  const scoreColor = getScoreColor(result.overallScore);
  const scoreLabel = getScoreLabel(result.overallScore);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 pb-12">

      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link href="/dashboard">
              <button className="p-1.5 rounded-lg text-white/40 hover:text-white/70 hover:bg-white/5 transition-colors">
                <ArrowLeft className="h-4 w-4" />
              </button>
            </Link>
            <h2 className="text-2xl font-black text-white/90">Analysis Results</h2>
          </div>
          <p className="text-sm text-white/40 ml-8">
            Target Role:{" "}
            <span className="text-[#F472B6] font-semibold">{result.targetRole}</span>
            {" · "}
            <span className="text-white/25 text-xs">
              {new Date(result.timestamp).toLocaleString()}
            </span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          {result.isMock && (
            <NeonBadge label="Simulated Result" variant="pink" dot size="md" />
          )}
          <NeonBadge label="AI Analysis Complete" variant="green" dot size="md" />
          <NeonBadge label={`Powered by Gemini`} variant="purple" size="sm" />
        </div>
      </motion.div>

      {/* ── Internship Readiness Banner ── */}
      {result.internshipReadiness && (
        <InternshipReadinessBanner level={result.internshipReadiness} />
      )}

      {/* ── Score Overview Row ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Overall Score", value: result.overallScore, icon: Star, accent: "blue" as const },
          { label: "Resume Score", value: result.resumeScore, icon: FileText, accent: "purple" as const },
          { label: "ATS Score", value: result.atsScore, icon: Brain, accent: "pink" as const },
          { label: "Role Match", value: result.matchScore, icon: Target, accent: "green" as const },
        ].map((item, i) => {
          const Icon = item.icon;
          const color = getScoreColor(item.value);
          return (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="glass glass-hover rounded-2xl p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <Icon className="h-4 w-4 text-white/40" />
                <span className="text-xs font-medium" style={{ color }}>
                  {getScoreLabel(item.value)}
                </span>
              </div>
              <p className="text-3xl font-black" style={{ color }}>
                {item.value}
                <span className="text-base text-white/30">%</span>
              </p>
              <p className="text-xs text-white/40 mt-1">{item.label}</p>
              <div className="mt-3 h-1 rounded-full bg-white/5 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${item.value}%` }}
                  transition={{ duration: 1, delay: 0.4 + i * 0.08 }}
                  className="h-full rounded-full"
                  style={{ background: color }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ── GitHub Score (if available) ── */}
      {result.githubScore > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="glass glass-hover rounded-2xl p-5 flex items-center gap-5"
        >
          <ATSScoreRing score={result.githubScore} />
          <div className="flex-1">
            <p className="text-sm font-semibold text-white/80 mb-1">GitHub Portfolio Score</p>
            <p className="text-xs text-white/40 leading-relaxed">
              {result.githubFeedback || "Your GitHub portfolio has been analyzed and factored into the overall score."}
            </p>
            {result.github && (
              <div className="flex flex-wrap gap-2 mt-2">
                <NeonBadge label={`${result.github.repos} repos`} variant="purple" size="sm" />
                <NeonBadge label={`${result.github.stars} ★ stars`} variant="muted" size="sm" />
                <NeonBadge label={`${result.github.followers} followers`} variant="muted" size="sm" />
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* ── Charts Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <SkillsChart data={result.radarData} />
        <ScoreCard score={result.overallScore} />
      </div>

      {/* ── Section Scores Bar Chart ── */}
      <GlassCard animate>
        <h3 className="text-sm font-semibold text-white/90 mb-5">Resume Section Scores</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart
            data={result.sectionScores}
            margin={{ top: 0, right: 10, bottom: 0, left: -20 }}
          >
            <XAxis
              dataKey="section"
              tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                background: "rgba(10,10,18,0.95)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 12,
                fontSize: 12,
              }}
              labelStyle={{ color: "rgba(255,255,255,0.7)" }}
              itemStyle={{ color: "#00D4FF" }}
              formatter={(val: number, _name: string, props: { payload?: { feedback?: string } }) => [
                `${val}/100`,
                props.payload?.feedback ?? "",
              ]}
            />
            <Bar dataKey="score" radius={[6, 6, 0, 0]}>
              {result.sectionScores.map((entry, i) => (
                <Cell key={i} fill={getScoreColor(entry.score)} opacity={0.85} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </GlassCard>

      {/* ── Suggestions + Missing Keywords + Skills to Learn ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* AI Suggestions */}
        <GlassCard animate className="flex flex-col gap-3">
          <div className="flex items-center gap-2 mb-1">
            <Lightbulb className="h-4 w-4 text-[#00D4FF]" />
            <h3 className="text-sm font-semibold text-white/90">AI Suggestions</h3>
            <NeonBadge label="Gemini" variant="purple" size="sm" />
          </div>
          <ul className="space-y-2.5">
            {(result.suggestions?.length ? result.suggestions : result.recommendations).map(
              (s, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-xs text-white/55 leading-relaxed"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#00D4FF] shrink-0" />
                  {s}
                </li>
              )
            )}
          </ul>
        </GlassCard>

        {/* Skills to Learn */}
        <GlassCard animate className="flex flex-col gap-3">
          <div className="flex items-center gap-2 mb-1">
            <GraduationCap className="h-4 w-4 text-[#F472B6]" />
            <h3 className="text-sm font-semibold text-white/90">Skills to Learn</h3>
          </div>
          {result.skillsToLearn?.length ? (
            <div className="flex flex-wrap gap-2">
              {result.skillsToLearn.map((skill, i) => (
                <motion.span
                  key={skill}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="px-2.5 py-1 text-xs rounded-full font-medium"
                  style={{
                    background: "rgba(244,114,182,0.1)",
                    color: "#F472B6",
                    border: "1px solid rgba(244,114,182,0.2)",
                  }}
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-white/30">No additional skills flagged.</p>
          )}
          <p className="text-xs text-white/25 mt-auto pt-2 border-t border-white/5">
            Recommended learning path for {result.targetRole}
          </p>
        </GlassCard>

        {/* Strengths */}
        <GlassCard animate className="flex flex-col gap-3">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle2 className="h-4 w-4 text-[#10B981]" />
            <h3 className="text-sm font-semibold text-white/90">Strengths</h3>
          </div>
          <ul className="space-y-2">
            {result.strengths.map((s, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-xs text-white/55 leading-relaxed"
              >
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#10B981] shrink-0" />
                {s.replace(/^✓\s*/, "")}
              </li>
            ))}
          </ul>
        </GlassCard>
      </div>

      {/* ── Keywords ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <GlassCard animate>
          <div className="flex items-center gap-2 mb-4">
            <Tag className="h-4 w-4 text-[#10B981]" />
            <h3 className="text-sm font-semibold text-white/90">Detected Keywords</h3>
            <span className="text-xs text-white/30 ml-auto">
              {result.presentKeywords.length} found
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {result.presentKeywords.map((kw) => (
              <NeonBadge key={kw} label={kw} variant="green" size="sm" />
            ))}
          </div>
        </GlassCard>

        <GlassCard animate>
          <div className="flex items-center gap-2 mb-4">
            <Tag className="h-4 w-4 text-red-400" />
            <h3 className="text-sm font-semibold text-white/90">Missing Keywords</h3>
            <span className="text-xs text-white/30 ml-auto">
              {result.missingKeywords.length} flagged
            </span>
          </div>
          {result.missingKeywords.length ? (
            <div className="flex flex-wrap gap-2">
              {result.missingKeywords.map((kw) => (
                <span
                  key={kw}
                  className="px-2.5 py-0.5 text-xs rounded-full bg-red-400/10 text-red-400 border border-red-400/20"
                >
                  {kw}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-[#10B981]">
              Great — no critical keywords missing!
            </p>
          )}
        </GlassCard>
      </div>

      {/* ── GitHub Analysis Card ── */}
      {result.github && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <GitHubCard
            profile={result.github}
            portfolioScore={result.githubScore}
          />
        </motion.div>
      )}

      {/* ── GitHub Feedback (text) if no full profile ── */}
      {!result.github && result.githubFeedback && (
        <GlassCard animate>
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="h-4 w-4 text-[#7C3AED]" />
            <h3 className="text-sm font-semibold text-white/90">Portfolio Feedback</h3>
            <NeonBadge label="Gemini" variant="purple" size="sm" />
          </div>
          <p className="text-sm text-white/55 leading-relaxed">{result.githubFeedback}</p>
        </GlassCard>
      )}

      {/* ── Weaknesses / Areas to Improve ── */}
      {result.weaknesses?.length > 0 && (
        <GlassCard animate>
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="h-4 w-4 text-amber-400" />
            <h3 className="text-sm font-semibold text-white/90">Areas to Improve</h3>
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {result.weaknesses.map((w, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-xs text-white/55 leading-relaxed p-2.5 rounded-lg bg-amber-400/5 border border-amber-400/10"
              >
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-amber-400 shrink-0" />
                {w}
              </li>
            ))}
          </ul>
        </GlassCard>
      )}

      {/* ── Run Again CTA ── */}
      <div className="flex justify-center pb-4">
        <Link href="/dashboard">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-8 py-3.5 rounded-2xl text-sm font-semibold text-white border border-white/10 glass hover:border-[#00D4FF]/30 transition-all duration-200"
          >
            <ArrowLeft className="h-4 w-4" />
            Run Another Analysis
          </motion.button>
        </Link>
      </div>
    </div>
  );
}
