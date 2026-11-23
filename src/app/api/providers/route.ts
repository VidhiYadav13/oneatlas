import { NextResponse } from "next/server";
import { DataService } from "@/lib/data/db";

export async function GET() {
  try {
    const providers = DataService.getProviders();
    return NextResponse.json({
      success: true,
      data: providers,
    });
  } catch (error) {
    console.error("API Error in /api/providers:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch providers" },
      { status: 500 }
    );
  }
}
