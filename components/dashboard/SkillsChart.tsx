"use client";

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import GlassCard from "@/components/common/GlassCard";
import { Activity } from "lucide-react";

interface SkillsChartProps {
  data?: { subject: string; A: number; fullMark: number }[];
  isEmpty?: boolean;
}

const CustomTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { value: number; name: string }[];
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass rounded-xl px-3 py-2 text-xs text-white/80 border border-white/10">
        <p className="font-semibold">{payload[0]?.name}</p>
        <p className="text-[#00D4FF]">{payload[0]?.value}/100</p>
      </div>
    );
  }
  return null;
};

export default function SkillsChart({ data, isEmpty = false }: SkillsChartProps) {
  return (
    <GlassCard className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <div className="p-2 rounded-lg bg-[#00D4FF]/10 border border-[#00D4FF]/20">
          <Activity className="h-4 w-4 text-[#00D4FF]" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white/90">Skills Radar</h3>
          <p className="text-xs text-white/40">Competency breakdown</p>
        </div>
      </div>

      {isEmpty || !data ? (
        <div className="h-56 flex items-center justify-center">
          <div className="text-center">
            <div className="h-32 w-32 rounded-full border-2 border-dashed border-white/10 flex items-center justify-center mx-auto mb-3">
              <Activity className="h-8 w-8 text-white/15" />
            </div>
            <p className="text-xs text-white/30">Run analysis to see results</p>
          </div>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <RadarChart data={data} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
            <PolarGrid
              stroke="rgba(255,255,255,0.06)"
              gridType="polygon"
            />
            <PolarAngleAxis
              dataKey="subject"
              tick={{ fill: "rgba(255,255,255,0.45)", fontSize: 11 }}
            />
            <Radar
              name="Score"
              dataKey="A"
              stroke="#00D4FF"
              fill="#00D4FF"
              fillOpacity={0.15}
              strokeWidth={2}
            />
            <Tooltip content={<CustomTooltip />} />
          </RadarChart>
        </ResponsiveContainer>
      )}
    </GlassCard>
  );
}
