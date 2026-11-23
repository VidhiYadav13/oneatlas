export type Modality = "text" | "vision" | "audio" | "code" | "embedding";

export type Capability = 
  | "reasoning" 
  | "tool_use" 
  | "function_calling" 
  | "json_mode" 
  | "system_prompt" 
  | "web_search" 
  | "code_execution" 
  | "long_context"
  | "structured_output";

export type ModelCategory = "all" | "multimodal" | "text-only" | "reasoning" | "code" | "embedding";

export interface Lab {
  id: string;
  slug: string;
  name: string;
  logo: string;
  description: string;
  website: string;
  headquarters: string;
  foundedYear: number;
  isVerified: boolean;
  totalModelsCount: number;
  highlightColor?: string;
}

export interface Provider {
  id: string;
  slug: string;
  name: string;
  logo: string;
  website: string;
  description: string;
  uptimePercent: number;
  avgLatencyMs: number;
  avgThroughputTokSec: number;
  status: "operational" | "degraded" | "maintenance";
  supportedProtocols: string[];
  compliance: string[];
  regions: string[];
}

export interface ModelProviderRate {
  providerId: string;
  providerName: string;
  providerSlug: string;
  providerLogo: string;
  inputPricePerM: number;
  outputPricePerM: number;
  latencyP50Ms: number;
  latencyP95Ms: number;
  throughputTokSec: number;
  isDefault: boolean;
  uptimePercent: number;
  contextLimit: number;
  status: "operational" | "degraded";
}

export interface BenchmarkScore {
  slug: string;
  name: string;
  score: number;
  maxScore: number;
  category: "Reasoning" | "Coding" | "General Knowledge" | "Math" | "Agents";
  rank?: number;
}

export interface Model {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  architecture: string;
  releaseDate: string;
  lab: Lab;
  labId: string;
  type: "multimodal" | "text-only" | "reasoning" | "code" | "embedding";
  license: string;
  isOpenWeights: boolean;
  isFeatured: boolean;
  isTrending: boolean;
  isNew: boolean;
  contextWindow: number;
  maxOutputTokens: number;
  inputPricePerM: number;
  outputPricePerM: number;
  cachedPricePerM?: number;
  batchDiscountPercent?: number;
  modalities: Modality[];
  capabilities: Capability[];
  providers: ModelProviderRate[];
  benchmarks: BenchmarkScore[];
  arenaElo: number;
  mmluScore: number;
  humanEvalScore: number;
  sweBenchScore?: number;
  mathScore?: number;
  weeklyRequestsCount: number;
  averageLatencyMs: number;
  averageThroughputTokSec: number;
}

export type SortOption = 
  | "trending"
  | "price_asc"
  | "price_desc"
  | "context_desc"
  | "arena_elo_desc"
  | "mmlu_desc"
  | "newest";

export interface FilterState {
  search: string;
  labs: string[];
  providers: string[];
  category: ModelCategory;
  modalities: Modality[];
  capabilities: Capability[];
  isOpenWeightsOnly: boolean;
  isProprietaryOnly: boolean;
  maxInputPrice: number;
  minContextWindow: number;
  sortBy: SortOption;
}

export interface LeaderboardEntry {
  rank: number;
  model: Model;
  score: number;
  metric: string;
  costEfficiencyRatio: number; // Elo per dollar
  delta: number; // rank change (+1, -2, 0)
}
