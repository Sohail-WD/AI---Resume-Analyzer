"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { LogIn, LogOut, User, History } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function AuthButton() {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  if (status === "loading") {
    return <div className="h-10 w-10 rounded-full bg-white/5 animate-pulse" />;
  }

  if (!session) {
    return (
      <button
        onClick={() => signIn("google")}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-black text-sm font-bold hover:bg-white/90 transition-all"
      >
        <LogIn className="h-4 w-4" />
        Sign In
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1 rounded-full hover:bg-white/5 transition-all border border-white/5"
      >
        {session.user?.image ? (
          <Image
            src={session.user.image}
            alt={session.user.name || "User"}
            width={32}
            height={32}
            className="rounded-full border border-white/10"
          />
        ) : (
          <div className="h-8 w-8 rounded-full bg-[#00D4FF]/10 flex items-center justify-center border border-[#00D4FF]/20">
            <User className="h-4 w-4 text-[#00D4FF]" />
          </div>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#0A0A0F] border border-white/10 shadow-2xl p-2 z-50 overflow-hidden"
            >
              <div className="px-3 py-2 mb-2 border-b border-white/5">
                <p className="text-sm font-bold text-white truncate">{session.user?.name}</p>
                <p className="text-xs text-white/40 truncate">{session.user?.email}</p>
              </div>

              <Link
                href="/dashboard/history"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/5 text-sm text-white/70 hover:text-white transition-all"
              >
                <History className="h-4 w-4" />
                History
              </Link>

              <Link
                href="/dashboard/profile"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/5 text-sm text-white/70 hover:text-white transition-all"
              >
                <User className="h-4 w-4" />
                Profile
              </Link>

              <button
                onClick={() => signOut()}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-red-500/10 text-sm text-red-400 transition-all mt-1"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
