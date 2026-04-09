import { Swords } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border-subtle bg-bg-secondary/50 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Swords className="w-4 h-4 text-gold-dark" />
            <span className="font-cinzel text-sm text-gold-dark">
              Valor Board
            </span>
          </div>
          <p className="text-xs text-text-secondary">
            Chronicle of Champions &mdash; Where legends are forged
          </p>
        </div>
      </div>
    </footer>
  );
}
