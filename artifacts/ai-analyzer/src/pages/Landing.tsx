import { Hero } from "@/components/landing/Hero";
import { CTASection } from "@/components/landing/CTASection";
import { AmbientBackground } from "@/components/effects/AmbientBackground";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 relative">
      <AmbientBackground />
      <nav className="fixed top-0 left-0 right-0 z-50 flex h-20 items-center justify-between px-6 md:px-12 backdrop-blur-md border-b border-white/5 bg-background/50">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
          </div>
          <span className="font-bold text-xl tracking-tight text-white">NEXUS</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          <a href="#about" className="hover:text-white transition-colors">About</a>
        </div>
        <div className="flex items-center gap-4">
          <a href="/dashboard" className="text-sm font-medium text-white hover:text-primary transition-colors hidden md:block">Log in</a>
          <a href="/dashboard" className="h-10 px-4 inline-flex items-center justify-center rounded-full bg-white text-black text-sm font-semibold hover:bg-white/90 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.1)]">
            Get Started
          </a>
        </div>
      </nav>

      <main className="pt-20 relative z-10">
        <Hero />
        <CTASection />
      </main>

      <footer className="border-t border-white/5 py-12 text-center text-sm text-muted-foreground relative z-10">
        <p>© 2025 Nexus AI. All rights reserved.</p>
      </footer>
    </div>
  );
}
