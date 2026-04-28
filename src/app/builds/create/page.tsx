import type { Metadata } from "next";
import CreateBuildClient from "./create-client";

export const metadata: Metadata = {
  title: "Create Build",
  description:
    "Share your Dark and Darker character build with the community — pick perks, skills, spells and gear and publish your loadout.",
  alternates: { canonical: "/builds/create" },
  robots: { index: false, follow: true },
};

export default function CreateBuildPage() {
  return <CreateBuildClient />;
}
