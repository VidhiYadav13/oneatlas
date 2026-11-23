import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Building2, ChevronLeft, ExternalLink, MapPin, Calendar, Layers, ShieldCheck } from "lucide-react";
import { DataService } from "@/lib/data/db";
import ModelCard from "@/components/ModelCard";

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const labs = DataService.getLabs();
  return labs.map((l) => ({ slug: l.slug }));
}

export default function LabDetailPage({ params }: PageProps) {
  const { slug } = params;
  const result = DataService.getLabBySlug(slug);

  if (!result) {
    notFound();
  }

  const { lab, models } = result;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-400">
        <Link href="/labs" className="hover:text-cyan-400 flex items-center gap-1">
          <ChevronLeft className="h-3.5 w-3.5" />
          <span>All Labs</span>
        </Link>
        <span>/</span>
        <span className="text-white font-medium">{lab.name}</span>
      </div>

      {/* Lab Banner */}
      <div className="rounded-3xl border border-border bg-surface-card p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-border/80">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span
                className="h-4 w-4 rounded-full"
                style={{ backgroundColor: lab.highlightColor || "#6366f1" }}
              />
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white">
                {lab.name}
              </h1>
              {lab.isVerified && (
                <span className="flex items-center gap-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 text-[10px] text-cyan-300">
                  <ShieldCheck className="h-3 w-3" />
                  <span>Verified Organization</span>
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              {lab.description}
            </p>
          </div>

          <a
            href={lab.website}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-2 text-xs font-semibold text-white hover:border-slate-500 transition-colors self-start sm:self-auto"
          >
            <span>Visit Website</span>
            <ExternalLink className="h-3.5 w-3.5 text-cyan-400" />
          </a>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-6 text-xs text-slate-400 font-mono">
          <div>
            <span className="text-[10px] uppercase text-slate-400 block">Headquarters</span>
            <strong className="text-white font-sans">{lab.headquarters}</strong>
          </div>
          <div>
            <span className="text-[10px] uppercase text-slate-400 block">Founded</span>
            <strong className="text-white">{lab.foundedYear}</strong>
          </div>
          <div>
            <span className="text-[10px] uppercase text-slate-400 block">Active Models</span>
            <strong className="text-cyan-300">{models.length} Models Indexed</strong>
          </div>
        </div>
      </div>

      {/* Model Catalog for this lab */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">
            {lab.name} Foundation Models ({models.length})
          </h2>
          <span className="text-xs text-slate-400">
            Real-time inference & pricing metrics
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
