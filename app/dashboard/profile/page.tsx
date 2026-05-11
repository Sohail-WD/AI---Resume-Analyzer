"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { User, Mail, Shield, LogOut, ExternalLink, Settings, Github, Database } from "lucide-react";
import GlassCard from "@/components/common/GlassCard";
import Image from "next/image";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") return null;
  if (!session) {
    router.push("/auth/signin");
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-4">
      <h2 className="text-3xl font-black text-white/90">Account Settings</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-6">
          <GlassCard className="flex flex-col items-center text-center p-8 space-y-4">
            <div className="relative h-24 w-24">
              {session.user?.image ? (
                <Image
                  src={session.user.image}
                  alt={session.user.name || "User"}
                  fill
                  className="rounded-full border-2 border-[#00D4FF]/20 p-1"
                />
              ) : (
                <div className="h-full w-full rounded-full bg-[#00D4FF]/10 flex items-center justify-center border border-[#00D4FF]/20">
                  <User className="h-10 w-10 text-[#00D4FF]" />
                </div>
              )}
            </div>
            <div>
              <h3 className="text-xl font-bold text-white/90">{session.user?.name}</h3>
              <p className="text-sm text-white/30 truncate max-w-[180px]">{session.user?.email}</p>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex items-center gap-2 px-6 py-2 rounded-xl bg-red-500/10 text-red-400 text-sm font-bold hover:bg-red-500/20 transition-all border border-red-500/20"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </GlassCard>

          <GlassCard className="p-4">
            <h4 className="text-[10px] text-white/20 uppercase font-bold mb-3 tracking-widest">Account Status</h4>
            <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-green-500/5 border border-green-500/10">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-bold text-green-500/80">Premium Active</span>
            </div>
          </GlassCard>
        </div>

        <div className="md:col-span-2 space-y-6">
          <GlassCard className="p-6 space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                <Settings className="h-5 w-5 text-[#00D4FF]" />
              </div>
              <h3 className="text-lg font-bold text-white/90">General Information</h3>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] text-white/30 uppercase font-bold ml-1">Full Name</label>
                  <div className="px-4 py-3 rounded-xl bg-white/[0.03] border border-white/5 text-sm text-white/80">
                    {session.user?.name}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] text-white/30 uppercase font-bold ml-1">Email Address</label>
                  <div className="px-4 py-3 rounded-xl bg-white/[0.03] border border-white/5 text-sm text-white/80 flex items-center justify-between">
                    <span className="truncate">{session.user?.email}</span>
                    <Shield className="h-3.5 w-3.5 text-[#10B981]" />
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#00D4FF]/5 border border-[#00D4FF]/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Database className="h-5 w-5 text-[#00D4FF]" />
                  <div>
                    <p className="text-sm font-bold text-white/90">Data Persistence</p>
                    <p className="text-[10px] text-white/40">Your analyses are securely stored in MongoDB Atlas.</p>
                  </div>
                </div>
                <ExternalLink className="h-4 w-4 text-white/20" />
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                  <Github className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white/90">Developer Settings</h3>
              </div>
            </div>
            <p className="text-sm text-white/40 leading-relaxed">
              Connect your GitHub account to enable automatic portfolio indexing and real-time contribution analysis across all your resume reports.
            </p>
            <button className="mt-4 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white/80 text-sm font-bold hover:bg-white/10 transition-all flex items-center gap-2">
              <Github className="h-4 w-4" />
              Manage GitHub Connection
            </button>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
