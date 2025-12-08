import { GLOBAL_THRESHOLDS, METRICS, Threshold } from "@/config";

export interface Aggregation {
  name: string;
  value: number;
}

export interface AggregationWithExtras extends Aggregation {
  label: string;
  thresholds?: Threshold;
}

/**
 * Helper to parse aggregations into normalized objects
 */
export function parseAggregations(aggregations: Aggregation[]): AggregationWithExtras[] {
  return aggregations.map(agg => ({
    ...agg,
    label: METRICS[agg.name]?.label ?? agg.name,
    thresholds: GLOBAL_THRESHOLDS[agg.name]
  }));
}

/**
 * Helper to get start of day timestamp
 */
export function startOfToday(): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today.getTime();
}


