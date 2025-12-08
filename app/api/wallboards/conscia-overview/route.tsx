import { Threshold, getWallboardConfig, METRICS, GLOBAL_THRESHOLDS } from "@/config";
import { fetchWallboardData } from "@/services/api-client";
import { NextRequest, NextResponse } from "next/server";

/**
 * Types for GraphQL response
 */
interface Root {
  data: QueryResults;
}

interface QueryResults {
  consciaAgentStateData?: AgentStateData;
  consciaQueueStateData?: QueueStateData;
  plannet21AgentStateData?: AgentStateData;
  plannet21QueueStateData?: QueueStateData;
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
const consciaConfig = getWallboardConfig("conscia");
const plannet21Config = getWallboardConfig("plannet21");

const consciaTeamIds = consciaConfig?.teams.map(t => t.id) ?? [];
const consciaQueueIds = consciaConfig?.queues.map(q => q.id) ?? [];
const plannet21TeamIds = plannet21Config?.teams.map(t => t.id) ?? [];
const plannet21QueueIds = plannet21Config?.queues.map(q => q.id) ?? [];

/**
 * Generate GraphQL queries
 */
const consciaAgentQuery = generateAgentQuery("conscia", consciaTeamIds);
const consciaQueueQuery = generateQueueQuery("conscia", consciaQueueIds);
const plannet21AgentQuery = generateAgentQuery("plannet21", plannet21TeamIds);
const plannet21QueueQuery = generateQueueQuery("plannet21", plannet21QueueIds);

/**
 * Main handler
 */
export async function GET(request: NextRequest) {
  try {
    if (!consciaConfig || !plannet21Config) {
      return NextResponse.json(
        { error: "Wallboard data not available" },
        { status: 400 }
      );
    }

    const now = Date.now();

    const query = `
      query Overview($to: Long!) {
        ${consciaAgentQuery}
        ${consciaQueueQuery}
        ${plannet21AgentQuery}
        ${plannet21QueueQuery}
      }
    `;

    const { data } = await fetchWallboardData<Root>(query, "", { to: now });

    const consciaAgentStats = data.consciaAgentStateData
      ? parseAggregations(data.consciaAgentStateData.agentSessions[0].aggregation)
      : [];
    const plannet21AgentStats = data.plannet21AgentStateData
      ? parseAggregations(data.plannet21AgentStateData.agentSessions[0].aggregation)
      : [];
    const consciaQueueStats = data.consciaQueueStateData
      ? parseAggregations(data.consciaQueueStateData.taskLegs[0].aggregation)
      : [];
    const plannet21QueueStats = data.plannet21QueueStateData
      ? parseAggregations(data.plannet21QueueStateData.taskLegs[0].aggregation)
      : [];

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      consciaAgentStats,
      plannet21AgentStats,
      consciaQueueStats,
      plannet21QueueStats
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


