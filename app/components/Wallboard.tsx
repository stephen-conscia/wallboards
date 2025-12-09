"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Card from "./Card";
import { AggregationWithExtras } from "@/lib/query-helpers";
import { formatCardValue, getThresholdStatus } from "@/lib/wallboard-thresholds";

export interface WallboardData { items: AggregationWithExtras[]; timestamp: string }

interface Props {
  title: string;
  data: WallboardData;
  columns?: 3 | 4;
}

export default function Wallboard({ data, title, columns = 3 }: Props) {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => setHydrated(true), []);

  return (
    <div className="w-full h-screen flex flex-col justify-between items-center py-8 px-6">
      {/* Header */}
      <div className="flex flex-col items-center gap-4">
        <Image
          src="/aviva.svg"
          alt="Company logo"
          width={200}
          height={200}
          className="w-40 sm:w-48 md:w-56 lg:w-64 h-auto"
        />
        <h1 className="text-[clamp(1.5rem,3vw,2.5rem)] font-bold text-center">{title}</h1>
      </div>

      {/* Grid */}

      <div className={`
          grid 
          grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:${columns === 4 ? "grid-cols-4" : "grid-cols-3"} 
          gap-6 md:gap-8 lg:gap-10 xl:gap-12 
          w-full 2xl:max-w-4/5
          grow items-center justify-center
      `}>
        {data.items.map(item => (
          <Card
            key={item.name}
            title={item.label}
            value={formatCardValue(item.name, item.value)}
            threshold={getThresholdStatus(item.name, item.value, item.thresholds)}
          />
        ))}
      </div>

      {/* Last updated */}
      {/* Adjust footer styling (less margin from bottom) */}
      {hydrated && (
        <div className="mt-8 text-sm opacity-60">
          Last updated: {new Date(data.timestamp).toLocaleTimeString()}
        </div>
      )}
    </div>
  );
}
