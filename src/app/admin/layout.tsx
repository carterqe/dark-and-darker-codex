import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { requireAdmin } from "@/lib/admin-auth";

export const metadata = {
  title: "Admin — Dark and Darker Codex",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const admin = await requireAdmin();
  if (!admin) {
    redirect("/");
  }
  return <>{children}</>;
}
