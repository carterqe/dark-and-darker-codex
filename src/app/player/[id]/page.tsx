import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { DarkerDBResponse, DarkerDBCharacter } from "@/lib/darkerdb";
import { SITE } from "@/lib/site";
import PlayerProfileClient from "./player-client";

const DARKERDB_API = "https://api.darkerdb.com/v1";

type Props = { params: Promise<{ id: string }> };

async function fetchCharacter(id: string): Promise<DarkerDBCharacter | null> {
  const numericId = parseInt(id, 10);
  if (isNaN(numericId)) return null;
  try {
    const apiRes = await fetch(`${DARKERDB_API}/characters/${numericId}`, {
      next: { revalidate: 300 },
    });
    if (!apiRes.ok) return null;
    const res: DarkerDBResponse<DarkerDBCharacter> = await apiRes.json();
    return res.body ?? null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const character = await fetchCharacter(id);
  if (!character) {
    return {
      title: "Player not found",
      robots: { index: false, follow: true },
    };
  }
  const path = `/player/${character.id}`;
  const title = `${character.name} — Level ${character.level} ${character.class}`;
  const description = `${character.name}, a level ${character.level} ${character.class} from Early Access Season 7 (historical).`;
  return {
    title,
    description,
    alternates: { canonical: path },
    robots: { index: false, follow: true },
    openGraph: {
      title,
      description,
      url: path,
      type: "profile",
    },
    twitter: { title, description },
  };
}

export default async function PlayerPage({ params }: Props) {
  const { id } = await params;
  const character = await fetchCharacter(id);
  if (!character) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    url: `${SITE.url}/player/${character.id}`,
    name: `${character.name} — Dark and Darker`,
    mainEntity: {
      "@type": "Person",
      name: character.name,
      identifier: String(character.id),
      url: `${SITE.url}/player/${character.id}`,
      additionalProperty: [
        { "@type": "PropertyValue", name: "Class", value: character.class },
        { "@type": "PropertyValue", name: "Level", value: character.level },
        ...(character.rank
          ? [{ "@type": "PropertyValue", name: "Rank", value: character.rank }]
          : []),
        ...(character.rating != null
          ? [{ "@type": "PropertyValue", name: "Rating", value: character.rating }]
          : []),
        ...(character.adventure_points != null
          ? [{ "@type": "PropertyValue", name: "Adventure Points", value: character.adventure_points }]
          : []),
      ],
    },
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <Link
        href="/leaderboard"
        className="inline-flex items-center gap-2 text-text-secondary hover:text-gold-primary transition-colors text-sm mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Leaderboard
      </Link>

      <PlayerProfileClient character={character} />
    </div>
  );
}
