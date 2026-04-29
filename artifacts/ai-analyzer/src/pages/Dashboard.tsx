import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { FileText, ShieldCheck, Github, Target } from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { ResumeUploadCard } from "@/components/dashboard/ResumeUploadCard";
import { GithubInputCard } from "@/components/dashboard/GithubInputCard";
import { TargetRoleSelect } from "@/components/dashboard/TargetRoleSelect";
import { AnalyzeButton } from "@/components/dashboard/AnalyzeButton";
import { EmptyAnalytics } from "@/components/dashboard/EmptyAnalytics";
import { TargetRole } from "@/types/analyzer";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [file, setFile] = useState<File | null>(null);
  const [githubUrl, setGithubUrl] = useState("");
  const [role, setRole] = useState<TargetRole>("Frontend Developer");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    if (!file && !githubUrl) {
      toast({
        title: "Missing Information",
        description: "Please upload a resume or provide a GitHub URL.",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      // Simulate API call 2.5s
      await new Promise(resolve => setTimeout(resolve, 2500));
      setLocation("/results");
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "There was an error analyzing your profile. Please try again.",
        variant: "destructive"
      });
      setIsAnalyzing(false);
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <DashboardShell>
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-10 pb-12"
      >
        {/* SECTION 1 — Hero card */}
        <motion.div variants={item} className="relative rounded-3xl overflow-hidden glass-card p-8 md:p-12 glow-border">
          {/* Animated gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-accent/20 opacity-50 animate-pulse" style={{ animationDuration: '8s' }} />
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/30 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/30 rounded-full blur-[80px] translate-y-1/3 -translate-x-1/4" />
          
          <div className="relative z-10 flex flex-col items-center text-center space-y-4 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-white bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
              Analyze Your Internship Readiness
            </h2>
            <p className="text-muted-foreground md:text-lg">
              Upload your resume, link your GitHub, pick a target role — get a precise readiness score in seconds.
            </p>
          </div>
        </motion.div>

        {/* SECTION 2 — Two upload/input cards */}
        <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="group relative">
            <ResumeUploadCard file={file} setFile={setFile} />
          </div>
          <div className="group relative">
            <GithubInputCard url={githubUrl} setUrl={setGithubUrl} />
          </div>
        </motion.div>

        {/* SECTION 3 — Target Role dropdown */}
        <motion.div variants={item} className="max-w-md mx-auto w-full">
          <div className="text-[10px] uppercase tracking-widest font-semibold text-muted-foreground mb-2 px-1 text-center">
            Target Role
          </div>
          <TargetRoleSelect role={role} setRole={setRole} />
        </motion.div>

        {/* SECTION 4 — Large Analyze button */}
        <motion.div variants={item} className="max-w-xl mx-auto w-full pt-4">
          <AnalyzeButton 
            onClick={handleAnalyze} 
            isLoading={isAnalyzing} 
            disabled={!file && !githubUrl} 
          />
        </motion.div>

        {/* SECTION 5 — Analytics cards grid */}
        <motion.div variants={item} className="pt-8">
          <EmptyAnalytics isAnalyzing={isAnalyzing} />
        </motion.div>

      </motion.div>
    </DashboardShell>
  );
}
