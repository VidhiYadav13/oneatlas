"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Calculator, DollarSign, TrendingDown, Sparkles, Layers, Cpu } from "lucide-react";
import CostCalculatorWidget from "@/components/CostCalculatorWidget";

export default function CalculatorPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-400">
              <Calculator className="h-4 w-4" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              AI Token Cost & Budget Simulator
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Simulate monthly infrastructure costs across frontier LLMs, open-weights models, and specialized providers.
          </p>
        </div>
      </div>

      {/* Main interactive widget */}
      <CostCalculatorWidget initialPromptTokens={10000000} initialCompletionTokens={3000000} />

      {/* Token Economics Explainer */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        <div className="rounded-2xl border border-border bg-surface-card p-5 space-y-2">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-cyan-400" />
            <span>Prompt Caching Discounts</span>
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Leading providers (Anthropic, DeepSeek, OpenAI) offer 50% to 90% discounts on prompt tokens when reusing cached system prompts and context.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-surface-card p-5 space-y-2">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400" />
            <span>Open Weights Savings</span>
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Models like DeepSeek V3 ($0.14/1M) and Llama 3.3 70B ($0.18/1M) provide frontier performance at 90-95% lower cost than traditional proprietary APIs.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-surface-card p-5 space-y-2">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-purple-400" />
            <span>Reasoning Token Multiplier</span>
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Deliberate reasoning models (o1, o3-mini, DeepSeek R1) generate internal chain-of-thought tokens that are billed as completion tokens.
          </p>
        </div>
      </div>
    </div>
  );
}
