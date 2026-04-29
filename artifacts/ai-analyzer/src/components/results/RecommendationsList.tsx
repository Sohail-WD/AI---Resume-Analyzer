import { CheckCircle2, AlertTriangle, Info, XCircle } from "lucide-react";
import { SpotlightCard } from "@/components/effects/SpotlightCard";
import { Recommendation } from "@/types/analyzer";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const iconMap = {
  critical: XCircle,
  warning: AlertTriangle,
  suggestion: Info,
  praise: CheckCircle2,
};

const colorMap = {
  critical: "text-rose-500 bg-rose-500/10 border-rose-500/20 shadow-[0_0_10px_rgba(244,63,94,0.2)]",
  warning: "text-amber-500 bg-amber-500/10 border-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.2)]",
  suggestion: "text-primary bg-primary/10 border-primary/20 shadow-[0_0_10px_rgba(56,189,248,0.2)]",
  praise: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.2)]",
};

export function RecommendationsList({ recommendations }: { recommendations: Recommendation[] }) {
  return (
    <SpotlightCard className="glass-card col-span-full h-full flex flex-col">
      <div className="p-6 pb-4 border-b border-white/5 flex items-center justify-between">
        <h3 className="text-lg font-semibold tracking-tight">AI Insights & Recommendations</h3>
        <Badge variant="outline" className="bg-white/5 text-white/70 border-white/10 px-2.5 py-0.5">
          {recommendations.length} Items
        </Badge>
      </div>
      <div className="flex-1 p-0">
        <div className="divide-y divide-white/5">
          {recommendations.map((rec) => {
            const Icon = iconMap[rec.type];
            return (
              <div key={rec.id} className="p-5 hover:bg-white/[0.03] transition-colors flex gap-4 items-start group">
                <div className={cn("p-2 rounded-xl border shrink-0 mt-0.5 transition-transform group-hover:scale-110 duration-300", colorMap[rec.type])}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm text-white/90 leading-relaxed font-medium">{rec.message}</p>
                  {rec.actionable && (
                    <p className="text-xs text-primary font-semibold mt-2 cursor-pointer hover:underline inline-flex items-center gap-1.5 transition-colors hover:text-primary/80">
                      View how to fix
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </SpotlightCard>
  );
}
