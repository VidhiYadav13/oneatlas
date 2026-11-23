import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CompareTray from "@/components/CompareTray";
import CommandPalette from "@/components/CommandPalette";
import PlaygroundModal from "@/components/PlaygroundModal";

export const metadata: Metadata = {
  title: "OneAtlas — AI Model Discovery & Intelligence Platform",
  description:
    "Discover, evaluate, compare, and benchmark frontier AI models across global providers. Inspired by OpenRouter, RouterPlus, and LiteLLM.",
  keywords: [
    "AI models",
    "OpenRouter",
    "LiteLLM",
    "LLM comparison",
    "Chatbot Arena Elo",
    "MMLU",
    "AI model pricing",
    "Anthropic",
    "OpenAI",
    "DeepSeek",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="min-h-screen bg-[#07090e] text-slate-100 antialiased selection:bg-indigo-500/30 selection:text-cyan-300">
        <div className="relative min-h-screen flex flex-col bg-grid-pattern">
          {/* Subtle ambient lighting */}
          <div className="pointer-events-none fixed inset-0 z-0 bg-radial-gradient opacity-70" />

          <Navbar />

          <main className="relative z-10 flex-1">
            {children}
          </main>

          <CompareTray />
          <CommandPalette />
          <PlaygroundModal />

          <Footer />
        </div>
      </body>
    </html>
  );
}
