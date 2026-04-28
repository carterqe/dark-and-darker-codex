import type { Metadata } from "next";
import MarketClient from "./market-client";

export const metadata: Metadata = {
  title: "Market",
  description:
    "Live Dark and Darker market prices — search trading post listings by item, slot, rarity and class to find the best gold value before you buy or sell.",
  alternates: { canonical: "/market" },
  openGraph: {
    title: "Dark and Darker Market — Live Trading Post Prices",
    description:
      "Live trading post prices for Dark and Darker — filter by item, slot, rarity and class.",
    url: "/market",
    type: "website",
  },
  twitter: {
    title: "Dark and Darker Market — Live Trading Post Prices",
    description:
      "Live trading post prices for Dark and Darker — filter by item, slot, rarity and class.",
  },
};

export default function MarketPage() {
  return <MarketClient />;
}
