import type { Metadata } from "next";
import type { ReactNode } from "react";

// Applies to every route under app/(staff)/ — login included — so none of
// the internal portal is indexable, without repeating this on every page.
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function StaffRouteGroupLayout({ children }: { children: ReactNode }) {
  return children;
}
