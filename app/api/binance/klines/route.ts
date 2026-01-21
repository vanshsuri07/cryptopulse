import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const symbol = searchParams.get("symbol");
  const interval = searchParams.get("interval") ?? "5m";
  const limit = searchParams.get("limit") ?? "288";

  if (!symbol) {
    return NextResponse.json({ error: "Missing symbol" }, { status: 400 });
  }

  const url = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`;

  try {
    const res = await fetch(url, {
      headers: {
        Accept: "application/json",
      },
      // optional caching
      next: { revalidate: 30 },
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Binance API error" }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch klines" }, { status: 500 });
  }
}
