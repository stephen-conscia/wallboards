import { getWallboardConfig } from "@/config";
import { fetchWallboardData } from "@/lib/api-client";
import { NextRequest, NextResponse } from "next/server";


export async function GET(request: NextRequest) {
  try {
    // Read query parameters
    console.log(request.url);
    const url = new URL(request.url);
    const teamParam = url.searchParams.get("team");

    if (!teamParam) {
      return NextResponse.json(
        { error: "Missing 'team' query parameter" },
        { status: 400 }
      );
    }

    const wallboardData = getWallboardConfig(teamParam);
    if (!wallboardData) {
      return NextResponse.json(
        { error: "Wallboard data not available for " + teamParam },
        { status: 400 }
      );
    }

    return NextResponse.json({ team: teamParam });
  } catch (err) {
    console.error("Error fetching overview:", err);
    return NextResponse.json(
      { error: "Failed to fetch overview" },
      { status: 500 }
    );
  }
}
