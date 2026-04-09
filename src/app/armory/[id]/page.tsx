import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { DarkerDBResponse, DarkerDBItem } from "@/lib/darkerdb";
import ItemDetailClient from "./item-detail-client";

const DARKERDB_API = "https://api.darkerdb.com/v1";

export default async function ItemDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const numericId = parseInt(id, 10);
  if (isNaN(numericId)) notFound();

  try {
    const res = await fetch(`${DARKERDB_API}/items/${numericId}`);
    if (!res.ok) notFound();
    const data: DarkerDBResponse<DarkerDBItem> = await res.json();

    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          href="/armory"
          className="inline-flex items-center gap-2 text-text-secondary hover:text-gold-primary transition-colors text-sm mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Armory
        </Link>
        <ItemDetailClient item={data.body} />
      </div>
    );
  } catch {
    notFound();
  }
}
