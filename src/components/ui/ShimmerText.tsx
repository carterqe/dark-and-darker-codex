interface ShimmerTextProps {
  children: React.ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3" | "span";
}

export default function ShimmerText({
  children,
  className = "",
  as: Tag = "h1",
}: ShimmerTextProps) {
  return (
    <Tag className={`shimmer-text font-cinzel font-bold ${className}`}>
      {children}
    </Tag>
  );
}
