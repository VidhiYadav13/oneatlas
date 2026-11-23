import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Server, ChevronLeft, ExternalLink, Globe, Shield, Activity, Zap } from "lucide-react";
import { DataService } from "@/lib/data/db";
import ModelCard from "@/components/ModelCard";

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const providers = DataService.getProviders();
  return providers.map((p) => ({ slug: p.slug }));
}

export default function ProviderDetailPage({ params }: PageProps) {
  const { slug } = params;
  const result = DataService.getProviderBySlug(slug);

  if (!result) {
    notFound();
  }

  const { provider, models } = result;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-400">
        <Link href="/providers" className="hover:text-cyan-400 flex items-center gap-1">
          <ChevronLeft className="h-3.5 w-3.5" />
          <span>All Providers</span>
        </Link>
        <span>/</span>
        <span className="text-white font-medium">{provider.name}</span>
      </div>

      {/* Provider Banner */}
      <div className="rounded-3xl border border-border bg-surface-card p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-border/80">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white">
                {provider.name}
              </h1>
              <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-xs text-emerald-400 font-mono">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {provider.uptimePercent}% Uptime
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              {provider.description}
            </p>
          </div>

          <a
            href={provider.website}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-2 text-xs font-semibold text-white hover:border-slate-500 transition-colors self-start sm:self-auto"
          >
            <span>Visit Provider Console</span>
            <ExternalLink className="h-3.5 w-3.5 text-cyan-400" />
          </a>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 text-xs text-slate-400 font-mono">
          <div>
            <span className="text-[10px] uppercase text-slate-400 block">P50 Latency</span>
            <strong className="text-cyan-300 text-sm">{provider.avgLatencyMs}ms</strong>
          </div>
          <div>
            <span className="text-[10px] uppercase text-slate-400 block">Avg Throughput</span>
            <strong className="text-emerald-400 text-sm">{provider.avgThroughputTokSec} tok/s</strong>
          </div>
          <div>
            <span className="text-[10px] uppercase text-slate-400 block">Compliance</span>
            <strong className="text-white">{provider.compliance.join(", ")}</strong>
          </div>
          <div>
            <span className="text-[10px] uppercase text-slate-400 block">Regions</span>
            <strong className="text-slate-300">{provider.regions.join(", ")}</strong>
          </div>
        </div>
      </div>

      {/* Models Hosted by this provider */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">
            Models Available on {provider.name} ({models.length})
          </h2>
          <span className="text-xs text-slate-400">
            Unified routing & rate limits
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {models.map((model) => (
            <ModelCard key={model.id} model={model} />
          ))}
        </div>
      </div>
    </div>
  );
}
