import { useId } from "react";

export default function GoldDivider({ className = "" }: { className?: string }) {
  const uid = useId();
  const leftId = `goldGradientLeft-${uid}`;
  const rightId = `goldGradientRight-${uid}`;

  return (
    <div className={`flex items-center justify-center py-6 ${className}`} aria-hidden="true">
      <svg
        width="400"
        height="24"
        viewBox="0 0 400 24"
        fill="none"
        className="w-full max-w-[400px]"
      >
        {/* Left flourish */}
        <path
          d="M0 12h140"
          stroke={`url(#${leftId})`}
          strokeWidth="1"
        />
        <path
          d="M120 6c10 0 15 6 20 6s10-6 20-6"
          stroke="var(--gold-primary)"
          strokeWidth="1.5"
          fill="none"
        />
        <path
          d="M120 18c10 0 15-6 20-6s10 6 20 6"
          stroke="var(--gold-primary)"
          strokeWidth="1.5"
          fill="none"
        />

        {/* Center diamond */}
        <rect
          x="192"
          y="4"
          width="16"
          height="16"
          rx="1"
          transform="rotate(45 200 12)"
          fill="none"
          stroke="var(--gold-primary)"
          strokeWidth="1.5"
        />
        <rect
          x="196"
          y="8"
          width="8"
          height="8"
          rx="0.5"
          transform="rotate(45 200 12)"
          fill="var(--gold-primary)"
          fillOpacity="0.3"
          stroke="var(--gold-primary)"
          strokeWidth="0.5"
        />

        {/* Right flourish */}
        <path
          d="M260 12h140"
          stroke={`url(#${rightId})`}
          strokeWidth="1"
        />
        <path
          d="M240 6c10 0 15 6 20 6s10-6 20-6"
          stroke="var(--gold-primary)"
          strokeWidth="1.5"
          fill="none"
        />
        <path
          d="M240 18c10 0 15-6 20-6s10 6 20 6"
          stroke="var(--gold-primary)"
          strokeWidth="1.5"
          fill="none"
        />

        <defs>
          <linearGradient id={leftId} x1="0" y1="0" x2="140" y2="0">
            <stop offset="0%" stopColor="var(--gold-primary)" stopOpacity="0" />
            <stop offset="100%" stopColor="var(--gold-primary)" stopOpacity="1" />
          </linearGradient>
          <linearGradient id={rightId} x1="260" y1="0" x2="400" y2="0">
            <stop offset="0%" stopColor="var(--gold-primary)" stopOpacity="1" />
            <stop offset="100%" stopColor="var(--gold-primary)" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
