"use client";
import { useState, useEffect } from "react";
import { CLIENT_REFRESH_INTERVAL_MS } from "@/config";
import GridLayout, { WallboardData } from "@/app/components/GridLayout";

export default function Page() {
  const [apiData, setApiData] = useState<WallboardData | null>(null);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/wallboards/global-summary")
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
    <GridLayout title="Global Status" timestamp={apiData.timestamp} items={apiData.items} columns={4} />
  );
}


