"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles, Shield, Zap } from "lucide-react";
import NeonBadge from "@/components/common/NeonBadge";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden grid-bg">
      {/* Background orbs */}
      <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-[#00D4FF]/6 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-[#7C3AED]/8 blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full bg-[#F472B6]/4 blur-[100px] pointer-events-none" />

      <div className="relative z-10 text-center px-4 sm:px-6 max-w-5xl mx-auto">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-6"
        >
          <NeonBadge
            label="✨ AI-Powered Resume Analysis"
            variant="blue"
            dot
            size="md"
          />
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight text-white leading-[1.05] mb-6"
        >
          Land Your{" "}
          <span className="gradient-text">Dream Role</span>
          <br />
          with AI Insights
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg sm:text-xl text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Upload your resume, link your GitHub, and get instant AI-powered analysis
          with match scores, skill gaps, and personalized recommendations.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link href="/dashboard">
            <motion.button
              id="hero-cta-btn"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="relative flex items-center gap-2.5 px-8 py-4 rounded-2xl font-semibold text-base text-white overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #00D4FF 0%, #7C3AED 100%)",
                boxShadow: "0 0 30px rgba(0, 212, 255, 0.3), 0 0 80px rgba(124, 58, 237, 0.15)",
              }}
            >
              <Sparkles className="h-5 w-5" />
              Analyze My Resume
              <ArrowRight className="h-4 w-4" />
            </motion.button>
          </Link>

          <Link href="/dashboard">
            <motion.button
              id="hero-secondary-btn"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold text-sm text-white/60 glass border border-white/10 hover:text-white/90 hover:border-white/20 transition-all duration-200"
            >
              View Demo
            </motion.button>
          </Link>
        </motion.div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex items-center justify-center gap-6 mt-14 flex-wrap"
        >
          {[
            { icon: Shield, label: "Privacy First" },
            { icon: Zap, label: "Instant Results" },
            { icon: Sparkles, label: "AI-Powered" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2 text-white/30 text-sm">
              <Icon className="h-4 w-4 text-[#00D4FF]/60" />
              {label}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
