import { Swords } from "lucide-react";

export default function Footer() {
  return (
    <footer aria-label="Site footer" className="border-t border-border-subtle bg-bg-secondary/50 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Top row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Swords className="w-4 h-4 text-gold-dark" aria-hidden="true" />
            <span className="font-cinzel text-sm text-gold-dark">
              DaD Codex
            </span>
          </div>
          <p className="text-xs text-text-secondary">
            Leaderboards, builds, market &amp; maps for Dark and Darker
          </p>
        </div>

        {/* Disclaimer */}
        <div className="border-t border-border-subtle/50 pt-5 space-y-2">
          <p className="text-[11px] text-text-secondary/50 leading-relaxed text-center">
            IRONMACE&trade; and Dark and Darker&trade; are trademarks of IRONMACE in the U.S. and/or other countries.
            Certain assets and content referenced on this website are &copy; IRONMACE. All rights reserved.
            DaD Codex is a fan-made website created by the community and is in no way affiliated with or endorsed by IRONMACE.
            All intellectual property, including but not limited to game assets, names, logos, and trademarks, belong solely to IRONMACE.
            This website is intended for informational and community purposes only and is not an official source for Dark and Darker.
          </p>
          <p className="text-[10px] text-text-secondary/30 text-center">
            &copy; {new Date().getFullYear()} DaD Codex. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
