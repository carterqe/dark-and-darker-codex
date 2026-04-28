import type { Metadata } from "next";
import QuestsClient from "./quests-client";

export const metadata: Metadata = {
  title: "Quests",
  description:
    "Dark and Darker merchant quests — track every NPC quest, requirements and rewards across each tier and merchant in one place.",
  alternates: { canonical: "/quests" },
  openGraph: {
    title: "Dark and Darker Quests — Merchant Quest Tracker",
    description:
      "Every merchant quest in Dark and Darker with requirements, rewards and tier progression.",
    url: "/quests",
    type: "website",
  },
  twitter: {
    title: "Dark and Darker Quests — Merchant Quest Tracker",
    description:
      "Every merchant quest in Dark and Darker with requirements, rewards and tier progression.",
  },
};

export default function QuestsPage() {
  return <QuestsClient />;
}
