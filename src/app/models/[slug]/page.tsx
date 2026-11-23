import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Sparkles,
  GitCompare,
  Heart,
  Server,
  Layers,
  Zap,
  Activity,
  Shield,
  Clock,
  Cpu,
  Brain,
  Eye,
  CheckCircle2,
  XCircle,
  ExternalLink,
  ChevronLeft,
  Terminal,
  Trophy,
} from "lucide-react";
import { DataService } from "@/lib/data/db";
import { formatCurrency, formatTokens } from "@/lib/utils";
import CodeSnippetViewer from "@/components/CodeSnippetViewer";
import CostCalculatorWidget from "@/components/CostCalculatorWidget";
import ModelCard from "@/components/ModelCard";
import ModelDetailActions from "./ModelDetailActions";

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const models = DataService.getModels().models;
  return models.map((m) => ({ slug: m.slug }));
}

export default function ModelDetailPage({ params }: PageProps) {
  const { slug } = params;
  const model = DataService.getModelBySlug(slug);

  if (!model) {
    notFound();
  }

  const allModels = DataService.getModels().models;
  const relatedModels = allModels
    .filter((m) => m.id !== model.id && (m.labId === model.labId || m.type === model.type))
    .slice(0, 3);

  // Context percentage
  const contextPct = Math.min(100, Math.round((model.contextWindow / 2_000_000) * 100));

  const allCapabilities = [
    { key: "reasoning", label: "Deep Reasoning Engine" },
    { key: "tool_use", label: "Native Tool / Function Calling" },
    { key: "structured_output", label: "Structured JSON Output" },
    { key: "system_prompt", label: "System Prompts & Steerability" },
    { key: "long_context", label: "Long Context Processing" },
    { key: "web_search", label: "Live Web Search Synthesis" },
    { key: "code_execution", label: "Native Code Sandbox Execution" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs text-slate-400">
        <Link href="/" className="hover:text-cyan-400 flex items-center gap-1">
          <ChevronLeft className="h-3.5 w-3.5" />
          <span>All Models</span>
        </Link>
        <span>/</span>
        <Link href={`/labs/${model.lab.slug}`} className="hover:text-cyan-400">
          {model.lab.name}
        </Link>
        <span>/</span>
        <span className="text-white font-medium">{model.name}</span>
      </div>

      {/* Model Hero Banner */}
      <div className="relative rounded-3xl border border-indigo-500/30 bg-surface-card p-6 sm:p-10 shadow-2xl overflow-hidden backdrop-blur-xl">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-4 max-w-3xl">
            {/* Lab & Type Pills */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <Link
                href={`/labs/${model.lab.slug}`}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1 font-semibold text-white hover:border-slate-500 transition-colors"
              >
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: model.lab.highlightColor || "#6366f1" }}
                />
                <span>{model.lab.name}</span>
              </Link>

              <span className="badge-subtle bg-slate-800 border-border text-slate-300 capitalize">
                {model.type}
              </span>

              {model.isOpenWeights ? (
                <span className="badge-subtle bg-emerald-500/15 border-emerald-500/30 text-emerald-300">
                  Open Weights ({model.license})
                </span>
              ) : (
                <span className="badge-subtle bg-slate-800 border-border text-slate-400">
                  Proprietary
                </span>
              )}

              {model.isNew && (
                <span className="badge-subtle bg-cyan-500/15 border-cyan-500/30 text-cyan-300">
                  New Release
                </span>
              )}
            </div>

            {/* Model Name & Tagline */}
            <div>
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
                {model.name}
              </h1>
              <p className="text-base text-cyan-300/90 mt-2 font-medium">
                {model.tagline}
              </p>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {model.description}
            </p>

            {/* Architecture & Release info */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 font-mono pt-2">
              <span className="flex items-center gap-1">
                <Cpu className="h-3.5 w-3.5 text-indigo-400" />
                <span>{model.architecture}</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-cyan-400" />
                <span>Released {model.releaseDate}</span>
              </span>
            </div>
          </div>

          {/* Interactive Actions (Compare, Favorite, Playground) */}
          <ModelDetailActions slug={model.slug} name={model.name} />
        </div>
      </div>

      {/* Primary Metrics Grid: Pricing, Context, Speed, Elo */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Pricing */}
        <div className="rounded-2xl border border-border bg-surface-card p-5">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
            Token Pricing (In / Out)
          </span>
          <div className="text-2xl font-extrabold font-mono text-white">
            {formatCurrency(model.inputPricePerM)}
            <span className="text-slate-400 text-lg font-normal"> / </span>
            <span className="text-cyan-300">{formatCurrency(model.outputPricePerM)}</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            {model.cachedPricePerM ? `Cached prompt: ${formatCurrency(model.cachedPricePerM)}/1M` : "Per 1M tokens"}
          </p>
        </div>

        {/* Context Window */}
        <div className="rounded-2xl border border-border bg-surface-card p-5">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
            Context Window
          </span>
          <div className="text-2xl font-extrabold font-mono text-white">
            {formatTokens(model.contextWindow)}
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-1.5 rounded-full"
              style={{ width: `${contextPct}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Max output: {formatTokens(model.maxOutputTokens)} tokens
          </p>
        </div>

        {/* Chatbot Arena Elo */}
        <div className="rounded-2xl border border-border bg-surface-card p-5">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
            Chatbot Arena Elo
          </span>
          <div className="text-2xl font-extrabold font-mono text-amber-400 flex items-center gap-1.5">
            <Trophy className="h-6 w-6" />
            <span>{model.arenaElo}</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Top 5% frontier global ranking
          </p>
        </div>

        {/* Throughput & Latency */}
        <div className="rounded-2xl border border-border bg-surface-card p-5">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
            Avg Throughput / P50
          </span>
          <div className="text-2xl font-extrabold font-mono text-emerald-400">
            {model.averageThroughputTokSec} <span className="text-sm font-normal">tok/s</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            P50 Time to first token: {model.averageLatencyMs}ms
          </p>
        </div>
      </div>

      {/* Two Column Layout: Specifications & Benchmarks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Capabilities & Specifications */}
        <div className="rounded-2xl border border-border bg-surface-card p-6 space-y-6">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Shield className="h-4 w-4 text-cyan-400" />
            <span>Model Capabilities & Protocol Support</span>
          </h3>

          <div className="space-y-3">
            {allCapabilities.map((cap) => {
              const isSupported = model.capabilities.includes(cap.key as any);
              return (
                <div
                  key={cap.key}
                  className="flex items-center justify-between p-2.5 rounded-xl border border-border/50 bg-surface/50 text-xs"
                >
                  <span className="font-medium text-slate-200">{cap.label}</span>
                  {isSupported ? (
                    <span className="flex items-center gap-1 text-emerald-400 font-semibold font-mono">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Supported</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-slate-400 font-mono">
                      <XCircle className="h-4 w-4" />
                      <span>Not Supported</span>
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          <div className="border-t border-border/60 pt-4 text-xs text-slate-400">
            <div className="grid grid-cols-2 gap-4 font-mono">
              <div>
                <span className="block text-[10px] text-slate-400 uppercase">License</span>
                <span className="text-white font-medium">{model.license}</span>
              </div>
              <div>
                <span className="block text-[10px] text-slate-400 uppercase">Weekly Queries</span>
                <span className="text-white font-medium">
                  {model.weeklyRequestsCount.toLocaleString()} requests
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Benchmarks & Leaderboard Scores */}
        <div className="rounded-2xl border border-border bg-surface-card p-6 space-y-6">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Trophy className="h-4 w-4 text-amber-400" />
            <span>Benchmark Performance</span>
          </h3>

          <div className="space-y-4">
            {/* Arena Elo */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium">Chatbot Arena Elo</span>
                <span className="font-mono font-bold text-amber-400">{model.arenaElo} / 1400</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-amber-400 h-2 rounded-full"
                  style={{ width: `${(model.arenaElo / 1400) * 100}%` }}
                />
              </div>
            </div>

            {/* MMLU-Pro */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium">MMLU-Pro (Reasoning)</span>
                <span className="font-mono font-bold text-indigo-300">{model.mmluScore}%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-indigo-500 h-2 rounded-full"
                  style={{ width: `${model.mmluScore}%` }}
                />
              </div>
            </div>

            {/* HumanEval Coding */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium">HumanEval (Python Code Synthesis)</span>
                <span className="font-mono font-bold text-cyan-300">{model.humanEvalScore}%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-cyan-400 h-2 rounded-full"
                  style={{ width: `${model.humanEvalScore}%` }}
                />
              </div>
            </div>

            {/* SWE-bench Verified */}
            {model.sweBenchScore && (
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300 font-medium">SWE-bench Verified (Software Engineering)</span>
                  <span className="font-mono font-bold text-emerald-300">{model.sweBenchScore}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-emerald-400 h-2 rounded-full"
                    style={{ width: `${model.sweBenchScore}%` }}
                  />
                </div>
              </div>
            )}

            {/* MATH-500 */}
            {model.mathScore && (
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300 font-medium">MATH-500 (Complex Mathematics)</span>
                  <span className="font-mono font-bold text-purple-300">{model.mathScore}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-purple-400 h-2 rounded-full"
                    style={{ width: `${model.mathScore}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Available Providers Table */}
      <div className="rounded-2xl border border-border bg-surface-card p-6 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-border/80">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Server className="h-4 w-4 text-cyan-400" />
              <span>Available Inference Providers ({model.providers.length})</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Compare latency, token throughput, and pricing across verified hosting providers.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border/60 text-slate-400 uppercase tracking-wider text-[10px]">
                <th className="py-2.5 px-3">Provider</th>
                <th className="py-2.5 px-3">Pricing (In / Out)</th>
                <th className="py-2.5 px-3">P50 Latency</th>
                <th className="py-2.5 px-3">P95 Latency</th>
                <th className="py-2.5 px-3">Throughput</th>
                <th className="py-2.5 px-3">Uptime</th>
                <th className="py-2.5 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 font-mono">
              {model.providers.map((p) => (
                <tr key={p.providerId} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 px-3 font-sans font-bold text-white flex items-center gap-2">
                    <Link
                      href={`/providers/${p.providerSlug}`}
                      className="hover:text-cyan-300 transition-colors"
                    >
                      {p.providerName}
                    </Link>
                    {p.isDefault && (
                      <span className="rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-1.5 py-0.2 text-[9px]">
                        Default
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3">
                    <span className="text-white">{formatCurrency(p.inputPricePerM)}</span>
                    <span className="text-slate-400"> / </span>
                    <span className="text-cyan-300">{formatCurrency(p.outputPricePerM)}</span>
                  </td>
                  <td className="py-3 px-3 text-slate-300">{p.latencyP50Ms}ms</td>
                  <td className="py-3 px-3 text-slate-400">{p.latencyP95Ms}ms</td>
                  <td className="py-3 px-3 text-emerald-400 font-semibold">
                    {p.throughputTokSec} tok/s
                  </td>
                  <td className="py-3 px-3 text-slate-300">{p.uptimePercent}%</td>
                  <td className="py-3 px-3 text-right">
                    <span className="inline-flex items-center gap-1 text-emerald-400 text-[11px] font-sans">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Operational
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Developer Integration Code Snippets */}
      <div className="space-y-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Terminal className="h-4 w-4 text-cyan-400" />
            <span>Developer Integration (LiteLLM & OpenAI SDK)</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Integrate {model.name} into your application using unified proxy headers or drop-in SDKs.
          </p>
        </div>
        <CodeSnippetViewer modelSlug={model.slug} modelName={model.name} />
      </div>

      {/* Cost Simulator for this Model */}
      <CostCalculatorWidget highlightModelSlug={model.slug} />

      {/* Related Models */}
      {relatedModels.length > 0 && (
        <div className="space-y-4 pt-6">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-cyan-400" />
            <span>Related Models in {model.lab.name}</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {relatedModels.map((rm) => (
              <ModelCard key={rm.id} model={rm} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
