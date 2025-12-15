"use client";
import GridLayout, { WallboardData } from "@/app/components/GridLayout";
import { CLIENT_REFRESH_INTERVAL_MS } from "@/config";
import { useState, useEffect } from "react";

interface Props {
  apiUrl: string;
  title: string;
}

export default function QueueSummary({ apiUrl, title }: Props) {
  const [apiData, setApiData] = useState<WallboardData | null>(null);

  const fetchData = async () => {
    try {
      const res = await fetch(apiUrl)
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
    <GridLayout title={title} items={apiData.items} timestamp={apiData.timestamp} />
  );
}


