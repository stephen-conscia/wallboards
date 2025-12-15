import { getWallboardConfig, WallboardConfig } from "@/config";
import { fetchWallboardData } from "@/lib/api-client";
import { Aggregation, AggregationWithExtras, parseAggregations, startOfToday } from "@/lib/query-helpers";
import { NextRequest, NextResponse } from "next/server";

/**
 * Types for GraphQL response
 */
interface Root {
  data: QueryResults;
}

interface QueryResults {
  AAgentStateData: AgentStateData;
  AQueueStateData: QueueStateData;
  BAgentStateData: AgentStateData;
  BQueueStateData: QueueStateData;
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
        ${generateAgentQuery("A", wallboardData[0].teams.map(config => config.id), wallboardData[0].skills)},
        ${generateQueueQuery("A", wallboardData[0].skills)},
        ${generateAgentQuery("B", wallboardData[1].teams.map(config => config.id) ?? [], wallboardData[1].skills)},
        ${generateQueueQuery("B", wallboardData[1].skills)},
  }`;

    const { data, timestamp } = await fetchWallboardData<Root>(query, url.pathname + url.search, { to: Date.now() });

    const aAgent = parseAggregations(data.AAgentStateData!.agentSessions[0].aggregation, teams[0]);
    const aQueue = parseAggregations(data.AQueueStateData!.taskLegs[0].aggregation, teams[0]);
    const bAgent = parseAggregations(data.BAgentStateData!.agentSessions[0].aggregation, teams[1]);
    const bQueue = parseAggregations(data.BQueueStateData!.taskLegs[0].aggregation, teams[1]);


    const teamA: AggregationWithExtras[] = [{ name: `group${wallboardData[0].name}`, label: wallboardData[0].name }, aAgent, aQueue].flat();

    const teamB: AggregationWithExtras[] = [{ name: `group${wallboardData[1].name}`, label: wallboardData[1].name }, bAgent, bQueue].flat();

    return NextResponse.json({
      timestamp,
      teamA, teamB
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
function generateAgentQuery(prefix: string, teamIds: string[], skillList: string[]): string {
  const from = startOfToday();
  return `
    ${prefix}AgentStateData: agentSession(
    from: ${from}
      to: $to
      filter: {
    and: [
      { isActive: { equals: true } }
      { channelInfo: { channelType: { equals: "telephony" } } }
      { or: [ ${teamIds.map(id => `{ teamId: { equals: "${id}" } } `)} ] }
      { or: [ ${skillList.map(name => `{ agentSkills: { name: { equals: "${name}" } } } `)} ] }

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
function generateQueueQuery(prefix: string, skillList: string[]): string {
  const from = startOfToday();
  const skillFilters = skillList.map(name => `{ requiredSkills: { name: { equals: "${name}" } } } `);
  return `
    ${prefix}QueueStateData: taskLegDetails(
    from: ${from}
      to: $to
      filter: {
    and: [
      { isActive: { equals: true } },
      { channelType: { equals: telephony } },
      { or: [ ${skillFilters} ] }
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
