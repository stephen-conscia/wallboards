"use client";
import QueueSummary from "@/app/components/QueueSummary";

export default function Page() {
  return <QueueSummary title="Life & Pensions Broker" apiUrl="/api/wallboards/queue-summary?team=lnpBroker" />
}

