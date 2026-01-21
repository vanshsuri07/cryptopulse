"use client";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useGlobalSearch } from "./GlobalSearchProvider";

const Navbar = () => {
  const pathName = usePathname();
  const { openSearch } = useGlobalSearch();

  return (
    <header>
      <div className="main-container inner">
        <Link href="/">
          <Image src="/logo.png" alt="CryptoPulse Logo" width={132} height={40} />
        </Link>

        <nav>
          <Link
            href="/"
            className={cn("nav-link", {
              "is-active": pathName === "/",
              "is-home": true,
            })}
          >
            Home
          </Link>

          <button onClick={openSearch} className="nav-link search-button">
            <span>Search</span>
            <kbd className="search-kbd">
              <span className="text-xs">⌘K</span>
            </kbd>
          </button>

          <Link
            href="/coins"
            className={cn("nav-link", {
              "is-active": pathName === "/coins",
            })}
          >
            All Coins
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
