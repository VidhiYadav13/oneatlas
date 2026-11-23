import { NextRequest, NextResponse } from "next/server";
import { DataService } from "@/lib/data/db";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    const model = DataService.getModelBySlug(slug);

    if (!model) {
      return NextResponse.json(
        { success: false, error: "Model not found" },
        { status: 404 }
      );
    }

    // Get related models from the same lab or category
    const allModels = DataService.getModels().models;
    const relatedModels = allModels
      .filter((m) => m.id !== model.id && (m.labId === model.labId || m.type === model.type))
      .slice(0, 4);

    return NextResponse.json({
      success: true,
      data: {
        model,
        relatedModels,
      },
    });
  } catch (error) {
    console.error("API Error in /api/models/[slug]:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
