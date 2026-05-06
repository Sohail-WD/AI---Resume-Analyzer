"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import GlassCard from "@/components/common/GlassCard";

interface TechData {
  name: string;
  value: number;
}

interface TechPieChartProps {
  data: TechData[];
}

const COLORS = ["#00D4FF", "#7C3AED", "#F472B6", "#10B981", "#F59E0B", "#6366F1"];

export default function TechPieChart({ data }: TechPieChartProps) {
  if (!data || data.length === 0) return null;

  return (
    <GlassCard animate className="min-h-[350px]">
      <h3 className="text-sm font-semibold text-white/90 mb-5">Technology Distribution</h3>
      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: "rgba(10,10,18,0.95)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 12,
                fontSize: 12,
              }}
              itemStyle={{ color: "#fff" }}
            />
            <Legend 
              verticalAlign="bottom" 
              height={36}
              formatter={(value) => <span className="text-[10px] text-white/60 uppercase tracking-wider">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
}
