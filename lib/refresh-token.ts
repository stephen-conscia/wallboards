import { env } from "./env";

const TOKEN_REFRESH_URL = "https://webexapis.com/v1/access_token";

interface Token {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  refresh_token_expires_in: number;
  token_type: "Bearer";
  scope: "spark:kms cjp:config_read";
}

interface TokenCache {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

let cached: TokenCache = {
  accessToken: env.ACCESS_TOKEN,
  refreshToken: env.REFRESH_TOKEN,
  expiresAt: 0
}

let inFlightRefresh: Promise<TokenCache> | null = null;

export async function getAccessToken(): Promise<string> {

  if (Date.now() < cached.expiresAt) {
    return cached.accessToken;
  }

  if (inFlightRefresh) {
    const response = await inFlightRefresh;
    return response.accessToken;
  }

  inFlightRefresh = (async () => {
    try {
      const response = await fetch(TOKEN_REFRESH_URL, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        method: "POST",
        body: new URLSearchParams({
          "grant_type": "refresh_token",
          "client_id": env.CLIENT_ID,
          "client_secret": env.CLIENT_SECRET,
          "refresh_token": cached.refreshToken
        })
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Token refresh failed (${response.status}): ${text}`);
      }

      const json = await response.json() as Token;

      cached = {
        accessToken: json.access_token,
        refreshToken: json.refresh_token,
        expiresAt: Date.now() + (json.expires_in * 1000) * 0.75
      };

      return cached;

    } finally {
      inFlightRefresh = null;
    }

  })();

  const token = await inFlightRefresh;
  return token.accessToken;
}
