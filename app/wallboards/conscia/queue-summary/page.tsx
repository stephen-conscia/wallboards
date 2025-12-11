"use client";
import QueueSummary from "@/app/components/QueueSummary";

export default function Page() {
  return <QueueSummary apiUrl="/api/wallboards/queue-summary?team=plannet21" title="Conscia Queue Summary" />
}

