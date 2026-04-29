import { motion, useReducedMotion } from "framer-motion";
import { ParticleField } from "./ParticleField";

export function AmbientBackground() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 bg-background">
      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03]" 
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />
      
      {/* Floating Blobs */}
      {!shouldReduceMotion ? (
        <>
          <motion.div
            animate={{
              x: ["0%", "10%", "-5%", "0%"],
              y: ["0%", "5%", "-10%", "0%"],
              scale: [1, 1.1, 0.9, 1],
            }}
            transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
            className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/20 blur-[120px]"
          />
          <motion.div
            animate={{
              x: ["0%", "-10%", "10%", "0%"],
              y: ["0%", "-5%", "15%", "0%"],
              scale: [1, 0.9, 1.1, 1],
            }}
            transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-accent/20 blur-[120px]"
          />
          <motion.div
            animate={{
              x: ["0%", "15%", "-15%", "0%"],
              y: ["0%", "-15%", "10%", "0%"],
              scale: [1, 1.2, 0.8, 1],
            }}
            transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
            className="absolute top-[40%] left-[30%] w-[30%] h-[30%] rounded-full bg-blue-500/10 blur-[100px]"
          />
        </>
      ) : (
        <>
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/20 blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-accent/20 blur-[120px]" />
          <div className="absolute top-[40%] left-[30%] w-[30%] h-[30%] rounded-full bg-blue-500/10 blur-[100px]" />
        </>
      )}

      {/* Radial Vignette */}
      <div className="absolute inset-0 bg-background/50 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black_100%)]" />

      {/* Particle Layer */}
      <ParticleField />
    </div>
  );
}
