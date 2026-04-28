import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CLASS_DATA, getClassData } from "@/lib/class-data";
import ClassDetailClient from "./class-detail-client";

type Props = {
  params: Promise<{ className: string }>;
};

export function generateStaticParams() {
  return Object.keys(CLASS_DATA).map((className) => ({
    className: encodeURIComponent(className),
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { className: raw } = await params;
  const className = decodeURIComponent(raw);
  const data = getClassData(className);
  if (!data) return { title: "Class not found" };

  const extras = [
    data.spells ? "spells" : null,
    data.songs ? "songs" : null,
    data.shapeshiftForms ? "shapeshift forms" : null,
  ]
    .filter(Boolean)
    .join(", ");
  const description = `${className} class guide for Dark and Darker — perks, skills${extras ? `, ${extras}` : ""} and memory builds.`;
  const path = `/classes/${encodeURIComponent(className)}`;

  return {
    title: `${className} Class`,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: `${className} — Dark and Darker Class Guide`,
      description,
      url: path,
      type: "article",
    },
    twitter: {
      title: `${className} — Dark and Darker Class Guide`,
      description,
    },
  };
}

export default async function ClassDetailPage({ params }: Props) {
  const { className: raw } = await params;
  const className = decodeURIComponent(raw);
  if (!getClassData(className)) notFound();
  return <ClassDetailClient className={className} />;
}
