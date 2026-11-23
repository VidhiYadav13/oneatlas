import { NextRequest, NextResponse } from "next/server";
import { DataService } from "@/lib/data/db";
import { FilterState, Modality, Capability, ModelCategory, SortOption } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search") || undefined;
    const category = (searchParams.get("category") as ModelCategory) || "all";
    const sortBy = (searchParams.get("sortBy") as SortOption) || "trending";
    const labsParam = searchParams.get("labs");
    const providersParam = searchParams.get("providers");
    const modalitiesParam = searchParams.get("modalities");
    const capabilitiesParam = searchParams.get("capabilities");
    const maxPriceParam = searchParams.get("maxPrice");
    const minContextParam = searchParams.get("minContext");
    const openWeightsOnly = searchParams.get("openWeights") === "true";
    const proprietaryOnly = searchParams.get("proprietary") === "true";

    const filters: Partial<FilterState> = {
      search,
      category,
      sortBy,
      labs: labsParam ? labsParam.split(",").filter(Boolean) : [],
      providers: providersParam ? providersParam.split(",").filter(Boolean) : [],
      modalities: modalitiesParam ? (modalitiesParam.split(",").filter(Boolean) as Modality[]) : [],
      capabilities: capabilitiesParam ? (capabilitiesParam.split(",").filter(Boolean) as Capability[]) : [],
      maxInputPrice: maxPriceParam ? parseFloat(maxPriceParam) : undefined,
      minContextWindow: minContextParam ? parseInt(minContextParam, 10) : undefined,
      isOpenWeightsOnly: openWeightsOnly,
      isProprietaryOnly: proprietaryOnly,
    };

    const result = DataService.getModels(filters);

    return NextResponse.json({
      success: true,
      data: result.models,
      total: result.total,
      facets: result.facets,
    });
  } catch (error) {
    console.error("API Error in /api/models:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch models" },
      { status: 500 }
    );
  }
}
