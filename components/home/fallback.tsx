import DataTable from "@/components/ui/DataTable";
import React from "react";

export const CoinOverviewFallback = () => {
  return (
    <div id="coin-overview-fallback">
      <div className="header pt-2">
        <div className="header-image skeleton"></div>
        <div className="info">
          <div className="header-line-sm skeleton"></div>
          <div className="header-line-lg skeleton"></div>
        </div>
      </div>
    </div>
  );
};

export const TrendingCoinsFallback = () => {
  const skeletonData = Array.from({ length: 6 }, (_, i) => ({
    item: {
      id: `skeleton-${i}`,
      name: "",
      symbol: "",
      market_cap_rank: 0,
      thumb: "",
      large: "",
      data: {
        price: 0,
        price_change_percentage_24h: {
          usd: 0,
        },
      },
    },
  }));

  const columns: DataTableColumn<TrendingCoin>[] = [
    {
      header: "Name",
      cellClassName: "name-cell",
      cell: () => (
        <div className="name-link">
          <div className="name-image skeleton"></div>
          <div className="name-line skeleton"></div>
        </div>
      ),
    },
    {
      header: "24h Change",
      cellClassName: "change-cell",
      cell: () => (
        <div className="price-change">
          <div className="change-icon skeleton"></div>
          <div className="change-line skeleton"></div>
        </div>
      ),
    },
    {
      header: "Price",
      cellClassName: "price-cell",
      cell: () => <div className="price-line skeleton"></div>,
    },
  ];

  return (
    <div id="trending-coins-fallback">
      <h4>Trending Coins</h4>
      <DataTable
        data={skeletonData}
        columns={columns}
        rowKey={(coin) => coin.item.id}
        tableClassName="trending-coins-table"
        headerCellClassName="py-3!"
        bodyCellClassName="py-2!"
      />
    </div>
  );
};
