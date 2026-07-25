import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { roleLabel } from "@/lib/permissions";
import type { AuditLog } from "@/types";

// Admin-only change history. Server-safe (no hooks/browser APIs), so it
// costs nothing to render from a Server Component.
//
// TODO (migration): entries come from `prisma.auditLog.findMany()` once a
// real database exists; every field this component reads (actorRole, field,
// oldValue, newValue, comment) is already on the AuditLog type in
// types/index.ts so no UI changes should be needed when that happens.
export function AuditTimeline({ entries }: { entries: AuditLog[] }) {
  if (entries.length === 0) {
    return <p className="text-sm text-muted-foreground">Noch keine Änderungen erfasst.</p>;
  }

  return (
    <ol className="space-y-6 border-l border-border pl-6">
      {entries.map((entry) => (
        <li key={entry.id} className="relative">
          <span className="absolute -left-[1.6rem] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-background bg-primary" />
          <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
            <p className="text-sm font-medium text-foreground">
              {entry.actorName}
              {entry.actorRole && (
                <span className="ml-1.5 text-xs font-normal text-muted-foreground">({roleLabel(entry.actorRole)})</span>
              )}
            </p>
            <time dateTime={entry.createdAt} className="text-xs text-muted-foreground">
              {new Date(entry.createdAt).toLocaleString("de-CH", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </time>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{entry.summary}</p>
          {entry.field && (
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="font-normal">
                {entry.field}
              </Badge>
              {entry.oldValue && <span className="text-xs text-muted-foreground">{entry.oldValue}</span>}
              {entry.oldValue && entry.newValue && <ArrowRight className="h-3 w-3 text-muted-foreground" />}
              {entry.newValue && <span className="text-xs font-medium text-foreground">{entry.newValue}</span>}
            </div>
          )}
          {entry.comment && <p className="mt-1.5 text-xs italic text-muted-foreground">„{entry.comment}“</p>}
        </li>
      ))}
    </ol>
  );
}
