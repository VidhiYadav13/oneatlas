"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Sparkles,
  LayoutGrid,
  Table as TableIcon,
  ArrowUpDown,
  Search,
  Zap,
  Filter,
  CheckCircle2,
  TrendingUp,
  Brain,
  Cpu,
  Layers,
  ShieldCheck,
  X,
  Compass,
} from "lucide-react";
import { useStore } from "@/lib/store/useStore";
import { models, labs, providers } from "@/lib/data/mockData";
import { SortOption } from "@/lib/types";
import ModelCard from "@/components/ModelCard";
import ModelTableRow from "@/components/ModelTableRow";
import FilterSidebar from "@/components/FilterSidebar";

export default function HomePage() {
  const filters = useStore((s) => s.filters);
  const viewMode = useStore((s) => s.viewMode);
  const setViewMode = useStore((s) => s.setViewMode);
  const setSortBy = useStore((s) => s.setSortBy);
  const resetFilters = useStore((s) => s.resetFilters);
  const setSearch = useStore((s) => s.setSearch);
  const setCategory = useStore((s) => s.setCategory);
  const setOpenWeightsOnly = useStore((s) => s.setOpenWeightsOnly);
  const setMinContextWindow = useStore((s) => s.setMinContextWindow);
  const setCommandPaletteOpen = useStore((s) => s.setCommandPaletteOpen);

  // Filter and sort models on the client according to active store filters
  const filteredModels = useMemo(() => {
    let result = [...models];

    // Search
    if (filters.search.trim()) {
      const q = filters.search.toLowerCase().trim();
      result = result.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.slug.toLowerCase().includes(q) ||
          m.tagline.toLowerCase().includes(q) ||
          m.description.toLowerCase().includes(q) ||
          m.lab.name.toLowerCase().includes(q) ||
          m.architecture.toLowerCase().includes(q)
      );
    }

    // Category
    if (filters.category !== "all") {
      result = result.filter((m) => m.type === filters.category);
    }

    // Labs
    if (filters.labs.length > 0) {
      result = result.filter((m) => filters.labs.includes(m.lab.slug));
    }

    // Providers
    if (filters.providers.length > 0) {
      result = result.filter((m) =>
        m.providers.some((p) => filters.providers.includes(p.providerSlug))
      );
    }

    // Modalities
    if (filters.modalities.length > 0) {
      result = result.filter((m) =>
        filters.modalities.every((mod) => m.modalities.includes(mod))
      );
    }

    // Capabilities
    if (filters.capabilities.length > 0) {
      result = result.filter((m) =>
        filters.capabilities.every((cap) => m.capabilities.includes(cap))
      );
    }

    // Open Weights
    if (filters.isOpenWeightsOnly) {
      result = result.filter((m) => m.isOpenWeights);
    }
    if (filters.isProprietaryOnly) {
      result = result.filter((m) => !m.isOpenWeights);
    }

    // Max Input Price
    if (filters.maxInputPrice > 0) {
      result = result.filter((m) => m.inputPricePerM <= filters.maxInputPrice);
    }

    // Min Context
    if (filters.minContextWindow > 0) {
      result = result.filter((m) => m.contextWindow >= filters.minContextWindow);
    }

    // Sort
    switch (filters.sortBy) {
      case "price_asc":
        result.sort((a, b) => a.inputPricePerM - b.inputPricePerM);
        break;
      case "price_desc":
        result.sort((a, b) => b.inputPricePerM - a.inputPricePerM);
        break;
      case "context_desc":
        result.sort((a, b) => b.contextWindow - a.contextWindow);
        break;
      case "arena_elo_desc":
        result.sort((a, b) => b.arenaElo - a.arenaElo);
        break;
      case "mmlu_desc":
        result.sort((a, b) => b.mmluScore - a.mmluScore);
        break;
      case "newest":
        result.sort(
          (a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()
        );
        break;
      case "trending":
      default:
        result.sort((a, b) => {
          if (a.isTrending && !b.isTrending) return -1;
          if (!a.isTrending && b.isTrending) return 1;
          return b.weeklyRequestsCount - a.weeklyRequestsCount;
        });
        break;
    }

    return result;
  }, [filters]);

  const sortOptions: { id: SortOption; label: string }[] = [
    { id: "trending", label: "Trending & Usage" },
    { id: "arena_elo_desc", label: "Highest Arena Elo" },
    { id: "mmlu_desc", label: "Highest MMLU-Pro" },
    { id: "price_asc", label: "Price: Low to High" },
    { id: "price_desc", label: "Price: High to Low" },
    { id: "context_desc", label: "Largest Context" },
    { id: "newest", label: "Newest Releases" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Hero Section */}
      <section className="relative rounded-3xl border border-indigo-500/20 bg-gradient-to-b from-surface/90 via-[#0d121e]/80 to-[#07090e]/60 p-8 sm:p-12 shadow-2xl overflow-hidden backdrop-blur-xl">
        <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 h-80 w-80 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-1 text-xs font-semibold text-cyan-300">
            <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>OneAtlas Intelligence Platform</span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-300">Frontier Model Discovery</span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-[1.15]">
            Discover, evaluate, and compare{" "}
            <span className="bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
              frontier AI models
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
            Real-time specifications, verified Chatbot Arena & MMLU benchmarks, transparent token pricing, and universal multi-provider routing inspired by OpenRouter, RouterPlus, and LiteLLM.
          </p>

          {/* Quick Filter Chips for instant exploration */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <span className="text-xs text-slate-400 font-medium mr-1">Quick Filters:</span>
            <button
              onClick={() => setCategory("reasoning")}
              className="rounded-lg border border-purple-500/30 bg-purple-500/10 px-2.5 py-1 text-xs text-purple-300 hover:bg-purple-500/20 transition-all flex items-center gap-1"
            >
              <Brain className="h-3 w-3" />
              <span>Deep Reasoning (o1, R1, 3.7)</span>
            </button>
            <button
              onClick={() => setOpenWeightsOnly(true)}
              className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs text-emerald-300 hover:bg-emerald-500/20 transition-all"
            >
              Open Weights (Llama, DeepSeek, Qwen)
            </button>
            <button
              onClick={() => setMinContextWindow(1000000)}
              className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-1 text-xs text-cyan-300 hover:bg-cyan-500/20 transition-all"
            >
              1M+ Long Context (Gemini)
            </button>
            <button
              onClick={() => resetFilters()}
              className="rounded-lg border border-border bg-surface px-2.5 py-1 text-xs text-slate-300 hover:text-white transition-all"
            >
              Clear All
            </button>
          </div>

          {/* Platform Metric Counters */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-border/60">
            <div>
              <span className="text-xl sm:text-2xl font-bold font-mono text-white">
                {models.length}
              </span>
              <span className="text-xs text-slate-400 block">Frontier Models</span>
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-bold font-mono text-cyan-400">
                {labs.length}
              </span>
              <span className="text-xs text-slate-400 block">AI Labs & Research</span>
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-bold font-mono text-indigo-400">
                {providers.length}
              </span>
              <span className="text-xs text-slate-400 block">Inference Providers</span>
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-bold font-mono text-emerald-400">
                100%
              </span>
              <span className="text-xs text-slate-400 block">Real-time Verified</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Catalog Section: Sidebar + Grid */}
      <section className="flex flex-col lg:flex-row items-start gap-8">
        {/* Left Filter Sidebar */}
        <FilterSidebar />

        {/* Right Content Area */}
        <div className="w-full flex-1 min-w-0 space-y-6">
          {/* Header Controls: Results Count, View Switcher & Sorting */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/80">
            <div className="flex items-center gap-3">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Compass className="h-4 w-4 text-cyan-400" />
                <span>Models Catalog</span>
              </h2>
              <span className="rounded-full bg-surface-card border border-border px-2.5 py-0.5 text-xs font-mono font-semibold text-slate-300">
                {filteredModels.length} {filteredModels.length === 1 ? "Model" : "Models"}
              </span>
            </div>

            <div className="flex items-center gap-3">
              {/* Sort By Dropdown */}
              <div className="flex items-center gap-1.5 text-xs">
                <ArrowUpDown className="h-3.5 w-3.5 text-slate-400" />
                <span className="text-slate-400 hidden sm:inline">Sort:</span>
                <select
                  value={filters.sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="rounded-lg border border-border bg-surface px-2.5 py-1.5 text-xs font-medium text-white focus:outline-none focus:border-cyan-400 cursor-pointer"
                >
                  {sortOptions.map((opt) => (
                    <option key={opt.id} value={opt.id} className="bg-[#0b0e17] text-white">
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* View Mode Toggle: Grid vs Table */}
              <div className="flex items-center rounded-lg border border-border bg-surface p-0.5">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 rounded-md transition-all ${
                    viewMode === "grid"
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-slate-400 hover:text-white"
                  }`}
                  title="Card Grid View"
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode("table")}
                  className={`p-1.5 rounded-md transition-all ${
                    viewMode === "table"
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-slate-400 hover:text-white"
                  }`}
                  title="Dense Table View"
                >
                  <TableIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Active Filter Chips Summary */}
          {(filters.search ||
            filters.category !== "all" ||
            filters.labs.length > 0 ||
            filters.providers.length > 0 ||
            filters.modalities.length > 0 ||
            filters.isOpenWeightsOnly ||
            filters.isProprietaryOnly ||
            filters.maxInputPrice > 0 ||
            filters.minContextWindow > 0) && (
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-slate-400 text-[11px]">Active Filters:</span>
              {filters.search && (
                <span className="badge-subtle bg-surface border-border text-slate-200 flex items-center gap-1">
                  Query: &ldquo;{filters.search}&rdquo;
                  <button onClick={() => setSearch("")} className="hover:text-red-400">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {filters.category !== "all" && (
                <span className="badge-subtle bg-indigo-500/15 border-indigo-500/30 text-indigo-300 flex items-center gap-1">
                  Category: {filters.category}
                  <button onClick={() => setCategory("all")} className="hover:text-red-400">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {filters.isOpenWeightsOnly && (
                <span className="badge-subtle bg-emerald-500/15 border-emerald-500/30 text-emerald-300 flex items-center gap-1">
                  Open Weights
                  <button onClick={() => setOpenWeightsOnly(false)} className="hover:text-red-400">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              <button
                onClick={resetFilters}
                className="text-[11px] text-cyan-400 hover:underline ml-1"
              >
                Reset all
              </button>
            </div>
          )}

          {/* Catalog Render: Grid or Table */}
          {filteredModels.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-12 text-center space-y-4">
              <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-2xl bg-surface text-slate-400">
                <Search className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-white">No models matched your criteria</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Try loosening your search terms, context window threshold, or active filter tags.
              </p>
              <button
                onClick={resetFilters}
                className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500 transition-all shadow-md"
              >
                Reset All Filters
              </button>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {filteredModels.map((model) => (
                <ModelCard key={model.id} model={model} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-border bg-surface-card overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border/80 bg-surface/80 text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                      <th className="py-3 px-3 w-16">Compare</th>
                      <th className="py-3 px-3">Model & Lab</th>
                      <th className="py-3 px-3">Type</th>
                      <th className="py-3 px-3">Context</th>
                      <th className="py-3 px-3">Pricing (In/Out)</th>
                      <th className="py-3 px-3">Arena Elo</th>
                      <th className="py-3 px-3">MMLU</th>
                      <th className="py-3 px-3 hidden md:table-cell">Throughput</th>
                      <th className="py-3 px-3 hidden lg:table-cell">Top Provider</th>
                      <th className="py-3 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredModels.map((model) => (
                      <ModelTableRow key={model.id} model={model} />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
