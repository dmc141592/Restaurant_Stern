import { Link } from "@tanstack/react-router";
import { Menu, MapPin, Phone } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetHeader,
} from "@/components/ui/sheet";

const NAV = [
  { to: "/restaurant", label: "Restaurant" },
  { to: "/speisekarte", label: "Speisekarte" },
  { to: "/events", label: "Events" },
  { to: "/kontakt", label: "Kontakt" },
] as const;

export function PublicShell({ children }: { children: ReactNode }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header
        className={`sticky top-0 z-40 transition-all ${
          scrolled
            ? "border-b border-border bg-background/90 backdrop-blur"
            : "border-b border-transparent bg-background/60 backdrop-blur-sm"
        }`}
      >
        <div className="container-page flex h-16 items-center justify-between gap-4">
          <Link to="/" className="flex items-baseline gap-2">
            <span className="font-serif text-2xl leading-none text-primary">Sternen</span>
            <span className="hidden text-xs uppercase tracking-[0.2em] text-muted-foreground sm:inline">
              Albisrieden
            </span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                activeProps={{ className: "text-primary" }}
                className="text-sm font-medium text-foreground/80 transition-colors hover:text-primary"
              >
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Button asChild size="sm" className="hidden sm:inline-flex">
              <Link to="/reservation">Tisch reservieren</Link>
            </Button>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden" aria-label="Menü öffnen">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[85vw] max-w-sm">
                <SheetHeader>
                  <SheetTitle className="font-serif text-2xl text-primary">Sternen Albisrieden</SheetTitle>
                </SheetHeader>
                <div className="mt-6 flex flex-col gap-1">
                  {NAV.map((n) => (
                    <Link
                      key={n.to}
                      to={n.to}
                      className="rounded-md px-3 py-2 text-base font-medium text-foreground hover:bg-accent/20"
                    >
                      {n.label}
                    </Link>
                  ))}
                  <Link
                    to="/reservation"
                    className="mt-2 rounded-md bg-primary px-3 py-2 text-center text-base font-medium text-primary-foreground"
                  >
                    Tisch reservieren
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main>{children}</main>

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
                <span>Albisriederstrasse 000<br />8047 Zürich</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <a href="tel:+41000000000" className="hover:underline">+41 00 000 00 00</a>
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
              <li><Link to="/impressum" className="hover:underline">Impressum</Link></li>
              <li><Link to="/datenschutz" className="hover:underline">Datenschutz</Link></li>
              <li>
                <Link
                  to="/staff/login"
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
    </div>
  );
}
