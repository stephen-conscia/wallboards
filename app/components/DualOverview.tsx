"use client";
import { CLIENT_REFRESH_INTERVAL_MS } from "@/config";
import { AggregationWithExtras } from "@/lib/query-helpers";
import { useState, useEffect } from "react";
import GridLayout, { WallboardData } from "./GridLayout";

interface Payload {
  timestamp: number;
  items: AggregationWithExtras[];
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

      const items: WallboardData['items'] = data.items.map(function(item, index) {
        return {
          ...item,
          borderColor: borderColors[Math.floor(index / (data.items.length / 2))]
        }
      });

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
