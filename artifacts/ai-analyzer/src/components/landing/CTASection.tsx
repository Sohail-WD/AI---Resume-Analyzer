import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { SpotlightCard } from "@/components/effects/SpotlightCard";

export function CTASection() {
  return (
    <div className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 w-full h-full bg-primary/5 -z-10" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      
      <div className="max-w-4xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <SpotlightCard className="glass-card p-12 rounded-3xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/3 -z-10 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/10 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/3 -z-10 pointer-events-none" />

            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">
              Ready to upgrade your career?
            </h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of engineers and designers using Nexus AI to optimize their portfolios and land top-tier roles.
            </p>
            <Link href="/dashboard">
              <Button size="lg" className="h-14 px-8 text-lg font-semibold bg-gradient-to-r from-primary via-accent to-primary animated-gradient-btn text-primary-foreground border-none rounded-full transition-all">
                Start Free Analysis
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </SpotlightCard>
        </motion.div>
      </div>
    </div>
  );
}
