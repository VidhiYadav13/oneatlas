"use client";

import React from "react";
import { GitCompare, Heart, Terminal } from "lucide-react";
import { useStore } from "@/lib/store/useStore";

interface Props {
  slug: string;
  name: string;
}

export default function ModelDetailActions({ slug, name }: Props) {
  const isComparing = useStore((s) => s.isComparing(slug));
  const addToCompare = useStore((s) => s.addToCompare);
  const isFavorite = useStore((s) => s.isFavorite(slug));
  const toggleFavorite = useStore((s) => s.toggleFavorite);
  const openPlayground = useStore((s) => s.openPlayground);

  return (
    <div className="flex flex-wrap lg:flex-col items-center gap-2.5 flex-shrink-0">
      <button
        onClick={() => openPlayground(slug)}
        className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:scale-[1.02] transition-all"
      >
        <Terminal className="h-4 w-4" />
        <span>Test in Playground</span>
      </button>

      <button
        onClick={() => addToCompare(slug)}
        className={`w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border px-4 py-2 text-xs font-semibold transition-all ${
          isComparing
            ? "border-indigo-500 bg-indigo-600 text-white shadow-sm"
            : "border-border bg-surface text-slate-300 hover:text-white hover:border-slate-600"
        }`}
      >
        <GitCompare className="h-4 w-4" />
        <span>{isComparing ? "In Comparison (Remove)" : "Add to Comparison"}</span>
      </button>

      <button
        onClick={() => toggleFavorite(slug)}
        className={`w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border px-4 py-2 text-xs font-semibold transition-all ${
          isFavorite
            ? "border-rose-500/40 bg-rose-500/15 text-rose-300"
            : "border-border bg-surface text-slate-300 hover:text-rose-400 hover:border-slate-600"
        }`}
      >
        <Heart className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />
        <span>{isFavorite ? "Favorited" : "Bookmark Model"}</span>
      </button>
    </div>
  );
}
