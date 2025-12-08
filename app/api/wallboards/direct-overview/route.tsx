import { getWallboardConfig, GLOBAL_THRESHOLDS, METRICS, Threshold } from "@/config";
import { fetchWallboardData } from "@/lib/api-client";
import { NextRequest, NextResponse } from "next/server";

/**
 * Types for GraphQL response
 */
interface Root {
  data: QueryResults;
}

interface QueryResults {
  homeAgentStateData?: AgentStateData;
  homeQueueStateData?: QueueStateData;
  motorAgentStateData?: AgentStateData;
  motorQueueStateData?: QueueStateData;
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

interface Aggregation {
  name: string;
  value: number;
}

interface AggregationWithExtras extends Aggregation {
  label: string;
  thresholds?: Threshold;
}

/**
 * Fetch wallboard configs
 */
const homeConfig = getWallboardConfig("directHome");
const motorConfig = getWallboardConfig("directMotor");

const homeTeamIds = homeConfig?.teams.map(t => t.id) ?? [];
const homeQueueIds = homeConfig?.queues.map(q => q.id) ?? [];
const motorTeamIds = motorConfig?.teams.map(t => t.id) ?? [];
const motorQueueIds = motorConfig?.queues.map(q => q.id) ?? [];

/**
 * Generate GraphQL queries
 */
const homeAgentQuery = generateAgentQuery("home", homeTeamIds);
const homeQueueQuery = generateQueueQuery("home", homeQueueIds);
const motorAgentQuery = generateAgentQuery("motor", motorTeamIds);
const motorQueueQuery = generateQueueQuery("motor", motorQueueIds);

/**
 * Main handler
 */
export async function GET(request: NextRequest) {
  try {
    if (!homeConfig || !motorConfig) {
      return NextResponse.json(
        { error: "Wallboard data not available" },
        { status: 400 }
      );
    }

    const now = Date.now();

    const query = `
      query DirectOverview($to: Long!) {
        ${homeAgentQuery}
        ${homeQueueQuery}
        ${motorAgentQuery}
        ${motorQueueQuery}
      }
    `;

    const { data } = await fetchWallboardData<Root>(query, "direct", { to: now });

    const homeAgentStats = data.homeAgentStateData
      ? parseAggregations(data.homeAgentStateData.agentSessions[0].aggregation)
      : [];
    const motorAgentStats = data.motorAgentStateData
      ? parseAggregations(data.motorAgentStateData.agentSessions[0].aggregation)
      : [];
    const homeQueueStats = data.homeQueueStateData
      ? parseAggregations(data.homeQueueStateData.taskLegs[0].aggregation)
      : [];
    const motorQueueStats = data.motorQueueStateData
      ? parseAggregations(data.motorQueueStateData.taskLegs[0].aggregation)
      : [];

    return NextResponse.json({
      homeAgentStats,
      motorAgentStats,
      homeQueueStats,
      motorQueueStats
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
 * Helper to parse aggregations into normalized objects
 */
function parseAggregations(aggregations: Aggregation[]): AggregationWithExtras[] {
  return aggregations.map(agg => ({
    ...agg,
    label: METRICS[agg.name]?.label ?? agg.name,
    thresholds: GLOBAL_THRESHOLDS[agg.name]
  }));
}

/**
 * Generate agent query string
 */
function generateAgentQuery(prefix: string, teamIds: string[]): string {
  const from = startOfToday();
  const teamFilters = teamIds.map(id => `{ teamId: { equals: "${id}" } }`).join(", ");
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
  const queueFilters = queueIds.map(id => `{ queue: { id: { equals: "${id}" } } }`).join(", ");
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

/**
 * Helper to get start of day timestamp
 */
function startOfToday(): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today.getTime();
}

