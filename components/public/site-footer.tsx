import Link from "next/link";
import { MapPin, Phone } from "lucide-react";

// Pure static chrome — no interactivity, safe as a Server Component.
export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border bg-primary text-primary-foreground">
      <div className="container-page grid gap-10 py-14 md:grid-cols-4">
        <div>
          <p className="font-serif text-2xl">Sternen Albisrieden</p>
          <p className="mt-3 max-w-xs text-sm text-primary-foreground/70">
            Warme Schweizer Gastfreundschaft im Quartier – seit vielen Jahren.
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-primary-foreground/60">Kontakt</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
              <span>
                Albisriederstrasse 000
                <br />
                8047 Zürich
              </span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <a href="tel:+41000000000" className="hover:underline">
                +41 00 000 00 00
              </a>
            </li>
          </ul>
          <p className="mt-3 text-[11px] text-primary-foreground/50">Demo-Kontakt – vor Veröffentlichung prüfen.</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-primary-foreground/60">Öffnungszeiten</p>
          <ul className="mt-3 space-y-1 text-sm">
            <li>Mo – Do 11:30 – 23:00</li>
            <li>Fr 11:30 – 24:00</li>
            <li>Sa 17:30 – 24:00</li>
            <li className="text-primary-foreground/70">So Ruhetag</li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-primary-foreground/60">Rechtliches</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link href="/impressum" className="hover:underline">
                Impressum
              </Link>
            </li>
            <li>
              <Link href="/datenschutz" className="hover:underline">
                Datenschutz
              </Link>
            </li>
            <li>
              <Link
                href="/staff/login"
                className="text-primary-foreground/50 hover:text-primary-foreground/80 hover:underline"
              >
                Mitarbeiterbereich
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-primary-foreground/10">
        <div className="container-page py-4 text-xs text-primary-foreground/60">
          © {new Date().getFullYear()} Restaurant Sternen Albisrieden · Demo-Prototyp
        </div>
      </div>
    </footer>
  );
}
