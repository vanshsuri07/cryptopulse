"use client";

import { useEffect, useState } from "react";

type Props = {
  symbol: string; // btc, eth, sol
};

export default function LivePriceBySymbol({ symbol }: Props) {
  const [price, setPrice] = useState<string>("—");

  useEffect(() => {
    const pair = `${symbol.toLowerCase()}usdt`;

    const socket = new WebSocket(`wss://stream.binance.com:9443/ws/${pair}@ticker`);

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setPrice(Number(data.c).toLocaleString());
    };

    socket.onerror = () => {
      console.error("WebSocket error");
    };

    return () => socket.close();
  }, [symbol]);

  return <span className="font-semibold text-green-500">${price}</span>;
}
