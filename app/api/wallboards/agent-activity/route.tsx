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

export async function GET(request: NextRequest) {
  try {
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

    const teamIds = wallboardData.teams.map(config => config.id) ?? [];
    const skillIds = wallboardData.skills;

    const query = getQuery(teamIds, skillIds);

    const { data, timestamp } = await fetchWallboardData<Root>(
      query,
      url.pathname + url.search,
      { from: startOfToday(), to: Date.now() }
    );

    const agentSessions = data.agentSession.agentSessions;

    const sorted = agentSessions.sort((a, b) => {
      const timeA = a.channelInfo[0]?.lastActivityTime ?? 0;
      const timeB = b.channelInfo[0]?.lastActivityTime ?? 0;

      return timeA - timeB;
    });

    const firstTenElements = sorted.slice(0, 10);

    return NextResponse.json({ agentSessions: firstTenElements, timestamp });

  } catch (err) {
    console.error("Error fetching overview:", err);
    return NextResponse.json(
      { error: "Failed to fetch overview" },
      { status: 500 }
    );
  }
}

function getQuery(teamIds: string[], skillList: string[]) {
  return `
query AgentTasks($from: Long!, $to: Long!) {
  agentSession(
    from: $from
    to: $to
    filter: {
      and: [
        { or: [ ${teamIds.map(id => `{ teamId: { equals: "${id}" } }`)} ] }
        { or: [ ${skillList.map(skillName => `{ agentSkills: { name: { equals: "${skillName}" } intVal: { gt: 0 } } }`)} ] }
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
}

