"use client";
import { formatTimeSince, getStateTextColor } from "@/lib/wallboard-thresholds";
import { useState, useEffect } from "react";
import WallboardLayout from "./WallboardLayout";

const API_REFRESH_INTERVAL_MS = 1000;

interface ApiData {
  agentSessions: AgentActivity[];
  timestamp: number;
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

interface Props {
  path: string;
  title: string;
}

export default function AgentActivity({ path, title }: Props) {
  const [apiData, setApiData] = useState<ApiData | null>(null);

  const fetchData = async () => {
    try {
      const res = await fetch(path);
      const json = await res.json();
      setApiData(json);
    } catch (err) {
      console.error(err);
    }
  };


  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, API_REFRESH_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  // Ensure 'Loading' text is highly visible
  if (!apiData) return <div className="text-white text-[clamp(2rem, 5vw, 4rem)] font-bold text-center mt-20">Loading...</div>;


  return (
    // 1. Enforce h-screen and use vertical padding (py-8)
    <WallboardLayout title={title} timestamp={apiData.timestamp}>

      {/* Middle section: table (grows) */}
      {/* 3. Added flex-grow to the main content container and overflow-y-auto for safety */}
      <div className="flex flex-col grow overflow-x-auto overflow-y-auto">
        {/* 4. Table sizing adjustments for wallboard visibility */}
        <table className="w-full border-separate border-spacing-y-2">

          {/* Table Header */}
          <thead className="bg-neutral-secondary-medium text-slate-400">
            <tr>
              <th scope="col" className="px-10 py-4 uppercase tracking-wide text-left align-middle text-[clamp(1.25rem,2.5vw,2.5rem)] font-extrabold">
                Agent Name
              </th>
              <th scope="col" className="px-10 py-4 uppercase tracking-wide text-left align-middle text-[clamp(1.25rem,2.5vw,2.5rem)] font-extrabold">
                State
              </th>
              <th scope="col" className="px-10 py-4 uppercase tracking-wide text-left align-middle text-[clamp(1.25rem,2.5vw,2.5rem)] font-extrabold">
                Reason Code
              </th>
              <th scope="col" className="px-10 py-4 uppercase tracking-wide text-left align-middle text-[clamp(1.25rem,2.5vw,2.5rem)] font-extrabold">
                Time in State
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-gray-700/50">
            {apiData.agentSessions.map((session) => (
              <tr key={session.agentId} className="bg-neutral-primary shadow-lg hover:shadow-xl transition-shadow duration-200">
                {/* 6. Scaled up text and padding for TD elements */}
                <th scope="row" className="px-10 py-4 font-bold text-[clamp(1.5rem,3.5vw,3rem)] whitespace-nowrap">
                  {session.agentName}
                </th>
                <td className={`px-2 py-3 text-[clamp(1.5rem,3.5vw,3rem)] font-bold ${getStateTextColor(session.channelInfo[0].currentState)} rounded-none`}>
                  {session.channelInfo[0].currentState}
                </td>
                <td className="px-2 py-3 text-[clamp(1.5rem,3.5vw,3rem)]">{session.channelInfo[0].idleCodeName}</td>
                <td className="px-2 py-3 text-[clamp(1.5rem,3.5vw,3rem)]">
                  {formatTimeSince(session.channelInfo[0].lastActivityTime)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </WallboardLayout>
  );
}
