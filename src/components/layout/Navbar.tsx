"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Shield,
  Sword,
  Store,
  Users,
  Swords,
  Hammer,
  Newspaper,
  LogOut,
  LogIn,
  Menu,
  X,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import AuthModal from "@/components/auth/AuthModal";
import Toast from "@/components/ui/Toast";

const navLinks = [
  { href: "/", label: "Hall", icon: Shield },
  { href: "/builds", label: "Builds", icon: Hammer },
  { href: "/classes", label: "Classes", icon: Users },
  { href: "/armory", label: "Armory", icon: Sword },
  { href: "/market", label: "Market", icon: Store },
  { href: "/patch-notes", label: "Patch Notes", icon: Newspaper },
];

const adminLink = { href: "/admin/feedback", label: "Admin", icon: ShieldCheck };

export default function Navbar() {
  const pathname = usePathname();
  const { user, profile, isAdmin, loading, openAuthModal, signOut, toast, clearToast } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [signOutConfirm, setSignOutConfirm] = useState(false);
  const links = isAdmin ? [...navLinks, adminLink] : navLinks;

  async function handleSignOut() {
    setSignOutConfirm(false);
    await signOut();
  }

  return (
    <>
      <nav aria-label="Main navigation" className="fixed top-7 left-0 right-0 z-50 border-b border-border-subtle bg-bg-primary/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Logo */}
            <Link href="/" aria-label="DaD Codex — Home" className="flex items-center gap-2 group shrink-0 cursor-pointer">
              <Swords className="w-5 h-5 sm:w-6 sm:h-6 text-gold-primary group-hover:text-gold-light transition-colors" aria-hidden="true" />
              <span className="font-cinzel font-bold text-base sm:text-lg text-gold-primary group-hover:text-gold-light transition-colors hidden sm:inline">
                DaD Codex
              </span>
            </Link>

            {/* Desktop nav links */}
            <div className="hidden md:flex items-center gap-1">
              {links.map((link) => {
                const isActive =
                  pathname === link.href ||
                  (link.href !== "/" && pathname.startsWith(link.href));
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={isActive ? "page" : undefined}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-sm text-sm font-medium transition-all duration-200 cursor-pointer
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
                      onClick={() => setSignOutConfirm(true)}
                      title="Sign out"
                      aria-label="Sign out"
                      className="flex items-center px-2 py-2 text-text-secondary hover:text-accent-red border border-transparent hover:border-accent-red/30 rounded-sm transition-all text-xs cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => openAuthModal("login")}
                    className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-gold-primary border border-gold-primary/30 rounded-sm hover:bg-gold-primary/10 transition-all cursor-pointer"
                  >
                    <LogIn className="w-4 h-4" />
                    <span className="hidden sm:inline">Login</span>
                  </button>
                ))}

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
                aria-expanded={mobileOpen}
                aria-controls="mobile-nav"
                className="md:hidden flex items-center px-2 py-2 text-text-secondary hover:text-gold-primary transition-colors cursor-pointer"
              >
                {mobileOpen ? <X className="w-5 h-5" aria-hidden="true" /> : <Menu className="w-5 h-5" aria-hidden="true" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile nav drawer */}
        {mobileOpen && (
          <div id="mobile-nav" className="md:hidden border-t border-border-subtle bg-bg-primary/95 backdrop-blur-md">
            <div className="px-4 py-3 space-y-1">
              {links.map((link) => {
                const isActive =
                  pathname === link.href ||
                  (link.href !== "/" && pathname.startsWith(link.href));
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    aria-current={isActive ? "page" : undefined}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm font-medium transition-all cursor-pointer
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
      {/* Sign-out confirmation */}
      {signOutConfirm && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setSignOutConfirm(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="signout-title"
            className="bg-bg-secondary border border-border-subtle rounded-sm p-6 w-full max-w-sm shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-2">
              <LogOut className="w-5 h-5 text-accent-red shrink-0" aria-hidden="true" />
              <h2 id="signout-title" className="font-cinzel font-bold text-base text-text-primary">
                Sign Out?
              </h2>
            </div>
            <p className="text-sm text-text-secondary mb-6">
              Your session will end. You can sign back in at any time.
            </p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setSignOutConfirm(false)}
                className="px-4 py-2 text-xs font-medium text-text-secondary border border-border-subtle rounded-sm hover:text-text-primary hover:border-text-secondary/30 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSignOut}
                className="px-4 py-2 text-xs font-medium text-accent-red border border-accent-red/30 rounded-sm hover:bg-accent-red/10 transition-all"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
      <AuthModal />
      <Toast message={toast} onClose={clearToast} duration={5000} />
    </>
  );
}
