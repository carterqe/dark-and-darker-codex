import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { DarkerDBResponse, DarkerDBItem } from "@/lib/darkerdb";
import { SITE } from "@/lib/site";
import ItemDetailClient from "./item-detail-client";

const DARKERDB_API = "https://api.darkerdb.com/v1";

type Props = { params: Promise<{ id: string }> };

async function fetchItem(id: string): Promise<DarkerDBItem | null> {
  const numericId = parseInt(id, 10);
  if (isNaN(numericId)) return null;
  try {
    const res = await fetch(`${DARKERDB_API}/items/${numericId}`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    const data: DarkerDBResponse<DarkerDBItem> = await res.json();
    return data.body ?? null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const item = await fetchItem(id);
  if (!item) {
    return {
      title: "Item not found",
      robots: { index: false, follow: true },
    };
  }
  const path = `/armory/${item.id}`;
  const title = `${item.name} — ${item.rarity} ${item.type}`;
  const description = item.description?.trim()
    ? item.description
    : `${item.rarity} ${item.type}${item.armor_type ? ` (${item.armor_type})` : ""} in Dark and Darker — gear score ${item.gear_score}, vendor price ${item.vendor_price}g.`;

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      type: "article",
    },
    twitter: { title, description },
  };
}

export default async function ItemDetailPage({ params }: Props) {
  const { id } = await params;
  const item = await fetchItem(id);
  if (!item) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: item.name,
    sku: String(item.id),
    description: item.description || `${item.rarity} ${item.type} in Dark and Darker.`,
    category: item.type,
    url: `${SITE.url}/armory/${item.id}`,
    brand: { "@type": "Brand", name: "Dark and Darker" },
    additionalProperty: [
      { "@type": "PropertyValue", name: "Rarity", value: item.rarity },
      { "@type": "PropertyValue", name: "Gear Score", value: item.gear_score },
      ...(item.armor_type
        ? [{ "@type": "PropertyValue", name: "Armor Type", value: item.armor_type }]
        : []),
      ...(item.slot_type
        ? [{ "@type": "PropertyValue", name: "Slot", value: item.slot_type }]
        : []),
    ],
    offers: {
      "@type": "Offer",
      price: item.vendor_price,
      priceCurrency: "XGP",
      availability: "https://schema.org/InStock",
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
        href="/armory"
        className="inline-flex items-center gap-2 text-text-secondary hover:text-gold-primary transition-colors text-sm mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Armory
      </Link>
      <ItemDetailClient item={item} />
    </div>
  );
}
