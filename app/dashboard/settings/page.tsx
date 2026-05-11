"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, 
  Bell, 
  Shield, 
  Moon, 
  Save, 
  CheckCircle, 
  Loader2, 
  Mail, 
  AtSign, 
  Smartphone, 
  Lock, 
  Eye, 
  EyeOff,
  Palette,
  Sun
} from "lucide-react";
import GlassCard from "@/components/common/GlassCard";
import NeonBadge from "@/components/common/NeonBadge";

type TabType = "profile" | "notifications" | "security" | "appearance";

export default function SettingsPage() {
  const { data: session, update } = useSession();
  const [activeTab, setActiveTab] = useState<TabType>("profile");
  const [name, setName] = useState(session?.user?.name || "");
  const [username, setUsername] = useState(session?.user?.email?.split("@")[0] || "");
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");

  useEffect(() => {
    if (session?.user?.name) setName(session.user.name);
  }, [session]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveStatus("idle");

    try {
      const res = await fetch("/api/user/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, username }),
      });

      if (res.ok) {
        await update({ name });
        setSaveStatus("success");
        setTimeout(() => setSaveStatus("idle"), 3000);
      } else {
        setSaveStatus("error");
      }
    } catch (err) {
      setSaveStatus("error");
    } finally {
      setIsSaving(false);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <GlassCard className="p-8 space-y-8">
              <div className="flex items-center gap-3 border-b border-white/5 pb-6">
                <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                  <User className="h-5 w-5 text-[#00D4FF]" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Public Profile</h2>
                  <p className="text-xs text-white/40">This information will be displayed on your reports.</p>
                </div>
              </div>

              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] text-white/30 uppercase font-bold ml-1">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your name"
                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/[0.03] border border-white/5 text-sm text-white focus:outline-none focus:border-[#00D4FF]/50 transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] text-white/30 uppercase font-bold ml-1">Username</label>
                    <div className="relative">
                      <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="username"
                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/[0.03] border border-white/5 text-sm text-white focus:outline-none focus:border-[#00D4FF]/50 transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2 opacity-60">
                  <label className="text-[10px] text-white/30 uppercase font-bold ml-1">Email Address</label>
                  <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.02] border border-white/5 text-sm text-white/40 cursor-not-allowed">
                    <Mail className="h-4 w-4" />
                    {session?.user?.email}
                    <div className="ml-auto">
                      <NeonBadge label="Verified" variant="blue" size="xs" />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4">
                  <p className="text-xs text-white/20 italic">
                    {saveStatus === "success" && <span className="text-[#10B981] flex items-center gap-1"><CheckCircle className="h-3 w-3" /> Changes saved successfully!</span>}
                    {saveStatus === "error" && <span className="text-red-400">Failed to save changes.</span>}
                  </p>
                  <button
                    type="submit"
                    disabled={isSaving || (name === session?.user?.name && username === session?.user?.email?.split("@")[0])}
                    className="flex items-center gap-2 px-8 py-3 rounded-xl bg-[#00D4FF] text-black font-bold text-sm hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 transition-all shadow-[0_0_20px_rgba(0,212,255,0.2)]"
                  >
                    {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    Save Changes
                  </button>
                </div>
              </form>
            </GlassCard>
          </motion.div>
        );
      case "notifications":
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <GlassCard className="p-8 space-y-6">
              <h3 className="text-lg font-bold text-white mb-6">Notification Preferences</h3>
              {[
                { label: "Analysis Ready", desc: "Get notified when your AI report is finished.", active: true },
                { label: "Weekly Insights", desc: "Personalized career tips and market trends.", active: true },
                { label: "Account Activity", desc: "Security alerts and login notifications.", active: false },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between py-4 border-b border-white/5 last:border-0">
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-white">{item.label}</p>
                    <p className="text-xs text-white/40">{item.desc}</p>
                  </div>
                  <div className={`h-6 w-11 rounded-full p-1 cursor-pointer transition-all ${item.active ? 'bg-[#00D4FF]' : 'bg-white/10'}`}>
                    <div className={`h-4 w-4 rounded-full bg-white shadow-lg transition-all ${item.active ? 'ml-5' : 'ml-0'}`} />
                  </div>
                </div>
              ))}
            </GlassCard>
          </motion.div>
        );
      case "security":
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <GlassCard className="p-8 space-y-8">
              <div className="flex items-center gap-3 border-b border-white/5 pb-6">
                <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                  <Lock className="h-5 w-5 text-red-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Security Settings</h2>
                  <p className="text-xs text-white/40">Protect your account and data.</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Smartphone  className="h-5 w-5 text-white/40" />
                      <div>
                        <p className="text-sm font-bold text-white">Two-Factor Authentication</p>
                        <p className="text-[10px] text-white/30 italic">Not yet configured</p>
                      </div>
                    </div>
                    <button className="px-4 py-2 rounded-lg bg-white/5 text-white/70 text-xs font-bold hover:bg-white/10 transition-all">
                      Configure
                    </button>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-red-500/5 border border-red-500/10 space-y-4">
                  <h4 className="text-sm font-bold text-red-400">Danger Zone</h4>
                  <p className="text-xs text-white/40">Permanently delete your account and all associated analysis data.</p>
                  <button className="px-6 py-3 rounded-xl bg-red-500 text-white text-xs font-bold hover:bg-red-600 transition-all">
                    Delete My Account
                  </button>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        );
      case "appearance":
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <GlassCard className="p-8 space-y-6">
              <h3 className="text-lg font-bold text-white mb-6">Theme Settings</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl border-2 border-[#00D4FF] bg-black/40 space-y-3 cursor-pointer">
                  <div className="h-12 w-full rounded-lg bg-gradient-to-br from-[#0A0A0F] to-[#1A1A25] border border-white/5" />
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-white">Dark (Futuristic)</span>
                    <CheckCircle className="h-4 w-4 text-[#00D4FF]" />
                  </div>
                </div>
                <div className="p-4 rounded-2xl border border-white/5 bg-white/5 space-y-3 opacity-40 cursor-not-allowed">
                  <div className="h-12 w-full rounded-lg bg-white border border-white/10" />
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-white">Light (Coming Soon)</span>
                    <Sun className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20 p-4">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white">Settings</h1>
          <p className="text-sm text-white/40 mt-1">Manage your account preferences and security.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar Nav */}
        <div className="md:col-span-1 space-y-2">
          {[
            { id: "profile", label: "Profile", icon: User },
            { id: "notifications", label: "Notifications", icon: Bell },
            { id: "security", label: "Security", icon: Shield },
            { id: "appearance", label: "Appearance", icon: Palette },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as TabType)}
              className={`w-full flex items-center gap-3 px-4 py-4 rounded-2xl text-sm font-bold transition-all ${
                activeTab === item.id 
                  ? "bg-[#00D4FF]/10 text-[#00D4FF] border border-[#00D4FF]/20 shadow-[0_0_20px_rgba(0,212,255,0.05)]" 
                  : "text-white/40 hover:text-white/70 hover:bg-white/5 border border-transparent"
              }`}
            >
              <item.icon className={`h-4 w-4 ${activeTab === item.id ? "text-[#00D4FF]" : "text-white/20"}`} />
              {item.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="md:col-span-3 min-h-[500px]">
          <AnimatePresence mode="wait">
            {renderTabContent()}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
