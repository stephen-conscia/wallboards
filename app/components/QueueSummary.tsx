"use client";
import GridLayout, { WallboardData } from "@/app/components/GridLayout";
import { useState, useEffect } from "react";

const REFRESH_INTERVAL_MS = 1000;
interface Props {
  apiUrl: string;
  title: string;
}

export default function QueueSummary({ apiUrl, title }: Props) {
  const [apiData, setApiData] = useState<WallboardData | null>(null);
  const [hydrated, setHydrated] = useState(false);

  const fetchData = async () => {
    try {
      const res = await fetch(apiUrl)
      const data = await res.json();
      setApiData(data);
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => setHydrated(true), []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, REFRESH_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  if (!hydrated || !apiData) return <div className="text-white text-2xl">Loading...</div>;

  return (
    <GridLayout title={title} items={apiData.items} timestamp={apiData.timestamp} />
  );
}


