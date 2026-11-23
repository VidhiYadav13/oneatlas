import { NextRequest, NextResponse } from "next/server";
import { DataService } from "@/lib/data/db";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    const result = DataService.getLabBySlug(slug);

    if (!result) {
      return NextResponse.json(
        { success: false, error: "Lab not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("API Error in /api/labs/[slug]:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
