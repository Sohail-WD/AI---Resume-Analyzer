"use client";

import { motion } from "framer-motion";
import { Check, Zap, Star, Shield, Sparkles, Rocket, ArrowRight } from "lucide-react";
import GlassCard from "@/components/common/GlassCard";
import { useRouter } from "next/navigation";

const PLANS = [
  {
    name: "Basic",
    price: "₹0",
    period: "Forever",
    description: "Ideal for casual job seekers",
    icon: Zap,
    color: "#94A3B8",
    features: [
      "5 AI Analyses per day",
      "Standard Match Scoring",
      "GitHub Integration",
      "Community Support"
    ],
    buttonText: "Current Plan",
    current: true
  },
  {
    name: "Pro",
    price: "₹299",
    period: "per month",
    description: "For serious career growth",
    icon: Star,
    color: "#00D4FF",
    features: [
      "Unlimited AI Analyses",
      "Gemini 1.5 Pro (Deep Analysis)",
      "Premium PDF Reports",
      "ATS Keyword Optimization",
      "Priority Email Support"
    ],
    buttonText: "Upgrade to Pro",
    popular: true
  },
  {
    name: "Pro+",
    price: "₹599",
    period: "per month",
    description: "The ultimate career toolkit",
    icon: Rocket,
    color: "#7C3AED",
    features: [
      "Everything in Pro",
      "AI Mock Interviews",
      "Custom CV Templates",
      "1-on-1 Career Strategy",
      "Direct WhatsApp Support"
    ],
    buttonText: "Go Ultimate"
  }
];

export default function PricingPage() {
  const router = useRouter();

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20">
      <div className="text-center space-y-4 pt-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-4"
        >
          <Sparkles className="h-4 w-4 text-[#00D4FF]" />
          <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Choose Your Path</span>
        </motion.div>
        <h1 className="text-4xl md:text-6xl font-black text-white leading-tight">
          Unlock the Full Power of <span className="gradient-text">AI Analytics</span>
        </h1>
        <p className="text-white/40 max-w-2xl mx-auto text-lg">
          Take your career to the next level with precision insights, unlimited checks, and professional tools designed to get you hired.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {PLANS.map((plan, index) => {
          const Icon = plan.icon;
          return (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative h-full"
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                  <div className="bg-[#00D4FF] text-black text-[10px] font-black uppercase px-6 py-1.5 rounded-full shadow-[0_0_30px_rgba(0,212,255,0.4)] flex items-center gap-1.5">
                    <Star className="h-3.5 w-3.5 fill-black" />
                    Best Value
                  </div>
                </div>
              )}

              <GlassCard className={`h-full flex flex-col p-8 md:p-10 border ${plan.popular ? 'border-[#00D4FF]/40 bg-white/[0.03]' : 'border-white/5 bg-white/[0.01]'} hover:border-white/20 transition-all group`}>
                <div className="mb-10">
                  <div className="p-4 rounded-2xl w-fit mb-6" style={{ backgroundColor: `${plan.color}15`, border: `1px solid ${plan.color}30` }}>
                    <Icon className="h-8 w-8" style={{ color: plan.color }} />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">{plan.name}</h2>
                  <p className="text-sm text-white/30 leading-relaxed">{plan.description}</p>
                </div>

                <div className="mb-10">
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-black text-white">{plan.price}</span>
                    <span className="text-white/40 font-medium">{plan.period}</span>
                  </div>
                </div>

                <div className="space-y-5 flex-1 mb-10">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-4">
                      <div className="mt-1 h-5 w-5 rounded-full bg-[#10B981]/10 flex items-center justify-center shrink-0">
                        <Check className="h-3 w-3 text-[#10B981]" />
                      </div>
                      <span className="text-sm text-white/70 group-hover:text-white transition-colors">{feature}</span>
                    </div>
                  ))}
                </div>

                <button 
                  className={`w-full py-5 rounded-2xl text-base font-black transition-all flex items-center justify-center gap-2 ${
                    plan.current 
                      ? "bg-white/5 text-white/20 cursor-default border border-white/10" 
                      : plan.popular
                        ? "bg-[#00D4FF] text-black shadow-[0_0_30px_rgba(0,212,255,0.4)] hover:shadow-[0_0_40px_rgba(0,212,255,0.6)] hover:scale-[1.02]"
                        : "bg-white text-black hover:bg-white/90 hover:scale-[1.02]"
                  }`}
                >
                  {plan.buttonText}
                  {!plan.current && <ArrowRight className="h-4 w-4" />}
                </button>
              </GlassCard>
            </motion.div>
          );
        })}
      </div>

      <div className="flex flex-col items-center gap-8 pt-12 border-t border-white/5">
        <div className="flex flex-wrap justify-center gap-12 opacity-40">
          <div className="flex items-center gap-3">
            <Shield className="h-5 w-5" />
            <span className="text-xs font-bold uppercase tracking-widest">SSL Secure</span>
          </div>
          <div className="flex items-center gap-3">
            <Sparkles className="h-5 w-5" />
            <span className="text-xs font-bold uppercase tracking-widest">Instant Activation</span>
          </div>
          <div className="flex items-center gap-3">
            <Shield className="h-5 w-5" />
            <span className="text-xs font-bold uppercase tracking-widest">Refund Policy</span>
          </div>
        </div>
      </div>
    </div>
  );
}
