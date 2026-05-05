"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export default function CTASection() {
  return (
    <section className="py-24 px-4 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative max-w-4xl mx-auto rounded-3xl overflow-hidden"
      >
        {/* Background */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, rgba(0,212,255,0.08) 0%, rgba(124,58,237,0.12) 50%, rgba(244,114,182,0.08) 100%)",
          }}
        />
        <div className="absolute inset-0 border border-white/8 rounded-3xl" />

        {/* Orbs */}
        <div className="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-[#00D4FF]/10 blur-3xl" />
        <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-[#7C3AED]/15 blur-3xl" />

        <div className="relative z-10 text-center py-16 px-8">
          <div className="flex justify-center mb-6">
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
              <Sparkles className="h-7 w-7 text-[#00D4FF]" />
            </div>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
            Ready to Analyze Your{" "}
            <span className="gradient-text">Resume?</span>
          </h2>
          <p className="text-white/50 text-lg max-w-xl mx-auto mb-10">
            Join thousands of job seekers who&apos;ve used AI insights to land
            interviews faster.
          </p>

          <Link href="/dashboard">
            <motion.button
              id="cta-start-btn"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-3 px-10 py-4 rounded-2xl font-bold text-base text-white"
              style={{
                background:
                  "linear-gradient(135deg, #00D4FF 0%, #7C3AED 100%)",
                boxShadow:
                  "0 0 40px rgba(0, 212, 255, 0.25), 0 0 80px rgba(124, 58, 237, 0.15)",
              }}
            >
              <Sparkles className="h-5 w-5" />
              Start Analyzing for Free
              <ArrowRight className="h-4 w-4" />
            </motion.button>
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
