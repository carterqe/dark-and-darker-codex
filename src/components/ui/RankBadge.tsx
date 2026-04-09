import { Crown } from "lucide-react";

interface RankBadgeProps {
  rank: number;
  size?: "sm" | "lg";
}

export default function RankBadge({ rank, size = "sm" }: RankBadgeProps) {
  const isTop3 = rank <= 3;
  const sizeClasses = size === "lg" ? "w-12 h-14" : "w-8 h-10";
  const textSize = size === "lg" ? "text-lg" : "text-sm";

  if (!isTop3) {
    return (
      <span className={`font-cinzel font-bold ${textSize} text-gold-dark`}>
        {rank}
      </span>
    );
  }

  const colors = {
    1: { fill: "#c9a84c", stroke: "#e8d48b", bg: "rgba(201,168,76,0.15)" },
    2: { fill: "#a8a8b8", stroke: "#c8c8d8", bg: "rgba(168,168,184,0.15)" },
    3: { fill: "#8a6746", stroke: "#b08860", bg: "rgba(138,103,70,0.15)" },
  };

  const c = colors[rank as 1 | 2 | 3];

  return (
    <div className={`relative ${sizeClasses} flex items-center justify-center`}>
      {/* Shield SVG */}
      <svg
        viewBox="0 0 40 48"
        fill="none"
        className="absolute inset-0 w-full h-full"
      >
        <path
          d="M20 2L4 10V24C4 34 20 46 20 46C20 46 36 34 36 24V10L20 2Z"
          fill={c.bg}
          stroke={c.fill}
          strokeWidth="2"
        />
        <path
          d="M20 6L8 12V24C8 32 20 42 20 42C20 42 32 32 32 24V12L20 6Z"
          fill="none"
          stroke={c.stroke}
          strokeWidth="0.5"
          opacity="0.5"
        />
      </svg>

      {/* Crown for rank 1, number for others */}
      {rank === 1 ? (
        <Crown className="w-4 h-4 relative z-10" style={{ color: c.fill }} />
      ) : (
        <span
          className={`font-cinzel font-bold ${textSize} relative z-10`}
          style={{ color: c.fill }}
        >
          {rank}
        </span>
      )}
    </div>
  );
}
