import type { Metadata } from "next";
import MapsClient from "./maps-client";

export const metadata: Metadata = {
  title: "Maps",
  description:
    "Interactive Dark and Darker dungeon maps — Goblin Cave, Crypts, Ruins, Inferno, Frost Mountain, Ice Abyss, Ship Graveyard and Firedeep — with extracts, portals, shrines and bosses.",
  alternates: { canonical: "/maps" },
  openGraph: {
    title: "Dark and Darker Maps — Interactive Dungeon Maps",
    description:
      "Interactive Dark and Darker dungeon maps with extracts, portals, shrines, altars, bosses and treasure markers.",
    url: "/maps",
    type: "website",
  },
  twitter: {
    title: "Dark and Darker Maps — Interactive Dungeon Maps",
    description:
      "Interactive Dark and Darker dungeon maps with extracts, portals, shrines, altars, bosses and treasure markers.",
  },
};

export default function MapsPage() {
  return <MapsClient />;
}
