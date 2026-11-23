"use client";

import React from "react";
import Link from "next/link";
import { GitCompare, Heart, ArrowUpRight, Terminal, Zap, Brain, Eye } from "lucide-react";
import { Model } from "@/lib/types";
import { useStore } from "@/lib/store/useStore";
import { formatCurrency, formatTokens } from "@/lib/utils";

interface ModelTableRowProps {
  model: Model;
}

export default function ModelTableRow({ model }: ModelTableRowProps) {
  const isComparing = useStore((s) => s.isComparing(model.slug));
  const addToCompare = useStore((s) => s.addToCompare);
  const isFavorite = useStore((s) => s.isFavorite(model.slug));
  const toggleFavorite = useStore((s) => s.toggleFavorite);
  const openPlayground = useStore((s) => s.openPlayground);

  const contextPct = Math.min(100, Math.max(10, Math.round((model.contextWindow / 2_000_000) * 100)));

  return (
    <tr className="border-b border-border/50 hover:bg-white/[0.02] transition-colors text-xs group">
      {/* Compare Checkbox & Favorite */}
      <td className="py-3 px-3">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => addToCompare(model.slug)}
            className={`p-1 rounded transition-all ${
              isComparing
                ? "bg-indigo-600 text-white"
                : "text-slate-400 hover:text-cyan-300"
            }`}
            title="Compare"
          >
            <GitCompare className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => toggleFavorite(model.slug)}
            className={`p-1 rounded transition-all ${
              isFavorite
                ? "text-rose-400"
                : "text-slate-400 hover:text-rose-400"
            }`}
            title="Favorite"
          >
            <Heart className={`h-3.5 w-3.5 ${isFavorite ? "fill-current" : ""}`} />
          </button>
        </div>
      </td>

      {/* Model Name & Lab */}
      <td className="py-3 px-3">
        <div className="flex items-center gap-2">
          <span
            className="h-2.5 w-2.5 rounded-full flex-shrink-0"
            style={{ backgroundColor: model.lab.highlightColor || "#6366f1" }}
          />
          <div className="min-w-0">
            <Link
              href={`/models/${model.slug}`}
              className="font-bold text-white group-hover:text-cyan-300 transition-colors truncate block"
            >
              {model.name}
            </Link>
            <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
              <Link href={`/labs/${model.lab.slug}`} className="hover:text-slate-200">
                {model.lab.name}
              </Link>
              <span>•</span>
              <span className={model.isOpenWeights ? "text-emerald-400" : "text-slate-400"}>
                {model.isOpenWeights ? "Open Weights" : "Proprietary"}
              </span>
            </div>
          </div>
        </div>
      </td>

      {/* Modality & Type */}
      <td className="py-3 px-3">
        <div className="flex items-center gap-1">
          {model.capabilities.includes("reasoning") && (
            <span title="Reasoning">
              <Brain className="h-3.5 w-3.5 text-purple-400" />
            </span>
          )}
          {model.modalities.includes("vision") && (
            <span title="Vision">
              <Eye className="h-3.5 w-3.5 text-blue-400" />
            </span>
          )}
          <span className="text-[11px] text-slate-300 capitalize">{model.type}</span>
        </div>
      </td>

      {/* Context Window */}
      <td className="py-3 px-3 font-mono">
        <div className="flex items-center gap-2">
          <span className="text-white font-medium">{formatTokens(model.contextWindow)}</span>
          <div className="w-12 bg-slate-800 rounded-full h-1 hidden sm:block">
            <div
              className="bg-cyan-400 h-1 rounded-full"
              style={{ width: `${contextPct}%` }}
            />
          </div>
        </div>
      </td>

      {/* Pricing Input / Output */}
      <td className="py-3 px-3 font-mono">
        <div className="flex items-center gap-1">
          <span className="text-white">{formatCurrency(model.inputPricePerM)}</span>
          <span className="text-slate-400">/</span>
          <span className="text-cyan-300">{formatCurrency(model.outputPricePerM)}</span>
        </div>
      </td>

      {/* Arena Elo */}
      <td className="py-3 px-3 font-mono text-white font-semibold">
        <div className="flex items-center gap-1">
          <span className="text-amber-400">★</span>
          <span>{model.arenaElo}</span>
        </div>
      </td>

      {/* MMLU Score */}
      <td className="py-3 px-3 font-mono text-slate-300">
        <span>{model.mmluScore}%</span>
      </td>

      {/* Speed (Latency & Tok/s) */}
      <td className="py-3 px-3 font-mono text-slate-300 hidden md:table-cell">
        <div className="text-[11px]">
          <span className="text-emerald-400">{model.averageThroughputTokSec} tok/s</span>
          <span className="text-slate-400 text-[10px] ml-1">({model.averageLatencyMs}ms)</span>
        </div>
      </td>

      {/* Top Provider */}
      <td className="py-3 px-3 hidden lg:table-cell">
        <span className="rounded bg-surface px-2 py-0.5 text-[10px] text-slate-300 border border-border">
          {model.providers[0]?.providerName || "Direct"}
        </span>
      </td>

      {/* Actions */}
      <td className="py-3 px-3 text-right">
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={() => openPlayground(model.slug)}
            className="p-1.5 rounded-lg border border-border bg-surface text-slate-400 hover:text-cyan-300 hover:border-slate-600 transition-all"
            title="Launch Playground"
          >
            <Terminal className="h-3.5 w-3.5" />
          </button>
          <Link
            href={`/models/${model.slug}`}
            className="p-1.5 rounded-lg border border-indigo-500/30 bg-indigo-500/10 text-cyan-300 hover:bg-indigo-500/20 transition-all"
            title="View Details"
          >
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </td>
    </tr>
  );
}
