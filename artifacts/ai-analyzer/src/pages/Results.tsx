import { motion } from "framer-motion";
import { Link } from "wouter";
import { ChevronLeft, BarChart3, Search, Database, Star, Download, Sparkles } from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { AnalyticsCard } from "@/components/dashboard/AnalyticsCard";
import { SkillRadarChart } from "@/components/results/SkillRadarChart";
import { ProjectImpactChart } from "@/components/results/ProjectImpactChart";
import { ATSScoreCard } from "@/components/results/ATSScoreCard";
import { RecommendationsList } from "@/components/results/RecommendationsList";
import { mockAnalysisResult } from "@/lib/mockData";
import { Button } from "@/components/ui/button";

export default function Results() {
  const result = mockAnalysisResult;

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <DashboardShell>
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-10 pb-12"
      >
        <motion.div variants={item} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="h-8 px-2 text-muted-foreground hover:text-white -ml-2">
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Back
                </Button>
              </Link>
              <span className="text-primary text-xs font-semibold tracking-widest uppercase px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20">
                {result.role}
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Analysis Complete</h2>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="border-white/10 bg-white/5 text-white hover:bg-white/10">
              <Download className="mr-2 h-4 w-4" />
              Export PDF
            </Button>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_20px_rgba(56,189,248,0.3)]">
              <Sparkles className="mr-2 h-4 w-4" />
              Apply Recommendations
            </Button>
          </div>
        </motion.div>

        {/* Top Stats Row */}
        <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <AnalyticsCard 
            title="Overall Match" 
            value={`${result.overallMatch}%`} 
            subtitle="Top 15% of candidates" 
            icon={BarChart3} 
            trend={{ value: 12, isPositive: true }}
            glowColor="primary"
          />
          <AnalyticsCard 
            title="ATS Compatibility" 
            value={`${result.atsCompatibility}%`} 
            subtitle="Needs minor formatting" 
            icon={Search} 
            trend={{ value: 5, isPositive: false }}
            glowColor="amber"
          />
          <AnalyticsCard 
            title="Projects Analyzed" 
            value={result.projectsAnalyzed} 
            subtitle="High impact detected" 
            icon={Database} 
            glowColor="accent"
          />
          <AnalyticsCard 
            title="Recommendations" 
            value={result.recommendationsCount} 
            subtitle="1 critical, 2 suggestions" 
            icon={Star} 
            glowColor="green"
          />
        </motion.div>

        {/* Middle Charts Row */}
        <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 h-full">
            <ATSScoreCard score={result.atsCompatibility} />
          </div>
          <div className="lg:col-span-2 h-full">
            <SkillRadarChart skills={result.skills} />
          </div>
        </motion.div>

        {/* Bottom Row */}
        <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-full">
            <ProjectImpactChart projects={result.projects} />
          </div>
          <div className="h-full">
            <RecommendationsList recommendations={result.recommendations} />
          </div>
        </motion.div>

      </motion.div>
    </DashboardShell>
  );
}
