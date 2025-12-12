import { API_CACHE_TTL_MS } from "@/config";
import { getCache, setCache } from "./memory-cache";
import { getAccessToken } from "./refresh-token";

const SEARCH_URL = "https://api.wxcc-eu2.cisco.com/search?orgid=Y2lzY29zcGFyazovL3VzL09SR0FOSVpBVElPTi83Mzg0NWZmZC00NTdlLTRlNzItYmRiNy04MDI5YmQ0OWE5YmY";
let timestamp: number = 0;

export async function fetchWallboardData<T>(
  query: string,
  cacheKey: string,
  variables?: Record<string, unknown>,
  ttlMs: number = API_CACHE_TTL_MS
): Promise<T & { timestamp: number }> {

  const cached = getCache<T>(cacheKey);
  if (cached) return { ...cached, timestamp };

  const token = await getAccessToken();

  const response = await fetch(SEARCH_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ query, variables }),
    cache: "no-store"
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    throw new Error(`API error ${response.status}: ${errorText}`);
  }

  try {
    const json = await response.json() as T;
    setCache<T>(cacheKey, json, ttlMs);
    timestamp = Date.now();
    return { ...json, timestamp };
  } catch {
    throw new Error("API returned invalid JSON.");
  }

}

