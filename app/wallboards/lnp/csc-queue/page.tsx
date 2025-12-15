"use client";
import QueueSummary from "@/app/components/QueueSummary";

export default function Page() {
  return <QueueSummary title="Queue Summary LNP CSC" apiUrl="/api/wallboards/queue-summary?team=lnpCsc" />
}

