"use client";

import { Briefcase, ChevronDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import GlassCard from "@/components/common/GlassCard";
import { TARGET_ROLES } from "@/utils/constants";
import { TargetRole } from "@/types";

interface RoleDropdownProps {
  value: TargetRole | "";
  onChange: (role: TargetRole) => void;
}

export default function RoleDropdown({ value, onChange }: RoleDropdownProps) {
  return (
    <GlassCard animate className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <div className="p-2 rounded-lg bg-[#F472B6]/10 border border-[#F472B6]/20">
          <Briefcase className="h-4 w-4 text-[#F472B6]" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white/90">Target Role</h3>
          <p className="text-xs text-white/40">What role are you applying for?</p>
        </div>
      </div>

      <Select value={value} onValueChange={(v) => onChange(v as TargetRole)}>
        <SelectTrigger
          id="role-dropdown"
          className="w-full h-11 bg-white/3 border-white/8 text-white/80 rounded-xl hover:bg-white/5 hover:border-[#F472B6]/30 focus:border-[#F472B6]/50 focus:ring-0 transition-all duration-200"
        >
          <div className="flex items-center gap-2">
            <ChevronDown className="h-4 w-4 text-[#F472B6]" />
            <SelectValue placeholder="Select a target role…" />
          </div>
        </SelectTrigger>
        <SelectContent className="bg-[#0D0D14] border-white/10 rounded-xl shadow-2xl">
          {TARGET_ROLES.map((role) => (
            <SelectItem
              key={role}
              value={role}
              className="text-white/70 hover:text-white focus:text-white focus:bg-white/5 rounded-lg cursor-pointer"
            >
              {role}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {value && (
        <p className="text-[11px] text-white/30">
          Analyzing resume match for <span className="text-[#F472B6]">{value}</span>
        </p>
      )}
    </GlassCard>
  );
}
