import React from "react";
import Link from "next/link";
import { Sparkles, Terminal, Activity, Layers, Cpu, ShieldCheck } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border/60 bg-[#06080d] text-slate-400 mt-20">
      {/* Top statistics stripe */}
      <div className="border-b border-border/40 py-4 bg-surface/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 text-xs">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-emerald-400" />
              <span>Inference Status: <strong className="text-white">All Operational</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Cpu className="h-4 w-4 text-cyan-400" />
              <span>Models Tracked: <strong className="text-white">17 Frontier LLMs</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-indigo-400" />
              <span>Inference Providers: <strong className="text-white">7 Direct Routing</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-amber-400" />
              <span>Latency Benchmarks: <strong className="text-white">P50 / P95 Verified</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-400 p-[1px]">
                <div className="flex h-full w-full items-center justify-center rounded-[7px] bg-[#07090e]">
                  <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
                </div>
              </div>
              <span className="text-sm font-bold text-white">OneAtlas</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Unified AI model discovery and intelligence platform inspired by OpenRouter, RouterPlus, and LiteLLM. Explore specifications, compare pricing, and evaluate benchmarks across global frontier providers.
            </p>
            <div className="pt-2 text-[11px] text-slate-400">
              Frontend Engineer MVP Demo Task
            </div>
          </div>

          {/* Product links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-3">
              Platform
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/" className="hover:text-cyan-400 transition-colors">
                  Model Catalog & Search
                </Link>
              </li>
              <li>
                <Link href="/compare" className="hover:text-cyan-400 transition-colors">
                  Side-by-Side Comparison Matrix
                </Link>
              </li>
              <li>
                <Link href="/rankings" className="hover:text-cyan-400 transition-colors">
                  Chatbot Arena & MMLU Leaderboard
                </Link>
              </li>
              <li>
                <Link href="/calculator" className="hover:text-cyan-400 transition-colors">
                  Token Cost & Savings Calculator
                </Link>
              </li>
            </ul>
          </div>

          {/* Ecosystem */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-3">
              Ecosystem
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/labs" className="hover:text-cyan-400 transition-colors">
                  AI Labs & Research Directory
                </Link>
              </li>
              <li>
                <Link href="/providers" className="hover:text-cyan-400 transition-colors">
                  Cloud Providers & Inference Engines
                </Link>
              </li>
              <li>
                <a
                  href="https://openrouter.ai"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-cyan-400 transition-colors"
                >
                  OpenRouter Reference
                </a>
              </li>
              <li>
                <a
                  href="https://www.litellm.ai"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-cyan-400 transition-colors"
                >
                  LiteLLM Compatibility Spec
                </a>
              </li>
            </ul>
          </div>

          {/* Developer API */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-3">
              API Endpoints
            </h4>
            <div className="space-y-2 text-xs">
              <div className="rounded border border-border bg-surface p-2 font-mono text-[11px] text-slate-300">
                GET /api/models
              </div>
              <div className="rounded border border-border bg-surface p-2 font-mono text-[11px] text-slate-300">
                GET /api/compare?models=...
              </div>
              <div className="rounded border border-border bg-surface p-2 font-mono text-[11px] text-slate-300">
                GET /api/benchmarks?metric=...
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-12 border-t border-border/40 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <div>
            © 2026 OneAtlas. Built for developers, AI engineers, and researchers.
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              API Status 99.98%
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
