"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Shield,
  Trophy,
  Sword,
  Store,
  Users,
  Globe,
  Swords,
  Hammer,
  ScrollText,
  Map,
  LogOut,
  LogIn,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import AuthModal from "@/components/auth/AuthModal";
import Toast from "@/components/ui/Toast";

const navLinks = [
  { href: "/", label: "Hall", icon: Shield },
  { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { href: "/armory", label: "Armory", icon: Sword },
  { href: "/bazaar", label: "Bazaar", icon: Store },
  { href: "/classes", label: "Classes", icon: Users },
  { href: "/realm", label: "Realm", icon: Globe },
  { href: "/builds", label: "Builds", icon: Hammer },
  { href: "/quests", label: "Quests", icon: ScrollText },
  { href: "/maps", label: "Maps", icon: Map },
];

export default function Navbar() {
  const pathname = usePathname();
  const { user, profile, loading, openAuthModal, signOut, toast, clearToast } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border-subtle bg-bg-primary/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group shrink-0">
              <Swords className="w-5 h-5 sm:w-6 sm:h-6 text-gold-primary group-hover:text-gold-light transition-colors" />
              <span className="font-cinzel font-bold text-base sm:text-lg text-gold-primary group-hover:text-gold-light transition-colors hidden sm:inline">
                DaD Codex
              </span>
            </Link>

            {/* Desktop nav links */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive =
                  pathname === link.href ||
                  (link.href !== "/" && pathname.startsWith(link.href));
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-sm text-sm font-medium transition-all duration-200
                      ${
                        isActive
                          ? "text-gold-light bg-gold-primary/10 border border-gold-primary/30"
                          : "text-text-secondary hover:text-gold-primary border border-transparent"
                      }`}
                  >
                    <Icon className="w-4 h-4" />
                    {link.label}
                  </Link>
                );
              })}
            </div>

            {/* Right side: auth + mobile toggle */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Auth area */}
              {!loading &&
                (user ? (
                  <>
                    <span className="text-xs font-cinzel font-bold text-gold-primary hidden sm:block truncate max-w-[100px]">
                      {profile?.username ?? user.email?.split("@")[0]}
                    </span>
                    <button
                      onClick={signOut}
                      title="Sign out"
                      className="flex items-center px-2 py-2 text-text-secondary hover:text-accent-red border border-transparent hover:border-accent-red/30 rounded-sm transition-all text-xs"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => openAuthModal("login")}
                    className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-gold-primary border border-gold-primary/30 rounded-sm hover:bg-gold-primary/10 transition-all"
                  >
                    <LogIn className="w-4 h-4" />
                    <span className="hidden sm:inline">Login</span>
                  </button>
                ))}

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden flex items-center px-2 py-2 text-text-secondary hover:text-gold-primary transition-colors"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile nav drawer */}
        {mobileOpen && (
          <div className="md:hidden border-t border-border-subtle bg-bg-primary/95 backdrop-blur-md">
            <div className="px-4 py-3 space-y-1">
              {navLinks.map((link) => {
                const isActive =
                  pathname === link.href ||
                  (link.href !== "/" && pathname.startsWith(link.href));
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm font-medium transition-all
                      ${
                        isActive
                          ? "text-gold-light bg-gold-primary/10 border border-gold-primary/30"
                          : "text-text-secondary hover:text-gold-primary border border-transparent"
                      }`}
                  >
                    <Icon className="w-4 h-4" />
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </nav>
      <AuthModal />
      <Toast message={toast} onClose={clearToast} duration={5000} />
    </>
  );
}
