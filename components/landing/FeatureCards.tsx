"use client";

import { motion } from "framer-motion";
import {
  Upload,
  BarChart3,
  Target,
  GitBranch,
  Lightbulb,
  Shield,
} from "lucide-react";
import GlassCard from "@/components/common/GlassCard";

const FEATURES = [
  {
    icon: Upload,
    title: "Smart Resume Parsing",
    description:
      "Upload your PDF resume and our AI extracts and analyzes every section — experience, skills, education, and projects.",
    accent: "#00D4FF",
    accentBg: "rgba(0,212,255,0.1)",
    accentBorder: "rgba(0,212,255,0.2)",
  },
  {
    icon: GitBranch,
    title: "GitHub Portfolio Analysis",
    description:
      "Link your GitHub profile to showcase real projects. We analyze languages, contribution patterns, and repo quality.",
    accent: "#7C3AED",
    accentBg: "rgba(124,58,237,0.1)",
    accentBorder: "rgba(124,58,237,0.2)",
  },
  {
    icon: Target,
    title: "Role Match Scoring",
    description:
      "Get a precise match score showing how well your profile aligns with your target role's requirements.",
    accent: "#F472B6",
    accentBg: "rgba(244,114,182,0.1)",
    accentBorder: "rgba(244,114,182,0.2)",
  },
  {
    icon: BarChart3,
    title: "Skill Gap Analysis",
    description:
      "Identify missing skills with a visual radar chart and get a prioritized list of what to learn next.",
    accent: "#10B981",
    accentBg: "rgba(16,185,129,0.1)",
    accentBorder: "rgba(16,185,129,0.2)",
  },
  {
    icon: Lightbulb,
    title: "Actionable Recommendations",
    description:
      "Receive personalized, prioritized steps to improve your resume and maximize your interview chances.",
    accent: "#F59E0B",
    accentBg: "rgba(245,158,11,0.1)",
    accentBorder: "rgba(245,158,11,0.2)",
  },
  {
    icon: Shield,
    title: "Privacy First",
    description:
      "Your resume data is processed securely and never stored permanently. Your career data stays yours.",
    accent: "#60A5FA",
    accentBg: "rgba(96,165,250,0.1)",
    accentBorder: "rgba(96,165,250,0.2)",
  },
];

export default function FeatureCards() {
  return (
    <section className="py-24 px-4 sm:px-6 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mb-16"
      >
        <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
          Everything You Need to{" "}
          <span className="gradient-text">Stand Out</span>
        </h2>
        <p className="text-white/45 text-lg max-w-2xl mx-auto">
          Our AI analyzes every aspect of your professional profile to give you
          the competitive edge.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {FEATURES.map((feature, i) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <GlassCard hover className="h-full group">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 border transition-all duration-300 group-hover:scale-110"
                  style={{
                    background: feature.accentBg,
                    borderColor: feature.accentBorder,
                  }}
                >
                  <Icon className="h-5 w-5" style={{ color: feature.accent }} />
                </div>
                <h3 className="text-base font-bold text-white/90 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-white/45 leading-relaxed">
                  {feature.description}
                </p>
              </GlassCard>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
