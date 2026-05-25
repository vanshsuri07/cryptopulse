# 🚀 CryptoPulse

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-38B2AC?logo=tailwindcss&logoColor=white)

**CryptoPulse** is a modern crypto market dashboard built with Next.js. It highlights Bitcoin’s snapshot, trending coins, and top categories with clean visuals and fast server-side data fetching.

---

## ✨ Highlights

- 📊 **Bitcoin overview** with current price and OHLC chart.
- 🔥 **Trending coins** table with 24h change indicators.
- 🧭 **Top categories** view with market cap and volume snapshots.
- ⚡ **Server-first data fetching** with retries and caching.
- 🎨 **Composable UI** powered by Radix UI, Tailwind CSS, and Lucide icons.

---

## 🧰 Tech Stack

- **Framework:** Next.js (App Router)
- **UI:** React 19, Tailwind CSS, Radix UI, Lucide Icons
- **Charts:** Lightweight Charts
- **API:** CoinGecko (via server actions)

---

## 🏁 Getting Started

### 1) Install dependencies

```bash
npm install
```

### 2) Set environment variables

Create a `.env.local` file:

```bash
COINGECKO_BASE_URL=https://api.coingecko.com/api/v3
COINGECKO_API_KEY=your_api_key_here

NEXT_PUBLIC_COINGECKO_API_KEY=your_api_key_here
NEXT_PUBLIC_COINGECKO_WEBSOCKET_URL=wss://stream.coingecko.com/v1
```

### 3) Run the app

```bash
npm run dev
```

Visit **http://localhost:3000** to view the dashboard.

---

## 🧪 Scripts

```bash
npm run dev       # Start local dev server
npm run build     # Build for production
npm run start     # Start production server
npm run lint      # Lint the codebase
npm run format    # Format with Prettier
```

---

## 📁 Project Structure

```text
app/            # App Router pages and layouts
components/     # Shared UI components
lib/            # API clients and utilities
public/         # Static assets
```

---

## 🌐 Data Sources

- **CoinGecko API** for prices, trending coins, and categories.
- **Dexscreener** (optional) for pool data.

---

## 📦 Deployment

Deploy easily with [Vercel](https://vercel.com/new) or your preferred Node.js host.

---

## 🙌 Contributing

Issues and pull requests are welcome. If you’re proposing a feature, include context or a quick mockup to speed up review.
