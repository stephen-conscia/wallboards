const required = [
  "ACCESS_TOKEN",
  "REFRESH_TOKEN",
  "CLIENT_ID",
  "CLIENT_SECRET",
] as const;

for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

export const env = {
  ACCESS_TOKEN: process.env.ACCESS_TOKEN!,
  REFRESH_TOKEN: process.env.REFRESH_TOKEN!,
  CLIENT_ID: process.env.CLIENT_ID!,
  CLIENT_SECRET: process.env.CLIENT_SECRET!,
};