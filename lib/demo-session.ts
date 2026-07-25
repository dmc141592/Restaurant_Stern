// DEMO-ONLY — delete this file when Auth.js is introduced.
//
// This is NOT authentication. It is a cookie that names one of four seeded
// mock users so the staff-portal UI can be previewed under each role while
// the frontend is being built. There is no password, no credential check,
// and no server-side verification of any kind — anyone can set this cookie
// to any value and see that role's UI. The real session/role check MUST be
// implemented server-side with Auth.js before this portal is ever exposed
// outside local development.

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { mockUsers } from "@/data/mock";
import type { User } from "@/types";
import { DEMO_SESSION_COOKIE } from "./demo-session-shared";

export interface DemoSession {
  user: User;
}

export async function getDemoSession(): Promise<DemoSession | null> {
  const store = await cookies();
  const userId = store.get(DEMO_SESSION_COOKIE)?.value;
  if (!userId) return null;
  const user = mockUsers.find((u) => u.id === userId && u.status === "ACTIVE");
  if (!user) return null;
  return { user };
}

// Use at the top of every page/layout under app/(staff)/staff/(authenticated)/.
export async function requireDemoSession(): Promise<DemoSession> {
  const session = await getDemoSession();
  if (!session) redirect("/staff/login");
  return session;
}
