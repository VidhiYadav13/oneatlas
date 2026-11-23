import { NextResponse } from "next/server";
import { DataService } from "@/lib/data/db";

export async function GET() {
  try {
    const labs = DataService.getLabs();
    return NextResponse.json({
      success: true,
      data: labs,
    });
  } catch (error) {
    console.error("API Error in /api/labs:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch labs" },
      { status: 500 }
    );
  }
}
