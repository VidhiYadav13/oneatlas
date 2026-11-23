import { NextRequest, NextResponse } from "next/server";
import { DataService } from "@/lib/data/db";
import { benchmarkMetrics } from "@/lib/data/mockData";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const metric = searchParams.get("metric") || "arena_elo";

    const leaderboard = DataService.getLeaderboard(metric);

    return NextResponse.json({
      success: true,
      data: {
        currentMetric: metric,
        availableMetrics: benchmarkMetrics,
        leaderboard,
      },
    });
  } catch (error) {
    console.error("API Error in /api/benchmarks:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch benchmarks" },
      { status: 500 }
    );
  }
}
