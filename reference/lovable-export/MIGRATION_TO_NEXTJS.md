# Migration nach Next.js

Dieses Dokument beschreibt die geplante Migration des Prototyps in eine
produktive Anwendung mit **Next.js 15 (App Router)**, **PostgreSQL**,
**Prisma**, **Auth.js** und **Vercel**.

## Aktuelle Struktur (Prototyp)

    src/
      routes/                TanStack file-based routes
      components/public/     Public-Site Shell
      components/staff/      Staff-Portal Shell + Helpers
      components/ui/         shadcn/ui Primitiven
      types/index.ts         Domänen-Typen
      data/mock.ts           Statische Demo-Daten
      repositories/          Repository-Interfaces + Mock-Impl.
      services/auth.tsx      Mock AuthService + React-Kontext
      lib/permissions.ts     Rollen und Berechtigungen

## Zielstruktur (Next.js App Router)

    app/
      (public)/
        page.tsx                        -> /
        restaurant/page.tsx             -> /restaurant
        speisekarte/page.tsx            -> /speisekarte
        events/page.tsx                 -> /events
        reservation/page.tsx            -> /reservation
        kontakt/page.tsx                -> /kontakt
        datenschutz/page.tsx            -> /datenschutz
        impressum/page.tsx              -> /impressum
      (staff)/
        staff/layout.tsx                -> StaffShell + Auth-Gate
        staff/login/page.tsx
        staff/dashboard/page.tsx
        staff/reservierungen/page.tsx
        staff/reservierungen/[id]/page.tsx
        staff/events/page.tsx
        staff/events/new/page.tsx
        staff/events/[id]/page.tsx
        staff/analytics/page.tsx
        staff/sitzbereiche/page.tsx
        staff/oeffnungszeiten/page.tsx
        staff/team/page.tsx
        staff/settings/page.tsx
      api/
        webhooks/…                      -> für externe Provider
    components/                         (unverändert übernehmen)
    features/                           (Domain-Feature-Ordner, optional)
    lib/                                (permissions, utils, auth-helpers)
    repositories/                       (Prisma-basiert)
    services/                           (email, storage, exports)
    prisma/
      schema.prisma
      migrations/
      seed.ts

## Route-Migration

| Prototyp (TanStack)                              | Ziel (App Router)                                        |
|--------------------------------------------------|----------------------------------------------------------|
| `src/routes/index.tsx`                           | `app/(public)/page.tsx`                                  |
| `src/routes/restaurant.tsx`                      | `app/(public)/restaurant/page.tsx`                       |
| `src/routes/speisekarte.tsx`                     | `app/(public)/speisekarte/page.tsx`                      |
| `src/routes/events.tsx`                          | `app/(public)/events/page.tsx`                           |
| `src/routes/reservation.tsx`                     | `app/(public)/reservation/page.tsx`                      |
| `src/routes/kontakt.tsx`                         | `app/(public)/kontakt/page.tsx`                          |
| `src/routes/datenschutz.tsx`                     | `app/(public)/datenschutz/page.tsx`                      |
| `src/routes/impressum.tsx`                       | `app/(public)/impressum/page.tsx`                        |
| `src/routes/staff.login.tsx`                     | `app/(staff)/staff/login/page.tsx`                       |
| `src/routes/staff.dashboard.tsx`                 | `app/(staff)/staff/dashboard/page.tsx`                   |
| `src/routes/staff.reservierungen.index.tsx`      | `app/(staff)/staff/reservierungen/page.tsx`              |
| `src/routes/staff.reservierungen.$id.tsx`        | `app/(staff)/staff/reservierungen/[id]/page.tsx`         |
| `src/routes/staff.events.index.tsx`              | `app/(staff)/staff/events/page.tsx`                      |
| `src/routes/staff.events.new.tsx`                | `app/(staff)/staff/events/new/page.tsx`                  |
| `src/routes/staff.events.$id.tsx`                | `app/(staff)/staff/events/[id]/page.tsx`                 |
| `src/routes/staff.analytics.tsx`                 | `app/(staff)/staff/analytics/page.tsx`                   |
| `src/routes/staff.sitzbereiche.tsx`              | `app/(staff)/staff/sitzbereiche/page.tsx`                |
| `src/routes/staff.oeffnungszeiten.tsx`           | `app/(staff)/staff/oeffnungszeiten/page.tsx`             |
| `src/routes/staff.team.tsx`                      | `app/(staff)/staff/team/page.tsx`                        |
| `src/routes/staff.settings.tsx`                  | `app/(staff)/staff/settings/page.tsx`                    |

Ersatz für Routing-Primitiven:

- `<Link>` von `@tanstack/react-router` → `next/link`
- `useNavigate()` / `useParams()` → `useRouter()` und `useParams()` aus `next/navigation`
- Route-Loader → Server Components + Prisma direkt oder Server Actions

## Komponenten übernehmen

Alle Dateien unter `src/components/` sind **frontend-only** und
enthalten (mit Ausnahme kleiner `Link`-Imports) keine TanStack-spezifische
Logik. Diese können 1:1 kopiert werden. `Link` durch `next/link` ersetzen.

## Datenzugriff ersetzen

Der aktuelle Pfad ist:

    Component ─► repositories/index.ts (Mock) ─► data/mock.ts (In-Memory)

Zielpfad:

    Server Component / Server Action ─► repositories/reservationRepository.prisma.ts ─► Prisma ─► PostgreSQL

**Vorgehen:**

1. Neues Paket `@prisma/client` installieren, Prisma initialisieren.
2. `prisma/schema.prisma` aus `src/types/index.ts` ableiten
   (Enums, Reservation, Event, User, SeatingArea, OpeningHours, AuditLog).
3. Für jedes Repository (Reservation, Event, User, OpeningHours, Seating)
   eine Prisma-basierte Implementierung anlegen, die die bestehende
   Interface-Signatur einhält.
4. Aufrufe wie `reservationRepository.findMany()` bleiben in den Komponenten
   unverändert – nur der Import zeigt neu auf die Prisma-Implementierung.
5. Client-Komponenten, die Mutationen ausführen (z. B. `updateStatus`),
   auf Server Actions umstellen (`"use server"` + `revalidatePath`).

## Auth.js Integration

- `src/services/auth.tsx` durch Auth.js ersetzen.
- Credentials Provider für E-Mail/Passwort; Einladungen über Magic-Link.
- `middleware.ts` schützt alle Routen unter `/staff/**` ausser `/staff/login`.
- Server-seitiges `auth()` liefert die aktuelle Session in Server Actions
  und Route Handlers.
- Rollen bleiben `EMPLOYEE`, `MANAGER`, `ADMIN` (User-Tabelle in DB).

## Server Action Kandidaten

- `createReservation`
- `updateReservationStatus`
- `addReservationNote`
- `softDeleteReservation` / `restoreReservation`
- `createEvent` / `publishEvent` / `hideEvent` / `softDeleteEvent`
- `inviteUser` / `updateUserRole` / `deactivateUser`
- `updateWeeklyOpeningHours` / `upsertSpecialDate`
- `updateSeatingArea`

## Route Handler Kandidaten

- `GET /api/reservations/export.csv` – CSV-Report für Manager
- `POST /api/webhooks/mailer` – E-Mail-Provider-Callbacks
- `POST /api/reservations/public` – öffentliche API (optional, mit Rate-Limit)

## Middleware

    /staff/**    -> Auth-Check + Rollen-Check
    /api/**      -> Ratenbegrenzung + Herkunftsprüfung

## Vercel

- Framework Preset: Next.js.
- Umgebungsvariablen: `DATABASE_URL`, `AUTH_SECRET`, `AUTH_EMAIL_*`,
  `EMAIL_FROM`, ggf. `SENTRY_DSN`.
- Postgres via Vercel Postgres oder Neon.
- `prisma migrate deploy` als Build-Hook.

## Bekannte Inkompatibilitäten

- TanStack `HeadContent` und `Scripts` werden von Next.js Metadata API abgelöst.
- `sessionStorage`-basierte Demo-Session **nicht** übernehmen – wird durch
  Auth.js Session Cookies ersetzt.
- Der Import `@/assets/*.jpg` wird in Next.js zu `next/image` mit statischen Imports.
