"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Check, Zap, Star, Shield, X, Sparkles, Rocket } from "lucide-react";
import GlassCard from "@/components/common/GlassCard";
import NeonBadge from "@/components/common/NeonBadge";

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

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

export default function PricingModal({ isOpen, onClose }: PricingModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto no-scrollbar"
          >
            <GlassCard className="p-8 md:p-12 border-white/10">
              <button 
                onClick={onClose}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/10 transition-colors text-white/40 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="text-center space-y-4 mb-12">
                <h2 className="text-4xl font-black text-white">Elevate Your Career</h2>
                <p className="text-white/40 max-w-lg mx-auto">
                  Choose the plan that fits your ambition. Get deeper insights and land your dream job faster.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {PLANS.map((plan) => {
                  const Icon = plan.icon;
                  return (
                    <motion.div
                      key={plan.name}
                      whileHover={{ y: -5 }}
                      className="relative"
                    >
                      {plan.popular && (
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                          <div className="bg-[#00D4FF] text-black text-[10px] font-black uppercase px-4 py-1 rounded-full shadow-[0_0_20px_rgba(0,212,255,0.5)] flex items-center gap-1">
                            <Sparkles className="h-3 w-3" />
                            Most Popular
                          </div>
                        </div>
                      )}

                      <div className={`h-full flex flex-col p-6 rounded-3xl border ${plan.popular ? 'bg-white/[0.03] border-[#00D4FF]/30' : 'bg-white/[0.01] border-white/5'} hover:border-white/20 transition-all`}>
                        <div className="mb-8">
                          <div className="p-3 rounded-2xl w-fit mb-4" style={{ backgroundColor: `${plan.color}10`, border: `1px solid ${plan.color}30` }}>
                            <Icon className="h-6 w-6" style={{ color: plan.color }} />
                          </div>
                          <h3 className="text-xl font-bold text-white mb-1">{plan.name}</h3>
                          <p className="text-xs text-white/30">{plan.description}</p>
                        </div>

                        <div className="mb-8">
                          <div className="flex items-baseline gap-1">
                            <span className="text-4xl font-black text-white">{plan.price}</span>
                            <span className="text-white/40 text-sm font-medium">{plan.period}</span>
                          </div>
                        </div>

                        <div className="space-y-4 flex-1 mb-8">
                          {plan.features.map((feature) => (
                            <div key={feature} className="flex items-start gap-3">
                              <div className="mt-1 h-4 w-4 rounded-full bg-[#10B981]/10 flex items-center justify-center shrink-0">
                                <Check className="h-2.5 w-2.5 text-[#10B981]" />
                              </div>
                              <span className="text-xs text-white/60">{feature}</span>
                            </div>
                          ))}
                        </div>

                        <button 
                          className={`w-full py-4 rounded-2xl text-sm font-bold transition-all ${
                            plan.current 
                              ? "bg-white/5 text-white/40 cursor-default border border-white/10" 
                              : plan.popular
                                ? "bg-[#00D4FF] text-black shadow-[0_0_30px_rgba(0,212,255,0.3)] hover:scale-[1.02] active:scale-[0.98]"
                                : "bg-white text-black hover:bg-white/90 hover:scale-[1.02] active:scale-[0.98]"
                          }`}
                        >
                          {plan.buttonText}
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-center gap-8 text-white/30">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Secure Payments via Razorpay</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Cancel anytime</span>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
