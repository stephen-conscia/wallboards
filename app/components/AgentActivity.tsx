"use client";
import { formatTimeSince, getStateTextColor } from "@/lib/wallboard-thresholds";
import Image from "next/image";
import { useState, useEffect } from "react";

const API_REFRESH_INTERVAL_MS = 1000;

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

interface Props {
  path: string;
  title: string;
}

export default function AgentActivity({ path, title }: Props) {
  const [apiData, setApiData] = useState<ApiData | null>(null);
  const [hydrated, setHydrated] = useState(false);

  const fetchData = async () => {
    try {
      const res = await fetch(path);
      const json = await res.json();
      setApiData(json);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => setHydrated(true), []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, API_REFRESH_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  // Ensure 'Loading' text is highly visible
  if (!hydrated || !apiData) return <div className="text-white text-[clamp(2rem, 5vw, 4rem)] font-bold text-center mt-20">Loading...</div>;


  return (
    // 1. Enforce h-screen and use vertical padding (py-8)
    <div className="w-full h-screen flex flex-col py-8 px-6">

      {/* Top section: logo + heading */}
      <div className="flex flex-col items-center gap-4 mb-8">
        <Image
          src="/aviva.svg"
          alt="Company logo"
          width={200}
          height={200}
          // Retaining the original sizing class for the logo as requested
          className="w-40 sm:w-48 md:w-56 lg:w-64 h-auto"
        />
        {/* 2. Scalable Title: Using clamp() */}
        <h1 className="text-[clamp(2rem,4vw,3.5rem)] font-bold text-center">
          {title}
        </h1>
      </div>

      {/* Middle section: table (grows) */}
      {/* 3. Added flex-grow to the main content container and overflow-y-auto for safety */}
      <div className="flex flex-col grow overflow-x-auto overflow-y-auto">
        {/* 4. Table sizing adjustments for wallboard visibility */}
        <table className="w-full border-separate border-spacing-y-2">

          {/* Table Header */}
          <thead className="bg-neutral-secondary-medium">
            <tr>
              {/* 5. Scaled up text and padding for TH elements */}
              <th scope="col" className="px-10 py-4 text-[clamp(1.25rem,2.5vw,2.5rem)] font-extrabold rounded-s-xl">Agent Name</th>
              <th scope="col" className="px-10 py-4 text-[clamp(1.25rem,2.5vw,2.5rem)] font-extrabold">State</th>
              <th scope="col" className="px-10 py-4 text-[clamp(1.25rem,2.5vw,2.5rem)] font-extrabold">Reason Code</th>
              <th scope="col" className="px-10 py-4 text-[clamp(1.25rem,2.5vw,2.5rem)] font-extrabold rounded-e-xl">Time in State</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-gray-700/50">
            {apiData.agentSessions.map((session) => (
              <tr key={session.agentId} className="bg-neutral-primary shadow-lg hover:shadow-xl transition-shadow duration-200">
                {/* 6. Scaled up text and padding for TD elements */}
                <th scope="row" className="px-10 py-6 font-bold text-[clamp(1.5rem,3.5vw,3rem)] whitespace-nowrap rounded-s-lg">
                  {session.agentName}
                </th>
                <td className={`px-10 py-6 text-[clamp(1.5rem,3.5vw,3rem)] font-bold ${getStateTextColor(session.channelInfo[0].currentState)} rounded-none`}>
                  {session.channelInfo[0].currentState}
                </td>
                <td className="px-10 py-6 text-[clamp(1.5rem,3.5vw,3rem)] rounded-none">{session.channelInfo[0].idleCodeName}</td>
                <td className="px-10 py-6 text-[clamp(1.5rem,3.5vw,3rem)] rounded-e-lg">
                  {formatTimeSince(session.channelInfo[0].lastActivityTime)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Last updated: moved outside the table container and pinned to the bottom */}
      <div className="mt-6 text-[clamp(1rem,1.5vw,1.5rem)] opacity-60 text-center">
        {hydrated && apiData && <>Last updated: {new Date(apiData.timestamp).toLocaleTimeString()}</>}
      </div>
    </div>
  );
}
