import type { AuditLog } from "@/types";

// Server-safe and interaction-free: uses the native <details> element for
// expandable metadata instead of a Client Component + useState.
export function AuditLogList({ logs }: { logs: AuditLog[] }) {
  if (logs.length === 0) {
    return <p className="text-sm text-muted-foreground">Keine Einträge.</p>;
  }
  return (
    <ul className="space-y-2">
      {logs.map((l) => (
        <li key={l.id} className="rounded-md border border-border p-3 text-sm">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="font-medium">{l.actorName}</span>{" "}
              <span className="text-muted-foreground">· {l.entityType}</span>
            </div>
            <span className="text-xs text-muted-foreground">{new Date(l.createdAt).toLocaleString("de-CH")}</span>
          </div>
          <p className="mt-1">{l.summary}</p>
          {l.details && (
            <details className="mt-2">
              <summary className="cursor-pointer text-xs text-primary">Details anzeigen</summary>
              <pre className="mt-1 overflow-x-auto rounded bg-muted/50 p-2 text-xs">
                {JSON.stringify(l.details, null, 2)}
              </pre>
            </details>
          )}
        </li>
      ))}
    </ul>
  );
}
