//
// ─────────────────────────────────────────────────────────────
//  Global Metric and Threshold Definitions
// ─────────────────────────────────────────────────────────────
//

export type Threshold = {
  warning: number;
  danger: number;
};

/**
 * A global registry of metric definitions.
 */
type MetricConfig = {
  label: string;
};

export const METRICS: Record<string, MetricConfig> = {
  idle: { label: "Idle" },
  available: { label: "Available" },
  callsInQueue: { label: "Calls in Queue" },
  longestWaitTimeSeconds: { label: "Longest Wait Time (Seconds)" },
};

/**
 * Global thresholds shared by all wallboards
 */
export const GLOBAL_THRESHOLDS: Record<string, Threshold> = {
  idle: { warning: 3, danger: 8 },
  available: { warning: 3, danger: 8 },
  callsInQueue: { warning: 3, danger: 8 },
  longestWaitTimeSeconds: { warning: 300, danger: 600 },
};

//
// ─────────────────────────────────────────────────────────────
//  Wallboard Types
// ─────────────────────────────────────────────────────────────
//

type Team = {
  id: string;
  name: string;
};

type Queue = {
  id: string;
  name: string;
};

type WallboardConfig = {
  key: string;
  name: string;
  teams: Team[];
  queues: Queue[];
  thresholds: typeof GLOBAL_THRESHOLDS; // shared thresholds
};

//
// ─────────────────────────────────────────────────────────────
//  Wallboard Configurations
// ─────────────────────────────────────────────────────────────
//

const WALLBOARDS: Record<string, WallboardConfig> = {
  conscia: {
    key: "conscia",
    name: "Conscia",
    teams: [
      { id: "89f643cb-5ce4-4951-b426-8d64dae62303", name: "Conscia" },
    ],
    queues: [
      { id: "2c749532-d4a7-4a15-bc04-b46ddc2889f6", name: "P21 Test 3" },
    ],
    thresholds: GLOBAL_THRESHOLDS,
  },
  plannet21: {
    key: "plannet21",
    name: "Plannet 21",
    teams: [
      { id: "72fcc0c5-454a-4876-87c2-fc63c4d90050", name: "P21 Test" },
    ],
    queues: [
      { id: "4da6f031-9b94-479a-95f1-0229d05f2ed3", name: "P21 Test 1" },
      { id: "357cb757-368d-4c9a-957e-7b9d9f17458b", name: "P21 Test 2" },
    ],
    thresholds: GLOBAL_THRESHOLDS,
  },
  directHome: {
    key: "direct-home",
    name: "Contact Center Overview - Direct",
    teams: [
      { id: "cb915eaa-097c-4102-ae59-66cc959affee", name: "Direct Home Service" },
      { id: "80c53cbd-92fc-4b44-8353-ef549ec37643", name: "Direct Home Renewal" },
      { id: "1ac30844-3392-4fe8-bd90-281490f2db65", name: "Direct Homes Sales" },
      { id: "3e1b07fa-9578-4533-bd65-ee152a8db006", name: "Direct GCC Homes" },
      { id: "fd5d5e22-5afa-439a-8443-0a13aa0369c9", name: "Direct GCC Multiskilled" },
    ],
    queues: [
      { id: "1fed1e63-7538-4479-9fd6-99fa4ccc0416", name: "Direct Home Service" },
      { id: "cdc1be33-c6c3-4f4f-a44e-bdccde7b087d", name: "Direct Home Renewal" },
      { id: "1f9f483c-434b-466b-94b3-cbc7211ad394", name: "Direct Home Sales" },
    ],
    thresholds: GLOBAL_THRESHOLDS,
  },

  directMotor: {
    key: "direct-motor",
    name: "Contact Center Overview - Direct Motor",
    teams: [
      { id: "fd5d5e22-5afa-439a-8443-0a13aa0369c9", name: "Direct GCC Multiskilled" },
      { id: "1fe8a4f8-c5dc-4154-80cc-0ebeb297fc55", name: "Direct GCC Motor" },
      { id: "e903a6b4-2d83-406b-a3a3-87f5c737864c", name: "Direct Motor Care" },
      { id: "95b7cc1c-ab8c-4325-a2e2-902072af5cf8", name: "Direct Motor Renewal" },
      { id: "dcdc1e54-7139-4e24-b592-1a8f88bd4c91", name: "Direct Motor Sales" },
    ],
    queues: [
      { id: "c87a4c7f-862a-479e-99a9-d3d1d925a279", name: "Direct Motor Service" },
      { id: "853f7c5d-f01c-495d-ac42-741e9c6bd1d3", name: "Direct Motor Renewal" },
      { id: "1265b5a6-c3de-4bc0-b19d-247994538384", name: "Direct Motor Sales" },
    ],
    thresholds: GLOBAL_THRESHOLDS,
  },

  landp: {
    key: "landp",
    name: "Contact Center Overview - L&P",
    teams: [
      { id: "TEAM_3_ID", name: "L&P Team 1" },
      { id: "TEAM_4_ID", name: "L&P Team 2" },
    ],
    queues: [
      { id: "QUEUE_3_ID", name: "L&P Queue 1" },
    ],
    thresholds: GLOBAL_THRESHOLDS,
  },
};

//
// ─────────────────────────────────────────────────────────────
//  Exported API
// ─────────────────────────────────────────────────────────────
//

export function getWallboardConfig(key: string) {
  return WALLBOARDS[key];
}
