"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import GlassCard from "@/components/common/GlassCard";
import { Target } from "lucide-react";
import { getScoreLabel, getScoreColor } from "@/utils/constants";

interface ScoreCardProps {
  score?: number;
  label?: string;
  isEmpty?: boolean;
}

const CustomTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { name: string; value: number }[];
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass rounded-xl px-3 py-2 text-xs text-white/80 border border-white/10">
        <p>{payload[0]?.name}: {payload[0]?.value}%</p>
      </div>
    );
  }
  return null;
};

export default function ScoreCard({ score, label = "Overall Score", isEmpty = false }: ScoreCardProps) {
  const displayScore = score ?? 0;
  const color = getScoreColor(displayScore);
  const scoreLabel = getScoreLabel(displayScore);

  const data = [
    { name: label, value: displayScore },
    { name: "Remaining", value: 100 - displayScore },
  ];

  return (
    <GlassCard className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <div className="p-2 rounded-lg bg-[#7C3AED]/10 border border-[#7C3AED]/20">
          <Target className="h-4 w-4 text-[#7C3AED]" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white/90">{label}</h3>
          <p className="text-xs text-white/40">AI match percentage</p>
        </div>
      </div>

      {isEmpty || !score ? (
        <div className="h-56 flex items-center justify-center">
          <div className="text-center">
            <div className="h-32 w-32 rounded-full border-2 border-dashed border-white/10 flex items-center justify-center mx-auto mb-3">
              <Target className="h-8 w-8 text-white/15" />
            </div>
            <p className="text-xs text-white/30">Awaiting analysis</p>
          </div>
        </div>
      ) : (
        <div className="relative">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                startAngle={90}
                endAngle={-270}
                dataKey="value"
                strokeWidth={0}
              >
                <Cell fill={color} opacity={0.9} />
                <Cell fill="rgba(255,255,255,0.04)" />
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>

          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-3xl font-bold" style={{ color }}>
              {displayScore}
            </span>
            <span className="text-xs text-white/40">/ 100</span>
            <span className="text-xs font-medium mt-1" style={{ color }}>
              {scoreLabel}
            </span>
          </div>
        </div>
      )}
    </GlassCard>
  );
}
