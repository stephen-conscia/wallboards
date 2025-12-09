
"use client";
interface Root {
  consciaAgentStats: ConsciaAgentStat[]
  plannet21AgentStats: Plannet21AgentStat[]
  consciaQueueStats: ConsciaQueueStat[]
  plannet21QueueStats: Plannet21QueueStat[]
  timestamp: string;
}

interface ConsciaAgentStat {
  name: string
  value: number
  label: string
  thresholds: Thresholds
}

interface Thresholds {
  warning: number
  danger: number
}

interface Plannet21AgentStat {
  name: string
  value: number
  label: string
  thresholds: Thresholds2
}

interface Thresholds2 {
  warning: number
  danger: number
}

interface ConsciaQueueStat {
  name: string
  value: number
  label: string
  thresholds: Thresholds3
}

interface Thresholds3 {
  warning: number
  danger: number
}

interface Plannet21QueueStat {
  name: string
  value: number
  label: string
  thresholds: Thresholds4
}

interface Thresholds4 {
  warning: number
  danger: number
}

import Image from "next/image";
import { useState, useEffect } from "react";
import { getThresholdStatus } from "@/lib/wallboard-thresholds";
import Card from "@/app/components/Card";
import { CLIENT_REFRESH_INTERVAL_MS } from "@/config";

export default function Page() {
  const [apiData, setApiData] = useState<Root | null>(null);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/wallboards/conscia/overview");
      const data = await res.json();
      setApiData(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, CLIENT_REFRESH_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  if (!apiData) return <div className="text-white text-2xl">Loading...</div>;

  return (
    <div className="w-full min-h-screen flex flex-col justify-between items-center p-6">
      {/* Header with logo */}
      <div className="flex flex-col items-center gap-4 mb-10">
        <Image
          src="/aviva.svg"
          alt="Company logo"
          width={200}
          height={200}
          className="w-40 sm:w-48 md:w-56 lg:w-64 h-auto"
        />
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center">
          Conscia Overview
        </h1>
      </div>

      {/* Grid of cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full max-w-screen-2xl">
        <div className="flex items-center justify-center mx-auto w-64 sm:w-full p-8 border border-slate-500 dark:border-slate-700 text-center rounded-lg shadow-xl">
          <h3 className="uppercase text-lg sm:text-xl lg:text-2xl font-semibold mb-2">Conscia</h3>
        </div>
        <Card title={apiData.consciaQueueStats[0].label} value={apiData.consciaQueueStats[0].value} threshold={getThresholdStatus(apiData.consciaQueueStats[0].value, apiData.consciaQueueStats[0].thresholds)} />
        {apiData.consciaAgentStats.map(stat => <Card key={stat.name} title={stat.label} value={stat.value} threshold={getThresholdStatus(stat.value, stat.thresholds)} />)}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full max-w-screen-2xl">
        <div className="flex items-center justify-center mx-auto w-64 sm:w-full p-8 border border-slate-500 dark:border-slate-700 text-center rounded-lg shadow-xl">
          <h3 className="uppercase text-lg sm:text-xl lg:text-2xl font-semibold mb-2">Plannet 21</h3>
        </div>
        <Card title={apiData.plannet21QueueStats[0].label} value={apiData.plannet21QueueStats[0].value} threshold={getThresholdStatus(apiData.plannet21QueueStats[0].value, apiData.plannet21QueueStats[0].thresholds)} />
        {apiData.plannet21AgentStats.map(stat => <Card key={stat.name} title={stat.label} value={stat.value} threshold={getThresholdStatus(stat.value, stat.thresholds)} />)}
      </div>

      {/* Last updated */}
      <div className="mt-10 text-sm opacity-60">
        {apiData && (
          <>Last updated: {new Date(apiData.timestamp).toLocaleTimeString()}</>
        )}
      </div>
    </div >
  );
}


