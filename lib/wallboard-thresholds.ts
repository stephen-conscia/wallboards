import { Threshold, METRICS } from "@/config";

export type ThresholdStatus = "default" | "warning" | "danger" | "success";

export function getThresholdStatus(
  name: keyof typeof METRICS,
  value?: number,
  threshold?: Threshold | undefined
): "default" | "warning" | "danger" | "success" {
  if (!threshold || value === undefined) return "default";

  let compareValue = value;

  switch (name) {
    case "longestWaitTimeSeconds":
      if (compareValue === 0) return "default";

      const diffMs = Date.now() - value;
      compareValue = Math.floor(diffMs / 1000);
      break;

    case "available":
      if (threshold.success !== undefined && compareValue >= threshold.success) return "success";
      if (threshold.warning !== undefined && compareValue >= threshold.warning) return "warning";
      if (threshold.danger !== undefined && compareValue >= threshold.danger) return "danger";
      return "default"
  }

  if (threshold.danger !== undefined && compareValue >= threshold.danger) return "danger";
  if (threshold.warning !== undefined && compareValue >= threshold.warning) return "warning";
  if (threshold.success !== undefined && compareValue >= threshold.success) return "success";
  return "default"
}


export function formatCardValue(
  name: keyof typeof METRICS,
  value?: number,
): React.ReactNode {
  if (value === undefined) return;
  if (name === "longestWaitTimeSeconds") {
    return formatTimeSince(value === 0 ? Date.now() : value);
  }
  return value;
}

export function formatTimeSince(epochTime: number): string {
  // Difference in milliseconds
  const diffMs = Date.now() - epochTime;

  // Convert to total seconds
  const totalSeconds = Math.floor(diffMs / 1000);

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  // Pad with zeros
  const pad = (num: number) => num.toString().padStart(2, "0");

  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}


/**
 * Returns a text color class corresponding to the agent's current state in dark mode.
 * @param state The agent's current state (e.g., "idle", "available", "connected")
 * @returns A Tailwind text color class
 */
export function getStateTextColor(state: string): string {
  switch (state.toLowerCase()) {
    case "idle":
      return "text-yellow-300";       // warning
    case "available":
      return "text-green-400";        // success
    case "connected":
      return "text-blue-400";         // info
    case "wrapup":
      return "text-purple-400";       // secondary
    case "not_responding":
      return "text-red-400";          // danger
    case "after_call_work":
      return "text-orange-400";       // attention
    case "ringing":
      return "text-pink-400";         // active alert
    case "consult":
      return "text-indigo-300";       // consultative/transition
    case "transferred":
      return "text-teal-300";         // successful handoff

    default:
      return "text-gray-300";         // unknown/other
  }
}

