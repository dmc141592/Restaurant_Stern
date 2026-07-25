import { ShieldAlert } from "lucide-react";
import type { ReactNode } from "react";
import { can, type Permission } from "@/lib/permissions";
import type { UserRole } from "@/types";

// UX-only permission gate — hides/shows UI for a nicer experience. This is
// NOT a security boundary: every mutation this gate protects must be
// independently re-checked server-side (see the FUTURE REPLACEMENT POINT
// comments in repositories/*.ts) once Server Actions + Auth.js exist.
//
// No hooks/browser APIs here, so this component works unchanged from both
// Server Components and Client Components — pass the role down explicitly
// rather than reading it from context.
export function PermissionGate({
  role,
  perm,
  children,
  fallback,
}: {
  role: UserRole | undefined;
  perm: Permission;
  children: ReactNode;
  fallback?: ReactNode;
}) {
  if (!can(role, perm)) return <>{fallback ?? null}</>;
  return <>{children}</>;
}

export function Unauthorized({ message }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border bg-muted/30 p-10 text-center">
      <ShieldAlert className="h-8 w-8 text-muted-foreground" />
      <p className="font-medium">Keine Berechtigung</p>
      <p className="max-w-md text-sm text-muted-foreground">
        {message ?? "Sie haben nicht die notwendigen Rechte für diesen Bereich. Wenden Sie sich an eine Managerin oder einen Administrator."}
      </p>
    </div>
  );
}
