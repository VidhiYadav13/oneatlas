"use client";

import React, { useState } from "react";
import {
  Filter,
  RotateCcw,
  Search,
  Building2,
  Server,
  DollarSign,
  Layers,
  ChevronDown,
  ChevronUp,
  Brain,
  Eye,
  Code2,
  SlidersHorizontal,
} from "lucide-react";
import { useStore } from "@/lib/store/useStore";
import { labs, providers } from "@/lib/data/mockData";
import { Modality, Capability, ModelCategory } from "@/lib/types";
import { formatCurrency, formatTokens } from "@/lib/utils";

export default function FilterSidebar() {
  const filters = useStore((s) => s.filters);
  const setSearch = useStore((s) => s.setSearch);
  const setCategory = useStore((s) => s.setCategory);
  const toggleLab = useStore((s) => s.toggleLab);
  const toggleProvider = useStore((s) => s.toggleProvider);
  const toggleModality = useStore((s) => s.toggleModality);
  const toggleCapability = useStore((s) => s.toggleCapability);
  const setOpenWeightsOnly = useStore((s) => s.setOpenWeightsOnly);
  const setProprietaryOnly = useStore((s) => s.setProprietaryOnly);
  const setMaxInputPrice = useStore((s) => s.setMaxInputPrice);
  const setMinContextWindow = useStore((s) => s.setMinContextWindow);
  const resetFilters = useStore((s) => s.resetFilters);

  // Collapsible section state
  const [labsExpanded, setLabsExpanded] = useState(true);
  const [providersExpanded, setProvidersExpanded] = useState(true);
  const [capabilitiesExpanded, setCapabilitiesExpanded] = useState(true);

  // Count active filters
  const activeCount =
    (filters.search ? 1 : 0) +
    (filters.category !== "all" ? 1 : 0) +
    filters.labs.length +
    filters.providers.length +
    filters.modalities.length +
    filters.capabilities.length +
    (filters.isOpenWeightsOnly ? 1 : 0) +
    (filters.isProprietaryOnly ? 1 : 0) +
    (filters.maxInputPrice > 0 ? 1 : 0) +
    (filters.minContextWindow > 0 ? 1 : 0);

  const categories: { id: ModelCategory; label: string }[] = [
    { id: "all", label: "All" },
    { id: "multimodal", label: "Multimodal" },
    { id: "reasoning", label: "Reasoning" },
    { id: "text-only", label: "Text Only" },
    { id: "code", label: "Code" },
  ];

  const modalitiesList: { id: Modality; label: string; icon: React.ElementType }[] = [
    { id: "text", label: "Text", icon: Layers },
    { id: "vision", label: "Vision", icon: Eye },
    { id: "code", label: "Code", icon: Code2 },
  ];

  const capabilitiesList: { id: Capability; label: string }[] = [
    { id: "reasoning", label: "Deep Reasoning" },
    { id: "tool_use", label: "Tool / Function Calling" },
    { id: "structured_output", label: "Structured JSON Output" },
    { id: "long_context", label: "Long Context (1M+)" },
    { id: "web_search", label: "Real-time Web Search" },
  ];

  return (
    <aside aria-label="Filters sidebar" className="w-full lg:w-72 flex-shrink-0 space-y-6">
      {/* Top Header & Reset */}
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-cyan-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-white">
            Filters {activeCount > 0 && `(${activeCount})`}
          </h3>
        </div>
        {activeCount > 0 && (
          <button
            onClick={resetFilters}
            className="flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Reset All</span>
          </button>
        )}
      </div>

      {/* Search Input */}
      <div>
        <label className="text-[11px] font-semibold text-slate-300 block mb-1.5 uppercase tracking-wider">
          Search Models
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, lab, type..."
            className="w-full rounded-xl border border-border bg-surface pl-9 pr-3 py-2 text-xs text-white placeholder-slate-400 focus:border-cyan-400 focus:outline-none"
          />
        </div>
      </div>

      {/* Model Categories */}
      <div>
        <label className="text-[11px] font-semibold text-slate-300 block mb-2 uppercase tracking-wider">
          Category
        </label>
        <div className="flex flex-wrap gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                filters.category === cat.id
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-surface border border-border text-slate-400 hover:text-white hover:border-slate-600"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* License / Weights Type */}
      <div>
        <label className="text-[11px] font-semibold text-slate-300 block mb-2 uppercase tracking-wider">
          License & Weights
        </label>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <button
            onClick={() => setOpenWeightsOnly(!filters.isOpenWeightsOnly)}
            className={`rounded-xl border px-2.5 py-1.5 text-center font-medium transition-all ${
              filters.isOpenWeightsOnly
                ? "border-emerald-500/50 bg-emerald-500/15 text-emerald-300"
                : "border-border bg-surface text-slate-400 hover:text-white"
            }`}
          >
            Open Weights
          </button>
          <button
            onClick={() => setProprietaryOnly(!filters.isProprietaryOnly)}
            className={`rounded-xl border px-2.5 py-1.5 text-center font-medium transition-all ${
              filters.isProprietaryOnly
                ? "border-indigo-500/50 bg-indigo-500/15 text-indigo-300"
                : "border-border bg-surface text-slate-400 hover:text-white"
            }`}
          >
            Proprietary
          </button>
        </div>
      </div>

      {/* Modalities */}
      <div>
        <label className="text-[11px] font-semibold text-slate-300 block mb-2 uppercase tracking-wider">
          Modalities
        </label>
        <div className="flex flex-wrap gap-1.5">
          {modalitiesList.map((m) => {
            const Icon = m.icon;
            const isSelected = filters.modalities.includes(m.id);
            return (
              <button
                key={m.id}
                onClick={() => toggleModality(m.id)}
                className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium transition-all ${
                  isSelected
                    ? "border-cyan-500/40 bg-cyan-500/15 text-cyan-300"
                    : "border-border bg-surface text-slate-400 hover:text-white"
                }`}
              >
                <Icon className="h-3 w-3" />
                <span>{m.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* AI Labs / Companies */}
      <div className="border-t border-border/60 pt-4">
        <button
          onClick={() => setLabsExpanded(!labsExpanded)}
          className="flex w-full items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-slate-300 mb-2"
        >
          <span className="flex items-center gap-1.5">
            <Building2 className="h-3.5 w-3.5 text-indigo-400" />
            <span>AI Labs ({labs.length})</span>
          </span>
          {labsExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
        </button>

        {labsExpanded && (
          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {labs.map((lab) => {
              const isSelected = filters.labs.includes(lab.slug);
              return (
                <button
                  key={lab.id}
                  onClick={() => toggleLab(lab.slug)}
                  className={`w-full flex items-center justify-between rounded-lg px-2.5 py-1 text-xs transition-colors ${
                    isSelected
                      ? "bg-indigo-600/20 text-white border border-indigo-500/40"
                      : "text-slate-400 hover:bg-white/[0.03] hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: lab.highlightColor || "#6366f1" }}
                    />
                    <span>{lab.name}</span>
                  </div>
                  <span className="text-[10px] text-slate-400">{lab.totalModelsCount}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Inference Providers */}
      <div className="border-t border-border/60 pt-4">
        <button
          onClick={() => setProvidersExpanded(!providersExpanded)}
          className="flex w-full items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-slate-300 mb-2"
        >
          <span className="flex items-center gap-1.5">
            <Server className="h-3.5 w-3.5 text-cyan-400" />
            <span>Inference Providers</span>
          </span>
          {providersExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
        </button>

        {providersExpanded && (
          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {providers.map((p) => {
              const isSelected = filters.providers.includes(p.slug);
              return (
                <button
                  key={p.id}
                  onClick={() => toggleProvider(p.slug)}
                  className={`w-full flex items-center justify-between rounded-lg px-2.5 py-1 text-xs transition-colors ${
                    isSelected
                      ? "bg-cyan-500/15 text-white border border-cyan-500/40"
                      : "text-slate-400 hover:bg-white/[0.03] hover:text-white"
                  }`}
                >
                  <span>{p.name}</span>
                  <span className="text-[10px] text-emerald-400 font-mono">
                    {p.uptimePercent}%
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Capabilities */}
      <div className="border-t border-border/60 pt-4">
        <button
          onClick={() => setCapabilitiesExpanded(!capabilitiesExpanded)}
          className="flex w-full items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-slate-300 mb-2"
        >
          <span className="flex items-center gap-1.5">
            <Brain className="h-3.5 w-3.5 text-purple-400" />
            <span>Capabilities</span>
          </span>
          {capabilitiesExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
        </button>

        {capabilitiesExpanded && (
          <div className="space-y-1.5">
            {capabilitiesList.map((c) => {
              const isSelected = filters.capabilities.includes(c.id);
              return (
                <button
                  key={c.id}
                  onClick={() => toggleCapability(c.id)}
                  className={`w-full flex items-center gap-2 rounded-lg px-2.5 py-1 text-xs transition-colors text-left ${
                    isSelected
                      ? "bg-purple-500/15 text-purple-300 border border-purple-500/30"
                      : "text-slate-400 hover:bg-white/[0.03] hover:text-white"
                  }`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${isSelected ? "bg-purple-400" : "bg-slate-600"}`} />
                  <span>{c.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Max Input Price Slider */}
      <div className="border-t border-border/60 pt-4">
        <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-slate-300 mb-2">
          <span>Max Input Price</span>
          <span className="font-mono text-cyan-300">
            {filters.maxInputPrice > 0 ? formatCurrency(filters.maxInputPrice) : "Any"}
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="15"
          step="0.5"
          value={filters.maxInputPrice}
          onChange={(e) => setMaxInputPrice(parseFloat(e.target.value))}
          className="w-full accent-cyan-400 cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
          <span>$0 (Free)</span>
          <span>$15/1M</span>
        </div>
      </div>

      {/* Min Context Window */}
      <div className="border-t border-border/60 pt-4">
        <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-slate-300 mb-2">
          <span>Min Context Window</span>
          <span className="font-mono text-cyan-300">
            {filters.minContextWindow > 0 ? formatTokens(filters.minContextWindow) : "Any"}
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="2000000"
          step="64000"
          value={filters.minContextWindow}
          onChange={(e) => setMinContextWindow(parseInt(e.target.value, 10))}
          className="w-full accent-indigo-400 cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
          <span>0</span>
          <span>1M</span>
          <span>2M</span>
        </div>
      </div>
    </aside>
  );
}
