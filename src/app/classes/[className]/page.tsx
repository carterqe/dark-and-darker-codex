import ClassDetailClient from "./class-detail-client";

export default async function ClassDetailPage({
  params,
}: {
  params: Promise<{ className: string }>;
}) {
  const { className } = await params;
  return <ClassDetailClient className={decodeURIComponent(className)} />;
}
