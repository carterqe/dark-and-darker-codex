import type { Metadata } from "next";
import CreateBuildClient from "./create-client";

export const metadata: Metadata = {
  title: "Create Build — Valor Board",
  description: "Share your Dark and Darker character build with the community.",
};

export default function CreateBuildPage() {
  return <CreateBuildClient />;
}
