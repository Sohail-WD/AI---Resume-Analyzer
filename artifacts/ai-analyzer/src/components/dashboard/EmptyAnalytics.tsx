import { BarChart3, Database, Search } from "lucide-react";
import { SpotlightCard } from "@/components/effects/SpotlightCard";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

export function EmptyAnalytics({ isAnalyzing }: { isAnalyzing?: boolean }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {[
        { icon: BarChart3, title: "Match Score", glow: "rgba(56,189,248,0.15)" },
        { icon: Search, title: "ATS Compatibility", glow: "rgba(245,158,11,0.15)" },
        { icon: Database, title: "Projects Analyzed", glow: "rgba(168,85,247,0.15)" },
        { icon: BarChart3, title: "Recommendations", glow: "rgba(34,197,94,0.15)" }
      ].map((item, i) => (
        <SpotlightCard key={i} spotlightColor={item.glow} className="glass-card opacity-80">
          <div className="p-6 flex flex-col min-h-[140px]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-muted-foreground text-sm uppercase tracking-wider">{item.title}</h3>
              <div className="p-2 rounded-lg bg-white/5 text-muted-foreground/50">
                <item.icon className="h-4 w-4" />
              </div>
            </div>
            
            {isAnalyzing ? (
              <div className="space-y-3 mt-auto">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-3 w-full" />
              </div>
            ) : (
              <div className="mt-auto">
                <div className="text-xl font-medium text-white/40">—</div>
                <p className="text-xs text-muted-foreground/60 mt-1 mb-3">Awaiting analysis</p>
                <Progress value={0} className="h-1 bg-white/5" />
              </div>
            )}
          </div>
        </SpotlightCard>
      ))}
    </div>
  );
}
