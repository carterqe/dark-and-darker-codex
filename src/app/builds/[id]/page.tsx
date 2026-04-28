import type { Metadata } from "next";
import { createClient } from "@/lib/supabase-server";
import { SITE } from "@/lib/site";
import type { Build } from "@/lib/build-types";
import BuildDetailClient from "./build-detail-client";

type Props = { params: Promise<{ id: string }> };

async function fetchBuildMeta(
  id: string,
): Promise<Pick<Build, "id" | "title" | "description" | "class" | "tags" | "is_public"> | null> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("builds")
      .select("id, title, description, class, tags, is_public")
      .eq("id", id)
      .single();
    return data ?? null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const build = await fetchBuildMeta(id);
  if (!build || !build.is_public) {
    return {
      title: "Build",
      robots: { index: false, follow: true },
    };
  }
  const path = `/builds/${build.id}`;
  const title = `${build.title} — ${build.class} Build`;
  const description = build.description?.trim()
    ? build.description.slice(0, 200)
    : `${build.class} build for Dark and Darker${build.tags?.length ? ` — ${build.tags.slice(0, 4).join(", ")}` : ""}.`;

  return {
    title,
    description,
    alternates: { canonical: path },
    keywords: build.tags?.length
      ? [build.class, "Dark and Darker build", ...build.tags]
      : undefined,
    openGraph: {
      title,
      description,
      url: path,
      type: "article",
      siteName: SITE.fullName,
    },
    twitter: { title, description },
  };
}

export default async function BuildDetailPage({ params }: Props) {
  const { id } = await params;
  return <BuildDetailClient id={id} />;
}
