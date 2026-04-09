import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { DarkerDBResponse, DarkerDBCharacter } from "@/lib/darkerdb";
import PlayerProfileClient from "./player-client";

const DARKERDB_API = "https://api.darkerdb.com/v1";

export default async function PlayerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const numericId = parseInt(id, 10);

  if (isNaN(numericId)) {
    notFound();
  }

  try {
    const apiRes = await fetch(`${DARKERDB_API}/characters/${numericId}`);
    if (!apiRes.ok) notFound();
    const res: DarkerDBResponse<DarkerDBCharacter> = await apiRes.json();
    const character = res.body;

    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
  } catch {
    notFound();
  }
}
