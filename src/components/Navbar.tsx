"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Compass,
  GitCompare,
  Trophy,
  Building2,
  Server,
  Calculator,
  Search,
  Terminal,
  Menu,
  X,
  Sparkles,
} from "lucide-react";
import { useStore } from "@/lib/store/useStore";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const compareSlugs = useStore((s) => s.compareSlugs);
  const setCommandPaletteOpen = useStore((s) => s.setCommandPaletteOpen);
  const openPlayground = useStore((s) => s.openPlayground);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: "Models", href: "/", icon: Compass },
    {
      name: "Compare",
      href: "/compare",
      icon: GitCompare,
      badge: compareSlugs.length > 0 ? compareSlugs.length : null,
    },
    { name: "Leaderboard", href: "/rankings", icon: Trophy },
    { name: "AI Labs", href: "/labs", icon: Building2 },
    { name: "Providers", href: "/providers", icon: Server },
    { name: "Calculator", href: "/calculator", icon: Calculator },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-[#07090e]/85 backdrop-blur-xl transition-all">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand / Logo */}
        <div className="flex items-center gap-8">
          <Link href="/" className="group flex items-center gap-3">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-purple-600 to-cyan-400 p-[1px] shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-all duration-300">
              <div className="flex h-full w-full items-center justify-center rounded-[11px] bg-[#07090e]">
                <Sparkles className="h-4 w-4 text-cyan-400 group-hover:rotate-12 transition-transform duration-300" />
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-base font-bold tracking-tight text-white group-hover:text-cyan-300 transition-colors">
                  OneAtlas
                </span>
                <span className="rounded bg-indigo-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-indigo-400 border border-indigo-500/20">
                  DEV
                </span>
              </div>
              <span className="text-[10px] text-slate-400 hidden sm:inline">
                Model Discovery & Intelligence
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`relative flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                    isActive
                      ? "text-cyan-300 bg-white/[0.06] shadow-sm"
                      : "text-slate-400 hover:text-slate-100 hover:bg-white/[0.03]"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{link.name}</span>
                  {link.badge !== null && (
                    <span className="ml-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-indigo-600 px-1 text-[10px] font-bold text-white">
                      {link.badge}
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute bottom-0 left-2 right-2 h-[2px] bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Action buttons */}
        <div className="flex items-center gap-2.5">
          {/* Quick Search (Cmd+K) button */}
          <button
            onClick={() => setCommandPaletteOpen(true)}
            className="flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs text-slate-400 hover:border-slate-600 hover:text-slate-200 transition-all shadow-inner"
            title="Search models, labs and providers (Ctrl+K)"
          >
            <Search className="h-3.5 w-3.5 text-slate-400" />
            <span className="hidden sm:inline">Search...</span>
            <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded bg-surface-card px-1.5 py-0.5 text-[10px] text-slate-400 border border-slate-700/50">
              ⌘K
            </kbd>
          </button>

          {/* Playground Quick Open */}
          <button
            onClick={() => openPlayground("claude-3-7-sonnet")}
            className="hidden sm:flex items-center gap-1.5 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-3 py-1.5 text-xs font-medium text-cyan-300 hover:bg-cyan-500/20 hover:border-cyan-500/50 transition-all"
          >
            <Terminal className="h-3.5 w-3.5" />
            <span>Playground</span>
          </button>

          {/* GitHub button */}
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-slate-400 hover:text-white hover:bg-white/[0.04] transition-all"
            title="GitHub Repository"
          >
            <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
          </a>

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex md:hidden h-8 w-8 items-center justify-center rounded-lg border border-border text-slate-400 hover:text-white"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border bg-[#0a0d15] px-4 py-4 space-y-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium ${
                  isActive
                    ? "bg-indigo-600/20 text-cyan-300 border border-indigo-500/30"
                    : "text-slate-400 hover:bg-white/[0.04] hover:text-white"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="h-4 w-4" />
                  <span>{link.name}</span>
                </div>
                {link.badge !== null && (
                  <span className="rounded-full bg-indigo-600 px-2 py-0.5 text-xs font-semibold text-white">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
          <div className="pt-2 border-t border-border/60">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openPlayground("claude-3-7-sonnet");
              }}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 py-2 text-sm font-medium text-cyan-300"
            >
              <Terminal className="h-4 w-4" />
              <span>Launch Playground</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
