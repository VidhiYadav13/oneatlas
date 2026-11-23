"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { GitCompare, X, ChevronDown, ChevronUp, Trash2, ArrowRight } from "lucide-react";
import { useStore } from "@/lib/store/useStore";
import { models } from "@/lib/data/mockData";

export default function CompareTray() {
  const router = useRouter();
  const compareSlugs = useStore((s) => s.compareSlugs);
  const removeFromCompare = useStore((s) => s.removeFromCompare);
  const clearCompare = useStore((s) => s.clearCompare);
  const [minimized, setMinimized] = useState(false);

  if (compareSlugs.length === 0) return null;

  const selectedModels = compareSlugs
    .map((slug) => models.find((m) => m.slug === slug || m.id === slug))
    .filter((m) => m !== undefined);

  const compareUrl = `/compare?models=${compareSlugs.join(",")}`;

  return (
    <AnimatePresence>
      <motion.aside
        aria-label="Comparison dock"
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 250 }}
        className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-3xl"
      >
        <div className="rounded-2xl border border-indigo-500/40 bg-[#0d121f]/95 p-3.5 shadow-2xl shadow-indigo-950/80 backdrop-blur-xl">
          {/* Header row */}
          <div className="flex items-center justify-between pb-2 border-b border-border/60">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-400">
                <GitCompare className="h-3.5 w-3.5" />
              </div>
              <span className="text-xs font-semibold text-white">
                Compare Drawer ({compareSlugs.length} / 4)
              </span>
              <span className="text-[11px] text-slate-400 hidden sm:inline">
                Side-by-side specs, pricing, and benchmarks
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={clearCompare}
                className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-red-400 transition-colors px-2 py-0.5 rounded hover:bg-white/[0.04]"
                title="Clear all selected"
              >
                <Trash2 className="h-3 w-3" />
                <span className="hidden sm:inline">Clear</span>
              </button>
              <button
                onClick={() => setMinimized(!minimized)}
                className="text-slate-400 hover:text-white p-1 rounded hover:bg-white/[0.04]"
                title={minimized ? "Expand drawer" : "Minimize drawer"}
              >
                {minimized ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Model Chips list (collapsible) */}
          {!minimized && (
            <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                {selectedModels.map((m) => (
                  <motion.div
                    key={m.id}
                    layout
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="flex items-center gap-2 rounded-xl border border-border bg-surface px-2.5 py-1 text-xs text-white shadow-sm"
                  >
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: m.lab.highlightColor || "#6366f1" }}
                    />
                    <span className="font-medium text-xs">{m.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      ${m.inputPricePerM}/M
                    </span>
                    <button
                      onClick={() => removeFromCompare(m.slug)}
                      className="ml-1 text-slate-400 hover:text-red-400 transition-colors"
                      title="Remove from comparison"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </motion.div>
                ))}

                {compareSlugs.length < 4 && (
                  <div className="hidden md:flex items-center rounded-xl border border-dashed border-border/80 px-2.5 py-1 text-[11px] text-slate-400">
                    + Add up to {4 - compareSlugs.length} more
                  </div>
                )}
              </div>

              {/* Action button */}
              <Link
                href={compareUrl}
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:scale-[1.02] transition-all flex-shrink-0"
              >
                <span>Compare {compareSlugs.length} Models</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          )}
        </div>
      </motion.aside>
    </AnimatePresence>
  );
}
