import type { Metadata } from "next";
import EditBuildClient from "./edit-client";

export const metadata: Metadata = {
  title: "Edit Build",
  robots: { index: false, follow: false },
};

type Props = { params: Promise<{ id: string }> };

export default async function EditBuildPage({ params }: Props) {
  const { id } = await params;
  return <EditBuildClient id={id} />;
}
