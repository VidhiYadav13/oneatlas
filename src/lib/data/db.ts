import { models, labs, providers, benchmarkMetrics } from "./mockData";
import { Model, Lab, Provider, FilterState, LeaderboardEntry } from "../types";

export class DataService {
  /**
   * Search, filter, and sort models
   */
  static getModels(filters?: Partial<FilterState>): {
    models: Model[];
    total: number;
    facets: {
      labs: { id: string; name: string; count: number }[];
      providers: { id: string; name: string; count: number }[];
      categories: { id: string; name: string; count: number }[];
      modalities: { id: string; count: number }[];
      capabilities: { id: string; count: number }[];
      maxPrice: number;
      maxContext: number;
    };
  } {
    let result = [...models];

    // Search query filter
    if (filters?.search && filters.search.trim() !== "") {
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

    // Lab filter
    if (filters?.labs && filters.labs.length > 0) {
      result = result.filter((m) =>
        filters.labs!.includes(m.lab.slug) || filters.labs!.includes(m.labId)
      );
    }

    // Provider filter
    if (filters?.providers && filters.providers.length > 0) {
      result = result.filter((m) =>
        m.providers.some((p) => filters.providers!.includes(p.providerSlug))
      );
    }

    // Category filter
    if (filters?.category && filters.category !== "all") {
      result = result.filter((m) => m.type === filters.category);
    }

    // Modalities filter
    if (filters?.modalities && filters.modalities.length > 0) {
      result = result.filter((m) =>
        filters.modalities!.every((mod) => m.modalities.includes(mod))
      );
    }

    // Capabilities filter
    if (filters?.capabilities && filters.capabilities.length > 0) {
      result = result.filter((m) =>
        filters.capabilities!.every((cap) => m.capabilities.includes(cap))
      );
    }

    // Open Weights filter
    if (filters?.isOpenWeightsOnly) {
      result = result.filter((m) => m.isOpenWeights);
    }
    if (filters?.isProprietaryOnly) {
      result = result.filter((m) => !m.isOpenWeights);
    }

    // Price filter
    if (filters?.maxInputPrice !== undefined && filters.maxInputPrice > 0) {
      result = result.filter((m) => m.inputPricePerM <= filters.maxInputPrice!);
    }

    // Min Context Window filter
    if (filters?.minContextWindow !== undefined && filters.minContextWindow > 0) {
      result = result.filter((m) => m.contextWindow >= filters.minContextWindow!);
    }

    // Sorting
    const sortBy = filters?.sortBy || "trending";
    switch (sortBy) {
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

    // Facet calculations
    const labCounts: { [id: string]: number } = {};
    const providerCounts: { [id: string]: number } = {};
    const categoryCounts: { [id: string]: number } = {};
    let maxPrice = 0;
    let maxContext = 0;

    models.forEach((m) => {
      labCounts[m.lab.slug] = (labCounts[m.lab.slug] || 0) + 1;
      m.providers.forEach((p) => {
        providerCounts[p.providerSlug] = (providerCounts[p.providerSlug] || 0) + 1;
      });
      categoryCounts[m.type] = (categoryCounts[m.type] || 0) + 1;
      if (m.inputPricePerM > maxPrice) maxPrice = m.inputPricePerM;
      if (m.contextWindow > maxContext) maxContext = m.contextWindow;
    });

    const facets = {
      labs: labs.map((l) => ({ id: l.slug, name: l.name, count: labCounts[l.slug] || 0 })),
      providers: providers.map((p) => ({
        id: p.slug,
        name: p.name,
        count: providerCounts[p.slug] || 0,
      })),
      categories: [
        { id: "all", name: "All Models", count: models.length },
        { id: "multimodal", name: "Multimodal", count: categoryCounts["multimodal"] || 0 },
        { id: "reasoning", name: "Reasoning", count: categoryCounts["reasoning"] || 0 },
        { id: "text-only", name: "Text Only", count: categoryCounts["text-only"] || 0 },
        { id: "code", name: "Code Specialized", count: categoryCounts["code"] || 0 },
      ],
      modalities: [
        { id: "text", count: models.filter((m) => m.modalities.includes("text")).length },
        { id: "vision", count: models.filter((m) => m.modalities.includes("vision")).length },
        { id: "code", count: models.filter((m) => m.modalities.includes("code")).length },
        { id: "audio", count: models.filter((m) => m.modalities.includes("audio")).length },
      ],
      capabilities: [
        { id: "reasoning", count: models.filter((m) => m.capabilities.includes("reasoning")).length },
        { id: "tool_use", count: models.filter((m) => m.capabilities.includes("tool_use")).length },
        { id: "function_calling", count: models.filter((m) => m.capabilities.includes("function_calling")).length },
        { id: "structured_output", count: models.filter((m) => m.capabilities.includes("structured_output")).length },
        { id: "long_context", count: models.filter((m) => m.capabilities.includes("long_context")).length },
        { id: "web_search", count: models.filter((m) => m.capabilities.includes("web_search")).length },
      ],
      maxPrice: Math.ceil(maxPrice),
      maxContext,
    };

    return {
      models: result,
      total: result.length,
      facets,
    };
  }

  static getModelBySlug(slug: string): Model | null {
    return models.find((m) => m.slug === slug || m.id === slug) || null;
  }

  static getLabs(): Lab[] {
    return labs.map((l) => ({
      ...l,
      totalModelsCount: models.filter((m) => m.labId === l.id || m.lab.slug === l.slug).length,
    }));
  }

  static getLabBySlug(slug: string): { lab: Lab; models: Model[] } | null {
    const lab = labs.find((l) => l.slug === slug || l.id === slug);
    if (!lab) return null;
    const labModels = models.filter((m) => m.labId === lab.id || m.lab.slug === lab.slug);
    return {
      lab: {
        ...lab,
        totalModelsCount: labModels.length,
      },
      models: labModels,
    };
  }

  static getProviders(): Provider[] {
    return providers;
  }

  static getProviderBySlug(slug: string): { provider: Provider; models: Model[] } | null {
    const provider = providers.find((p) => p.slug === slug || p.id === slug);
    if (!provider) return null;
    const providerModels = models.filter((m) =>
      m.providers.some((p) => p.providerSlug === provider.slug || p.providerId === provider.id)
    );
    return {
      provider,
      models: providerModels,
    };
  }

  static getLeaderboard(metric: string = "arena_elo"): LeaderboardEntry[] {
    const sorted = [...models];

    switch (metric) {
      case "swe_bench":
        sorted.sort((a, b) => (b.sweBenchScore || 0) - (a.sweBenchScore || 0));
        break;
      case "human_eval":
        sorted.sort((a, b) => b.humanEvalScore - a.humanEvalScore);
        break;
      case "mmlu_pro":
        sorted.sort((a, b) => b.mmluScore - a.mmluScore);
        break;
      case "math_500":
        sorted.sort((a, b) => (b.mathScore || 0) - (a.mathScore || 0));
        break;
      case "cost_efficiency":
        // Arena Elo divided by blended token price (input + output / 2)
        sorted.sort((a, b) => {
          const costA = (a.inputPricePerM + a.outputPricePerM) / 2 || 0.1;
          const costB = (b.inputPricePerM + b.outputPricePerM) / 2 || 0.1;
          return b.arenaElo / costB - a.arenaElo / costA;
        });
        break;
      case "arena_elo":
      default:
        sorted.sort((a, b) => b.arenaElo - a.arenaElo);
        break;
    }

    return sorted.map((model, idx) => {
      let score = model.arenaElo;
      if (metric === "swe_bench") score = model.sweBenchScore || 0;
      else if (metric === "human_eval") score = model.humanEvalScore;
      else if (metric === "mmlu_pro") score = model.mmluScore;
      else if (metric === "math_500") score = model.mathScore || 0;
      else if (metric === "cost_efficiency") {
        const cost = (model.inputPricePerM + model.outputPricePerM) / 2 || 0.1;
        score = Math.round((model.arenaElo / cost) * 10) / 10;
      }

      const cost = (model.inputPricePerM + model.outputPricePerM) / 2 || 0.1;
      const costEfficiencyRatio = Math.round((model.arenaElo / cost) * 10) / 10;

      return {
        rank: idx + 1,
        model,
        score,
        metric,
        costEfficiencyRatio,
        delta: idx % 3 === 0 ? 1 : idx % 5 === 0 ? -1 : 0,
      };
    });
  }

  static compareModels(slugs: string[]): Model[] {
    return slugs
      .map((slug) => models.find((m) => m.slug === slug || m.id === slug))
      .filter((m): m is Model => m !== undefined);
  }
}
