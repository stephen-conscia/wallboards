import { fetchWallboardData } from "@/services/api-client";
import { NextRequest, NextResponse } from "next/server";

const now = Date.now();
// const today = new Date();
// today.setHours(0, 0, 0, 0);
const from = now - (80 * 60 * 60 * 1000);
const query = `
{
  taskDetails(
    from: ${from}
    to: ${now}
  ) {
    tasks {
      id # Scalar field
      isActive
      contactReason
      lastWrapUpCodeId
      lastWrapupCodeName
      isTranscriptionAvailable
      isRealtimeTranscriptionEnabled
      ivrScriptName
      channelType
      createdTime
      endedTime
      lastAgent {
        # Object / Composite field
        id # Scalar field
        name
        signInId
      }
    }
  }
}
`;

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

    const data = await fetchWallboardData(query, url.pathname + url.search);
    return NextResponse.json(data);
  } catch (err) {
    console.error("Error fetching overview:", err);
    return NextResponse.json(
      { error: "Failed to fetch overview" },
      { status: 500 }
    );
  }
}
