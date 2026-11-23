"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Trophy,
  Medal,
  Sparkles,
  TrendingUp,
  Brain,
  Code2,
  Calculator,
  GitCompare,
  Terminal,
  ArrowUpRight,
  Filter,
} from "lucide-react";
import { DataService } from "@/lib/data/db";
import { benchmarkMetrics } from "@/lib/data/mockData";
import { useStore } from "@/lib/store/useStore";
import { formatCurrency, formatTokens } from "@/lib/utils";

export default function RankingsPage() {
  const [activeMetric, setActiveMetric] = useState<string>("arena_elo");
  const [filterType, setFilterType] = useState<"all" | "open" | "proprietary">("all");

  const addToCompare = useStore((s) => s.addToCompare);
  const isComparing = useStore((s) => s.isComparing);
  const openPlayground = useStore((s) => s.openPlayground);

  const rawEntries = DataService.getLeaderboard(activeMetric);

  const filteredEntries = rawEntries.filter((entry) => {
    if (filterType === "open") return entry.model.isOpenWeights;
    if (filterType === "proprietary") return !entry.model.isOpenWeights;
    return true;
  });

  const currentMetricDef =
    benchmarkMetrics.find((m) => m.slug === activeMetric) || {
      slug: "cost_efficiency",
      name: "Cost Efficiency (Elo / $)",
      category: "Value",
      maxScore: 10000,
    };

  const maxVal = Math.max(...filteredEntries.map((e) => e.score));

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400">
              <Trophy className="h-4 w-4" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              AI Model Rankings & Leaderboard
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Empirical evaluations across human preference (Arena Elo), reasoning (MMLU-Pro), code synthesis, and cost-efficiency.
          </p>
        </div>

        {/* Weights filter */}
        <div className="flex items-center rounded-xl border border-border bg-surface p-1 text-xs">
          <button
            onClick={() => setFilterType("all")}
            className={`px-3 py-1 rounded-lg font-medium transition-all ${
              filterType === "all" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"
            }`}
          >
            All Models
          </button>
          <button
            onClick={() => setFilterType("open")}
            className={`px-3 py-1 rounded-lg font-medium transition-all ${
              filterType === "open"
                ? "bg-emerald-600 text-white"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Open Weights
          </button>
          <button
            onClick={() => setFilterType("proprietary")}
            className={`px-3 py-1 rounded-lg font-medium transition-all ${
              filterType === "proprietary"
                ? "bg-indigo-600 text-white"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Proprietary
          </button>
        </div>
      </div>

      {/* Metric Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {benchmarkMetrics.map((bm) => (
          <button
            key={bm.slug}
            onClick={() => setActiveMetric(bm.slug)}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold whitespace-nowrap transition-all ${
              activeMetric === bm.slug
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                : "border border-border bg-surface text-slate-400 hover:text-white hover:border-slate-600"
            }`}
          >
            <span>{bm.name}</span>
            <span className="text-[10px] text-slate-400 font-normal">({bm.category})</span>
          </button>
        ))}

        <button
          onClick={() => setActiveMetric("cost_efficiency")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold whitespace-nowrap transition-all ${
            activeMetric === "cost_efficiency"
              ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/20"
              : "border border-border bg-surface text-slate-400 hover:text-white hover:border-slate-600"
          }`}
        >
          <TrendingUp className="h-3.5 w-3.5" />
          <span>Cost Efficiency (Elo / $)</span>
        </button>
      </div>

      {/* Leaderboard Table */}
      <div className="rounded-3xl border border-border bg-surface-card overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border bg-surface/80 text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                <th className="py-3.5 px-4 w-16">Rank</th>
                <th className="py-3.5 px-4">Model & Organization</th>
                <th className="py-3.5 px-4">Evaluation Score</th>
                <th className="py-3.5 px-4">Context</th>
                <th className="py-3.5 px-4">Pricing (In / Out)</th>
                <th className="py-3.5 px-4">Elo / $ Ratio</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {filteredEntries.map((entry, index) => {
                const rank = index + 1;
                const pct = Math.max(10, Math.round((entry.score / maxVal) * 100));
                const inCompare = isComparing(entry.model.slug);

                return (
                  <tr
                    key={entry.model.id}
                    className="hover:bg-white/[0.02] transition-colors group"
                  >
                    {/* Rank Badge */}
                    <td className="py-4 px-4 font-mono font-bold">
                      {rank === 1 ? (
                        <span className="inline-flex h-7 w-7 items-center justify-center rounded-xl bg-amber-400/20 text-amber-300 border border-amber-400/40">
                          🥇
                        </span>
                      ) : rank === 2 ? (
                        <span className="inline-flex h-7 w-7 items-center justify-center rounded-xl bg-slate-400/20 text-slate-200 border border-slate-400/40">
                          🥈
                        </span>
                      ) : rank === 3 ? (
                        <span className="inline-flex h-7 w-7 items-center justify-center rounded-xl bg-amber-700/20 text-amber-500 border border-amber-600/40">
                          🥉
                        </span>
                      ) : (
                        <span className="text-slate-400 pl-2">#{rank}</span>
                      )}
                    </td>

                    {/* Model & Lab */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2.5">
                        <span
                          className="h-2.5 w-2.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: entry.model.lab.highlightColor || "#6366f1" }}
                        />
                        <div>
                          <Link
                            href={`/models/${entry.model.slug}`}
                            className="font-bold text-white group-hover:text-cyan-300 transition-colors block text-sm"
                          >
                            {entry.model.name}
                          </Link>
                          <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                            <span>{entry.model.lab.name}</span>
                            <span>•</span>
                            <span className={entry.model.isOpenWeights ? "text-emerald-400" : "text-slate-400"}>
                              {entry.model.isOpenWeights ? "Open Weights" : "Proprietary"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Score Bar */}
                    <td className="py-4 px-4 min-w-[200px]">
                      <div className="flex items-center justify-between text-xs font-mono font-bold text-white mb-1">
                        <span>
                          {entry.score}
                          {activeMetric !== "arena_elo" && activeMetric !== "cost_efficiency" && "%"}
                        </span>
                        <span className="text-[10px] text-slate-400 font-sans font-normal">
                          {activeMetric === "cost_efficiency" ? "Elo/Dollar" : currentMetricDef.name}
                        </span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-2 rounded-full ${
                            rank === 1
                              ? "bg-amber-400"
                              : rank === 2
                              ? "bg-cyan-400"
                              : "bg-indigo-500"
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </td>

                    {/* Context */}
                    <td className="py-4 px-4 font-mono text-slate-300">
                      {formatTokens(entry.model.contextWindow)}
                    </td>

                    {/* Pricing */}
                    <td className="py-4 px-4 font-mono">
                      <span className="text-white">{formatCurrency(entry.model.inputPricePerM)}</span>
                      <span className="text-slate-400"> / </span>
                      <span className="text-cyan-300">{formatCurrency(entry.model.outputPricePerM)}</span>
                    </td>

                    {/* Cost Efficiency Ratio */}
                    <td className="py-4 px-4 font-mono text-emerald-400 font-semibold">
                      {entry.costEfficiencyRatio.toLocaleString()}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => addToCompare(entry.model.slug)}
                          className={`p-1.5 rounded-lg border transition-all ${
                            inCompare
                              ? "border-indigo-500 bg-indigo-600 text-white"
                              : "border-border bg-surface text-slate-400 hover:text-cyan-300"
                          }`}
                          title="Compare"
                        >
                          <GitCompare className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => openPlayground(entry.model.slug)}
                          className="p-1.5 rounded-lg border border-border bg-surface text-slate-400 hover:text-white"
                          title="Test in Playground"
                        >
                          <Terminal className="h-3.5 w-3.5" />
                        </button>
                        <Link
                          href={`/models/${entry.model.slug}`}
                          className="p-1.5 rounded-lg border border-indigo-500/30 bg-indigo-500/10 text-cyan-300 hover:bg-indigo-500/20"
                          title="View Details"
                        >
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
