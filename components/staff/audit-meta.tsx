// Server-safe presentational block for "created by/at, last modified by/at".
// Callers resolve the user ids to names themselves (they already have
// userRepository data loaded for the page) — keeps this component a pure
// formatter with no data-fetching of its own.
export function AuditMeta({
  createdByName,
  createdAt,
  updatedByName,
  updatedAt,
}: {
  createdByName?: string;
  createdAt?: string;
  updatedByName?: string;
  updatedAt?: string;
}) {
  return (
    <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs text-muted-foreground">
      <div>
        <dt className="uppercase tracking-widest">Erstellt von</dt>
        <dd className="mt-0.5 text-foreground">{createdByName ?? "—"}</dd>
      </div>
      <div>
        <dt className="uppercase tracking-widest">Erstellt am</dt>
        <dd className="mt-0.5 text-foreground">{createdAt ? new Date(createdAt).toLocaleString("de-CH") : "—"}</dd>
      </div>
      <div>
        <dt className="uppercase tracking-widest">Zuletzt geändert von</dt>
        <dd className="mt-0.5 text-foreground">{updatedByName ?? "—"}</dd>
      </div>
      <div>
        <dt className="uppercase tracking-widest">Zuletzt geändert am</dt>
        <dd className="mt-0.5 text-foreground">{updatedAt ? new Date(updatedAt).toLocaleString("de-CH") : "—"}</dd>
      </div>
    </dl>
  );
}
