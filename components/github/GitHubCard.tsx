"use client";

import { motion } from "framer-motion";
import {
  MapPin,
  Link as LinkIcon,
  Star,
  GitFork,
  ExternalLink,
  Users,
  BookOpen,
} from "lucide-react";
import { GithubIcon } from "@/components/icons/GithubIcon";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import Image from "next/image";
import { GitHubProfile } from "@/types";
import GlassCard from "@/components/common/GlassCard";
import NeonBadge from "@/components/common/NeonBadge";

interface GitHubCardProps {
  profile: GitHubProfile;
  portfolioScore?: number;
}

export default function GitHubCard({ profile, portfolioScore }: GitHubCardProps) {
  const pieData = profile.topLanguages.map((l) => ({
    name: l.language,
    value: l.percentage,
    color: l.color,
  }));

  return (
    <GlassCard animate className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-1">
        <GithubIcon className="h-4 w-4 text-[#7C3AED]" />
        <h3 className="text-sm font-semibold text-white/90">GitHub Portfolio</h3>
        <NeonBadge label={`@${profile.username}`} variant="purple" size="sm" />
        {portfolioScore !== undefined && (
          <span className="ml-auto text-xs font-semibold text-[#10B981]">
            Score: {portfolioScore}/100
          </span>
        )}
      </div>

      {/* Profile row */}
      <div className="flex items-start gap-4">
        <div className="relative">
          <div className="h-14 w-14 rounded-full ring-2 ring-[#7C3AED]/40 overflow-hidden bg-white/5 shrink-0">
            <Image
              src={profile.avatar}
              alt={profile.name}
              width={56}
              height={56}
              className="object-cover"
              unoptimized
            />
          </div>
          <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-[#10B981] border-2 border-[#050508]" />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-base font-bold text-white/90 truncate">{profile.name}</p>
          <p className="text-sm text-white/45 truncate">@{profile.username}</p>
          {profile.bio && (
            <p className="text-xs text-white/50 mt-1 line-clamp-2">{profile.bio}</p>
          )}
          <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2">
            {profile.location && (
              <span className="flex items-center gap-1 text-xs text-white/35">
                <MapPin className="h-3 w-3" /> {profile.location}
              </span>
            )}
            {profile.blog && (
              <a
                href={profile.blog.startsWith("http") ? profile.blog : `https://${profile.blog}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-xs text-[#00D4FF]/60 hover:text-[#00D4FF] transition-colors"
              >
                <LinkIcon className="h-3 w-3" /> {profile.blog}
              </a>
            )}
            {profile.company && (
              <span className="text-xs text-white/35">{profile.company}</span>
            )}
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Repos", value: profile.repos, icon: BookOpen, color: "#00D4FF" },
          { label: "Stars", value: profile.stars, icon: Star, color: "#F59E0B" },
          { label: "Followers", value: profile.followers, icon: Users, color: "#10B981" },
          { label: "Following", value: profile.following, icon: Users, color: "#7C3AED" },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              whileHover={{ scale: 1.04 }}
              className="flex flex-col items-center gap-1 p-3 rounded-xl bg-white/3 border border-white/6"
            >
              <Icon className="h-3.5 w-3.5" style={{ color: stat.color }} />
              <p className="text-lg font-bold text-white/90">
                {stat.value >= 1000
                  ? `${(stat.value / 1000).toFixed(1)}k`
                  : stat.value}
              </p>
              <p className="text-xs text-white/35">{stat.label}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Language breakdown */}
      {pieData.length > 0 && (
        <div>
          <p className="text-xs text-white/40 font-medium mb-3">Language Distribution</p>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width={120} height={120}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={32}
                  outerRadius={55}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} opacity={0.9} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "rgba(10,10,18,0.95)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 8,
                    fontSize: 11,
                  }}
                  formatter={(val: number) => [`${val}%`, ""]}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-1.5 flex-1 min-w-0">
              {pieData.slice(0, 5).map((lang) => (
                <div key={lang.name} className="flex items-center gap-2">
                  <div
                    className="h-2 w-2 rounded-full shrink-0"
                    style={{ background: lang.color }}
                  />
                  <p className="text-xs text-white/60 truncate flex-1">{lang.name}</p>
                  <p className="text-xs text-white/40 shrink-0">{lang.value}%</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Top repositories */}
      {profile.recentRepos.length > 0 && (
        <div>
          <p className="text-xs text-white/40 font-medium mb-3">Top Repositories</p>
          <div className="space-y-2">
            {profile.recentRepos.map((repo, i) => (
              <motion.a
                key={repo.name}
                href={repo.url}
                target="_blank"
                rel="noreferrer"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                whileHover={{ x: 3 }}
                className="flex items-center justify-between p-3 rounded-xl bg-white/3 border border-white/6 hover:border-[#7C3AED]/30 hover:bg-white/5 transition-all group"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white/80 truncate group-hover:text-[#7C3AED] transition-colors">
                    {repo.name}
                  </p>
                  {repo.description && (
                    <p className="text-xs text-white/35 truncate mt-0.5">
                      {repo.description}
                    </p>
                  )}
                  <div className="flex items-center gap-3 mt-1">
                    {repo.language && (
                      <span className="text-xs text-white/35">{repo.language}</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3 ml-3 shrink-0">
                  <span className="flex items-center gap-1 text-xs text-white/40">
                    <Star className="h-3 w-3" /> {repo.stars}
                  </span>
                  {"forks" in repo && (
                    <span className="flex items-center gap-1 text-xs text-white/30">
                      <GitFork className="h-3 w-3" /> {(repo as { forks: number }).forks}
                    </span>
                  )}
                  <ExternalLink className="h-3.5 w-3.5 text-white/20 group-hover:text-[#7C3AED] transition-colors" />
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      )}
    </GlassCard>
  );
}
