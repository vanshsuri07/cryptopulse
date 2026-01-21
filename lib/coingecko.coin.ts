// lib/coingecko.coin.ts
import { fetcher } from "@/lib/coingecko.actions";

export type CoinDetail = {
  id: string;
  name: string;
  symbol: string;
  image: {
    large: string;
  };
  description: {
    en: string;
  };
  market_data: {
    current_price: {
      usd: number;
    };
    market_cap: {
      usd: number;
    };
    price_change_percentage_24h: number;
  };
};

export async function getCoinDetail(id: string) {
  return fetcher<CoinDetail>(
    `/coins/${id}`,
    {
      localization: false,
      tickers: false,
      market_data: true,
      community_data: false,
      developer_data: false,
      sparkline: false,
    },
    120
  );
}
