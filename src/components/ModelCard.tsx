"use client";

import React from "react";
import Link from "next/link";
import {
  Sparkles,
  GitCompare,
  Heart,
  Zap,
  Cpu,
  Layers,
  ArrowUpRight,
  Shield,
  Eye,
  Code2,
  Brain,
  Terminal,
} from "lucide-react";
import { Model } from "@/lib/types";
import { useStore } from "@/lib/store/useStore";
import { formatCurrency, formatTokens } from "@/lib/utils";

interface ModelCardProps {
  model: Model;
}

export default function ModelCard({ model }: ModelCardProps) {
  const isComparing = useStore((s) => s.isComparing(model.slug));
  const addToCompare = useStore((s) => s.addToCompare);
  const isFavorite = useStore((s) => s.isFavorite(model.slug));
  const toggleFavorite = useStore((s) => s.toggleFavorite);
  const openPlayground = useStore((s) => s.openPlayground);

  // Compute context percentage of max (2M)
  const contextPct = Math.min(100, Math.max(10, Math.round((model.contextWindow / 2_000_000) * 100)));

  return (
    <div className="group relative flex flex-col justify-between rounded-2xl border border-border bg-surface-card p-5 transition-all duration-300 hover:border-indigo-500/50 hover:bg-surface-card-hover hover:shadow-xl hover:shadow-indigo-500/10">
      {/* Top Header */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <span
              className="h-3 w-3 rounded-full flex-shrink-0 shadow-sm"
              style={{ backgroundColor: model.lab.highlightColor || "#6366f1" }}
              title={model.lab.name}
            />
            <div className="min-w-0">
              <Link
                href={`/labs/${model.lab.slug}`}
                className="text-[11px] font-medium text-slate-400 hover:text-cyan-300 transition-colors truncate block"
              >
                {model.lab.name}
              </Link>
              <Link
                href={`/models/${model.slug}`}
                className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors truncate block"
              >
                {model.name}
              </Link>
            </div>
          </div>

          {/* Quick actions (Favorite, Compare, Playground) */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button
              onClick={() => toggleFavorite(model.slug)}
              className={`p-1.5 rounded-lg border transition-all ${
                isFavorite
                  ? "border-rose-500/40 bg-rose-500/15 text-rose-400"
                  : "border-border bg-surface text-slate-400 hover:text-rose-400 hover:border-slate-600"
              }`}
              title={isFavorite ? "Remove favorite" : "Save to favorites"}
            >
              <Heart className={`h-3.5 w-3.5 ${isFavorite ? "fill-current" : ""}`} />
            </button>

            <button
              onClick={() => addToCompare(model.slug)}
              className={`p-1.5 rounded-lg border transition-all ${
                isComparing
                  ? "border-indigo-500 bg-indigo-500 text-white shadow-sm"
                  : "border-border bg-surface text-slate-400 hover:text-cyan-300 hover:border-slate-600"
              }`}
              title={isComparing ? "Remove from comparison" : "Add to comparison"}
            >
              <GitCompare className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Tagline */}
        <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
          {model.tagline}
        </p>

        {/* Badges / Pill tags */}
        <div className="flex flex-wrap items-center gap-1.5 mb-4">
          {model.isOpenWeights ? (
            <span className="badge-subtle bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
              Open Weights
            </span>
          ) : (
            <span className="badge-subtle bg-slate-800 text-slate-400 border-border">
              Proprietary
            </span>
          )}

          {model.isNew && (
            <span className="badge-subtle bg-cyan-500/15 text-cyan-300 border-cyan-500/30">
              New Release
            </span>
          )}

          {model.isTrending && (
            <span className="badge-subtle bg-amber-500/15 text-amber-300 border-amber-500/30 flex items-center gap-1">
              <Zap className="h-2.5 w-2.5 fill-current" />
              Trending
            </span>
          )}

          {model.capabilities.includes("reasoning") && (
            <span className="badge-subtle bg-purple-500/15 text-purple-300 border-purple-500/30 flex items-center gap-1">
              <Brain className="h-2.5 w-2.5" />
              Reasoning
            </span>
          )}

          {model.modalities.includes("vision") && (
            <span className="badge-subtle bg-blue-500/10 text-blue-300 border-blue-500/20 flex items-center gap-1">
              <Eye className="h-2.5 w-2.5" />
              Vision
            </span>
          )}
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-2 rounded-xl bg-surface/70 p-3 border border-border/60 text-xs mb-4">
          {/* Pricing */}
          <div>
            <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-semibold">
              Input / Output
            </span>
            <div className="font-mono font-medium text-white text-xs mt-0.5">
              <span>{formatCurrency(model.inputPricePerM)}</span>
              <span className="text-slate-400 mx-1">/</span>
              <span className="text-cyan-300">{formatCurrency(model.outputPricePerM)}</span>
              <span className="text-[10px] text-slate-400 ml-1">/1M</span>
            </div>
          </div>

          {/* Context Window */}
          <div>
            <div className="flex items-center justify-between text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
              <span>Context</span>
              <span className="font-mono text-slate-300">{formatTokens(model.contextWindow)}</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 mt-1.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-1.5 rounded-full"
                style={{ width: `${contextPct}%` }}
              />
            </div>
          </div>

          {/* Arena Elo */}
          <div className="pt-2 border-t border-border/40">
            <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-semibold">
              Arena Elo
            </span>
            <div className="flex items-center gap-1 mt-0.5 font-mono font-semibold text-white">
              <span className="text-amber-400">★</span>
              <span>{model.arenaElo}</span>
            </div>
          </div>

          {/* MMLU-Pro or Coding */}
          <div className="pt-2 border-t border-border/40">
            <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-semibold">
              MMLU / Code
            </span>
            <div className="font-mono font-semibold text-slate-200 mt-0.5">
              <span>{model.mmluScore}%</span>
              <span className="text-slate-400 mx-1">•</span>
              <span className="text-indigo-400">{model.humanEvalScore}%</span>
            </div>
          </div>
        </div>

        {/* Providers list mini avatars */}
        <div className="flex items-center justify-between text-[11px] text-slate-400 mb-4">
          <span className="flex items-center gap-1">
            <Layers className="h-3 w-3" />
            <span>{model.providers.length} Providers</span>
          </span>
          <div className="flex -space-x-1 overflow-hidden">
            {model.providers.slice(0, 3).map((p, idx) => (
              <span
                key={idx}
                className="inline-flex h-5 items-center rounded bg-surface border border-border px-1.5 text-[10px] font-medium text-slate-300 shadow-sm"
              >
                {p.providerName}
              </span>
            ))}
            {model.providers.length > 3 && (
              <span className="inline-flex h-5 items-center rounded bg-surface border border-border px-1 text-[10px] text-slate-400">
                +{model.providers.length - 3}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Card Footer Actions */}
      <div className="flex items-center gap-2 pt-3 border-t border-border/50">
        <button
          onClick={() => openPlayground(model.slug)}
          className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-border bg-surface px-3 py-2 text-xs font-medium text-slate-300 hover:text-white hover:border-slate-600 transition-all"
        >
          <Terminal className="h-3.5 w-3.5 text-cyan-400" />
          <span>Playground</span>
        </button>

        <Link
          href={`/models/${model.slug}`}
          className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600/20 border border-indigo-500/30 px-3 py-2 text-xs font-medium text-cyan-300 hover:bg-indigo-600/30 hover:border-indigo-500/60 transition-all"
        >
          <span>View Specs</span>
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
