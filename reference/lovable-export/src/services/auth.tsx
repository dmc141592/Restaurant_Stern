// Mock authentication for the prototype. NOT SECURE. Replaces at migration
// time with Auth.js (credentials + magic-link invitations) + server-side
// session checks in Next.js middleware.

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Session, User, UserRole } from "@/types";
import { mockUsers } from "@/data/mock";

const STORAGE_KEY = "sternen.demo.session";

export interface AuthService {
  signIn(email: string, password: string, roleOverride?: UserRole): Promise<Session>;
  signOut(): Promise<void>;
  getSession(): Session | null;
  requestPasswordReset(email: string): Promise<void>;
  acceptInvitation(token: string, password: string): Promise<void>;
}

export const authService: AuthService = {
  async signIn(email, _password, roleOverride) {
    // Demo only: role selector short-circuits credential check.
    const user =
      mockUsers.find((u) => u.email === email && u.status === "ACTIVE") ??
      (roleOverride ? mockUsers.find((u) => u.role === roleOverride) : undefined) ??
      mockUsers[0];
    const session: Session = {
      user,
      expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
    };
    if (typeof window !== "undefined") {
      // Demo persistence only — never treat localStorage as a real store.
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    }
    return session;
  },
  async signOut() {
    if (typeof window !== "undefined") window.sessionStorage.removeItem(STORAGE_KEY);
  },
  getSession() {
    if (typeof window === "undefined") return null;
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as Session;
    } catch {
      return null;
    }
  },
  async requestPasswordReset() {
    // no-op demo
  },
  async acceptInvitation() {
    // no-op demo
  },
};

// -------- React context --------

interface AuthContextValue {
  session: Session | null;
  user: User | null;
  role: UserRole | undefined;
  signIn: (email: string, password: string, role?: UserRole) => Promise<Session>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);

  // Read persisted session after mount (SSR safety).
  useEffect(() => {
    setSession(authService.getSession());
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user: session?.user ?? null,
      role: session?.user.role,
      async signIn(email, password, role) {
        const s = await authService.signIn(email, password, role);
        setSession(s);
        return s;
      },
      async signOut() {
        await authService.signOut();
        setSession(null);
      },
    }),
    [session],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
