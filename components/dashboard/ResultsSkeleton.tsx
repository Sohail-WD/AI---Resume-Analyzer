"use client";

import { motion } from "framer-motion";

export default function ResultsSkeleton() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 pb-12 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="h-8 w-48 bg-white/5 rounded-lg" />
          <div className="h-4 w-64 bg-white/5 rounded-lg" />
        </div>
        <div className="flex gap-2">
          <div className="h-8 w-24 bg-white/5 rounded-full" />
          <div className="h-8 w-32 bg-white/5 rounded-full" />
        </div>
      </div>

      {/* Readiness Banner Skeleton */}
      <div className="h-16 w-full bg-white/5 rounded-2xl border border-white/5" />

      {/* Score Cards Skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="glass rounded-2xl p-5 space-y-3">
            <div className="flex justify-between">
              <div className="h-4 w-4 bg-white/10 rounded" />
              <div className="h-4 w-12 bg-white/10 rounded" />
            </div>
            <div className="h-10 w-16 bg-white/10 rounded" />
            <div className="h-3 w-24 bg-white/5 rounded" />
            <div className="h-1 w-full bg-white/5 rounded-full" />
          </div>
        ))}
      </div>

      {/* Charts Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="h-80 bg-white/5 rounded-2xl border border-white/5" />
        <div className="h-80 bg-white/5 rounded-2xl border border-white/5" />
      </div>

      {/* Suggestions Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-64 bg-white/5 rounded-2xl border border-white/5" />
        ))}
      </div>
    </div>
  );
}
