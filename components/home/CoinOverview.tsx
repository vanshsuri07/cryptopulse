import { fetcher } from "@/lib/coingecko.actions";
import { formatCurrency } from "@/lib/utils";
import Image from "next/image";
import { CoinOverviewFallback } from "./fallback";
import { OhlcData } from "lightweight-charts";
import CandlestickChart from "../CandlestickChart";
import TokenChart from "../CandlestickChart";

const CoinOverview = async () => {
  let coin: CoinDetailsData | null = null;
  let coinOHLCData: OhlcData[] | null = null;

  try {
    [coin, coinOHLCData] = await Promise.all([
      fetcher<CoinDetailsData>("/coins/bitcoin", {
        dex_pair_format: "symbol",
      }),
      fetcher<OhlcData[]>("/coins/bitcoin/ohlc", {
        vs_currency: "usd",
        days: 1,
      }),
    ]);
  } catch (error) {
    console.error("Error fetching coin overview:", error);
  }

  if (!coin) {
    return <CoinOverviewFallback />;
  }

  return (
    <div id="coin-overview">
      <div className="header pt-4 px-4 flex items-center gap-4">
        <Image src={coin.image.large} alt={coin.name} width={56} height={56} />
        <div className="info">
          <p>
            {coin.name} / {coin.symbol.toUpperCase()}
          </p>
          <h1>{formatCurrency(coin.market_data.current_price.usd)}</h1>
        </div>
      </div>
      <TokenChart symbol={coin.symbol}></TokenChart>
    </div>
  );
};

export default CoinOverview;
