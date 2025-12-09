"use client";
import { CLIENT_REFRESH_INTERVAL_MS } from "@/config";
import { AggregationWithExtras } from "@/lib/query-helpers";
import Image from "next/image";
import { useState, useEffect } from "react";
import Card from "./Card";
import { getThresholdStatus } from "@/lib/wallboard-thresholds";

interface TeamData {
  name: string;
  queueData: AggregationWithExtras[];
  agentData: AggregationWithExtras[];
}

interface Payload {
  timestamp: number;
  teams: [TeamData, TeamData]; // exactly two teams
}

// Predefined row colors (tailwind classes)
const rowColors = ["border-yellow-900", "border-sky-900"];

interface Props {
  apiUrl: string;
}
export default function DualOverview({ apiUrl }: Props) {
  const [apiData, setApiData] = useState<Payload | null>(null);

  const fetchData = async () => {
    try {
      const res = await fetch(apiUrl);
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
          Dual Overview
        </h1>
      </div>

      {/* Loop through teams */}
      {apiData.teams.map((team, idx) => {
        return (
          <div
            key={team.name}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full max-w-screen-2xl"
          >
            {/* Team Name Card */}
            <div
              className={`flex items-center justify-center mx-auto w-64 sm:w-full p-8 border text-center rounded-lg shadow-xl border ${rowColors[idx]}`}
            >
              <h3 className={`uppercase text-lg sm:text-xl lg:text-2xl font-semibold mb-2 text-white`}>
                {team.name}
              </h3>
            </div>

            {/* Queue Data */}
            {team.queueData.map((stat) => (
              <Card
                key={stat.name}
                title={stat.label}
                value={stat.value}
                threshold={getThresholdStatus(stat.name, stat.value, stat.thresholds)}
                borderColor={rowColors[idx]} // pass row color to the card
              />
            ))}

            {/* Agent Data */}
            {team.agentData.map((stat) => (
              <Card
                key={stat.name}
                title={stat.label}
                value={stat.value}
                threshold={getThresholdStatus(stat.name, stat.value, stat.thresholds)}
                borderColor={rowColors[idx]} // same row color
              />
            ))}
          </div>
        );
      })}

      {/* Last updated */}
      <div className="mt-10 text-sm opacity-60">
        Last updated: {new Date(apiData.timestamp).toLocaleTimeString()}
      </div>
    </div>
  );
}


