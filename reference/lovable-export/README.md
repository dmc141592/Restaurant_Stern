# Restaurant Sternen Albisrieden – Frontend Prototyp

Vollständiger, responsiver Frontend-Prototyp einer Restaurant-Website
und eines internen Reservations- und Betriebsportals für das
Restaurant Sternen Albisrieden in Zürich.

Dieses Repository ist bewusst **frontend-only** und **backend-neutral**:
alle Daten liegen in typisierten Mock-Repositories, die Schnittstellen
sind so gebaut, dass sie später eins zu eins durch Prisma-Queries in
einer Next.js App Router Anwendung ersetzt werden können.

## Ziel & Nutzen

- Zeigt, wie eine klassische Restaurant-Website zu einer kompletten
  digitalen Reservations- und Betriebsplattform ausgebaut werden kann.
- Dient als visueller und struktureller Referenz-Prototyp für die
  spätere Migration nach Next.js + PostgreSQL + Prisma + Auth.js +
  Vercel.

## Hauptfunktionen

### Öffentliche Website
- Startseite mit Hero, Story, Garten, Menu-Vorschau, Events, Kontakt
- Restaurant-Seite, Speisekarte, Events, Kontakt
- Reservationsformular mit React Hook Form + Zod
- Rechtsseiten (Impressum, Datenschutz)

### Mitarbeiterportal
- Login-Seite mit Demo-Rollenwechsel
- Dashboard mit Betriebskennzahlen
- Reservationsverwaltung (Liste, Filter, Suche, Detail, Notizen, Status)
- Event-Verwaltung (Liste, Neu, Detail, Veröffentlichung)
- Analytics (Recharts: Verlauf, Wochentag, Zeit, Status, Bereich)
- Sitzbereiche mit Kapazitäten
- Öffnungszeiten und Spezialtage
- Team-/Rollenverwaltung mit Einladungs-Flow
- Berechtigungsmatrix

## Design

- Warme Cream/Off-White Basis
- Deep Forest Green als Primärfarbe
- Chestnut Brown & Muted Gold als Akzente
- Charcoal für Text
- Serifen-Headings (Cormorant Garamond), Sans-Body (Inter)
- Zurückhaltende Rundungen, grosszügige Weissflächen
- Responsive bei 375 / 768 / 1024 / 1440 px

## Technologie

- React 19, TypeScript (strict)
- TanStack Router (später abgelöst durch Next.js App Router)
- Tailwind CSS v4
- shadcn/ui + Radix
- React Hook Form + Zod
- Recharts
- Lucide React
- date-fns

## Architektur

    src/
      routes/              Seiten (TanStack file-based)
      components/
        public/            Öffentliche Shell, Header, Footer
        staff/             StaffShell, StatusBadge, PermissionGate
        ui/                shadcn Primitiven
      types/               Domänen-Typen (Prisma-kompatibel)
      data/mock.ts         Realistische Demo-Daten
      repositories/        Repository-Interfaces + Mock-Implementierung
      services/auth.tsx    Mock AuthService + Kontext
      lib/permissions.ts   Rollen, Berechtigungen, Helper

## Rollen

| Rolle       | Übersicht                                                       |
|-------------|-----------------------------------------------------------------|
| Mitarbeiter | Reservationen einsehen, bearbeiten, Notizen, Events erstellen   |
| Manager     | + Löschen/Wiederherstellen, Sitzbereiche, Öffnungszeiten, Team  |
| Admin       | + Rollen ändern, Manager einladen, Audit-Log, Systemeinstellungen |

Die vollständige Matrix ist unter **/staff/settings** einsehbar.

## Lokal starten

    bun install
    bun run dev

Auf <http://localhost:8080> öffnen.

## Prototyp-Hinweise

- **Kein echter Backend.** Alle Daten liegen im Speicher.
- **Keine echte Authentifizierung.** Rollen sind über einen Demo-Wechsler
  wählbar. In Produktion durch Auth.js ersetzt.
- **Faktische Angaben (Preise, Zeiten, Adresse) sind Platzhalter** und
  im Code als `Demo-Inhalt – vor Veröffentlichung prüfen` markiert.

## Migration nach Next.js

Siehe [MIGRATION_TO_NEXTJS.md](./MIGRATION_TO_NEXTJS.md) für Zielstruktur,
Route-Mapping und Ersetzungsplan der Mock-Services.

Siehe [BACKEND_TODO.md](./BACKEND_TODO.md) für die vollständige Liste
aller Backend-Aufgaben (Schema, Auth, Emails, RLS, Monitoring, Backups).

## Deployment (Ziel)

Vercel · Next.js App Router · PostgreSQL · Prisma · Auth.js.

## Weiterentwicklung

- E-Mail-Bestätigungen und Kunden-Erinnerungen
- Kalenderintegration (ICS-Export)
- Zahlungsintegration für Events (Stripe)
- Mehrsprachigkeit (DE/EN/FR)
- Public-API für Partnerplattformen
