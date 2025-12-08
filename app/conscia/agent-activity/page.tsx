"use client";
import { formatTimeSince, getStateTextColor } from "@/lib/wallboard-thresholds";
import Image from "next/image";
import { useState, useEffect } from "react";

interface ApiData {
  agentSessions: AgentActivity[];
  timestamp: string;
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

export default function Page() {
  const [apiData, setApiData] = useState<ApiData | null>(null);
  const [hydrated, setHydrated] = useState(false);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/wallboards/conscia/agent-activity");
      const data = await res.json();
      setApiData(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => setHydrated(true), []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!hydrated || !apiData) return <div className="text-white text-2xl">Loading...</div>;


  return (
    <div className="w-full min-h-screen flex flex-col p-6">
      {/* Top section: logo + heading */}
      <div className="flex flex-col items-center gap-4 mb-6">
        <Image
          src="/aviva.svg"
          alt="Company logo"
          width={200}
          height={200}
          className="w-40 sm:w-48 md:w-56 lg:w-64 h-auto"
        />
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center">
          Conscia Agent Activity
        </h1>
      </div>

      {/* Middle section: table (grows) */}
      <div className="flex flex-col flex-grow overflow-x-auto">
        <table className="w-full text-lg text-left rtl:text-right text-body">
          <thead className="text-xl font-semibold bg-neutral-secondary-medium">
            <tr>
              <th scope="col" className="px-10 py-6 rounded-s-base">Agent Name</th>
              <th scope="col" className="px-10 py-6">State</th>
              <th scope="col" className="px-10 py-6">Reason Code</th>
              <th scope="col" className="px-10 py-6 rounded-e-base">Time in State</th>
            </tr>
          </thead>
          <tbody>
            {apiData.agentSessions.map((session) => (
              <tr key={session.agentId} className="bg-neutral-primary">
                <th scope="row" className="px-10 py-6 font-bold text-2xl whitespace-nowrap">
                  {session.agentName}
                </th>
                <td className={`px-10 py-6 text-2xl ${getStateTextColor(session.channelInfo[0].currentState)}`}>
                  {session.channelInfo[0].currentState}
                </td>
                <td className="px-10 py-6 text-2xl">{session.channelInfo[0].idleCodeName}</td>
                <td className="px-10 py-6 text-2xl">
                  {formatTimeSince(session.channelInfo[0].lastActivityTime)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Last updated: pinned to bottom of flex-grow container */}
        <div className="mt-auto text-sm opacity-60 text-center">
          {apiData && <>Last updated: {new Date(apiData.timestamp).toLocaleTimeString()}</>}
        </div>
      </div>
    </div>

  );
}

