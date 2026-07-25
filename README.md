# Restaurant Sternen Albisrieden

Moderne, responsive Restaurant-Webseite mit integriertem Mitarbeiterportal für die Verwaltung von Reservierungen, Events, Öffnungszeiten, Sitzbereichen und Teamrollen.

Dieses Projekt wurde als technischer Prototyp entwickelt, um zu zeigen, wie die bestehende Webseite des Restaurants Sternen Albisrieden modernisiert und gleichzeitig um ein digitales Verwaltungssystem erweitert werden kann.

---

## Projektstatus

Der aktuelle Stand umfasst:

- vollständige öffentliche Restaurant-Webseite
- responsive Darstellung für Desktop, Tablet und Mobile
- öffentliche Reservierungsanfrage mit Formularvalidierung
- Eventübersicht
- Speisekarte
- Kontakt- und Restaurantinformationen
- internes Mitarbeiterportal
- rollenbasierte Benutzeroberfläche für Mitarbeiter, Manager und Administratoren
- Reservierungsverwaltung
- Eventverwaltung
- Sitzbereichsverwaltung
- Öffnungszeitenverwaltung
- Teamübersicht
- Statistiken und Diagramme
- Änderungsverlauf und Aktivitätsanzeige

Aktuell verwendet das Projekt noch typisierte Demo-Daten.

Die produktive Backend-Anbindung mit PostgreSQL, Prisma, Auth.js und Neon ist als nächster Entwicklungsschritt vorgesehen.

---

## Ziel des Projekts

Das Projekt verfolgt zwei Ziele:

1. eine moderne und emotionale Restaurant-Webseite für Gäste
2. ein digitales Verwaltungssystem für den internen Betrieb

Die Lösung soll dem Restaurant ermöglichen, öffentliche Inhalte und interne Abläufe künftig zentral zu verwalten.

---

## Öffentliche Webseite

Die öffentliche Webseite enthält folgende Bereiche:

- Startseite
- Restaurant
- Speisekarte
- Events
- Reservation
- Kontakt
- Impressum
- Datenschutz

### Funktionen

- moderner, video-fähiger Hero-Bereich
- responsive Navigation
- Restaurant- und Gartenpräsentation
- Speisekartenvorschau
- aktuelle Öffnungszeiten
- öffentliche Eventübersicht
- Reservierungsformular
- Kontaktinformationen
- optimierte Bilder mit Next.js Image
- SEO-Metadaten
- mobile Darstellung

---

## Mitarbeiterportal

Der interne Bereich ist über folgende Route erreichbar:

```text
/staff/login
