"use client";
import QueueSummary from "@/app/components/QueueSummary";

export default function Page() {
  return <QueueSummary title="Queue Summary LNP Broker" apiUrl="/api/wallboards/queue-summary?team=lnpBroker" />
}

