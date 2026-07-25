// DEMO-ONLY — delete this file when Auth.js is introduced.
//
// Shared between server code (lib/demo-session.ts, which reads this cookie
// via next/headers) and client code (the demo login form / sign-out button,
// which set/clear it via document.cookie). Must not import next/headers or
// any server-only API, so it stays safe to bundle into client components.

export const DEMO_SESSION_COOKIE = "sternen_demo_session";
