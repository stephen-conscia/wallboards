
import { Threshold, getWallboardConfig, METRICS, GLOBAL_THRESHOLDS } from "@/config";
import { fetchWallboardData } from "@/lib/api-client";
import { NextRequest, NextResponse } from "next/server";

const query = `query AgentTasks($from: Long!, $to: Long!, $teamIds: [String!]) {
  agentSessionAvailable: agentSession(
    from: $from
    to: $to
    filter: {
      and: [
        { or: $teamIdsVar },
        { isActive: { equals: true } },
        { channelInfo: { channelType: { equals: "telephony" } } }
      ]
    }
  ) {
    agentSessions {
      agentId
      agentName
      state
      channelInfo {
        currentState
        lastActivityTime
        idleCodeName
      }
    }
  }
}
`;
export async function GET(request: NextRequest) {
  try {



  } catch (err) {
    console.error("Error fetching overview:", err);
    return NextResponse.json(
      { error: "Failed to fetch overview" },
      { status: 500 }
    );
  }
}
