import type { Metadata } from "next";
import BuildsClient from "./builds-client";

export const metadata: Metadata = {
  title: "Builds",
  description:
    "Browse community-shared Dark and Darker character builds — perks, skills, spells and gear loadouts for every class. Filter by class, playstyle and tier.",
  alternates: { canonical: "/builds" },
  openGraph: {
    title: "Dark and Darker Builds — Community Loadouts",
    description:
      "Community-shared Dark and Darker builds with perks, skills, spells and gear for every class.",
    url: "/builds",
    type: "website",
  },
  twitter: {
    title: "Dark and Darker Builds — Community Loadouts",
    description:
      "Community-shared Dark and Darker builds with perks, skills, spells and gear for every class.",
  },
};

export default function BuildsPage() {
  return <BuildsClient />;
}
