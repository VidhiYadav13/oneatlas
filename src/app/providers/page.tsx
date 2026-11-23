import React from "react";
import Link from "next/link";
import { Server, ArrowRight, Activity, Zap, Shield, Globe, Layers } from "lucide-react";
import { DataService } from "@/lib/data/db";

export default function ProvidersDirectoryPage() {
  const providers = DataService.getProviders();

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400">
              <Server className="h-4 w-4" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Inference Provider Ecosystem
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time latency metrics, global regions, and compliance standards across integrated inference cloud providers.
          </p>
        </div>
      </div>

      {/* Providers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {providers.map((p) => (
          <div
            key={p.id}
            className="group relative flex flex-col justify-between rounded-3xl border border-border bg-surface-card p-6 transition-all duration-300 hover:border-cyan-500/50 hover:bg-surface-card-hover hover:shadow-xl"
          >
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {p.name}
                </h3>
                <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-[10px] text-emerald-400 font-mono">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {p.uptimePercent}% Uptime
                </span>
              </div>

              {/* Bio */}
              <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                {p.description}
              </p>

              {/* Telemetry Metrics */}
              <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-surface/70 border border-border/60 text-xs font-mono">
                <div>
                  <span className="text-[10px] uppercase text-slate-400 block">P50 Latency</span>
                  <strong className="text-cyan-300">{p.avgLatencyMs}ms</strong>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-slate-400 block">Throughput</span>
                  <strong className="text-emerald-400">{p.avgThroughputTokSec} tok/s</strong>
                </div>
              </div>

              {/* Compliance & Protocols */}
              <div className="space-y-1.5 text-[11px] text-slate-400">
                <div className="flex flex-wrap gap-1">
                  {p.compliance.map((c, idx) => (
                    <span
                      key={idx}
                      className="rounded bg-slate-800 px-1.5 py-0.2 text-[10px] text-slate-300 border border-border"
                    >
                      {c}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-1 text-[10px] text-slate-400 pt-1">
                  <Globe className="h-3 w-3" />
                  <span>{p.regions.join(" • ")}</span>
                </div>
              </div>
            </div>

            {/* Action footer */}
            <div className="pt-6">
              <Link
                href={`/providers/${p.slug}`}
                className="flex items-center justify-between rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-xs font-semibold text-cyan-300 hover:bg-cyan-500/20 transition-all"
              >
                <span>View Supported Models</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
