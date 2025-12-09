"use client";
import Wallboard, { WallboardData } from "@/app/components/Wallboard";
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
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, []);

  if (!hydrated || !apiData) return <div className="text-white text-2xl">Loading...</div>;

  return (
    <Wallboard title="Conscia Queue Summary" data={apiData} />
  );
}

