"use client";
import Wallboard, { WallboardData } from "@/app/components/Wallboard";
import { CLIENT_REFRESH_INTERVAL_MS } from "@/config";
import { useState, useEffect } from "react";

export default function Page() {
  const [apiData, setApiData] = useState<WallboardData | null>(null);
  const [hydrated, setHydrated] = useState(false);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/wallboards/queue-summary?team=plannet21")
      const data = await res.json();
      setApiData(data);
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => setHydrated(true), []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, CLIENT_REFRESH_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  if (!hydrated || !apiData) return <div className="text-white text-2xl">Loading...</div>;

  return (
    <Wallboard title="Conscia Queue Summary" data={apiData} />
  );
}

