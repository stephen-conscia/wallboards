import { Threshold } from "@/config";

export type ThresholdStatus = "default" | "warning" | "danger" | "success";

export function getThresholdStatus(
  value: number,
  threshold: Threshold
): "default" | "warning" | "danger" | "success" {
  if (value >= threshold.danger) return "danger";
  if (value >= threshold.warning) return "warning";
  return "default"
}
