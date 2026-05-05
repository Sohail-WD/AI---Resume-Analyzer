import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { SpotlightCard } from "@/components/effects/SpotlightCard";
import { ProjectImpact } from "@/types/analyzer";

export function ProjectImpactChart({ projects }: { projects: ProjectImpact[] }) {
  return (
    <SpotlightCard className="glass-card h-full flex flex-col">
      <div className="p-6 pb-2 border-b border-white/5">
        <h3 className="text-lg font-semibold tracking-tight">Project Impact Analysis</h3>
      </div>
      <div className="p-6 pt-6 flex-1">
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={projects} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorImpact" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                </linearGradient>
                <linearGradient id="colorComplexity" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0.3}/>
                </linearGradient>
                <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="rgba(0, 0, 0, 0.3)" />
                </filter>
              </defs>
              <XAxis 
                dataKey="name" 
                tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }} 
                tickLine={false}
                axisLine={false}
                dy={10}
              />
              <YAxis 
                tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }} 
                tickLine={false}
                axisLine={false}
                dx={-10}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(10, 10, 10, 0.8)', 
                  border: '1px solid rgba(255,255,255,0.1)', 
                  borderRadius: '12px',
                  backdropFilter: 'blur(12px)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.5)'
                }}
                itemStyle={{ color: 'white', fontWeight: 500 }}
                labelStyle={{ color: 'rgba(255,255,255,0.7)', marginBottom: '4px' }}
                cursor={{ fill: 'rgba(255,255,255,0.03)' }}
              />
              <Bar dataKey="impact" name="Impact" fill="url(#colorImpact)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="complexity" name="Complexity" fill="url(#colorComplexity)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </SpotlightCard>
  );
}
