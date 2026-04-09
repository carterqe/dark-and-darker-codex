import type { Metadata } from "next";
import BuildsClient from "./builds-client";

export const metadata: Metadata = {
  title: "Builds — Valor Board",
  description: "Browse Dark and Darker character builds shared by the community.",
};

export default function BuildsPage() {
  return <BuildsClient />;
}
