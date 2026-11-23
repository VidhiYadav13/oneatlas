"use client";

import React, { useState } from "react";
import { Check, Copy, Terminal, Code2 } from "lucide-react";

interface CodeSnippetViewerProps {
  modelSlug: string;
  modelName: string;
}

export default function CodeSnippetViewer({ modelSlug, modelName }: CodeSnippetViewerProps) {
  const [activeTab, setActiveTab] = useState<"curl" | "litellm" | "python" | "node" | "ai-sdk">("litellm");
  const [copied, setCopied] = useState(false);

  const snippets = {
    litellm: `# Pip install litellm
from litellm import completion

response = completion(
    model="oneatlas/${modelSlug}",
    messages=[
        {"role": "system", "content": "You are a helpful AI assistant."},
        {"role": "user", "content": "Explain quantum computing in 2 sentences."}
    ],
    api_key="oa-live-****************************",
    api_base="https://oneatlas.dev/v1"
)

print(response.choices[0].message.content)`,

    curl: `curl https://oneatlas.dev/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer oa-live-****************************" \\
  -d '{
    "model": "oneatlas/${modelSlug}",
    "messages": [
      {"role": "user", "content": "Hello, ${modelName}!"}
    ],
    "stream": false
  }'`,

    python: `# OpenAI Python SDK compatible endpoint
from openai import OpenAI

client = OpenAI(
    base_url="https://oneatlas.dev/v1",
    api_key="oa-live-****************************"
)

completion = client.chat.completions.create(
    model="oneatlas/${modelSlug}",
    messages=[
        {"role": "user", "content": "Write a quick Rust web server using Axum."}
    ]
)

print(completion.choices[0].message.content)`,

    node: `// OpenAI Node SDK
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://oneatlas.dev/v1",
  apiKey: "oa-live-****************************",
});

async function main() {
  const response = await openai.chat.completions.create({
    model: "oneatlas/${modelSlug}",
    messages: [{ role: "user", content: "Optimize this PostgreSQL query." }],
    temperature: 0.7,
  });

  console.log(response.choices[0].message.content);
}

main();`,

    "ai-sdk": `// Vercel AI SDK
import { createOpenAI } from "@ai-sdk/openai";
import { generateText } from "ai";

const oneatlas = createOpenAI({
  baseURL: "https://oneatlas.dev/v1",
  apiKey: process.env.ONEATLAS_API_KEY,
});

export async function POST(req: Request) {
  const { text } = await generateText({
    model: oneatlas("oneatlas/${modelSlug}"),
    prompt: "Generate a Next.js 14 server action.",
  });

  return Response.json({ text });
}`,
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(snippets[activeTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tabs = [
    { id: "litellm", label: "LiteLLM" },
    { id: "curl", label: "cURL" },
    { id: "python", label: "Python SDK" },
    { id: "node", label: "Node.js SDK" },
    { id: "ai-sdk", label: "Vercel AI SDK" },
  ] as const;

  return (
    <div className="rounded-2xl border border-border bg-[#090d16] overflow-hidden shadow-xl">
      {/* Tabs Header */}
      <div className="flex items-center justify-between border-b border-border/80 px-4 py-2.5 bg-surface/80">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-indigo-600/30 text-cyan-300 border border-indigo-500/40"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Copy Button */}
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded-lg border border-border bg-surface px-2.5 py-1 text-xs text-slate-300 hover:text-white hover:border-slate-600 transition-all ml-2 flex-shrink-0"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-medium">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code Area */}
      <div className="p-4 overflow-x-auto font-mono text-xs text-slate-200 leading-relaxed bg-[#06080e]">
        <pre>
          <code>{snippets[activeTab]}</code>
        </pre>
      </div>
    </div>
  );
}
