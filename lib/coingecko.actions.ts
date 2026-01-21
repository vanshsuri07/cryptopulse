"use server";

import qs from "query-string";

const BASE_URL = process.env.COINGECKO_BASE_URL;
const API_KEY = process.env.COINGECKO_API_KEY;

if (!BASE_URL) throw new Error("Could not get base url");
if (!API_KEY) throw new Error("Could not get api key");

// Helper function to wait
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function fetcher<T>(
  endpoint: string,
  params?: QueryParams,
  revalidate = 60,
  retries = 3
): Promise<T> {
  const url = qs.stringifyUrl(
    {
      url: `${BASE_URL}${endpoint}`,
      query: params,
    },
    { skipEmptyString: true, skipNull: true }
  );

  let lastError: Error | null = null;

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const response = await fetch(url, {
        headers: {
          "x-cg-demo-api-key": API_KEY,
          "Content-Type": "application/json",
        } as Record<string, string>,
        next: { revalidate },
      });

      // Handle rate limiting specifically
      if (response.status === 429) {
        const retryAfter = response.headers.get("Retry-After");
        const waitTime = retryAfter
          ? parseInt(retryAfter) * 1000
          : Math.min(1000 * Math.pow(2, attempt), 10000); // Exponential backoff: 1s, 2s, 4s (max 10s)

        console.warn(
          `Rate limited (429). Waiting ${waitTime}ms before retry ${attempt + 1}/${retries}...`
        );

        if (attempt < retries - 1) {
          await wait(waitTime);
          continue; // Retry
        }
      }

      if (!response.ok) {
        const errorBody: CoinGeckoErrorBody = await response.json().catch(() => ({}));
        throw new Error(`API Error: ${response.status}: ${errorBody.error || response.statusText}`);
      }

      return response.json();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      // If it's the last attempt, throw the error
      if (attempt === retries - 1) {
        throw lastError;
      }

      // Wait before retrying (exponential backoff for network errors)
      const waitTime = Math.min(1000 * Math.pow(2, attempt), 5000);
      console.warn(
        `Request failed. Retrying in ${waitTime}ms... (attempt ${attempt + 1}/${retries})`
      );
      await wait(waitTime);
    }
  }

  throw lastError || new Error("Failed to fetch data");
}

export async function getPools(token: string) {
  const res = await fetch(`https://api.dexscreener.com/latest/dex/search?q=${token}`);

  if (!res.ok) return null;
  return res.json();
}
