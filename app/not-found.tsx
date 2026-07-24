import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <p className="text-sm uppercase tracking-widest text-muted-foreground">Fehler 404</p>
        <h1 className="mt-3 font-serif text-5xl text-foreground">Seite nicht gefunden</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Die gesuchte Seite existiert nicht oder wurde verschoben.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center justify-center rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90"
        >
          Zur Startseite
        </Link>
      </div>
    </div>
  );
}
