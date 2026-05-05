import Hero from "@/components/landing/Hero";
import FeatureCards from "@/components/landing/FeatureCards";
import CTASection from "@/components/landing/CTASection";
import Link from "next/link";
import { Zap } from "lucide-react";

export default function LandingPage() {
  return (
    <main className="min-h-screen" style={{ background: "#050508" }}>
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4"
        style={{ background: "rgba(5,5,8,0.85)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <Link href="/" className="flex items-center gap-2 group">
          <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-[#00D4FF]/20 to-[#7C3AED]/20 border border-[#00D4FF]/25 flex items-center justify-center">
            <Zap className="h-4 w-4 text-[#00D4FF]" />
          </div>
          <span className="text-base font-bold gradient-text-blue">ResumeAI</span>
        </Link>
        <div className="hidden sm:flex items-center gap-6 text-sm text-white/50">
          <Link href="#" className="hover:text-white/80 transition-colors">Features</Link>
          <Link href="#" className="hover:text-white/80 transition-colors">Pricing</Link>
          <Link href="/dashboard">
            <button className="px-4 py-2 rounded-xl text-sm font-medium text-white bg-white/8 border border-white/10 hover:bg-white/12 hover:border-white/20 transition-all duration-200">
              Dashboard →
            </button>
          </Link>
        </div>
      </nav>

      {/* Page content */}
      <Hero />
      <FeatureCards />
      <CTASection />

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-6 text-center text-xs text-white/25">
        © 2025 ResumeAI. Built with Next.js 15 &amp; AI.
      </footer>
    </main>
  );
}
