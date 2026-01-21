"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { CandlestickSeries, createChart, IChartApi, ISeriesApi, Time } from "lightweight-charts";
import {
  getChartConfig,
  LIVE_INTERVAL_BUTTONS,
  PERIOD_BUTTONS,
  PERIOD_CONFIG,
  type Period,
} from "@/constants";
import { cn } from "@/lib/utils";

type Props = {
  symbol: string; // btc, eth, sol
  height?: number;
  children?: React.ReactNode;
};

// Binance Kline data structure: [openTime, open, high, low, close, volume, closeTime, ...]
type BinanceKline = [
  number, // Open time
  string, // Open
  string, // High
  string, // Low
  string, // Close
  string, // Volume
  number, // Close time
  string, // Quote asset volume
  number, // Number of trades
  string, // Taker buy base asset volume
  string, // Taker buy quote asset volume
  string, // Unused field
];

// Map periods to Binance intervals
const PERIOD_TO_BINANCE_INTERVAL: Record<Period, string> = {
  daily: "5m",
  weekly: "15m",
  monthly: "1h",
  "3months": "4h",
  "6months": "1d",
  yearly: "1d",
  max: "1w",
};

export default function TokenChart({ symbol, height = 400, children }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const socketRef = useRef<WebSocket | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<Period>("daily");
  const [liveInterval, setLiveInterval] = useState<"1s" | "1m">("1m");
  const [isLiveMode, setIsLiveMode] = useState(true);

  // Cleanup WebSocket
  const closeWebSocket = () => {
    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
    }
  };

  // Fetch historical data
  const fetchHistoricalData = async (period: Period) => {
    if (!seriesRef.current) return;

    try {
      setIsLoading(true);
      setError(null);
      closeWebSocket();

      const baseSymbol = symbol.toUpperCase();

      // ❌ Binance does NOT support these
      const UNSUPPORTED = ["USDT", "USDC", "DAI"];

      if (UNSUPPORTED.includes(baseSymbol)) {
        console.warn(`No Binance chart for ${baseSymbol}`);
        setError(`No chart available for ${baseSymbol}`);
        setIsLoading(false);
        return;
      }

      const pair = `${baseSymbol}USDT`;
      const config = PERIOD_CONFIG[period];
      const interval = PERIOD_TO_BINANCE_INTERVAL[period];

      // Calculate limit based on period
      let limit = 500;
      if (config.days === "max") {
        limit = 1000; // Maximum allowed by Binance
      } else if (typeof config.days === "number") {
        // Estimate candles needed
        const hoursInPeriod = config.days * 24;
        const intervalHours = interval.includes("m")
          ? parseInt(interval) / 60
          : interval.includes("h")
            ? parseInt(interval)
            : parseInt(interval) * 24;
        limit = Math.min(Math.ceil(hoursInPeriod / intervalHours), 1000);
      }

      const response = await fetch(
        `https://api.binance.com/api/v3/klines?symbol=${pair}&interval=${interval}&limit=${limit}`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.status}`);
      }

      const data = await response.json();

      const candles = data.map((d: BinanceKline) => ({
        time: Math.floor(d[0] / 1000) as Time,
        open: parseFloat(d[1]),
        high: parseFloat(d[2]),
        low: parseFloat(d[3]),
        close: parseFloat(d[4]),
      }));

      seriesRef.current.setData(candles);
      chartRef.current?.timeScale().fitContent();

      setIsLoading(false);
    } catch (err) {
      console.error("Error fetching historical data:", err);
      setError("Failed to load chart data");
      setIsLoading(false);
    }
  };

  // Setup live WebSocket
  const setupLiveUpdates = () => {
    closeWebSocket();

    const pair = `${symbol.toUpperCase()}USDT`;
    const binanceInterval = liveInterval === "1s" ? "1s" : "1m";
    const streamName = pair.toLowerCase();

    let wsUrl: string;

    if (liveInterval === "1s") {
      // Use trade stream for second-by-second updates
      wsUrl = `wss://stream.binance.com:9443/ws/${streamName}@trade`;
    } else {
      // Use kline stream for minute candles
      wsUrl = `wss://stream.binance.com:9443/ws/${streamName}@kline_1m`;
    }

    const socket = new WebSocket(wsUrl);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log(`✅ Live updates connected for ${pair} (${liveInterval})`);
    };

    socket.onmessage = (event) => {
      if (!seriesRef.current) return;

      try {
        const message = JSON.parse(event.data);

        if (liveInterval === "1s") {
          // Trade stream - update with trade price
          const price = parseFloat(message.p);
          const time = Math.floor(message.T / 1000) as Time;

          seriesRef.current.update({
            time,
            open: price,
            high: price,
            low: price,
            close: price,
          });
        } else {
          // Kline stream - update with candlestick
          const kline = message.k;
          if (!kline) return;

          const candle = {
            time: Math.floor(kline.t / 1000) as Time,
            open: parseFloat(kline.o),
            high: parseFloat(kline.h),
            low: parseFloat(kline.l),
            close: parseFloat(kline.c),
          };

          seriesRef.current.update(candle);
        }
      } catch (err) {
        console.error("Error processing WebSocket message:", err);
      }
    };

    socket.onerror = (err) => {
      console.error("WebSocket error:", err);
    };

    socket.onclose = () => {
      console.log("WebSocket disconnected");
    };
  };

  // Initialize chart
  useEffect(() => {
    if (!containerRef.current) return;

    const chart = createChart(containerRef.current, getChartConfig(height, true));
    chart.applyOptions({
      timeScale: {
        tickMarkFormatter: (time: number) => {
          const date = new Date(time * 1000);
          const hours = date.getHours().toString().padStart(2, "0");
          const minutes = date.getMinutes().toString().padStart(2, "0");
          return `${hours}:${minutes}`;
        },
      },
    });
    chartRef.current = chart;

    const series = chart.addSeries(CandlestickSeries);
    seriesRef.current = series;

    // Handle resize
    const handleResize = () => {
      if (containerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: containerRef.current.clientWidth,
        });
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      closeWebSocket();
      if (chartRef.current) {
        chartRef.current.remove();
      }
    };
  }, [height]);

  // Handle period/live mode changes
  useEffect(() => {
    if (isLiveMode) {
      fetchHistoricalData(selectedPeriod);
      setupLiveUpdates();
    } else {
      fetchHistoricalData(selectedPeriod);
    }
  }, [symbol, selectedPeriod, isLiveMode, liveInterval]);

  return (
    <div id="candlestick-chart">
      {/* Controls */}
      <div className="chart-header">
        {/* Period Buttons */}
        <div className="button-group">
          <span className="text-sm mx-2 font-medium text-purple-100/50">Period:</span>
          {PERIOD_BUTTONS.map((button) => (
            <button
              key={button.value}
              onClick={() => {
                setSelectedPeriod(button.value);
                setIsLiveMode(false);
              }}
              className={selectedPeriod === button.value ? "config-button-active" : "config-button"}
            >
              {button.label}
            </button>
          ))}
        </div>

        {/* Live Mode Toggle */}
        <div className="button-group">
          <span className="text-sm mx-2 font-medium text-purple-100/50">Update Frequency:</span>
          {LIVE_INTERVAL_BUTTONS.map((button) => (
            <button
              key={button.value}
              onClick={() => setLiveInterval(button.value)}
              className={cn(
                "px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
                liveInterval === button.value
                  ? "bg-blue-600 text-white"
                  : "bg-[#1a2332] text-[#8f9fb1] hover:bg-[#242f42]"
              )}
            >
              {button.label}
            </button>
          ))}
        </div>
      </div>

      <div
        className="relative w-full bg-[#0b1116] rounded-lg overflow-hidden"
        style={{ minHeight: `${height}px` }}
      >
        <Suspense fallback={null} />
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#0b1116] z-10">
            <div className="text-red-500">{error}</div>
          </div>
        )}
        <div ref={containerRef} className="chart" />
      </div>
    </div>
  );
}
