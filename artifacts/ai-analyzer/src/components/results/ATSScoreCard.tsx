import { SpotlightCard } from "@/components/effects/SpotlightCard";
import { Progress } from "@/components/ui/progress";

export function ATSScoreCard({ score }: { score: number }) {
  return (
    <SpotlightCard className="glass-card h-full flex flex-col">
      <div className="p-6 pb-2 border-b border-white/5">
        <h3 className="text-lg font-semibold tracking-tight">ATS Compatibility</h3>
      </div>
      <div className="p-6 pt-6 flex-1 space-y-8">
        <div className="flex items-center justify-center">
          <div className="relative flex items-center justify-center h-36 w-36 rounded-full border border-white/10 shadow-[0_0_30px_rgba(56,189,248,0.1)] inset-0">
            <svg className="absolute inset-0 h-full w-full -rotate-90 transform drop-shadow-[0_0_8px_rgba(56,189,248,0.5)]">
              <circle
                className="text-white/5 stroke-current"
                strokeWidth="6"
                cx="72"
                cy="72"
                r="64"
                fill="transparent"
              />
              <circle
                className="text-primary stroke-current transition-all duration-1000 ease-out"
                strokeWidth="6"
                strokeDasharray={402}
                strokeDashoffset={402 - (402 * score) / 100}
                strokeLinecap="round"
                cx="72"
                cy="72"
                r="64"
                fill="transparent"
              />
            </svg>
            <div className="text-center">
              <span className="text-4xl font-bold text-white tracking-tighter">{score}</span>
              <span className="text-xs text-muted-foreground block font-medium uppercase tracking-wider mt-1">Score</span>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1.5">
              <span className="text-muted-foreground font-medium">Formatting</span>
              <span className="text-white font-semibold">85%</span>
            </div>
            <Progress value={85} className="h-1.5 bg-white/5" indicatorColor="bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1.5">
              <span className="text-muted-foreground font-medium">Keyword Match</span>
              <span className="text-white font-semibold">62%</span>
            </div>
            <Progress value={62} className="h-1.5 bg-white/5" indicatorColor="bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1.5">
              <span className="text-muted-foreground font-medium">Readability</span>
              <span className="text-white font-semibold">90%</span>
            </div>
            <Progress value={90} className="h-1.5 bg-white/5" indicatorColor="bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
          </div>
        </div>
      </div>
    </SpotlightCard>
  );
}
