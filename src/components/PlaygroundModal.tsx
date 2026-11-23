"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Terminal,
  X,
  Play,
  RotateCcw,
  Sparkles,
  Zap,
  Activity,
  DollarSign,
  Copy,
  Check,
} from "lucide-react";
import { useStore } from "@/lib/store/useStore";
import { models } from "@/lib/data/mockData";
import { formatCurrency } from "@/lib/utils";

export default function PlaygroundModal() {
  const playgroundSlug = useStore((s) => s.playgroundSlug);
  const closePlayground = useStore((s) => s.closePlayground);

  const [selectedSlug, setSelectedSlug] = useState<string>("claude-3-7-sonnet");
  const [prompt, setPrompt] = useState(
    "Explain the architectural differences and latency trade-offs between Mixture-of-Experts (MoE) and dense transformers."
  );
  const [output, setOutput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [latencyMs, setLatencyMs] = useState(0);
  const [tokSec, setTokSec] = useState(0);
  const [tokenCount, setTokenCount] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (playgroundSlug) {
      setSelectedSlug(playgroundSlug);
      setOutput("");
    }
  }, [playgroundSlug]);

  if (!playgroundSlug) return null;

  const currentModel = models.find((m) => m.slug === selectedSlug) || models[0];

  const samplePrompts = [
    "Explain MoE vs Dense Transformers architecture and latency trade-offs.",
    "Write a production-grade TypeScript debounce hook with cancellation.",
    "Compare DeepSeek R1 and OpenAI o1 reasoning mechanics.",
  ];

  const simulatedResponses: { [slug: string]: string } = {
    "claude-3-7-sonnet": `Here is an architectural comparison between Mixture-of-Experts (MoE) and Dense Transformers:

1. Parameter Activation & Efficiency:
   - Dense Models (e.g. GPT-4o, Claude 3.5 Sonnet): Every single weight in the network is evaluated for every incoming token. While conceptually straightforward and compute-dense, scaling parameters linearly escalates FLOPs per token.
   - MoE Architectures (e.g. DeepSeek V3/R1, Mixtral): A routing/gating network activates only a sparse subset of expert feed-forward layers per token (e.g. 37B active out of 671B total parameters).

2. Memory Bandwidth vs Compute Bound:
   - Inference throughput is heavily bounded by High Bandwidth Memory (HBM) bandwidth. MoE demands significant VRAM capacity to hold all expert weights, but achieves much higher tokens/second during generation because it requires fewer matrix multiplications per token.

3. OneAtlas Benchmark Recommendation:
   - For ultra-low latency interactive agents: DeepSeek V3 / Groq LPU (150-400+ tok/s).
   - For mission-critical reasoning and zero-defect code synthesis: Claude 3.7 Sonnet / o1.`,
    default: `Generated response from ${currentModel.name} (${currentModel.lab.name}):

Model Specifications:
- Context Window: ${currentModel.contextWindow.toLocaleString()} tokens
- Architecture: ${currentModel.architecture}
- Input Pricing: $${currentModel.inputPricePerM} / 1M tokens
- Output Pricing: $${currentModel.outputPricePerM} / 1M tokens
- Evaluation Score: Arena Elo ${currentModel.arenaElo}

Inference verified successfully via OneAtlas unified routing protocol. All parameters within nominal latency thresholds.`,
  };

  const runSimulation = () => {
    if (isStreaming) return;
    setIsStreaming(true);
    setOutput("");

    const fullText = simulatedResponses[currentModel.slug] || simulatedResponses.default;
    const words = fullText.split(" ");
    let index = 0;
    const startTime = Date.now();

    const speedInterval = Math.max(15, Math.floor(1000 / currentModel.averageThroughputTokSec));

    const interval = setInterval(() => {
      if (index < words.length) {
        setOutput((prev) => (prev ? prev + " " + words[index] : words[index]));
        index++;
        setTokenCount(Math.round(index * 1.3));
        setLatencyMs(Date.now() - startTime);
        setTokSec(currentModel.averageThroughputTokSec);
      } else {
        clearInterval(interval);
        setIsStreaming(false);
      }
    }, speedInterval);
  };

  const copyOutput = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Estimated prompt & output cost
  const promptTokensEst = Math.round(prompt.length / 4);
  const estCost =
    (promptTokensEst / 1_000_000) * currentModel.inputPricePerM +
    (tokenCount / 1_000_000) * currentModel.outputPricePerM;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closePlayground}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-4xl rounded-2xl border border-indigo-500/40 bg-[#0a0d16] shadow-2xl shadow-cyan-950/40 overflow-hidden z-10 flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border/80 px-5 py-3.5 bg-surface/70">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400">
                <Terminal className="h-4 w-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white">Interactive Model Sandbox</h3>
                  <span className="rounded bg-indigo-500/10 px-2 py-0.5 text-[10px] text-indigo-400 border border-indigo-500/20">
                    Live Stream Sim
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Test prompt generation speed and output tokens in real-time.
                </p>
              </div>
            </div>

            <button
              onClick={closePlayground}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.04]"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Model Selector Bar */}
          <div className="flex items-center justify-between border-b border-border/60 px-5 py-2.5 bg-surface/40 overflow-x-auto gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Selected Model:</span>
              <select
                value={selectedSlug}
                onChange={(e) => {
                  setSelectedSlug(e.target.value);
                  setOutput("");
                }}
                className="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-white focus:outline-none focus:border-cyan-400"
              >
                {models.map((m) => (
                  <option key={m.id} value={m.slug} className="bg-[#0b0e17] text-white">
                    {m.name} ({m.lab.name}) - ${m.inputPricePerM}/${m.outputPricePerM}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span className="flex items-center gap-1 font-mono">
                <Zap className="h-3.5 w-3.5 text-cyan-400" />
                <span>{currentModel.averageThroughputTokSec} tok/s target</span>
              </span>
              <span className="hidden sm:inline">•</span>
              <span className="hidden sm:inline font-mono">
                P50 Latency: {currentModel.averageLatencyMs}ms
              </span>
            </div>
          </div>

          {/* Content Body: Split View Prompt & Stream */}
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border/60 flex-1 overflow-y-auto">
            {/* Prompt Input Column */}
            <div className="p-4 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
                    Prompt Input
                  </label>
                  <span className="text-[10px] text-slate-400 font-mono">
                    ~{promptTokensEst} tokens
                  </span>
                </div>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={8}
                  placeholder="Enter a prompt to test model inference..."
                  className="w-full rounded-xl border border-border bg-surface/80 p-3 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-400 resize-none font-mono"
                />
              </div>

              {/* Sample Prompts */}
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block mb-1.5">
                  Try Sample Prompts:
                </span>
                <div className="space-y-1">
                  {samplePrompts.map((sp, idx) => (
                    <button
                      key={idx}
                      onClick={() => setPrompt(sp)}
                      className="w-full text-left rounded-lg border border-border/40 bg-surface/40 p-1.5 text-[11px] text-slate-400 hover:text-white hover:border-slate-600 transition-colors truncate block"
                    >
                      {sp}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <button
                  onClick={runSimulation}
                  disabled={isStreaming || !prompt.trim()}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:scale-[1.01] transition-all disabled:opacity-50"
                >
                  <Play className="h-3.5 w-3.5 fill-current" />
                  <span>{isStreaming ? "Streaming Tokens..." : "Run Inference Simulation"}</span>
                </button>
              </div>
            </div>

            {/* Output Stream Column */}
            <div className="p-4 flex flex-col justify-between space-y-4 bg-[#07090f]">
              <div className="flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
                      Model Stream Output
                    </span>
                    {isStreaming && (
                      <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
                    )}
                  </div>
                  {output && (
                    <button
                      onClick={copyOutput}
                      className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-white"
                    >
                      {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                      <span>{copied ? "Copied" : "Copy Output"}</span>
                    </button>
                  )}
                </div>

                <div className="rounded-xl border border-border bg-[#05060b] p-3.5 text-xs text-slate-200 font-mono flex-1 overflow-y-auto min-h-[220px] whitespace-pre-wrap leading-relaxed">
                  {output ? (
                    <>
                      {output}
                      {isStreaming && <span className="inline-block w-1.5 h-3.5 bg-cyan-400 ml-1 animate-pulse" />}
                    </>
                  ) : (
                    <span className="text-slate-400 italic">
                      Click &ldquo;Run Inference Simulation&rdquo; to test live generation and telemetry metrics...
                    </span>
                  )}
                </div>
              </div>

              {/* Telemetry Bar */}
              <div className="rounded-xl border border-border/80 bg-surface/80 p-3 grid grid-cols-4 gap-2 text-center text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Tokens</span>
                  <strong className="text-white font-mono">{tokenCount}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Speed</span>
                  <strong className="text-emerald-400 font-mono">{tokSec} tok/s</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Latency</span>
                  <strong className="text-cyan-400 font-mono">{latencyMs}ms</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Cost</span>
                  <strong className="text-amber-400 font-mono">{formatCurrency(estCost)}</strong>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
