
import { getWallboardConfig } from "@/config";
import { fetchWallboardData } from "@/lib/api-client";
import { startOfToday } from "@/lib/query-helpers";
import { NextRequest, NextResponse } from "next/server";

interface Root {
  data: Data
}

interface Data {
  agentSession: AgentSession
}

interface AgentSession {
  agentSessions: AgentActivity[];
}

interface AgentActivity {
  agentId: string
  agentName: string
  state: string
  channelInfo: ChannelInfo[]
}

interface ChannelInfo {
  currentState: string
  lastActivityTime: number
  idleCodeName: string
}

const plannet21Config = getWallboardConfig("plannet21");
const plannet21TeamIds = plannet21Config?.teams.map(t => t.id) ?? [];

const teamFilters = plannet21TeamIds.map(id => `{ teamId: { equals: "${id}" } }`).join(", ");
const query = `query AgentTasks($from: Long!, $to: Long!) {
  agentSession(
    from: $from
    to: $to
    filter: {
      and: [
        { or: [${teamFilters}] },
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

    if (!plannet21Config) {
      return NextResponse.json(
        { error: "Wallboard data not available" },
        { status: 400 }
      );
    }

    const now = Date.now();
    const { data } = await fetchWallboardData<Root>(query, "conscia-agent-activity", { from: startOfToday(), to: now }, 1000);

    const agentSessions = data.agentSession.agentSessions;

    const sortedSessions = agentSessions.sort((a, b) => {
      const timeA = a.channelInfo[0]?.lastActivityTime ?? 0;
      const timeB = b.channelInfo[0]?.lastActivityTime ?? 0;

      return timeB - timeA;
    });

    return NextResponse.json({ agentSessions: sortedSessions, timestamp: Date.now() });

  } catch (err) {
    console.error("Error fetching overview:", err);
    return NextResponse.json(
      { error: "Failed to fetch overview" },
      { status: 500 }
    );
  }
}
