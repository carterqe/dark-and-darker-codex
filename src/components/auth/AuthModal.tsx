"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Lock, User, Swords, AlertCircle, CheckCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const inputClass =
  "w-full pl-10 pr-4 py-2.5 bg-bg-primary border border-border-subtle rounded-sm text-sm text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-gold-primary/50 transition-all";

export default function AuthModal() {
  const { supabase, authModalOpen, authModalTab, closeAuthModal } = useAuth();
  const [tab, setTab] = useState<"login" | "signup">(authModalTab);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Sync tab when modal opens with a specific tab
  useEffect(() => {
    if (authModalOpen) {
      setTab(authModalTab);
      setError(null);
      setSuccess(null);
      setEmail("");
      setUsername("");
      setPassword("");
      setConfirmPassword("");
    }
  }, [authModalOpen, authModalTab]);

  const switchTab = (t: "login" | "signup") => {
    setTab(t);
    setError(null);
    setSuccess(null);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    setLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    const trimmedUsername = username.trim();

    // Check username availability first
    const { data: existing } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", trimmedUsername)
      .maybeSingle();

    if (existing) {
      setError("That username is already taken.");
      setLoading(false);
      return;
    }

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username: trimmedUsername },
        emailRedirectTo: `${window.location.origin}/api/auth/callback`,
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    // Create profile row via server route, passing access token
    // (cookies aren't set yet right after signUp, so we send the token directly)
    if (signUpData.user) {
      const profileRes = await fetch("/api/auth/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: trimmedUsername,
          access_token: signUpData.session?.access_token,
        }),
      });

      if (!profileRes.ok) {
        const { error: profileErr } = await profileRes.json();
        setError(`Account created but profile setup failed: ${profileErr}`);
        setLoading(false);
        return;
      }
    }

    setSuccess(
      "Account created! If email confirmation is required, check your inbox. Otherwise you're already signed in."
    );
    setLoading(false);
  };

  return (
    <AnimatePresence>
      {authModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeAuthModal();
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-md mx-4 bg-bg-secondary border border-border-subtle rounded-sm overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-border-subtle">
              <div className="flex items-center gap-2">
                <Swords className="w-5 h-5 text-gold-primary" />
                <span className="font-cinzel font-bold text-gold-primary">
                  {tab === "login" ? "Welcome Back" : "Join the Realm"}
                </span>
              </div>
              <button
                onClick={closeAuthModal}
                className="text-text-secondary hover:text-text-primary transition-colors p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-border-subtle">
              {(["login", "signup"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => switchTab(t)}
                  className={`flex-1 py-3 text-xs font-cinzel font-bold uppercase tracking-wider transition-all ${
                    tab === t
                      ? "text-gold-primary border-b-2 border-gold-primary -mb-px"
                      : "text-text-secondary hover:text-text-primary"
                  }`}
                >
                  {t === "login" ? "Sign In" : "Create Account"}
                </button>
              ))}
            </div>

            <div className="p-6 space-y-4">
              {error && (
                <div className="flex items-center gap-2.5 bg-accent-red/10 border border-accent-red/30 rounded-sm px-4 py-3">
                  <AlertCircle className="w-4 h-4 text-accent-red shrink-0" />
                  <p className="text-xs text-accent-red">{error}</p>
                </div>
              )}
              {success && (
                <div className="flex items-center gap-2.5 bg-accent-emerald/10 border border-accent-emerald/30 rounded-sm px-4 py-3">
                  <CheckCircle className="w-4 h-4 text-accent-emerald shrink-0" />
                  <p className="text-xs text-accent-emerald">{success}</p>
                </div>
              )}

              {tab === "login" ? (
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-gold-dark font-bold block mb-1.5">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="your@email.com"
                        className={inputClass}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-gold-dark font-bold block mb-1.5">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="••••••••"
                        className={inputClass}
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 bg-gold-primary text-bg-primary font-cinzel font-bold text-sm rounded-sm hover:bg-gold-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                  >
                    {loading ? "Signing in..." : "Sign In"}
                  </button>
                  <p className="text-center text-xs text-text-secondary">
                    No account?{" "}
                    <button
                      type="button"
                      onClick={() => switchTab("signup")}
                      className="text-gold-primary hover:text-gold-light underline"
                    >
                      Create one
                    </button>
                  </p>
                </form>
              ) : (
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-gold-dark font-bold block mb-1.5">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="your@email.com"
                        className={inputClass}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-gold-dark font-bold block mb-1.5">
                      Username
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        minLength={3}
                        maxLength={20}
                        pattern="^[a-zA-Z0-9_]+$"
                        placeholder="your_username"
                        className={inputClass}
                      />
                    </div>
                    <p className="text-[10px] text-text-secondary/60 mt-1">
                      Letters, numbers, underscores · 3–20 characters
                    </p>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-gold-dark font-bold block mb-1.5">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={8}
                        placeholder="Min. 8 characters"
                        className={inputClass}
                      />
                    </div>
                    <p className="text-[10px] text-text-secondary/60 mt-1">
                      Must be at least 8 characters
                    </p>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-gold-dark font-bold block mb-1.5">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        minLength={8}
                        placeholder="Re-enter password"
                        className={inputClass}
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 bg-gold-primary text-bg-primary font-cinzel font-bold text-sm rounded-sm hover:bg-gold-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                  >
                    {loading ? "Creating account..." : "Create Account"}
                  </button>
                  <p className="text-center text-xs text-text-secondary">
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => switchTab("login")}
                      className="text-gold-primary hover:text-gold-light underline"
                    >
                      Sign in
                    </button>
                  </p>
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
