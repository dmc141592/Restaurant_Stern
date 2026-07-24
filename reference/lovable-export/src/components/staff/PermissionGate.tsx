import { ShieldAlert } from "lucide-react";
import type { ReactNode } from "react";
import { useAuth } from "@/services/auth";
import { can, type Permission } from "@/lib/permissions";

// UX-only permission gate. Real enforcement MUST happen server-side.
export function PermissionGate({
  perm,
  children,
  fallback,
}: {
  perm: Permission;
  children: ReactNode;
  fallback?: ReactNode;
}) {
  const { role } = useAuth();
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
