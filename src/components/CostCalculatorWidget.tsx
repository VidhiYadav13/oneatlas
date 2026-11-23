"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Calculator, ArrowRight, DollarSign, Sparkles, TrendingDown, Layers } from "lucide-react";
import { models } from "@/lib/data/mockData";
import { formatCurrency, formatNumber } from "@/lib/utils";

interface CostCalculatorProps {
  initialPromptTokens?: number;
  initialCompletionTokens?: number;
  highlightModelSlug?: string;
}

export default function CostCalculatorWidget({
  initialPromptTokens = 5000000,
  initialCompletionTokens = 2000000,
  highlightModelSlug,
}: CostCalculatorProps) {
  const [promptTokens, setPromptTokens] = useState(initialPromptTokens);
  const [completionTokens, setCompletionTokens] = useState(initialCompletionTokens);

  // Calculate costs for all models
  const calculated = models.map((m) => {
    const promptCost = (promptTokens / 1_000_000) * m.inputPricePerM;
    const completionCost = (completionTokens / 1_000_000) * m.outputPricePerM;
    const totalCost = promptCost + completionCost;

    return {
      model: m,
      promptCost,
      completionCost,
      totalCost,
    };
  });

  calculated.sort((a, b) => a.totalCost - b.totalCost);

  const highestCost = Math.max(...calculated.map((c) => c.totalCost));
  const cheapest = calculated[0];
  const highlighted = calculated.find((c) => c.model.slug === highlightModelSlug) || calculated[0];

  return (
    <div className="rounded-2xl border border-border bg-surface-card p-6 shadow-xl">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-border/80 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-400">
              <Calculator className="h-4 w-4" />
            </div>
            <h3 className="text-base font-bold text-white">Interactive Token Cost Simulator</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Simulate monthly developer spend across 17 frontier LLMs based on expected token traffic.
          </p>
        </div>

        {cheapest && (
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 flex items-center gap-2 text-xs">
            <TrendingDown className="h-4 w-4 text-emerald-400" />
            <div>
              <span className="text-slate-300 block text-[10px]">Lowest Cost:</span>
              <strong className="text-emerald-300 font-mono">
                {cheapest.model.name} ({formatCurrency(cheapest.totalCost)}/mo)
              </strong>
            </div>
          </div>
        )}
      </div>

      {/* Sliders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6 p-4 rounded-xl bg-surface/50 border border-border/60">
        {/* Prompt tokens */}
        <div>
          <div className="flex justify-between text-xs mb-2">
            <span className="text-slate-300 font-semibold uppercase tracking-wider text-[11px]">
              Monthly Input Tokens
            </span>
            <span className="font-mono text-cyan-300 font-bold">
              {formatNumber(promptTokens)} tokens
            </span>
          </div>
          <input
            type="range"
            min="100000"
            max="50000000"
            step="500000"
            value={promptTokens}
            onChange={(e) => setPromptTokens(parseInt(e.target.value, 10))}
            className="w-full accent-cyan-400 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
            <span>100k</span>
            <span>25M</span>
            <span>50M tokens</span>
          </div>
        </div>

        {/* Completion tokens */}
        <div>
          <div className="flex justify-between text-xs mb-2">
            <span className="text-slate-300 font-semibold uppercase tracking-wider text-[11px]">
              Monthly Output Tokens
            </span>
            <span className="font-mono text-indigo-300 font-bold">
              {formatNumber(completionTokens)} tokens
            </span>
          </div>
          <input
            type="range"
            min="50000"
            max="25000000"
            step="250000"
            value={completionTokens}
            onChange={(e) => setCompletionTokens(parseInt(e.target.value, 10))}
            className="w-full accent-indigo-400 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
            <span>50k</span>
            <span>12.5M</span>
            <span>25M tokens</span>
          </div>
        </div>
      </div>

      {/* Cost Comparison Bar List */}
      <div className="space-y-3">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex justify-between">
          <span>Model Comparison ({calculated.length} Models)</span>
          <span>Estimated Monthly Bill</span>
        </div>

        <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
          {calculated.map((item) => {
            const isHigh = item.model.slug === highlightModelSlug;
            const barPct = Math.max(3, Math.round((item.totalCost / highestCost) * 100));

            return (
              <div
                key={item.model.id}
                className={`rounded-xl border p-2.5 transition-all ${
                  isHigh
                    ? "border-cyan-400/60 bg-cyan-500/10 shadow-md"
                    : "border-border/60 bg-surface/60 hover:bg-surface"
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: item.model.lab.highlightColor || "#6366f1" }}
                    />
                    <Link
                      href={`/models/${item.model.slug}`}
                      className="font-bold text-white hover:text-cyan-300 transition-colors"
                    >
                      {item.model.name}
                    </Link>
                    <span className="text-[10px] text-slate-400 hidden sm:inline">
                      ({item.model.lab.name})
                    </span>
                  </div>

                  <div className="text-right font-mono">
                    <span className="text-sm font-bold text-white">
                      {formatCurrency(item.totalCost)}
                    </span>
                    <span className="text-[10px] text-slate-400 ml-1">/mo</span>
                  </div>
                </div>

                {/* Progress bar representing cost relative to maximum */}
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-1.5 rounded-full ${
                      item.totalCost < 5
                        ? "bg-emerald-400"
                        : item.totalCost < 30
                        ? "bg-cyan-400"
                        : "bg-indigo-500"
                    }`}
                    style={{ width: `${barPct}%` }}
                  />
                </div>

                <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1 font-mono">
                  <span>
                    Input: {formatCurrency(item.promptCost)} • Output: {formatCurrency(item.completionCost)}
                  </span>
                  <span>
                    ${item.model.inputPricePerM} / ${item.model.outputPricePerM} per 1M
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
