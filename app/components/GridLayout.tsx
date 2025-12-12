"use client";

import Card from "./Card";
import { formatCardValue, getThresholdStatus } from "@/lib/wallboard-thresholds";
import WallboardLayout from "./WallboardLayout";
import { AggregationWithExtras } from "@/lib/query-helpers";

interface WallboardItem extends AggregationWithExtras {
  borderColor?: string;
}

export interface WallboardData {
  title: string;
  items: WallboardItem[];
  timestamp: number;
  columns?: 3 | 4;
}

export default function Wallboard({ title, items, timestamp, columns = 3 }: WallboardData) {
  return (
    <>
      <WallboardLayout title={title} timestamp={timestamp}>

        <div
          className={`
          flex-1 w-full max-w-screen-3xl mx-auto
          grid ${columns === 4 ? "md:grid-cols-4" : "md:grid-cols-3"} 
          gap-6 md:gap-8 lg:gap-10 xl:gap-12
          p-2 md:p-6 2xl:p12
        `}
        >
          {items.map((item, index) => (
            <Card
              key={index}
              title={item.label}
              value={formatCardValue(item.name, item.value)}
              threshold={getThresholdStatus(item.name, item.value, item.thresholds)}
              borderColor={item.borderColor}
            />
          ))}
        </div>
      </WallboardLayout>

    </>
  );
}
