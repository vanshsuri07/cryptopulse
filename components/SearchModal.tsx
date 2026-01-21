"use client";
import React, { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { Input } from "./ui/input";
import Image from "next/image";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import DataTable from "./DataTable";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchModal = ({ isOpen, onClose }: SearchModalProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  interface Coin {
    id: string;
    name: string;
    symbol: string;
    large?: string;
    thumb?: string;
    image?: string;
    price_change_percentage_24h?: number;
    data?: {
      price_change_percentage_24h?: {
        usd?: number;
      };
    };
  }

  const [searchResults, setSearchResults] = useState<Coin[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      // Fetch all coins when modal opens with no search query
      if (searchQuery.length === 0) {
        fetchAllCoins();
      }
    } else {
      document.body.style.overflow = "unset";
      setSearchQuery("");
      setSearchResults([]);
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const fetchAllCoins = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=false`
      );
      const data = await response.json();
      setSearchResults(data || []);
    } catch (error) {
      console.error("Error fetching all coins:", error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const searchCoins = async () => {
      if (searchQuery.trim().length === 0) {
        fetchAllCoins();
        return;
      }

      if (searchQuery.trim().length < 2) {
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(
          `https://api.coingecko.com/api/v3/search?query=${encodeURIComponent(searchQuery)}`
        );
        const data = await response.json();
        setSearchResults(data.coins?.slice(0, 50) || []);
      } catch (error) {
        console.error("Search error:", error);
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    const debounce = setTimeout(searchCoins, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery]);

  const handleClose = () => {
    onClose();
  };

  const handleResultClick = () => {
    handleClose();
  };

  if (!isOpen) return null;

  return (
    <div id="search-modal-overlay" onClick={handleClose}>
      <div id="search-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="search-modal-header">
          <div className="search-input-wrapper">
            <Search size={20} className="search-icon" />
            <Input
              type="text"
              placeholder="Search cryptocurrencies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
              autoFocus
            />
          </div>
          <button onClick={handleClose} className="close-button">
            <X size={24} />
          </button>
        </div>

        <div className="search-results">
          {isLoading && (
            <div className="search-message">
              <p>Searching...</p>
            </div>
          )}

          {!isLoading && searchQuery.length >= 1 && searchResults.length === 0 && (
            <div className="search-message">
              <p>No results found for &apos;{searchQuery}&apos;</p>
            </div>
          )}

          {!isLoading && searchResults.length >= 0 && (
            <ul className="results-list">
              {searchResults.map((coin) => (
                <li key={coin.id}>
                  <Link
                    href={`/coins/${coin.id}`}
                    onClick={handleResultClick}
                    className="result-item"
                  >
                    <div className="result-info">
                      <Image
                        src={
                          [coin.large, coin.thumb, coin.image].find(
                            (src) => typeof src === "string" && src.startsWith("http")
                          ) || "/coin-placeholder.png"
                        }
                        alt={coin.name}
                        width={32}
                        height={32}
                      />

                      <div className="coin-details">
                        <h4>{coin.name}</h4>
                        <p className="symbol">{coin.symbol}</p>
                      </div>
                    </div>
                    {(() => {
                      const priceChange =
                        coin.price_change_percentage_24h ??
                        coin.data?.price_change_percentage_24h?.usd;

                      if (priceChange === null || priceChange === undefined) {
                        return null;
                      }

                      return (
                        <span
                          className={`price-change ${priceChange >= 0 ? "positive" : "negative"}`}
                        >
                          {priceChange.toFixed(2)}%
                        </span>
                      );
                    })()}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
