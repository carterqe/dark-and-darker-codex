import type { Metadata } from "next";
import BuildDetailClient from "./build-detail-client";

export const metadata: Metadata = {
  title: "Build — Dark and Darker Codex",
};

export default async function BuildDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <BuildDetailClient id={id} />;
}
