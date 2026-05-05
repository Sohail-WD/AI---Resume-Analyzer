import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ChevronRight, BrainCircuit, ShieldCheck, Zap } from "lucide-react";
import { SpotlightCard } from "@/components/effects/SpotlightCard";

export function Hero() {
  return (
    <div className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden py-20">
      <div className="max-w-4xl mx-auto px-4 text-center space-y-10 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-sm text-primary mb-4"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          Nexus AI Engine v2.0 is live
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl md:text-7xl font-extrabold tracking-tight text-white"
        >
          Your career trajectory, <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-accent">quantified by AI.</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
        >
          Drop your resume and GitHub. Select your target role. Get deep, actionable insights on how you stack up against top-tier tech candidates.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
        >
          <Link href="/dashboard">
            <Button size="lg" className="h-14 px-8 text-lg font-semibold text-primary-foreground rounded-full transition-all border-none bg-gradient-to-r from-primary via-accent to-primary animated-gradient-btn">
              Launch Analyzer
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full border-white/10 bg-white/5 hover:bg-white/10 text-white transition-all hover:scale-105">
            View Example Report
          </Button>
        </motion.div>
      </div>

      {/* Feature Highlights row */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto px-4 mt-24 w-full"
      >
        {[
          { icon: BrainCircuit, title: "Deep Context Analysis", desc: "We don't just keyword match. We understand project complexity." },
          { icon: Zap, title: "Actionable Insights", desc: "Get specific recommendations on exactly what to rewrite." },
          { icon: ShieldCheck, title: "ATS Optimization", desc: "Ensure your resume passes the automated screeners." }
        ].map((f, i) => (
          <SpotlightCard key={i} className="glass-card p-6 rounded-2xl flex flex-col items-center text-center glow-border border-none">
            <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
              <f.icon className="h-6 w-6" />
            </div>
            <h3 className="text-white font-medium mb-2">{f.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
          </SpotlightCard>
        ))}
      </motion.div>
    </div>
  );
}
