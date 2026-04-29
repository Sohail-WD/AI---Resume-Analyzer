import { Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TargetRole } from "@/types/analyzer";

const ROLES: TargetRole[] = [
  "Frontend Developer",
  "Full Stack Developer",
  "Backend Developer",
  "AI/ML Intern"
];

export function TargetRoleSelect({ role, setRole }: { role: TargetRole; setRole: (r: TargetRole) => void }) {
  return (
    <Select value={role} onValueChange={(v) => setRole(v as TargetRole)}>
      <SelectTrigger className="w-full bg-white/5 border-white/10 focus:ring-primary/50 text-white h-12 rounded-xl glass-card">
        <SelectValue placeholder="Select a role" />
      </SelectTrigger>
      <SelectContent className="bg-background/95 backdrop-blur-xl border-white/10 text-white">
        {ROLES.map(r => (
          <SelectItem key={r} value={r} className="focus:bg-white/10 focus:text-white cursor-pointer py-2">
            {r}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
