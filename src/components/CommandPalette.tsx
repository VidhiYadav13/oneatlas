"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Sparkles,
  Building2,
  Server,
  GitCompare,
  Trophy,
  Calculator,
  Terminal,
  ArrowRight,
  X,
} from "lucide-react";
import { useStore } from "@/lib/store/useStore";
import { models, labs, providers } from "@/lib/data/mockData";

export default function CommandPalette() {
  const router = useRouter();
  const isOpen = useStore((s) => s.commandPaletteOpen);
  const setIsOpen = useStore((s) => s.setCommandPaletteOpen);
  const openPlayground = useStore((s) => s.openPlayground);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut listener for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(!isOpen);
      } else if (e.key === "Escape" && isOpen) {
        e.preventDefault();
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, setIsOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Compute filtered items
  const cleanQ = query.toLowerCase().trim();

  const matchingModels = models
    .filter(
      (m) =>
        m.name.toLowerCase().includes(cleanQ) ||
        m.slug.toLowerCase().includes(cleanQ) ||
        m.lab.name.toLowerCase().includes(cleanQ) ||
        m.type.toLowerCase().includes(cleanQ)
    )
    .slice(0, 5);

  const matchingLabs = labs
    .filter((l) => l.name.toLowerCase().includes(cleanQ) || l.slug.toLowerCase().includes(cleanQ))
    .slice(0, 3);

  const matchingProviders = providers
    .filter((p) => p.name.toLowerCase().includes(cleanQ) || p.slug.toLowerCase().includes(cleanQ))
    .slice(0, 3);

  const quickPages = [
    { title: "Model Comparison Matrix", href: "/compare", icon: GitCompare, category: "Navigation" },
    { title: "Chatbot Arena & MMLU Leaderboard", href: "/rankings", icon: Trophy, category: "Navigation" },
    { title: "Token Cost & Savings Calculator", href: "/calculator", icon: Calculator, category: "Tool" },
  ].filter((p) => p.title.toLowerCase().includes(cleanQ));

  const allItems: Array<{
    id: string;
    title: string;
    subtitle: string;
    category: string;
    action: () => void;
    icon: React.ElementType;
  }> = [];

  matchingModels.forEach((m) => {
    allItems.push({
      id: `model-${m.id}`,
      title: m.name,
      subtitle: `${m.lab.name} • ${m.type} • $${m.inputPricePerM}/1M in`,
      category: "AI Models",
      action: () => {
        setIsOpen(false);
        router.push(`/models/${m.slug}`);
      },
      icon: Sparkles,
    });
  });

  matchingLabs.forEach((l) => {
    allItems.push({
      id: `lab-${l.id}`,
      title: l.name,
      subtitle: `${l.totalModelsCount} models cataloged • ${l.headquarters}`,
      category: "AI Labs",
      action: () => {
        setIsOpen(false);
        router.push(`/labs/${l.slug}`);
      },
      icon: Building2,
    });
  });

  matchingProviders.forEach((p) => {
    allItems.push({
      id: `prov-${p.id}`,
      title: p.name,
      subtitle: `${p.uptimePercent}% uptime • ${p.avgLatencyMs}ms avg latency`,
      category: "Inference Providers",
      action: () => {
        setIsOpen(false);
        router.push(`/providers/${p.slug}`);
      },
      icon: Server,
    });
  });

  quickPages.forEach((p) => {
    allItems.push({
      id: `page-${p.href}`,
      title: p.title,
      subtitle: "Jump directly to page",
      category: p.category,
      action: () => {
        setIsOpen(false);
        router.push(p.href);
      },
      icon: p.icon,
    });
  });

  // Handle arrow keys
  const handleKeyDownList = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, allItems.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + allItems.length) % Math.max(1, allItems.length));
    } else if (e.key === "Enter" && allItems[selectedIndex]) {
      e.preventDefault();
      allItems[selectedIndex].action();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 sm:px-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/75 backdrop-blur-md"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="relative w-full max-w-2xl rounded-2xl border border-border bg-[#0b0e17] shadow-2xl shadow-indigo-500/10 overflow-hidden z-10"
          >
            {/* Search Input Bar */}
            <div className="flex items-center border-b border-border/80 px-4 py-3.5 bg-surface/40">
              <Search className="h-5 w-5 text-cyan-400 mr-3 flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                onKeyDown={handleKeyDownList}
                placeholder="Search models, labs, providers, benchmarks..."
                className="w-full bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="text-slate-400 hover:text-white mr-2"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              <kbd className="rounded bg-surface-card px-2 py-0.5 text-[10px] text-slate-400 border border-border">
                ESC
              </kbd>
            </div>

            {/* Results List */}
            <div className="max-h-96 overflow-y-auto p-2 space-y-1">
              {allItems.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400">
                  No matching models, labs, or providers found for &ldquo;{query}&rdquo;.
                </div>
              ) : (
                allItems.map((item, idx) => {
                  const Icon = item.icon;
                  const isSelected = idx === selectedIndex;

                  return (
                    <button
                      key={item.id}
                      onClick={item.action}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`w-full flex items-center justify-between rounded-xl px-3 py-2.5 text-left transition-all ${
                        isSelected
                          ? "bg-indigo-600/20 text-white border border-indigo-500/40"
                          : "text-slate-300 hover:bg-white/[0.04] border border-transparent"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg ${
                            isSelected ? "bg-indigo-500 text-white" : "bg-surface text-slate-400"
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="truncate">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-white truncate">
                              {item.title}
                            </span>
                            <span className="rounded bg-white/[0.05] px-1.5 py-0.2 text-[9px] text-slate-400">
                              {item.category}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 truncate">{item.subtitle}</p>
                        </div>
                      </div>
                      <ArrowRight
                        className={`h-4 w-4 flex-shrink-0 transition-transform ${
                          isSelected ? "text-cyan-400 translate-x-0.5" : "text-slate-400 opacity-0"
                        }`}
                      />
                    </button>
                  );
                })
              )}
            </div>

            {/* Bottom Keyboard Guide */}
            <div className="flex items-center justify-between border-t border-border/80 px-4 py-2.5 bg-surface/60 text-[11px] text-slate-400">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <kbd className="rounded bg-surface-card px-1 py-0.5 text-[9px] border border-border">↑</kbd>
                  <kbd className="rounded bg-surface-card px-1 py-0.5 text-[9px] border border-border">↓</kbd>
                  to navigate
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="rounded bg-surface-card px-1 py-0.5 text-[9px] border border-border">↵</kbd>
                  to select
                </span>
              </div>
              <button
                onClick={() => {
                  setIsOpen(false);
                  openPlayground("claude-3-7-sonnet");
                }}
                className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-medium"
              >
                <Terminal className="h-3 w-3" />
                <span>Launch Interactive Playground</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
