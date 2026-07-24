# Backend TODO – Sternen Albisrieden

Vollständige Liste aller Backend-Arbeiten, die für die produktive
Version fehlen. Der aktuelle Prototyp ist rein frontend und enthält
**keinerlei echte Sicherheit oder Persistenz**.

## Datenbank

- [ ] PostgreSQL-Datenbank bereitstellen (Vercel Postgres / Neon / RDS)
- [ ] Prisma-Setup: `prisma init`, `.env` mit `DATABASE_URL`
- [ ] `prisma/schema.prisma` aus `src/types/index.ts` ableiten:
      Reservation, Customer, ReservationNote, RestaurantEvent, User,
      SeatingArea, DailyOpeningHours, SpecialOpeningDate, AuditLog,
      Notification, Invitation
- [ ] Enums migrieren: `ReservationStatus`, `ReservationSource`,
      `ReservationOccasion`, `UserRole`, `UserStatus`, `EventStatus`,
      `EventVisibility`, `AuditAction`
- [ ] Indices auf `Reservation(date, time)`, `Reservation(customerEmail)`,
      `User(email)`, `Event(startDate, status)`
- [ ] Initial-Migration + `prisma migrate deploy` in Vercel-Buildhook
- [ ] Seed-Skript für Sitzbereiche und Standard-Öffnungszeiten

## Authentifizierung (Auth.js)

- [ ] Credentials Provider für Mitarbeitende (E-Mail/Passwort)
- [ ] Passwort-Hashing mit `argon2` oder `bcrypt`
- [ ] Session-Cookies (httpOnly, secure, SameSite=Lax)
- [ ] „Passwort vergessen"-Flow (Magic-Link)
- [ ] Einladungs-Flow: Admin/Manager erstellt Einladung → E-Mail →
      Empfänger setzt Passwort → Konto wird aktiv
- [ ] `middleware.ts`: Zugriff auf `/staff/**` erfordert Session
- [ ] Rollen-Check pro Route (siehe Berechtigungsmatrix)

## Autorisierung

- [ ] `lib/permissions.ts` server-seitig gespiegelt
- [ ] Jede Server Action prüft: `assertPermission(session, 'reservation.softDelete')`
- [ ] Row-Level-Checks in Repositories (z. B. `deletedAt IS NULL` per Default)
- [ ] Optional: PostgreSQL Row-Level Security für zusätzliche Absicherung

## Emails

- [ ] E-Mail-Provider anbinden (Resend / Postmark / SendGrid)
- [ ] Templates: Reservationsbestätigung an Gast, Benachrichtigung ans Team,
      Einladung, Passwort-Reset, Erinnerungs-E-Mail (24h davor)
- [ ] Testmodus für Staging-Umgebung
- [ ] Bounce-Handling via Webhook

## Datei-/Bilder-Storage

- [ ] Object-Storage für Event-Bilder (Vercel Blob / S3 / Cloudflare R2)
- [ ] Upload via Server Action mit MIME/Size-Validation
- [ ] Signed URLs für private Assets

## Validierung

- [ ] Server-seitige Zod-Validierung in allen Server Actions
- [ ] Kollisionscheck bei Reservationen (Kapazität, Bereich)
- [ ] Sperrung vergangener Daten

## Sicherheit

- [ ] Rate-Limiting für `/api/**` und Formulare (Upstash Rate Limit)
- [ ] CSRF-Schutz für Formulare (Auth.js built-in bei App Router)
- [ ] Content-Security-Policy Header
- [ ] Secure Headers via `next.config.js`
- [ ] Input-Sanitization vor DB-Schreiben
- [ ] Kein Rendern von Gast-HTML

## Audit & Observability

- [ ] Audit-Log persistieren (jede Server Action loggt Aktor + Aktion + Entity)
- [ ] Strukturierte Logs (JSON) → Vercel Logs / Logtail
- [ ] Fehler-Monitoring (Sentry)
- [ ] Web-Vitals + Analytics (Vercel Analytics)

## Datenschutz (nDSG / DSGVO)

- [ ] Datenschutzerklärung juristisch prüfen
- [ ] Löschkonzept für Kundendaten (z. B. nach 24 Monaten)
- [ ] Export- und Auskunftsrecht implementieren
- [ ] Cookie-Banner nur bei nicht-essenziellen Cookies

## Backups & Betrieb

- [ ] Automatische DB-Backups (täglich, 30-Tage-Retention)
- [ ] Disaster-Recovery-Plan
- [ ] Staging-Umgebung + Preview-Deploys
- [ ] Monitoring der DB-Latenzen und Fehlerraten

## Erweiterte Features (nach MVP)

- [ ] iCal-Export pro Reservation
- [ ] Zahlungsintegration für Events (Stripe)
- [ ] Kunden-Portal (Reservationen selbst ändern/stornieren)
- [ ] Mehrsprachigkeit (DE/EN/FR)
- [ ] Wartelisten-Modul
