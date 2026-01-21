"use client";

import { useEffect, useState } from "react";
import CoinHeader from "@/components/CoinHeader";
import { Separator } from "@/components/ui/separator";
import TokenChart from "./CandlestickChart";

export default function LiveDataWrapper({ coin }: { coin: CoinDetailsData }) {
  const [price, setPrice] = useState<number | null>(null);
  const [change24h, setChange24h] = useState<number | null>(null);

  useEffect(() => {
    const pair = `${coin.symbol.toLowerCase()}usdt`;

    const socket = new WebSocket(`wss://stream.binance.com:9443/ws/${pair}@ticker`);

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setPrice(Number(data.c)); // current price
      setChange24h(Number(data.P)); // 24h % change
    };

    socket.onerror = () => {
      console.warn("WebSocket disconnected");
    };

    return () => socket.close();
  }, [coin.symbol]);

  return (
    <section id="live-data-wrapper">
      <CoinHeader
        name={coin.name}
        image={coin.image.large}
        livePrice={price ?? coin.market_data.current_price.usd}
        livePriceChangePercentage24h={
          change24h ?? coin.market_data.price_change_percentage_24h_in_currency.usd
        }
        priceChangePercentage30d={coin.market_data.price_change_percentage_30d_in_currency.usd}
        priceChange24h={coin.market_data.price_change_24h_in_currency.usd}
      />
      <Separator className="divider" />

      <div id="trend">
        <TokenChart symbol={coin.symbol} />
      </div>
    </section>
  );
}
