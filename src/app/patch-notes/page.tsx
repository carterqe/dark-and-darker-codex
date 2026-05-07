import type { Metadata } from "next";
import PatchNotesClient from "./patch-notes-client";

export const metadata: Metadata = {
  title: "Patch Notes",
  description:
    "Latest Dark and Darker patch notes and announcements — pulled directly from the official Steam feed.",
  alternates: { canonical: "/patch-notes" },
  openGraph: {
    title: "Dark and Darker Patch Notes",
    description:
      "Latest Dark and Darker patch notes and announcements from Ironmace.",
    url: "/patch-notes",
    type: "website",
  },
  twitter: {
    title: "Dark and Darker Patch Notes",
    description:
      "Latest Dark and Darker patch notes and announcements from Ironmace.",
  },
};

export default function PatchNotesPage() {
  return <PatchNotesClient />;
}
