import { getWallboardConfig } from "@/config";
import { fetchWallboardData } from "@/lib/api-client";
import { Aggregation, parseAggregations, startOfToday } from "@/lib/query-helpers";
import { NextRequest, NextResponse } from "next/server";


export interface TaskLegDetails {
  taskLegs: Array<{
    aggregation: Aggregation[];
  }>;
}

export interface TaskDetails {
  tasks: Array<{
    aggregation: Aggregation[];
  }>;
}

export interface AgentSessionDetails {
  agentSessions: Array<{
    aggregation: Aggregation[];
  }>;
}

// Generic, dynamic response shape
export type DynamicWallboardResponse = {
  [key: string]: TaskLegDetails | TaskDetails | AgentSessionDetails;
};

export async function GET(request: NextRequest) {
  try {
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

    const teamIds = wallboardData.teams?.map(config => config.id) ?? [];
    const queueIds = wallboardData.teams?.map(config => config.id) ?? [];

    const q = getQuery(teamParam, teamIds, queueIds);
    const query = `query Summary($to: Long!) { ${q} }`;

    const { data } = await fetchWallboardData<DynamicWallboardResponse>(
      query,
      url.pathname + url.search,
      { to: Date.now() }
    );

    const prefix = teamParam; // Example: "lnp"

    // @ts-ignore
    const taskLegs = (data[`${prefix}TaskLegDetails`] as TaskLegDetails).taskLegs;
    // @ts-ignore
    const tasks = (data[`${prefix}TaskDetails`] as TaskDetails).tasks;
    // @ts-ignore
    const agentSessions = (data[`${prefix}AgentSession`] as AgentSessionDetails).agentSessions;

    const taskLegStats = parseAggregations(taskLegs[0].aggregation);
    const taskStats = parseAggregations(tasks[0].aggregation);
    const agentStats = parseAggregations(agentSessions[0].aggregation);

    return NextResponse.json({ items: [...taskStats, ...agentStats, ...taskLegStats], timestamp: Date.now() });

  } catch (err) {
    console.error("Error fetching overview:", err);
    return NextResponse.json(
      { error: "Failed to fetch overview" },
      { status: 500 }
    );
  }
}

function getQuery(teamPrefix: string, teamIds: string[], queueIds: string[]) {
  const fromTime = startOfToday();

  return `
${teamPrefix}TaskLegDetails: taskLegDetails(
  from: ${fromTime}
  to: $to
  filter: {
    and: [
      { channelType:{ equals: telephony } },
      { isActive:{ equals: true } },
      { or: [ ${queueIds.map(id => `{ queue: {id: { equals: "${id}" } } }`).join(",")} ] }
    ]
  }
  aggregations: [
    {
      field: "id"
      type: count
      name: "callsInQueue"
      filter: { status: { equals: "parked" } }
    },
    {
      field: "createdTime"
      type: min
      name: "longestWaitTimeSeconds"
      filter: { status: { equals: "parked" } }
    }
  ]
) {
  taskLegs {
    aggregation {
      name
      value
    }
  }
}

${teamPrefix}TaskDetails: taskDetails(
  from: ${fromTime}
  to: $to
  filter: { 
    and: [
      { channelType: { equals: telephony } }
      { direction: { equals: "inbound" } }
      { isActive: { equals: false } }
      { or: [ ${queueIds.map(id => `{ lastQueue: { equals: { id: "${id}"} } }`).join(",")} ] }
    ]
  }
  aggregations: [
    {
      field: "id"
      type: count
      name: "Calls Offered"
    },
    {
      field: "connectedCount"
      type: count 
      name: "Answered"
    },
  ]
) {
  tasks {
    aggregation {
      name
      value
    }
  }
}

${teamPrefix}AgentSession: agentSession(
  from: ${fromTime}
  to: $to
  filter: {
    and: [
      { isActive: { equals: true } }
      { channelInfo: { channelType: { equals: "telephony" } } }
      { or: [ ${teamIds.map(id => `{ teamId: { equals: "${id}" } }`).join(",")} ] }
    ]
  }
  aggregations: [
    {
      field: "id"
      type: count
      name: "available"
      filter: { channelInfo: { currentState: { equals: available } } }
    },
    {
      field: "id"
      type: count
      name: "idle"
      filter: { channelInfo: { currentState: { equals: idle } } }
    }
  ]
) {
  agentSessions {
    aggregation {
      name
      value
    }
  }
}
`;
}
