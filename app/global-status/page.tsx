"use client";
import { useState, useEffect } from "react";
import { GlobalData } from "../api/wallboards/global/route";
import Wallboard, { WallboardData } from "../components/Wallboard";
import { CLIENT_REFRESH_INTERVAL_MS } from "@/config";

export default function Page() {
  const [apiData, setApiData] = useState<WallboardData | null>(null);
  const [hydrated, setHydrated] = useState(false);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/wallboards/global")
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
    <Wallboard title="Global Status" data={apiData} columns={4} />
  );
}


