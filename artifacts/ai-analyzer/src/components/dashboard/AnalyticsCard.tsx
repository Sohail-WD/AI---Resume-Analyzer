import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { SpotlightCard } from "@/components/effects/SpotlightCard";

interface AnalyticsCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: LucideIcon;
  trend?: { value: number; isPositive: boolean };
  glowColor?: "primary" | "accent" | "green" | "amber";
  progress?: number;
}

export function AnalyticsCard({ title, value, subtitle, icon: Icon, trend, glowColor = "primary", progress }: AnalyticsCardProps) {
  const glowMap = {
    primary: "group-hover:shadow-[0_0_30px_rgba(56,189,248,0.2)]",
    accent: "group-hover:shadow-[0_0_30px_rgba(168,85,247,0.2)]",
    green: "group-hover:shadow-[0_0_30px_rgba(34,197,94,0.2)]",
    amber: "group-hover:shadow-[0_0_30px_rgba(245,158,11,0.2)]",
  };

  const spotlightColorMap = {
    primary: "rgba(56,189,248,0.15)",
    accent: "rgba(168,85,247,0.15)",
    green: "rgba(34,197,94,0.15)",
    amber: "rgba(245,158,11,0.15)",
  };

  const textMap = {
    primary: "text-primary",
    accent: "text-accent",
    green: "text-emerald-500",
    amber: "text-amber-500",
  };

  return (
    <SpotlightCard spotlightColor={spotlightColorMap[glowColor]} className={cn("glass-card relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300", glowMap[glowColor])}>
      <div className={cn("absolute top-0 right-0 w-32 h-32 bg-current opacity-5 blur-[50px] -z-10", textMap[glowColor])} />
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium text-muted-foreground text-sm uppercase tracking-wider">{title}</h3>
          <div className={cn("p-2 rounded-lg bg-white/5", textMap[glowColor])}>
            <Icon className="h-4 w-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-white">{value}</span>
          {trend && (
            <span className={cn("text-xs font-medium", trend.isPositive ? "text-emerald-500" : "text-rose-500")}>
              {trend.isPositive ? "+" : "-"}{Math.abs(trend.value)}%
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
        
        {progress !== undefined && (
          <div className="mt-4">
            <Progress value={progress} className="h-1 bg-white/5" />
          </div>
        )}
      </div>
    </SpotlightCard>
  );
}

