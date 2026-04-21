import { createAdminClient } from "@/lib/supabase-admin";
import AdminFeedbackClient, {
  type FeedbackItem,
} from "./admin-feedback-client";

export const dynamic = "force-dynamic";

export default async function AdminFeedbackPage() {
  const db = createAdminClient();
  const { data, error } = await db
    .from("feedback")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);

  if (error) {
    console.error("admin feedback page load error:", error);
  }

  const items = (data ?? []) as FeedbackItem[];
  return <AdminFeedbackClient items={items} />;
}
