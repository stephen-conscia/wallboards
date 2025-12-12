"use client";
import { CLIENT_REFRESH_INTERVAL_MS } from "@/config";
import { AggregationWithExtras } from "@/lib/query-helpers";
import { useState, useEffect } from "react";
import GridLayout, { WallboardData } from "./GridLayout";

interface TeamData {
  name: string;
  queueData: [AggregationWithExtras, AggregationWithExtras];
  agentData: [AggregationWithExtras];
}

interface Payload {
  timestamp: number;
  teams: [TeamData, TeamData]; // exactly two teams
}

const borderColors = ["border-yellow-900", "border-sky-900"];

interface Props {
  apiUrl: string;
  title: string;
}

export default function DualOverview({ apiUrl, title }: Props) {
  const [apiData, setApiData] = useState<WallboardData | null>(null);

  const fetchData = async () => {
    try {
      const res = await fetch(apiUrl);
      const data = await res.json() as Payload;
      const items: WallboardData["items"] = data.teams.flatMap((team, index) => [
        { name: team.name, label: team.name, borderColor: borderColors[index] },
        { ...team.agentData[0], borderColor: borderColors[index] },
        { ...team.queueData[0], borderColor: borderColors[index] },
        { ...team.queueData[1], borderColor: borderColors[index] },
      ]);
      setApiData({ timestamp: data.timestamp, title, items });
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
    <GridLayout items={apiData.items} title={apiData.title} timestamp={apiData.timestamp} columns={4} />
  );
}
