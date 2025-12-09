import { getWallboardConfig } from "@/config";
import { fetchWallboardData } from "@/lib/api-client";
import { Aggregation, parseAggregations, startOfToday } from "@/lib/query-helpers";
import { NextRequest, NextResponse } from "next/server";

export interface Root {
  data: Data
}

export interface Data {
  taskLegDetails: TaskLegDetails
  taskDetails: TaskDetails
  agentSession: AgentSession
}

export interface TaskLegDetails {
  taskLegs: TaskLeg[]
}

export interface TaskLeg {
  aggregation: Aggregation[]
}

export interface TaskDetails {
  tasks: Task[]
}

export interface Task {
  aggregation: Aggregation2[]
}

export interface Aggregation2 {
  name: string
  value: number
}

export interface AgentSession {
  agentSessions: AgentSession2[]
}

export interface AgentSession2 {
  aggregation: Aggregation3[]
}

export interface Aggregation3 {
  name: string
  value: number
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

    console.log(teamParam);


    const teamIds = wallboardData.teams?.map(config => config.id) ?? [];
    const queueIds = wallboardData.queues?.map(config => config.id) ?? [];


    const q = getQuery(teamIds, queueIds);
    const query = `query Summary($to: Long!) { ${q} }`;


    const { data } = await fetchWallboardData<Root>(
      query,
      url.pathname + url.search,
      { to: Date.now() }
    );

    const taskLegs = data.taskLegDetails.taskLegs;
    const tasks = data.taskDetails.tasks;
    const agentSessions = data.agentSession.agentSessions;

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

function getQuery(teamIds: string[], queueIds: string[]) {
  const fromTime = startOfToday();

  return `
taskLegDetails: taskLegDetails(
  from: ${fromTime}
  to: $to
  filter: {
    and: [
      { status: { equals: "parked" } },
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
    },
    {
      field: "createdTime"
      type: min
      name: "longestWaitTimeSeconds"
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

taskDetails: taskDetails(
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

agentSession: agentSession(
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
