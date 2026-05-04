"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import type { SupabaseClient, User } from "@supabase/supabase-js";

export interface Profile {
  id: string;
  username: string;
  created_at: string;
}

interface AuthContextType {
  supabase: SupabaseClient;
  user: User | null;
  profile: Profile | null;
  isAdmin: boolean;
  loading: boolean;
  authModalOpen: boolean;
  authModalTab: "login" | "signup";
  openAuthModal: (tab?: "login" | "signup") => void;
  closeAuthModal: () => void;
  signOut: () => Promise<void>;
  toast: string | null;
  showToast: (message: string) => void;
  clearToast: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [supabase] = useState(() => createClient());
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<"login" | "signup">("login");
  const [toast, setToast] = useState<string | null>(null);

  const fetchProfile = useCallback(
    async (userId: string) => {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();
      setProfile(data ?? null);
    },
    [supabase]
  );

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      }
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        await fetchProfile(session.user.id);
      } else {
        setProfile(null);
        setIsAdmin(false);
      }
      if (event === "SIGNED_IN") {
        setAuthModalOpen(false);
        setToast("Welcome back, adventurer!");
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase, fetchProfile]);

  // Refetch admin status whenever the user changes. Decoupled from the session
  // effect above so a stale isAdmin=false can't survive a session that was
  // already established when ADMIN_EMAILS later included the user.
  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    fetch("/api/admin/check", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : { admin: false }))
      .then((json: { admin?: boolean }) => {
        if (!cancelled) setIsAdmin(Boolean(json.admin));
      })
      .catch(() => {
        if (!cancelled) setIsAdmin(false);
      });
    return () => {
      cancelled = true;
    };
  }, [user]);

  const openAuthModal = (tab: "login" | "signup" = "login") => {
    setAuthModalTab(tab);
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => setAuthModalOpen(false);
  const showToast = (message: string) => setToast(message);
  const clearToast = () => setToast(null);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setIsAdmin(false);
    router.push("/logout");
  };

  return (
    <AuthContext.Provider
      value={{
        supabase,
        user,
        profile,
        isAdmin,
        loading,
        authModalOpen,
        authModalTab,
        openAuthModal,
        closeAuthModal,
        signOut,
        toast,
        showToast,
        clearToast,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
