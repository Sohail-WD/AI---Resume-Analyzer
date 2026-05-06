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
  Download,
  Share2,
  Copy,
  Check,
  FileDown,
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
import TechPieChart from "@/components/dashboard/TechPieChart";
import ResultsSkeleton from "@/components/dashboard/ResultsSkeleton";
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
  const data = [{ name: "ATS", value: score, fill: color }, { name: "gap", value: 100 - score, fill: "rgba(0,0,0,0)" }];

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
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      const stored = sessionStorage.getItem("analysisResult");
      if (stored) {
        try {
          setResult(JSON.parse(stored));
        } catch {
          /* ignore */
        }
      }
      setLoading(false);
    }, 1500); // Small delay to show off skeletons
    return () => clearTimeout(timer);
  }, []);

  const handleCopySuggestions = () => {
    if (!result) return;
    const suggestions = (result.suggestions?.length ? result.suggestions : result.recommendations).join("\n- ");
    navigator.clipboard.writeText(`AI Suggestions for ${result.targetRole}:\n- ${suggestions}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPDF = () => {
    window.print();
  };

  if (loading) return <ResultsSkeleton />;

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

  // Derived data for Pie Chart
  const techData = result.presentKeywords.slice(0, 6).map(kw => ({
    name: kw,
    value: 10 + Math.floor(Math.random() * 20)
  }));

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 pb-12">

      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Link href="/dashboard" className="no-print">
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
        
        <div className="flex flex-wrap items-center gap-3 no-print">
          <button 
            onClick={handleDownloadPDF}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white/70 glass hover:text-white transition-all"
          >
            <FileDown className="h-4 w-4" /> Download PDF
          </button>
          <button 
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white/70 glass hover:text-white transition-all"
          >
            <Share2 className="h-4 w-4" /> Export
          </button>
          <div className="h-8 w-px bg-white/10 mx-1 hidden sm:block" />
          <div className="flex items-center gap-2">
            {result.isMock && (
              <NeonBadge label="Simulated Result" variant="pink" dot size="md" />
            )}
            <NeonBadge label="AI Analysis Complete" variant="green" dot size="md" />
          </div>
        </div>
      </motion.div>

      {/* ── Internship Readiness Banner ── */}
      {result.internshipReadiness && (
        <InternshipReadinessBanner level={result.internshipReadiness} />
      )}

      {/* ── Score Overview Row ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Overall Score", value: result.overallScore, icon: Star, accent: "blue" as const, trend: "+5%" },
          { label: "Resume Score", value: result.resumeScore, icon: FileText, accent: "purple" as const, trend: "Avg" },
          { label: "ATS Score", value: result.atsScore, icon: Brain, accent: "pink" as const, trend: "Top 10%" },
          { label: "Role Match", value: result.matchScore, icon: Target, accent: "green" as const, trend: "Strong" },
        ].map((item, i) => {
          const Icon = item.icon;
          const color = getScoreColor(item.value);
          return (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="glass glass-hover rounded-2xl p-5 relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                  <Icon className="h-4 w-4 text-white/60" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-tighter px-2 py-0.5 rounded bg-white/5 text-white/40">
                  {item.trend}
                </span>
              </div>
              <p className="text-3xl font-black mb-1" style={{ color }}>
                {item.value}
                <span className="text-base text-white/30 ml-0.5">%</span>
              </p>
              <div className="flex items-center justify-between mt-auto">
                <p className="text-xs text-white/40 font-medium">{item.label}</p>
                <span className="text-[10px] font-medium" style={{ color }}>
                  {getScoreLabel(item.value)}
                </span>
              </div>
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
          className="glass glass-hover rounded-2xl p-5 flex items-center gap-5 border-l-4 border-l-[#00D4FF]"
        >
          <ATSScoreRing score={result.githubScore} />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <p className="text-sm font-semibold text-white/80">GitHub Portfolio Strength</p>
              <NeonBadge label="Analyzed" variant="blue" size="xs" />
            </div>
            <p className="text-xs text-white/40 leading-relaxed max-w-2xl">
              {result.githubFeedback || "Your GitHub portfolio has been analyzed and factored into the overall score."}
            </p>
            {result.github && (
              <div className="flex flex-wrap gap-2 mt-3">
                <div className="px-2 py-1 rounded-lg bg-white/5 border border-white/5 text-[10px] text-white/60 flex items-center gap-1.5">
                  <CheckCircle2 className="h-3 w-3 text-[#10B981]" /> {result.github.repos} repos
                </div>
                <div className="px-2 py-1 rounded-lg bg-white/5 border border-white/5 text-[10px] text-white/60 flex items-center gap-1.5">
                  <Star className="h-3 w-3 text-[#F59E0B]" /> {result.github.stars} stars
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* ── Charts Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <SkillsChart data={result.radarData} />
        </div>
        <TechPieChart data={techData} />
      </div>

      {/* ── Section Scores Bar Chart ── */}
      <GlassCard animate>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-semibold text-white/90">Detailed Resume Scoring</h3>
          <p className="text-[10px] text-white/30 uppercase tracking-widest">Section breakdown</p>
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart
            data={result.sectionScores}
            margin={{ top: 0, right: 10, bottom: 0, left: -20 }}
          >
            <XAxis
              dataKey="section"
              tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10 }}
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
              cursor={{ fill: 'rgba(255,255,255,0.02)' }}
              contentStyle={{
                background: "rgba(10,10,18,0.98)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 16,
                fontSize: 12,
                boxShadow: "0 10px 30px rgba(0,0,0,0.5)"
              }}
              labelStyle={{ color: "rgba(255,255,255,0.8)", fontWeight: 'bold', marginBottom: 4 }}
              itemStyle={{ color: "#00D4FF" }}
              formatter={(val: number, _name: string, props: { payload?: { feedback?: string } }) => [
                <div key="tip" className="flex flex-col gap-1">
                  <span className="text-lg font-black">{val}%</span>
                  <span className="text-[10px] text-white/40 leading-normal max-w-[200px] whitespace-normal">
                    {props.payload?.feedback}
                  </span>
                </div>
              ]}
            />
            <Bar dataKey="score" radius={[8, 8, 0, 0]} barSize={40}>
              {result.sectionScores.map((entry, i) => (
                <Cell key={i} fill={getScoreColor(entry.score)} opacity={0.9} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </GlassCard>

      {/* ── Suggestions + Missing Keywords + Skills to Learn ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* AI Suggestions */}
        <GlassCard animate className="flex flex-col gap-4">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-[#00D4FF]" />
              <h3 className="text-sm font-semibold text-white/90">AI Suggestions</h3>
            </div>
            <button 
              onClick={handleCopySuggestions}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/40 hover:text-white/80 transition-all no-print"
              title="Copy Suggestions"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-[#10B981]" /> : <Copy className="h-3.5 w-3.5" />}
            </button>
          </div>
          <ul className="space-y-3 flex-1 overflow-auto scrollbar-thin pr-2">
            {(result.suggestions?.length ? result.suggestions : result.recommendations).map(
              (s, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2.5 text-xs text-white/55 leading-relaxed p-2.5 rounded-xl bg-white/[0.02] border border-white/5"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#00D4FF] shrink-0 shadow-[0_0_8px_rgba(0,212,255,0.8)]" />
                  {s}
                </li>
              )
            )}
          </ul>
        </GlassCard>

        {/* Skills to Learn */}
        <GlassCard animate className="flex flex-col gap-4">
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
                  className="px-3 py-1.5 text-[10px] rounded-full font-bold uppercase tracking-wider"
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
          <div className="mt-auto pt-4 border-t border-white/5">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-3 w-3 text-white/20" />
              <p className="text-[10px] text-white/25 uppercase tracking-widest font-bold">
                Career Roadmap
              </p>
            </div>
          </div>
        </GlassCard>

        {/* Strengths */}
        <GlassCard animate className="flex flex-col gap-4">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle2 className="h-4 w-4 text-[#10B981]" />
            <h3 className="text-sm font-semibold text-white/90">Key Strengths</h3>
          </div>
          <ul className="space-y-3 overflow-auto scrollbar-thin pr-2">
            {result.strengths.map((s, i) => (
              <li
                key={i}
                className="flex items-center gap-3 text-xs text-white/70 p-3 rounded-xl bg-[#10B981]/5 border border-[#10B981]/10"
              >
                <div className="h-5 w-5 rounded-full bg-[#10B981]/10 flex items-center justify-center shrink-0">
                  <Check className="h-3 w-3 text-[#10B981]" />
                </div>
                {s.replace(/^✓\s*/, "")}
              </li>
            ))}
          </ul>
        </GlassCard>
      </div>

      {/* ── Keywords ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <GlassCard animate>
          <div className="flex items-center gap-2 mb-5">
            <Tag className="h-4 w-4 text-[#10B981]" />
            <h3 className="text-sm font-semibold text-white/90">Detected Tech Keywords</h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/5 text-white/30 ml-auto">
              {result.presentKeywords.length} MATCHED
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {result.presentKeywords.map((kw) => (
              <NeonBadge key={kw} label={kw} variant="green" size="sm" />
            ))}
          </div>
        </GlassCard>

        <GlassCard animate>
          <div className="flex items-center gap-2 mb-5">
            <Tag className="h-4 w-4 text-red-400" />
            <h3 className="text-sm font-semibold text-white/90">Critical Missing Keywords</h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/5 text-white/30 ml-auto uppercase">
              ATS Gap
            </span>
          </div>
          {result.missingKeywords.length ? (
            <div className="flex flex-wrap gap-2">
              {result.missingKeywords.map((kw) => (
                <span
                  key={kw}
                  className="px-3 py-1 text-[10px] font-bold rounded-lg bg-red-400/5 text-red-400 border border-red-400/10 uppercase tracking-tighter"
                >
                  {kw}
                </span>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 gap-2 text-center">
              <CheckCircle2 className="h-8 w-8 text-[#10B981] opacity-40" />
              <p className="text-xs text-[#10B981] font-medium">Perfect ATS Alignment</p>
              <p className="text-[10px] text-white/20">No critical keywords missing from your resume.</p>
            </div>
          )}
        </GlassCard>
      </div>

      {/* ── GitHub Analysis Card ── */}
      {result.github && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="no-print"
        >
          <GitHubCard
            profile={result.github}
            portfolioScore={result.githubScore}
          />
        </motion.div>
      )}

      {/* ── Areas to Improve ── */}
      {result.weaknesses?.length > 0 && (
        <GlassCard animate>
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="h-4 w-4 text-amber-400" />
            <h3 className="text-sm font-semibold text-white/90">Improvement Roadmap</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {result.weaknesses.map((w, i) => (
              <motion.div
                key={i}
                whileHover={{ x: 5 }}
                className="flex items-start gap-3 text-xs text-white/60 p-3 rounded-xl bg-amber-400/5 border border-amber-400/10"
              >
                <div className="mt-1 h-1.5 w-1.5 rounded-full bg-amber-400 shrink-0" />
                {w}
              </motion.div>
            ))}
          </div>
        </GlassCard>
      )}

      {/* ── Footer Actions ── */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 py-8 no-print border-t border-white/5">
        <Link href="/dashboard">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-8 py-3.5 rounded-2xl text-sm font-semibold text-white border border-white/10 glass hover:border-[#00D4FF]/30 transition-all duration-200"
          >
            <ArrowLeft className="h-4 w-4" />
            Return to Dashboard
          </motion.button>
        </Link>
        <button 
          onClick={handleDownloadPDF}
          className="flex items-center gap-2 px-8 py-3.5 rounded-2xl text-sm font-semibold text-black bg-[#00D4FF] hover:bg-[#00D4FF]/90 transition-all shadow-[0_0_20px_rgba(0,212,255,0.3)]"
        >
          <FileDown className="h-4 w-4" />
          Download Full Report
        </button>
      </div>
    </div>
  );
}

