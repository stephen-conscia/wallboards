import { getCache, setCache } from "./memory-cache";
import { getAccessToken } from "./refresh-token";

const SEARCH_URL = "https://api.wxcc-eu2.cisco.com/search?orgid=Y2lzY29zcGFyazovL3VzL09SR0FOSVpBVElPTi83Mzg0NWZmZC00NTdlLTRlNzItYmRiNy04MDI5YmQ0OWE5YmY";

export async function fetchWallboardData<T>(
  query: string,
  cacheKey: string,
  variables?: Record<string, unknown>,
  ttlMs: number = 4000
): Promise<T> {

  console.log(variables);
  console.log("cache key", cacheKey);
  const cached = getCache<T>(cacheKey);
  console.log("cached", cached);
  if (cached) console.log("*", cacheKey, "cached");
  if (cached) return cached;
  console.log("no cache.. continuing...");

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
    console.log(`API error ${response.status}: ${errorText}`);
    throw new Error(`API error ${response.status}: ${errorText}`);
  }

  try {
    const json = await response.json() as T;
    setCache<T>(cacheKey, json, ttlMs);
    return json;
  } catch {
    console.log("API returned invalid JSON.");
    throw new Error("API returned invalid JSON.");
  }

}

