import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from "recharts";
import { SpotlightCard } from "@/components/effects/SpotlightCard";
import { Skill } from "@/types/analyzer";

export function SkillRadarChart({ skills }: { skills: Skill[] }) {
  // Group by category, average score
  const grouped = skills.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || []).concat(curr.score);
    return acc;
  }, {} as Record<string, number[]>);

  const data = Object.keys(grouped).map(key => ({
    subject: key,
    A: Math.round(grouped[key].reduce((a,b) => a+b, 0) / grouped[key].length),
    fullMark: 100,
  }));

  return (
    <SpotlightCard className="glass-card h-full flex flex-col">
      <div className="p-6 pb-2 border-b border-white/5">
        <h3 className="text-lg font-semibold tracking-tight">Skill Alignment</h3>
      </div>
      <div className="p-6 pt-6 flex-1 flex items-center justify-center">
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
              <defs>
                <linearGradient id="radarFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.6}/>
                  <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0.1}/>
                </linearGradient>
                <filter id="radarShadow">
                  <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="hsl(var(--primary))" floodOpacity="0.4" />
                </filter>
              </defs>
              <PolarGrid stroke="rgba(255,255,255,0.05)" />
              <PolarAngleAxis 
                dataKey="subject" 
                tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 11, fontWeight: 500 }} 
              />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
              <Radar
                name="Score"
                dataKey="A"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                fill="url(#radarFill)"
                fillOpacity={1}
                filter="url(#radarShadow)"
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(10, 10, 10, 0.8)', 
                  border: '1px solid rgba(255,255,255,0.1)', 
                  borderRadius: '12px',
                  backdropFilter: 'blur(12px)'
                }}
                itemStyle={{ color: 'white' }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </SpotlightCard>
  );
}
