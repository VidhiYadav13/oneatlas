import React from "react";
import Link from "next/link";
import { Building2, ArrowRight, ShieldCheck, MapPin, Calendar, Layers } from "lucide-react";
import { DataService } from "@/lib/data/db";

export default function LabsDirectoryPage() {
  const labs = DataService.getLabs();

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-400">
              <Building2 className="h-4 w-4" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              AI Labs & Research Directory
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Explore world-class frontier research organizations and their open & proprietary foundation models.
          </p>
        </div>
      </div>

      {/* Labs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {labs.map((lab) => (
          <div
            key={lab.id}
            className="group relative flex flex-col justify-between rounded-3xl border border-border bg-surface-card p-6 transition-all duration-300 hover:border-indigo-500/50 hover:bg-surface-card-hover hover:shadow-xl"
          >
            <div className="space-y-4">
              {/* Header row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span
                    className="h-3.5 w-3.5 rounded-full"
                    style={{ backgroundColor: lab.highlightColor || "#6366f1" }}
                  />
                  <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {lab.name}
                  </h3>
                </div>
                {lab.isVerified && (
                  <span className="flex items-center gap-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 text-[10px] text-cyan-300">
                    <ShieldCheck className="h-3 w-3" />
                    <span>Verified Lab</span>
                  </span>
                )}
              </div>

              {/* Bio */}
              <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                {lab.description}
              </p>

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400 font-mono pt-2 border-t border-border/40">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-slate-400" />
                  <span>{lab.headquarters}</span>
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3 text-slate-400" />
                  <span>Founded {lab.foundedYear}</span>
                </span>
                <span className="flex items-center gap-1 text-cyan-300 font-semibold">
                  <Layers className="h-3 w-3" />
                  <span>{lab.totalModelsCount} Models Tracked</span>
                </span>
              </div>
            </div>

            {/* Action footer */}
            <div className="pt-6">
              <Link
                href={`/labs/${lab.slug}`}
                className="flex items-center justify-between rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-4 py-2 text-xs font-semibold text-cyan-300 hover:bg-indigo-500/20 transition-all"
              >
                <span>Explore {lab.name} Models</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
