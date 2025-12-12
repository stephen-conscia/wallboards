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

export type WallboardConfig = {
  key: string;
  name: string;
  teams: Team[];
  skills: string[];
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
    skills: ["P21 Skill 2"],
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
    skills: ["P21 Skill 1"],
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
      { id: "1ac30844-3392-4fe8-bd90-281490f2db65", name: "Direct Home Sales" },
      { id: "3e1b07fa-9578-4533-bd65-ee152a8db006", name: "Direct GCC Homes" },
      { id: "fd5d5e22-5afa-439a-8443-0a13aa0369c9", name: "Direct GCC Multiskilled" },
    ],
    skills: ["Direct Home Service", "Direct Home Renewal", "Direct Home Sales"],
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
    skills: ["Direct Motor Service", "Direct Motor Renewal", "Direct Motor Sales"],
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
    skills: ["LnP_Agency", "LnP_Annuity", "LnP_BSC_Corp_OPP", "LnP_BSC_NonCorp_OPP", "LnP_Claims", "LnP_CustSC", "LnP_Exist_Claims", "LnP_Exist_Life", "LnP_Pensions", "LnP_UW"],
    thresholds: {
      idle: { warning: 2, danger: 4 },
      callsInQueue: { warning: 2, danger: 3 },
      longestWaitTimeSeconds: { danger: 180, warning: 90, success: 1 },
      available: { danger: 0, warning: 2, success: 3 },
    }
  },
  lnpBroker: {
    key: "lnp",
    name: "LNP Broker",
    teams: [
      { id: "3139aff3-35ab-4b10-9771-8c2869fa1b79", name: "LnP_BSC_Corp_NonCorp" },
    ],
    skills: ["LnP_BSC_Corp_OPP", "LnP_BSC_NonCorp_OPP"],
    thresholds: {
      idle: { warning: 2, danger: 4 },
      callsInQueue: { warning: 2, danger: 3 },
      longestWaitTimeSeconds: { danger: 180, warning: 90, success: 1 },
      available: { danger: 0, warning: 2, success: 3 },
    }
  },
  lnpCsc: {
    key: "lnp",
    name: "LNP CSC",
    teams: [
      { id: "8111c927-86f9-448a-9565-1bb0aa3331ae", name: "LnP_CustSC_BLR" },
    ],
    skills: ["LnP_CustSC"],
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
