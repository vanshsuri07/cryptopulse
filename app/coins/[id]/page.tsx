import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { fetcher } from "@/lib/coingecko.actions";
import { formatCurrency } from "@/lib/utils";
import Convertor from "@/components/Convertor";
import LiveDataWrapper from "@/components/LiveDataWrapper";
import { Suspense } from "react";
import {
  LiveDataWrapperFallback,
  ConvertorFallback,
  CoinDetailsSkeleton,
} from "@/components/CoinDetailsFallback";

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  // ✅ CoinGecko FREE endpoint (metadata only)
  const coinData = await fetcher<CoinDetailsData>(`/coins/${id}`, {
    localization: false,
    tickers: false,
    market_data: true,
    community_data: false,
    developer_data: false,
    sparkline: false,
  });

  const coinDetails = [
    {
      label: "Market Cap",
      value: formatCurrency(coinData.market_data.market_cap.usd),
    },
    {
      label: "Market Cap Rank",
      value: `#${coinData.market_cap_rank}`,
    },
    {
      label: "Total Volume",
      value: formatCurrency(coinData.market_data.total_volume.usd),
    },
    {
      label: "Website",
      link: coinData.links.homepage?.[0],
      linkText: "Homepage",
    },
    {
      label: "Explorer",
      link: coinData.links.blockchain_site?.[0],
      linkText: "Explorer",
    },
    {
      label: "Community",
      link: coinData.links.subreddit_url,
      linkText: "Community",
    },
  ];

  return (
    <main id="coin-details-page">
      <section className="primary">
        <Suspense fallback={<LiveDataWrapperFallback />}>
          <LiveDataWrapper coin={coinData} />
        </Suspense>
      </section>

      {/* 📊 METADATA */}
      <section className="secondary">
        <Suspense fallback={<ConvertorFallback />}>
          <Convertor
            symbol={coinData.symbol}
            icon={coinData.image.small}
            priceList={coinData.market_data.current_price}
          />
        </Suspense>

        <Suspense fallback={<CoinDetailsSkeleton />}>
          <div className="details">
            <h4>Coin Details</h4>

            <ul className="details-grid">
              {coinDetails.map(({ label, value, link, linkText }, index) => (
                <li key={index}>
                  <p className="label">{label}</p>

                  {link ? (
                    <div className="link">
                      <Link href={link} target="_blank">
                        {linkText}
                      </Link>
                      <ArrowUpRight size={16} />
                    </div>
                  ) : (
                    <p className="text-base font-medium">{value}</p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </Suspense>
      </section>
    </main>
  );
};

export default Page;
