"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import {
  GitCompare,
  Plus,
  X,
  Trophy,
  Check,
  CheckCircle2,
  XCircle,
  Sparkles,
  Zap,
  ArrowRight,
  Share2,
  Trash2,
  Terminal,
} from "lucide-react";
import { useStore } from "@/lib/store/useStore";
import { models } from "@/lib/data/mockData";
import { Model } from "@/lib/types";
import { formatCurrency, formatTokens } from "@/lib/utils";

function CompareContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const storeCompareSlugs = useStore((s) => s.compareSlugs);
  const addToCompare = useStore((s) => s.addToCompare);
  const removeFromCompare = useStore((s) => s.removeFromCompare);
  const clearCompare = useStore((s) => s.clearCompare);
  const openPlayground = useStore((s) => s.openPlayground);

  const [highlightBest, setHighlightBest] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);

  // Read slugs from URL query param if present, otherwise from store
  const urlModels = searchParams.get("models");
  const activeSlugs = urlModels
    ? urlModels.split(",").filter(Boolean)
    : storeCompareSlugs.length > 0
    ? storeCompareSlugs
    : ["claude-3-7-sonnet", "o1", "deepseek-r1"];

  const comparedModels: Model[] = activeSlugs
    .map((slug) => models.find((m) => m.slug === slug || m.id === slug))
    .filter((m): m is Model => m !== undefined);

  // Find winners for highlighting
  const minInputPrice = Math.min(...comparedModels.map((m) => m.inputPricePerM));
  const minOutputPrice = Math.min(...comparedModels.map((m) => m.outputPricePerM));
  const maxContext = Math.max(...comparedModels.map((m) => m.contextWindow));
  const maxElo = Math.max(...comparedModels.map((m) => m.arenaElo));
  const maxMmlu = Math.max(...comparedModels.map((m) => m.mmluScore));
  const maxHumanEval = Math.max(...comparedModels.map((m) => m.humanEvalScore));
  const maxThroughput = Math.max(...comparedModels.map((m) => m.averageThroughputTokSec));

  const presets = [
    {
      title: "Reasoning Titans",
      slugs: ["claude-3-7-sonnet", "o1", "deepseek-r1"],
      desc: "Compare Claude 3.7 hybrid vs OpenAI o1 vs DeepSeek R1 open reasoning",
    },
    {
      title: "Cost Disruptors",
      slugs: ["deepseek-v3", "gemini-2-0-flash", "llama-3-3-70b-instruct"],
      desc: "Ultra-low-cost high-throughput models under $0.50/M tokens",
    },
    {
      title: "Coding Champions",
      slugs: ["claude-3-5-sonnet", "claude-3-7-sonnet", "codestral-2501"],
      desc: "Frontier software engineering and code generation models",
    },
  ];

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handlePreset = (slugs: string[]) => {
    router.push(`/compare?models=${slugs.join(",")}`);
  };

  const capabilitiesList = [
    { key: "reasoning", label: "Deep Reasoning" },
    { key: "tool_use", label: "Tool / Function Calling" },
    { key: "structured_output", label: "Structured JSON" },
    { key: "long_context", label: "Long Context (1M+)" },
    { key: "web_search", label: "Live Web Search" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-400">
              <GitCompare className="h-4 w-4" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Model Comparison Matrix
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Side-by-side analysis of pricing, architectural limits, and verified benchmark scores.
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setHighlightBest(!highlightBest)}
            className={`rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all ${
              highlightBest
                ? "border-emerald-500/50 bg-emerald-500/15 text-emerald-300"
                : "border-border bg-surface text-slate-400"
            }`}
          >
            Highlight Best Specs
          </button>

          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 rounded-xl border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white"
          >
            <Share2 className="h-3.5 w-3.5" />
            <span>{copiedLink ? "Link Copied!" : "Share Comparison"}</span>
          </button>
        </div>
      </div>

      {/* Quick Presets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {presets.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handlePreset(p.slugs)}
            className="rounded-2xl border border-border/80 bg-surface/50 p-4 text-left hover:border-cyan-400/50 hover:bg-surface transition-all group"
          >
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-bold text-white group-hover:text-cyan-300 transition-colors">
                {p.title}
              </span>
              <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:translate-x-1 group-hover:text-cyan-300 transition-all" />
            </div>
            <p className="text-[11px] text-slate-400">{p.desc}</p>
          </button>
        ))}
      </div>

      {/* Comparison Matrix Table */}
      {comparedModels.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center space-y-4">
          <h3 className="text-base font-bold text-white">No models selected for comparison</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Select up to 4 models from the discovery catalog or choose one of the preset comparisons above.
          </p>
          <Link
            href="/"
            className="inline-flex rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500"
          >
            Browse Models Catalog
          </Link>
        </div>
      ) : (
        <div className="rounded-3xl border border-border bg-surface-card overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              {/* Table Column Headers: Model Cards */}
              <thead>
                <tr className="border-b border-border bg-surface/80">
                  <th className="py-4 px-4 w-44 font-semibold text-slate-400 uppercase tracking-wider text-[11px]">
                    Attribute
                  </th>
                  {comparedModels.map((m) => (
                    <th key={m.id} className="py-4 px-4 min-w-[240px] align-top">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span
                            className="text-[10px] font-semibold uppercase tracking-wider block"
                            style={{ color: m.lab.highlightColor || "#6366f1" }}
                          >
                            {m.lab.name}
                          </span>
                          <Link
                            href={`/models/${m.slug}`}
                            className="text-base font-extrabold text-white hover:text-cyan-300 transition-colors block mt-0.5"
                          >
                            {m.name}
                          </Link>
                          <span className="text-[10px] text-slate-400 font-normal block mt-0.5">
                            {m.architecture}
                          </span>
                        </div>
                        <button
                          onClick={() => removeFromCompare(m.slug)}
                          className="text-slate-400 hover:text-red-400 p-1 rounded"
                          title="Remove model"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="mt-3 flex items-center gap-1.5">
                        <button
                          onClick={() => openPlayground(m.slug)}
                          className="flex-1 flex items-center justify-center gap-1 rounded-lg border border-border bg-surface py-1 text-[11px] text-cyan-300 hover:bg-cyan-500/10"
                        >
                          <Terminal className="h-3 w-3" />
                          <span>Test</span>
                        </button>
                        <Link
                          href={`/models/${m.slug}`}
                          className="flex-1 text-center rounded-lg border border-indigo-500/30 bg-indigo-500/10 py-1 text-[11px] text-white hover:bg-indigo-500/20"
                        >
                          Specs
                        </Link>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              {/* Table Rows */}
              <tbody className="divide-y divide-border/40 font-mono">
                {/* Input Price */}
                <tr className="hover:bg-white/[0.02]">
                  <td className="py-3 px-4 font-sans font-semibold text-slate-300">
                    Input Price / 1M
                  </td>
                  {comparedModels.map((m) => {
                    const isBest = highlightBest && m.inputPricePerM === minInputPrice;
                    return (
                      <td key={m.id} className="py-3 px-4">
                        <span
                          className={`font-bold ${
                            isBest ? "text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded" : "text-white"
                          }`}
                        >
                          {formatCurrency(m.inputPricePerM)}
                        </span>
                        {isBest && <span className="ml-1 text-[10px] text-emerald-400 font-sans">Lowest</span>}
                      </td>
                    );
                  })}
                </tr>

                {/* Output Price */}
                <tr className="hover:bg-white/[0.02]">
                  <td className="py-3 px-4 font-sans font-semibold text-slate-300">
                    Output Price / 1M
                  </td>
                  {comparedModels.map((m) => {
                    const isBest = highlightBest && m.outputPricePerM === minOutputPrice;
                    return (
                      <td key={m.id} className="py-3 px-4">
                        <span
                          className={`font-bold ${
                            isBest ? "text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded" : "text-cyan-300"
                          }`}
                        >
                          {formatCurrency(m.outputPricePerM)}
                        </span>
                        {isBest && <span className="ml-1 text-[10px] text-emerald-400 font-sans">Lowest</span>}
                      </td>
                    );
                  })}
                </tr>

                {/* Context Window */}
                <tr className="hover:bg-white/[0.02]">
                  <td className="py-3 px-4 font-sans font-semibold text-slate-300">
                    Context Window
                  </td>
                  {comparedModels.map((m) => {
                    const isBest = highlightBest && m.contextWindow === maxContext;
                    return (
                      <td key={m.id} className="py-3 px-4">
                        <span
                          className={`font-bold ${
                            isBest ? "text-cyan-300 bg-cyan-500/10 px-1.5 py-0.5 rounded" : "text-white"
                          }`}
                        >
                          {formatTokens(m.contextWindow)}
                        </span>
                        {isBest && <span className="ml-1 text-[10px] text-cyan-400 font-sans">Largest</span>}
                      </td>
                    );
                  })}
                </tr>

                {/* Max Output Tokens */}
                <tr className="hover:bg-white/[0.02]">
                  <td className="py-3 px-4 font-sans font-semibold text-slate-300">
                    Max Output Tokens
                  </td>
                  {comparedModels.map((m) => (
                    <td key={m.id} className="py-3 px-4 text-slate-300">
                      {formatTokens(m.maxOutputTokens)}
                    </td>
                  ))}
                </tr>

                {/* Arena Elo */}
                <tr className="hover:bg-white/[0.02]">
                  <td className="py-3 px-4 font-sans font-semibold text-slate-300">
                    Chatbot Arena Elo
                  </td>
                  {comparedModels.map((m) => {
                    const isBest = highlightBest && m.arenaElo === maxElo;
                    return (
                      <td key={m.id} className="py-3 px-4">
                        <span
                          className={`font-bold ${
                            isBest ? "text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded" : "text-slate-200"
                          }`}
                        >
                          ★ {m.arenaElo}
                        </span>
                        {isBest && <span className="ml-1 text-[10px] text-amber-400 font-sans">Rank 1</span>}
                      </td>
                    );
                  })}
                </tr>

                {/* MMLU-Pro */}
                <tr className="hover:bg-white/[0.02]">
                  <td className="py-3 px-4 font-sans font-semibold text-slate-300">
                    MMLU-Pro Score
                  </td>
                  {comparedModels.map((m) => {
                    const isBest = highlightBest && m.mmluScore === maxMmlu;
                    return (
                      <td key={m.id} className="py-3 px-4">
                        <span
                          className={`font-bold ${
                            isBest ? "text-indigo-300 bg-indigo-500/10 px-1.5 py-0.5 rounded" : "text-slate-300"
                          }`}
                        >
                          {m.mmluScore}%
                        </span>
                      </td>
                    );
                  })}
                </tr>

                {/* HumanEval Coding */}
                <tr className="hover:bg-white/[0.02]">
                  <td className="py-3 px-4 font-sans font-semibold text-slate-300">
                    HumanEval (Python)
                  </td>
                  {comparedModels.map((m) => {
                    const isBest = highlightBest && m.humanEvalScore === maxHumanEval;
                    return (
                      <td key={m.id} className="py-3 px-4">
                        <span
                          className={`font-bold ${
                            isBest ? "text-cyan-300 bg-cyan-500/10 px-1.5 py-0.5 rounded" : "text-slate-300"
                          }`}
                        >
                          {m.humanEvalScore}%
                        </span>
                      </td>
                    );
                  })}
                </tr>

                {/* Throughput */}
                <tr className="hover:bg-white/[0.02]">
                  <td className="py-3 px-4 font-sans font-semibold text-slate-300">
                    Avg Speed
                  </td>
                  {comparedModels.map((m) => {
                    const isBest = highlightBest && m.averageThroughputTokSec === maxThroughput;
                    return (
                      <td key={m.id} className="py-3 px-4">
                        <span className={isBest ? "text-emerald-400 font-bold" : "text-slate-300"}>
                          {m.averageThroughputTokSec} tok/s
                        </span>
                        <span className="text-slate-400 text-[10px] ml-1">({m.averageLatencyMs}ms)</span>
                      </td>
                    );
                  })}
                </tr>

                {/* Capabilities check */}
                {capabilitiesList.map((cap) => (
                  <tr key={cap.key} className="hover:bg-white/[0.02]">
                    <td className="py-3 px-4 font-sans font-semibold text-slate-300">
                      {cap.label}
                    </td>
                    {comparedModels.map((m) => {
                      const supported = m.capabilities.includes(cap.key as any);
                      return (
                        <td key={m.id} className="py-3 px-4">
                          {supported ? (
                            <span className="inline-flex items-center gap-1 text-emerald-400 font-sans text-xs">
                              <CheckCircle2 className="h-4 w-4" />
                              <span>Supported</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-slate-400 font-sans text-xs">
                              <XCircle className="h-4 w-4" />
                              <span>No</span>
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}

                {/* License */}
                <tr className="hover:bg-white/[0.02]">
                  <td className="py-3 px-4 font-sans font-semibold text-slate-300">
                    License
                  </td>
                  {comparedModels.map((m) => (
                    <td key={m.id} className="py-3 px-4 font-sans text-slate-300">
                      {m.license}
                    </td>
                  ))}
                </tr>

                {/* Available Providers */}
                <tr className="hover:bg-white/[0.02]">
                  <td className="py-3 px-4 font-sans font-semibold text-slate-300">
                    Providers
                  </td>
                  {comparedModels.map((m) => (
                    <td key={m.id} className="py-3 px-4 font-sans">
                      <div className="flex flex-wrap gap-1">
                        {m.providers.map((p, idx) => (
                          <span
                            key={idx}
                            className="rounded bg-surface px-1.5 py-0.5 text-[10px] text-slate-300 border border-border"
                          >
                            {p.providerName}
                          </span>
                        ))}
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense fallback={
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 text-center text-xs text-slate-400">
        Loading Comparison Matrix...
      </div>
    }>
      <CompareContent />
    </Suspense>
  );
}
