import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { MemberRecord } from "@/types";

interface AuthContextValue {
  member: MemberRecord | null;
  memberLoading: boolean;
  loginMember: (email: string, membershipOrRef: string) => Promise<{ ok: boolean; error?: string }>;
  logoutMember: () => void;

  isAdmin: boolean;
  adminEmail: string | null;
  loginAdmin: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logoutAdmin: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const MEMBER_SESSION_KEY = "adpap_member_session_v1";
const ADMIN_SESSION_KEY = "adpap_admin_session_v1";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [member, setMember] = useState<MemberRecord | null>(null);
  const [memberLoading, setMemberLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminEmail, setAdminEmail] = useState<string | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem(MEMBER_SESSION_KEY);
    if (raw) {
      try {
        setMember(JSON.parse(raw));
      } catch {
        /* ignore */
      }
    }
    const adminRaw = sessionStorage.getItem(ADMIN_SESSION_KEY);
    if (adminRaw) {
      setIsAdmin(true);
      setAdminEmail(adminRaw);
    }
    setMemberLoading(false);
  }, []);

  async function loginMember(email: string, membershipOrRef: string) {
    if (isSupabaseConfigured) {
      // The `members` table has no anon-readable RLS policy (it holds PII),
      // so lookup goes through a Netlify Function using the service_role
      // key server-side. See netlify/functions/member-login.ts.
      try {
        const res = await fetch("/.netlify/functions/member-login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, membershipOrRef }),
        });
        const data = await res.json();
        if (!res.ok) {
          return { ok: false, error: data.error || "Sign-in failed." };
        }
        const record: MemberRecord = data.member;
        setMember(record);
        sessionStorage.setItem(MEMBER_SESSION_KEY, JSON.stringify(record));
        return { ok: true };
      } catch {
        return { ok: false, error: "Could not reach the server. Please try again." };
      }
    }

    // Demo mode: look up in localStorage demo applications that have been "approved" by admin demo tools.
    const raw = localStorage.getItem("adpap_demo_members_v1");
    const members: MemberRecord[] = raw ? JSON.parse(raw) : [];
    const match = members.find(
      (m) =>
        m.membershipNumber.toLowerCase() === membershipOrRef.trim().toLowerCase() &&
        m.fullNameOrOrg // presence check
    );
    if (!match) {
      return {
        ok: false,
        error:
          "No active membership found for that combination in demo mode. Approve an application in the Admin Dashboard first, then log in with the assigned membership number.",
      };
    }
    setMember(match);
    sessionStorage.setItem(MEMBER_SESSION_KEY, JSON.stringify(match));
    return { ok: true };
  }

  function logoutMember() {
    setMember(null);
    sessionStorage.removeItem(MEMBER_SESSION_KEY);
  }

  async function loginAdmin(email: string, password: string) {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        return { ok: false, error: error.message };
      }
      // Verify the signed-in user is present in admin_users
      const { data: adminRow } = await supabase.from("admin_users").select("email").eq("email", email).maybeSingle();
      if (!adminRow) {
        await supabase.auth.signOut();
        return { ok: false, error: "This account is not authorized for admin access." };
      }
      setIsAdmin(true);
      setAdminEmail(email);
      sessionStorage.setItem(ADMIN_SESSION_KEY, email);
      return { ok: true };
    }

    // Demo mode fallback — NOT for production use.
    const demoPass = import.meta.env.VITE_ADMIN_DEMO_PASSCODE as string | undefined;
    if (demoPass && password === demoPass) {
      setIsAdmin(true);
      setAdminEmail(email);
      sessionStorage.setItem(ADMIN_SESSION_KEY, email);
      return { ok: true };
    }
    return {
      ok: false,
      error:
        "Admin sign-in requires Supabase Auth to be configured (see README), or a VITE_ADMIN_DEMO_PASSCODE set for local demo testing.",
    };
  }

  function logoutAdmin() {
    setIsAdmin(false);
    setAdminEmail(null);
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
    if (isSupabaseConfigured && supabase) {
      supabase.auth.signOut();
    }
  }

  return (
    <AuthContext.Provider
      value={{ member, memberLoading, loginMember, logoutMember, isAdmin, adminEmail, loginAdmin, logoutAdmin }}
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

