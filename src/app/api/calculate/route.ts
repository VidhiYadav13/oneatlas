import { NextRequest, NextResponse } from "next/server";
import { DataService } from "@/lib/data/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { monthlyPromptTokens = 1000000, monthlyCompletionTokens = 500000 } = body;

    const allModels = DataService.getModels().models;

    const calculations = allModels.map((model) => {
      const promptCost = (monthlyPromptTokens / 1_000_000) * model.inputPricePerM;
      const completionCost = (monthlyCompletionTokens / 1_000_000) * model.outputPricePerM;
      const totalCost = promptCost + completionCost;

      return {
        modelId: model.id,
        modelSlug: model.slug,
        modelName: model.name,
        labName: model.lab.name,
        inputPricePerM: model.inputPricePerM,
        outputPricePerM: model.outputPricePerM,
        promptCost: Math.round(promptCost * 100) / 100,
        completionCost: Math.round(completionCost * 100) / 100,
        totalCost: Math.round(totalCost * 100) / 100,
      };
    });

    calculations.sort((a, b) => a.totalCost - b.totalCost);

    return NextResponse.json({
      success: true,
      data: {
        monthlyPromptTokens,
        monthlyCompletionTokens,
        calculations,
      },
    });
  } catch (error) {
    console.error("API Error in /api/calculate:", error);
    return NextResponse.json(
      { success: false, error: "Calculation failed" },
      { status: 500 }
    );
  }
}
