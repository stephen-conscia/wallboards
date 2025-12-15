import { getWallboardConfig, METRICS, Threshold, WALLBOARDS } from "@/config";

export interface Aggregation {
  name: string;
  value?: number;
}

export interface AggregationWithExtras extends Aggregation {
  label: string;
  thresholds?: Threshold;
}

/**
 * Helper to parse aggregations into normalized objects
 */
export function parseAggregations(aggregations: Aggregation[], teamKey?: keyof typeof WALLBOARDS): AggregationWithExtras[] {
  const thresholds = teamKey ? getWallboardConfig(teamKey)?.thresholds : undefined;
  return aggregations.map(agg => ({
    ...agg,
    label: METRICS[agg.name]?.label ?? agg.name,
    thresholds: thresholds?.[agg.name]
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
