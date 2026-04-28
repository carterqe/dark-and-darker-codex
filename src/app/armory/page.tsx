import type { Metadata } from "next";
import ArmoryClient from "./armory-client";

export const metadata: Metadata = {
  title: "Armory",
  description:
    "Search every Dark and Darker item — weapons, armor, jewelry, consumables and utility — with stats, rarity, gear score and class restrictions.",
  alternates: { canonical: "/armory" },
  openGraph: {
    title: "Dark and Darker Armory — Item Database",
    description:
      "Search every Dark and Darker item with stats, rarity, gear score and class restrictions.",
    url: "/armory",
    type: "website",
  },
  twitter: {
    title: "Dark and Darker Armory — Item Database",
    description:
      "Search every Dark and Darker item with stats, rarity, gear score and class restrictions.",
  },
};

export default function ArmoryPage() {
  return <ArmoryClient />;
}
