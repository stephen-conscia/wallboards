"use client";

import Image from "next/image";
import Card from "./Card";
import { useState, useEffect } from "react";

interface Props {
  title: string;
  endPoint: string;
  timestamp: string;
  columns?: 3 | 4;
  intervalSeconds?: number;
}

export default function Wallboard({ title, endPoint, timestamp, columns = 3, intervalSeconds = 3 }: Props) {
  const [apiData, setApiData] = useState<any>(null);

  const fetchData = async () => {
    try {
      const res = await fetch(endPoint);
      const data = await res.json();
      setApiData(data);
      console.log(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, intervalSeconds * 1000);
    return () => clearInterval(interval);
  }, []);

  if (!apiData) return <div className="text-white text-2xl">Loading...</div>;

  return (
    <div className="w-full min-h-screen flex flex-col justify-between items-center p-6">
      {/* Header with logo */}
      <div className="flex flex-col items-center gap-4 mb-10">
        <Image
          src="/aviva.svg"
          alt="Company logo"
          width={200}
          height={200}
          className="w-40 sm:w-48 md:w-56 lg:w-64 h-auto"
        />
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center">
          {title}
        </h1>
      </div>

      {/* Grid of cards */}
      <div
        className={`
          grid
          grid-cols-1 
          sm:grid-cols-2 
          md:grid-cols-3 
          lg:${columns === 4 ? "grid-cols-4" : "grid-cols-3"}
          gap-6
          w-full
          max-w-screen-2xl
      `}
      >
        {Array.from(Array(6).keys()).map(key => (
          <Card key={key} title="title" value={key} />
        ))}
      </div>

      {/* Last updated */}
      <div className="mt-10 text-sm opacity-60">
        Last updated: {new Date(timestamp).toLocaleTimeString()}
      </div>
    </div >
  );
}

