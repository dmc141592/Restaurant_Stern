import type { ReactNode } from "react";
import { requireDemoSession } from "@/lib/demo-session";

// Server-side gate for everything under this segment. Not real
// authentication — see lib/demo-session.ts. This is deliberately the ONLY
// place the redirect-if-no-session check lives; individual pages trust it
// and just call getDemoSession()/requireDemoSession() again cheaply to read
// the resolved user (no session state is duplicated, it's a plain cookie
// read either way).
//
// No visual chrome here on purpose: each page renders its own <StaffShell>
// with page-specific title/description/actions, so the sidebar/header stay
// a single component instead of fighting Next's layout/page prop boundary.
export default async function AuthenticatedStaffLayout({ children }: { children: ReactNode }) {
  await requireDemoSession();
  return children;
}
