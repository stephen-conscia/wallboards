import { fetchWallboardData } from "@/lib/api-client";
import { Aggregation, parseAggregations, startOfToday } from "@/lib/query-helpers";
import { NextRequest, NextResponse } from "next/server";

export interface GlobalData {
  data: Data
}

interface Data {
  taskLegDetails: TaskLegDetails
  taskDetails: TaskDetails
  agentSession: AgentSession
}

interface TaskLegDetails {
  taskLegs: TaskLeg[]
}

interface TaskLeg {
  aggregation: Aggregation[]
}

interface TaskDetails {
  tasks: Task[]
}

interface Task {
  aggregation: Aggregation2[]
}

interface Aggregation2 {
  name: string
  value: number
}

interface AgentSession {
  agentSessions: AgentSession2[]
}

interface AgentSession2 {
  aggregation: Aggregation3[]
}

interface Aggregation3 {
  name: string
  value: number
}

const query = `
query AgentTasks($from: Long!, $to: Long!) {

  taskLegDetails(
    from: $from
    to: $to
    filter: {
      and: [
        { channelType: { equals: telephony } }
        { isActive: { equals: true } }
      ]
    }
    aggregations: [
      {
        field: "id"
        type: count
        name: "callsInQueue"
        filter: { status: { equals: "parked" } }
      }
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

  taskDetails(
    from: $from
    to: $to
    filter: {
      and: [
        { channelType: { equals: telephony } }
        { direction: { equals: "inbound" } }
        { isActive: { equals: false } }
      ]
    }
    aggregations: [
      {
        field: "id"
        type: count
        name: "callsOffered"
      }
      {
        field: "id"
        type: count
        name: "abandoned"
        filter: { contactHandleType: { equals: "abandoned" } }
      }
    ]
  ) {
    tasks {
      aggregation {
        name
        value
      }
    }
  }

  agentSession(
    from: $from
    to: $to
    filter: {
      and: [
        { isActive: { equals: true } }
        { channelInfo: { channelType: { equals: "telephony" } } }
      ]
    }
    aggregations: [
      {
        field: "id"
        type: count
        name: "available"
        filter: {
          channelInfo: { currentState: { equals: available } }
        }
      }
      {
        field: "id"
        type: count
        name: "idle"
        filter: {
          channelInfo: { currentState: { equals: idle } }
        }
      }
      {
        field: "id"
        type: count
        name: "connected"
        filter: {
          channelInfo: { currentState: { equals: connected } }
        }
      }
      {
      field: "id"
      type: count
      name: "agentCount"
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

}
`;


export async function GET(request: NextRequest) {
  try {

    const { data, timestamp } = await fetchWallboardData<GlobalData>(
      query,
      "global-query",
      { from: startOfToday(), to: Date.now() }
    );

    const taskLegStats = parseAggregations(data.taskLegDetails.taskLegs[0].aggregation);
    const taskStats = parseAggregations(data.taskDetails.tasks[0].aggregation);
    const agentStats = parseAggregations(data.agentSession.agentSessions[0].aggregation);

    return NextResponse.json({ items: [...taskStats, ...taskLegStats, ...agentStats], timestamp });

  } catch (err) {
    console.error("Error fetching overview:", err);
    return NextResponse.json(
      { error: "Failed to fetch overview" },
      { status: 500 }
    );
  }
}

