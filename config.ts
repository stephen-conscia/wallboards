//
// ─────────────────────────────────────────────────────────────
//  Global Metric and Threshold Definitions
// ─────────────────────────────────────────────────────────────
//

export const API_CACHE_TTL_MS = 3000;
export const CLIENT_REFRESH_INTERVAL_MS = 2000;

export type Threshold = {
  warning: number;
  danger: number;
  success?: number;
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
  longestWaitTimeSeconds: { label: "Longest Wait Time" },
  abandoned: { label: "Abandoned" },
  callsOffered: { label: "Calls Offered" },
  connected: { label: "Connected" },
  agentCount: { label: "Logged In" },
};

type Team = {
  id: string;
  name: string;
};

type Queue = {
  id: string;
  name: string;
};

export type WallboardConfig = {
  key: string;
  name: string;
  teams: Team[];
  queues: Queue[];
  thresholds?: Partial<Record<keyof typeof METRICS, Threshold>>;

};

//
// ─────────────────────────────────────────────────────────────
//  Wallboard Configurations
// ─────────────────────────────────────────────────────────────
//

export const WALLBOARDS: Record<string, WallboardConfig> = {
  conscia: {
    key: "conscia",
    name: "Conscia",
    teams: [
      { id: "89f643cb-5ce4-4951-b426-8d64dae62303", name: "Conscia" },
    ],
    queues: [
      { id: "2c749532-d4a7-4a15-bc04-b46ddc2889f6", name: "P21 Test 3" },
    ],
    thresholds: {
      idle: { warning: 2, danger: 4 },
      callsInQueue: { warning: 2, danger: 3 },
      longestWaitTimeSeconds: { danger: 180, warning: 90, success: 1 },
      available: { danger: 0, warning: 2, success: 3 },

    }
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
    thresholds: {
      idle: { warning: 2, danger: 4 },
      callsInQueue: { warning: 2, danger: 3 },
      longestWaitTimeSeconds: { danger: 180, warning: 90, success: 1 },
      available: { danger: 0, warning: 2, success: 3 },
    }

  },
  directHome: {
    key: "direct-home",
    name: "Home",
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
    thresholds: {
      idle: { warning: 2, danger: 4 },
      callsInQueue: { warning: 2, danger: 3 },
      longestWaitTimeSeconds: { danger: 180, warning: 90, success: 1 },
      available: { danger: 0, warning: 2, success: 3 },
    }

  },

  directMotor: {
    key: "direct-motor",
    name: "Motor",
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
    thresholds: {
      idle: { warning: 2, danger: 4 },
      callsInQueue: { warning: 2, danger: 3 },
      longestWaitTimeSeconds: { danger: 180, warning: 90, success: 1 },
      available: { danger: 0, warning: 2, success: 3 },
    }
  },

  lnp: {
    key: "lnp",
    name: "Contact Center Overview - L&P",
    teams: [
      { id: "3139aff3-35ab-4b10-9771-8c2869fa1b79", name: "LnP_BSC_Corp_NonCorp" },
      { id: "8111c927-86f9-448a-9565-1bb0aa3331ae", name: "LnP_CustSC_BLR" },
      { id: "69639a79-6675-4997-b402-f8cc8733b9c2", name: "LnP_Exist_Claims" },
    ],
    queues: [
      { id: "2146c5f4-d5ee-4579-8c2c-8e44bc3ab87e", name: "LnP_Agency" },
      { id: "ca6cc4ed-5707-4ee1-8009-59e542fdc59b", name: "LnP_Annuity" },
      { id: "653bcf77-d22e-46a5-bff5-f71369991ead", name: "LnP_BSC_Corp_OPP" },
      { id: "32e92361-532c-4a17-b64a-86e84fff954b", name: "LnP_BSC_NonCorp_OPP" },
      { id: "12bf7e76-ff0c-4392-9434-b2c2200c10d8", name: "LnP_Claims" },
      { id: "55a43721-dcdb-4f67-8fd7-931c7c373cd0", name: "LnP_CustSC" },
      { id: "4ba5b95a-0c2d-4f02-a558-97cffd7a20d5", name: "LnP_Exist_Claims" },
      { id: "d6d898e4-b06f-4b53-ad92-0f3896ea0308", name: "LnP_Exist_Life" },
      { id: "dca0160c-72c8-41aa-9300-fed2fe9e7fff", name: "LnP_Pensions" },
      { id: "29b98e8f-2744-474a-b526-da7e8fca084b", name: "LnP_UW" },
    ],
    thresholds: {
      idle: { warning: 2, danger: 4 },
      callsInQueue: { warning: 2, danger: 3 },
      longestWaitTimeSeconds: { danger: 180, warning: 90, success: 1 },
      available: { danger: 0, warning: 2, success: 3 },
    }
  },
} as const;

//
// ─────────────────────────────────────────────────────────────
//  Exported API
// ─────────────────────────────────────────────────────────────
//

export function getWallboardConfig(key: keyof typeof WALLBOARDS) {
  return WALLBOARDS[key];
}
