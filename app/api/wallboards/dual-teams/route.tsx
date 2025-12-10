import { getWallboardConfig, WallboardConfig } from "@/config";
import { fetchWallboardData } from "@/lib/api-client";
import { Aggregation, parseAggregations, startOfToday } from "@/lib/query-helpers";
import { NextRequest, NextResponse } from "next/server";

/**
 * Types for GraphQL response
 */
interface Root {
  data: QueryResults;
}

interface QueryResults {
  AAgentStateData?: AgentStateData;
  AQueueStateData?: QueueStateData;
  BAgentStateData?: AgentStateData;
  BQueueStateData?: QueueStateData;
}

interface AgentStateData {
  agentSessions: AgentSession[];
}

interface AgentSession {
  aggregation: Aggregation[];
}

interface QueueStateData {
  taskLegs: TaskLeg[];
}

interface TaskLeg {
  aggregation: Aggregation[];
}

/**
 * Main handler
 */
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const teams = url.searchParams.getAll("team"); // get all ?team= values

    // Validate exactly 2 teams
    if (teams.length !== 2) {
      return NextResponse.json(
        { error: "You must provide exactly 2 'team' query parameters" },
        { status: 400 }
      );
    }

    const wallboardData: WallboardConfig[] = [];
    for (let i = 0; i < teams.length; i++) {
      wallboardData[i] = getWallboardConfig(teams[i]);
      if (!wallboardData[i]) {
        return NextResponse.json(
          { error: "Wallboard data not available for " + teams[i] },
          { status: 400 }
        );
      }
    }

    const query = `
      query Overview($to: Long!) {
        ${generateAgentQuery("A", wallboardData[0].teams.map(config => config.id) ?? [])},
        ${generateQueueQuery("A", wallboardData[0].queues.map(config => config.id) ?? [])},
        ${generateAgentQuery("B", wallboardData[1].teams.map(config => config.id) ?? [])},
        ${generateQueueQuery("B", wallboardData[1].queues.map(config => config.id) ?? [])} 
  }`;

    const { data } = await fetchWallboardData<Root>(query, "B-overview", { to: Date.now() });

    const aAgent = parseAggregations(data.AAgentStateData!.agentSessions[0].aggregation, teams[0]);
    const aQueue = parseAggregations(data.AQueueStateData!.taskLegs[0].aggregation, teams[0]);
    const bAgent = parseAggregations(data.BAgentStateData!.agentSessions[0].aggregation, teams[1]);
    const bQueue = parseAggregations(data.BQueueStateData!.taskLegs[0].aggregation, teams[1]);

    return NextResponse.json({
      timestamp: Date.now(),
      teams: [{ name: wallboardData[0].name, queueData: aAgent, agentData: aQueue }, { name: wallboardData[1].name, queueData: bAgent, agentData: bQueue }],
    });
  } catch (err) {
    console.error("Error fetching overview:", err);
    return NextResponse.json(
      { error: "Failed to fetch overview" },
      { status: 500 }
    );
  }
}

/**
 * Generate agent query string
 */
function generateAgentQuery(prefix: string, teamIds: string[]): string {
  const from = startOfToday();
  const teamFilters = teamIds.map(id => `{ teamId: { equals: "${id}" } } `).join(", ");
  return `
    ${prefix}AgentStateData: agentSession(
    from: ${from}
      to: $to
      filter: {
    and: [
      { isActive: { equals: true } }
          { channelInfo: { channelType: { equals: "telephony" } } }
          { or: [${teamFilters}] }
    ]
  }
      aggregations: [
    { field: "id", type: count, name: "available", filter: { channelInfo: { currentState: { equals: available } } } },
    { field: "id", type: count, name: "idle", filter: { channelInfo: { currentState: { equals: idle } } } }
  ]
  ) {
      agentSessions {
        aggregation { name value }
    }
  }
  `;
}

/**
 * Generate queue query string
 */
function generateQueueQuery(prefix: string, queueIds: string[]): string {
  const from = startOfToday();
  const queueFilters = queueIds.map(id => `{ queue: { id: { equals: "${id}" } } } `).join(", ");
  return `
    ${prefix}QueueStateData: taskLegDetails(
    from: ${from}
      to: $to
      filter: {
    and: [
      { isActive: { equals: true } },
      { channelType: { equals: telephony } },
      { or: [${queueFilters}] }
    ]
  }
      aggregations: [
    { field: "id", type: count, name: "callsInQueue", filter: { status: { equals: "parked" } } }
  ]
  ) {
      taskLegs { aggregation { name value } }
  }
  `;
}


