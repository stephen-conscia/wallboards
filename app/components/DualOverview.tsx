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
    // 1. Enforce h-screen and use vertical padding (py-8) instead of huge margins
    <div className="w-full h-screen flex flex-col justify-between items-center py-8 px-6">

      {/* Header with logo */}
      {/* 2. Optimized Logo and Title Sizing */}
      <div className="flex flex-col items-center gap-4">
        <Image
          src="/aviva.svg"
          alt="Company logo"
          width={200}
          height={200}
          // Use smaller, more consistent logo sizing based on viewport width (vw)
          className="w-40 sm:w-48 md:w-56 lg:w-64 h-auto"

        />
        {/* Use a clamp() for the title for better scaling */}
        <h1 className="text-[clamp(1.5rem,3vw,2.5rem)] font-bold text-center">
          Dual Overview
        </h1>
      </div>

      {/* Main Content Area (Teams) */}
      {/* 3. Use flex-grow to ensure this area takes up all available vertical space */}
      <div className="flex flex-col grow justify-center w-full 2xl:max-w-4/5 gap-8 md:gap-10 lg:gap-12 py-4">
        {/* Loop through teams */}
        {apiData.teams.map((team, idx) => {
          return (
            // 4. Each team row must also flex-grow to share vertical space equally
            <div
              key={team.name}
              className={`
                grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 
                gap-4 md:gap-6 lg:gap-8 
                w-full 
                grow
              `}
            >
              {/* Team Name Card */}
              {/* 5. Team Name Card Styling: Ensure it matches the height/vertical alignment of the other cards in the row */}
              <div
                className={`
                  flex flex-col justify-center 
                  w-full 
                  // Use viewport-based padding for scaling
                  p-[2vw] sm:p-[1.5vw] lg:p-[1vw]
                  border-4 ${rowColors[idx]} // Added border-4 for prominence
                  text-center 
                  rounded-xl 
                  shadow-xl
                  transition-all
                `}
              >
                {/* 6. Optimized clamp() for Team Name */}
                <h3 className="uppercase text-[clamp(1.5rem,4vw,64px)] font-bold">
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
      </div>

      {/* Last updated */}
      {/* 7. Footer margin adjusted */}
      <div className="mt-8 text-sm opacity-60">
        Last updated: {new Date(apiData.timestamp).toLocaleTimeString()}
      </div>
    </div>
  );
}
