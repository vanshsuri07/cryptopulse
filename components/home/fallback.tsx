import DataTable from "@/components/DataTable";
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

export const CategoriesFallback = () => {
  const skeletonData = Array.from({ length: 10 }, (_, i) => ({
    id: `skeleton-${i}`,
    name: "",
    market_cap: 0,
    market_cap_change_24h: 0,
    volume_24h: 0,
    top_3_coins: ["", "", ""],
  }));

  const columns: DataTableColumn<Category>[] = [
    {
      header: "Category",
      cellClassName: "category-cell",
      cell: () => <div className="category-skeleton skeleton"></div>,
    },
    {
      header: "Top Gainers",
      cellClassName: "top-gainers-cell",
      cell: () => (
        <>
          <div className="coin-skeleton skeleton"></div>
          <div className="coin-skeleton skeleton"></div>
          <div className="coin-skeleton skeleton"></div>
        </>
      ),
    },
    {
      header: "24h Change",
      cellClassName: "change-cell",
      cell: () => (
        <>
          <div className="value-skeleton-md skeleton"></div>
          <div className="change-icon skeleton"></div>
        </>
      ),
    },
    {
      header: "Market Cap",
      cellClassName: "market-cap-cell",
      cell: () => <div className="value-skeleton-lg skeleton"></div>,
    },
    {
      header: "24h Volume",
      cellClassName: "volume-cell",
      cell: () => <div className="value-skeleton-lg skeleton"></div>,
    },
  ];

  return (
    <div id="categories-fallback">
      <h4>Top Categories</h4>
      <DataTable
        columns={columns}
        data={skeletonData}
        rowKey={(_, index) => index}
        tableClassName="mt-3"
      />
    </div>
  );
};
