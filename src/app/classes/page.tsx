import type { Metadata } from "next";
import ClassesClient from "./classes-client";

export const metadata: Metadata = {
  title: "Classes",
  description:
    "Every Dark and Darker class — Fighter, Barbarian, Rogue, Ranger, Wizard, Cleric, Bard, Warlock, Druid, Sorcerer — with perks, skills, spells and memory builds.",
  alternates: { canonical: "/classes" },
  openGraph: {
    title: "Dark and Darker Classes — Perks, Skills & Spells",
    description:
      "Browse every Dark and Darker class with perks, skills, spells, songs, shapeshift forms and memory builds.",
    url: "/classes",
    type: "website",
  },
  twitter: {
    title: "Dark and Darker Classes — Perks, Skills & Spells",
    description:
      "Browse every Dark and Darker class with perks, skills, spells, songs, shapeshift forms and memory builds.",
  },
};

export default function ClassesPage() {
  return <ClassesClient />;
}
