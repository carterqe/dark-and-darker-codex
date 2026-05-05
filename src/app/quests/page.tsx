import type { Metadata } from "next";
import QuestsClient from "./quests-client";

export const metadata: Metadata = {
  title: "Quest Guide",
  description:
    "Dark and Darker quest guide — browse every trader quest, track your progress, and share tips with the community.",
  alternates: { canonical: "/quests" },
  openGraph: {
    title: "Dark and Darker Quest Guide — Track & Complete Every Merchant Quest",
    description:
      "Browse every trader quest in Dark and Darker, mark quests complete, and share community tips.",
    url: "/quests",
    type: "website",
  },
  twitter: {
    title: "Dark and Darker Quest Guide — Track & Complete Every Merchant Quest",
    description:
      "Browse every trader quest in Dark and Darker, mark quests complete, and share community tips.",
  },
};

export default function QuestsPage() {
  return <QuestsClient />;
}
