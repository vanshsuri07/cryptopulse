"use server";

import qs from "query-string";

const BASE_URL = process.env.COINGECKO_BASE_URL!;
const API_KEY = process.env.COINGECKO_API_KEY!;

export async function fetcher<T>(
  endpoint: string,
  params?: Record<string, string | number | boolean | undefined>,
  revalidate = 60
): Promise<T> {
  const url = qs.stringifyUrl(
    {
      url: `${BASE_URL}${endpoint}`,
      query: params,
    },
    { skipEmptyString: true, skipNull: true }
  );

  const response = await fetch(url, {
    headers: {
      "x-cg-api-key": API_KEY,
      Accept: "application/json",
    },
    next: { revalidate },
  });

  if (!response.ok) {
    let errorMessage = response.statusText;
    try {
      const body = await response.json();
      errorMessage = body?.error ?? errorMessage;
    } catch {}

    throw new Error(`CoinGecko error ${response.status}: ${errorMessage}`);
  }

  return response.json() as Promise<T>;
}
