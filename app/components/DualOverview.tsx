"use client";
import { CLIENT_REFRESH_INTERVAL_MS } from "@/config";
import { AggregationWithExtras } from "@/lib/query-helpers";
import { useState, useEffect } from "react";
import GridLayout, { WallboardData } from "./GridLayout";

interface Payload {
  timestamp: number;
  teamA: AggregationWithExtras[];
  teamB: AggregationWithExtras[];
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
      if (!res.ok) throw new Error(`Failed to fetch: ${res.statusText}`);

      const data = await res.json() as Payload;

      const items: WallboardData['items'] = [
        ...data.teamA.map(item => ({ ...item, borderColor: borderColors[0] })),
        ...data.teamB.map(item => ({ ...item, borderColor: borderColors[1] }))
      ];

      setApiData({ timestamp: data.timestamp, title, items });
    } catch (err) {
      console.error("Error fetching data:", err);
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


