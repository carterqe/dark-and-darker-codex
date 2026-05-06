import type { Metadata } from "next";
import MapsClient from "./maps-client";

export const metadata: Metadata = {
  title: "Dungeon Reference",
  description:
    "Per-dungeon reference for Dark and Darker — bosses, subbosses, mob pools, and feature counts for Ruins, Crypts, The Ashen Range, Inferno, Frost Mountain, Ice Abyss, Ship Graveyard and The Firedeep. Dungeons are procedurally generated; positions are not fixed.",
  alternates: { canonical: "/maps" },
  openGraph: {
    title: "Dark and Darker — Dungeon Reference",
    description:
      "Bosses, subbosses, mob pools, and feature counts per dungeon. Procedurally generated layouts — positions are not fixed.",
    url: "/maps",
    type: "website",
  },
  twitter: {
    title: "Dark and Darker — Dungeon Reference",
    description:
      "Bosses, subbosses, mob pools, and feature counts per dungeon. Procedurally generated layouts — positions are not fixed.",
  },
};

export default function MapsPage() {
  return <MapsClient />;
}
