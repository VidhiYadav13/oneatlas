import { NextRequest, NextResponse } from "next/server";
import { DataService } from "@/lib/data/db";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const modelsParam = searchParams.get("models");

    if (!modelsParam) {
      return NextResponse.json({
        success: true,
        data: [],
      });
    }

    const slugs = modelsParam.split(",").map((s) => s.trim()).filter(Boolean);
    const models = DataService.compareModels(slugs);

    // Compute winners / highlights across compared models
    const bestPrice = models.length > 0 ? Math.min(...models.map((m) => m.inputPricePerM)) : 0;
    const maxContext = models.length > 0 ? Math.max(...models.map((m) => m.contextWindow)) : 0;
    const maxElo = models.length > 0 ? Math.max(...models.map((m) => m.arenaElo)) : 0;
    const maxMmlu = models.length > 0 ? Math.max(...models.map((m) => m.mmluScore)) : 0;
    const maxHumanEval = models.length > 0 ? Math.max(...models.map((m) => m.humanEvalScore)) : 0;

    return NextResponse.json({
      success: true,
      data: {
        models,
        highlights: {
          bestPrice,
          maxContext,
          maxElo,
          maxMmlu,
          maxHumanEval,
        },
      },
    });
  } catch (error) {
    console.error("API Error in /api/compare:", error);
    return NextResponse.json(
      { success: false, error: "Failed to compare models" },
      { status: 500 }
    );
  }
}
