import { AlertTriangle } from "lucide-react";

export default function BetaBanner() {
  return (
    <div
      className="fixed top-0 left-0 right-0 z-[60] h-7 flex items-center justify-center
                 bg-gradient-to-r from-amber-950/95 via-amber-900/95 to-amber-950/95
                 border-b border-gold-primary/40 backdrop-blur-sm"
      role="note"
      aria-label="Beta notice"
    >
      <div className="flex items-center gap-2 text-[11px] sm:text-xs font-medium text-gold-light tracking-wide">
        <AlertTriangle className="w-3.5 h-3.5 text-gold-primary flex-shrink-0" aria-hidden="true" />
        <span>
          <span className="font-bold text-gold-primary uppercase tracking-wider">Beta</span>
          <span className="text-gold-light/80 ml-2">— data may be incomplete or inaccurate while we refine the experience.</span>
        </span>
      </div>
    </div>
  );
}
