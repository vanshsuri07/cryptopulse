import React from "react";

export const LiveDataWrapperFallback = () => {
  return (
    <div id="live-data-wrapper">
      {/* Coin Header Skeleton */}
      <div id="coin-header" className="space-y-5">
        <div className="h-9 w-48 skeleton rounded-md"></div>

        <div className="info">
          <div className="size-11.25 sm:size-12.5 xl:size-19.25 skeleton rounded-full"></div>
          <div className="flex flex-col gap-3">
            <div className="h-12 w-64 skeleton rounded-md"></div>
            <div className="h-8 w-32 skeleton rounded-md"></div>
          </div>
        </div>

        <ul className="stats grid grid-cols-3 gap-4 sm:gap-6">
          {[1, 2, 3].map((i) => (
            <li
              key={i}
              className="flex flex-col gap-2 pr-4 sm:pr-6 border-r last:border-none border-purple-600"
            >
              <div className="h-4 w-20 skeleton rounded"></div>
              <div className="h-6 w-24 skeleton rounded"></div>
            </li>
          ))}
        </ul>
      </div>

      <div className="divider my-8 bg-purple-600"></div>

      {/* Chart Skeleton */}
      <div className="trend w-full">
        <div className="h-7 w-32 skeleton rounded-md mb-4 mt-2 ml-2"></div>

        <div id="candlestick-chart">
          <div className="chart-header">
            <div className="button-group">
              <div className="h-5 w-12 skeleton rounded mr-2"></div>
              {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                <div key={i} className="h-8 w-12 skeleton rounded-md"></div>
              ))}
            </div>
            <div className="button-group">
              <div className="h-5 w-32 skeleton rounded mr-2"></div>
              <div className="h-8 w-16 skeleton rounded-md"></div>
              <div className="h-8 w-16 skeleton rounded-md"></div>
            </div>
          </div>
          <div className="chart-skeleton skeleton rounded-lg"></div>
        </div>
      </div>
    </div>
  );
};

export const ConvertorFallback = () => {
  return (
    <div id="converter">
      <div className="h-6 w-16 skeleton rounded-md mb-3"></div>

      <div className="panel">
        <div className="input-wrapper">
          <div className="h-12 flex-1 skeleton rounded-md"></div>
          <div className="coin-info gap-2">
            <div className="size-5 skeleton rounded-full"></div>
            <div className="h-5 w-12 skeleton rounded"></div>
          </div>
        </div>
      </div>

      <div className="divider">
        <div className="line" />
        <div className="size-8 skeleton rounded-full"></div>
      </div>

      <div className="output-wrapper">
        <div className="h-8 w-32 skeleton rounded-md"></div>
        <div className="h-10 w-24 skeleton rounded-md"></div>
      </div>
    </div>
  );
};

export const CoinDetailsSkeleton = () => {
  return (
    <div className="details">
      <div className="h-7 w-32 skeleton rounded-md mb-4"></div>

      <ul className="details-grid">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <li key={i}>
            <div className="h-4 w-24 skeleton rounded mb-2"></div>
            <div className="h-6 w-32 skeleton rounded"></div>
          </li>
        ))}
      </ul>
    </div>
  );
};
