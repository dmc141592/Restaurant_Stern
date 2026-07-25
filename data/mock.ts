// Demo dataset. All content marked with `demo`/`unverified` MUST be reviewed
// before going public. Ported incrementally from the Lovable prototype as
// each page that needs it is migrated.

import type {
  AuditLog,
  DailyOpeningHours,
  MenuCategory,
  Notification,
  Reservation,
  RestaurantEvent,
  SeatingArea,
  SpecialOpeningDate,
  User,
} from "@/types";

export const DEMO_DISCLAIMER = "Demo-Inhalt – vor Veröffentlichung prüfen";

// -------- Users --------
//
// Demo-only accounts for the staff-portal preview. No passwords, no real
// credentials — see lib/demo-session.ts for how these map to the cookie-based
// demo session. Replace entirely with real accounts once Auth.js lands.

export const mockUsers: User[] = [
  {
    id: "u-admin",
    firstName: "Anna",
    lastName: "Berger",
    email: "anna.berger@sternenalbisrieden.demo",
    role: "ADMIN",
    status: "ACTIVE",
    lastLoginAt: "2026-07-23T18:12:00Z",
    createdAt: "2024-02-01T09:00:00Z",
  },
  {
    id: "u-manager",
    firstName: "Marco",
    lastName: "Frei",
    email: "marco.frei@sternenalbisrieden.demo",
    role: "MANAGER",
    status: "ACTIVE",
    lastLoginAt: "2026-07-24T07:44:00Z",
    createdAt: "2024-05-14T09:00:00Z",
  },
  {
    id: "u-employee",
    firstName: "Lea",
    lastName: "Huber",
    email: "lea.huber@sternenalbisrieden.demo",
    role: "EMPLOYEE",
    status: "ACTIVE",
    lastLoginAt: "2026-07-24T15:02:00Z",
    createdAt: "2025-01-09T09:00:00Z",
  },
  {
    id: "u-employee-2",
    firstName: "Tobias",
    lastName: "Meier",
    email: "tobias.meier@sternenalbisrieden.demo",
    role: "EMPLOYEE",
    status: "INVITED",
    invitationStatus: "PENDING",
    createdAt: "2026-07-20T09:00:00Z",
  },
];

// -------- Menu (frontend-only demo content) --------

export const mockMenu: MenuCategory[] = [
  {
    id: "cat-vorspeisen",
    title: "Vorspeisen",
    description: "Kleine Gerichte zum Ankommen.",
    items: [
      { id: "m-1", name: "Bunter Blattsalat", labels: ["vegetarisch"], unverified: true },
      { id: "m-2", name: "Hausgemachte Bouillon mit Flädli", unverified: true },
      { id: "m-3", name: "Bündnerfleisch mit Alpkäse", labels: ["regional"], unverified: true },
    ],
  },
  {
    id: "cat-haupt",
    title: "Hauptgerichte",
    description: "Traditionell und saisonal.",
    items: [
      { id: "m-4", name: "Zürcher Geschnetzeltes mit Rösti", labels: ["Klassiker"], unverified: true },
      { id: "m-5", name: "Cordon Bleu vom Kalb", unverified: true },
      { id: "m-6", name: "Kürbisrisotto", labels: ["vegetarisch", "saisonal"], unverified: true },
      { id: "m-7", name: "Wienerschnitzel mit Pommes", unverified: true },
    ],
  },
  {
    id: "cat-dessert",
    title: "Desserts",
    items: [
      { id: "m-8", name: "Hausgemachte Crème brûlée", unverified: true },
      { id: "m-9", name: "Warmes Apfelküchlein mit Vanilleeis", labels: ["saisonal"], unverified: true },
    ],
  },
];

// -------- Seating areas --------

export const mockSeatingAreas: SeatingArea[] = [
  {
    id: "sa-restaurant",
    name: "Restaurant",
    description: "Gemütlicher Hauptgastraum mit Holzvertäfelung.",
    capacity: 60,
    minPartySize: 1,
    maxPartySize: 12,
    publiclyBookable: true,
    currentlyOpen: true,
    displayOrder: 1,
  },
  {
    id: "sa-garten",
    name: "Gartenrestaurant",
    description: "Lauschiger Innenhof mit Bäumen und Lichterketten.",
    capacity: 45,
    minPartySize: 1,
    maxPartySize: 10,
    publiclyBookable: true,
    currentlyOpen: true,
    displayOrder: 2,
  },
  {
    id: "sa-saeli",
    name: "Sääli",
    description: "Separates Zimmer für Feiern und Anlässe.",
    capacity: 24,
    minPartySize: 8,
    maxPartySize: 24,
    publiclyBookable: false,
    currentlyOpen: true,
    displayOrder: 3,
  },
  {
    id: "sa-stuebli",
    name: "Stübli",
    description: "Intimes Nebenzimmer für kleinere Gruppen.",
    capacity: 14,
    minPartySize: 4,
    maxPartySize: 14,
    publiclyBookable: true,
    currentlyOpen: true,
    displayOrder: 4,
  },
];

// -------- Opening hours --------

export const mockOpeningHours: DailyOpeningHours[] = [
  { weekday: 1, closed: false, slots: [{ open: "11:30", close: "14:00" }, { open: "17:30", close: "23:00" }] },
  { weekday: 2, closed: false, slots: [{ open: "11:30", close: "14:00" }, { open: "17:30", close: "23:00" }] },
  { weekday: 3, closed: false, slots: [{ open: "11:30", close: "14:00" }, { open: "17:30", close: "23:00" }] },
  { weekday: 4, closed: false, slots: [{ open: "11:30", close: "14:00" }, { open: "17:30", close: "23:30" }] },
  { weekday: 5, closed: false, slots: [{ open: "11:30", close: "14:00" }, { open: "17:30", close: "24:00" }] },
  { weekday: 6, closed: false, slots: [{ open: "17:30", close: "24:00" }] },
  { weekday: 0, closed: true, slots: [], note: "Sonntag Ruhetag" },
];

export const mockSpecialDates: SpecialOpeningDate[] = [
  {
    id: "sd-nationalfeiertag",
    date: "2026-08-01",
    closed: false,
    slots: [{ open: "17:00", close: "24:00" }],
    publicMessage: "1. August – Grillabend im Garten (Demo-Inhalt)",
  },
  {
    id: "sd-betriebsferien",
    date: "2026-08-10",
    closed: true,
    slots: [],
    publicMessage: "Betriebsferien 10.–17. August (Demo-Inhalt)",
  },
];

// -------- Events --------

const today = new Date();
const iso = (d: Date) => d.toISOString().slice(0, 10);
const plus = (n: number) => {
  const d = new Date(today);
  d.setDate(d.getDate() + n);
  return iso(d);
};

export const mockEvents: RestaurantEvent[] = [
  {
    id: "e-1",
    title: "Sommernachts-Grill im Garten",
    slug: "sommergrill",
    shortDescription: "Ein lauer Abend, offener Grill, feine Weine.",
    fullDescription:
      "Wir feuern den Grill im Gartenrestaurant an und servieren saisonale Spezialitäten. Reservation empfohlen. (Demo-Inhalt)",
    startDate: plus(7),
    startTime: "18:00",
    endDate: plus(7),
    endTime: "23:00",
    reservationRequired: true,
    visibility: "PUBLIC",
    status: "PUBLISHED",
    createdBy: "u-manager",
    updatedBy: "u-manager",
    createdAt: "2026-06-01T09:00:00Z",
    updatedAt: "2026-06-01T09:00:00Z",
  },
  {
    id: "e-2",
    title: "Herbstliches Wildmenu",
    slug: "wildmenu",
    shortDescription: "Vier Gänge aus regionaler Jagd.",
    fullDescription: "Klassisches Wildmenu mit Beilagen aus dem Zürcher Umland. (Demo-Inhalt)",
    startDate: plus(45),
    startTime: "18:30",
    endDate: plus(45),
    endTime: "23:00",
    reservationRequired: true,
    capacity: 40,
    visibility: "PUBLIC",
    status: "PUBLISHED",
    createdBy: "u-manager",
    updatedBy: "u-manager",
    createdAt: "2026-06-15T09:00:00Z",
    updatedAt: "2026-06-15T09:00:00Z",
  },
  {
    id: "e-3",
    title: "Team-Weihnachtsessen (intern)",
    slug: "team-weihnacht",
    shortDescription: "Interner Anlass, nicht öffentlich.",
    fullDescription: "Wird im Kalender geführt. (Demo-Inhalt)",
    startDate: plus(150),
    startTime: "18:00",
    endDate: plus(150),
    endTime: "23:00",
    reservationRequired: false,
    visibility: "STAFF_ONLY",
    status: "DRAFT",
    createdBy: "u-admin",
    updatedBy: "u-admin",
    createdAt: "2026-07-01T09:00:00Z",
    updatedAt: "2026-07-01T09:00:00Z",
  },
  // Not present in the original Lovable dataset — added here so the public
  // events page has a real example to exercise the upcoming/past split with.
  {
    id: "e-4",
    title: "Frühlingsapéro im Garten",
    slug: "fruehlingsaperoo",
    shortDescription: "Aperitivo zur Gartensaison-Eröffnung.",
    fullDescription: "Ein entspannter Apéro zur Eröffnung der Gartensaison mit kleinen Häppchen. (Demo-Inhalt)",
    startDate: plus(-30),
    startTime: "17:00",
    endDate: plus(-30),
    endTime: "20:00",
    reservationRequired: false,
    visibility: "PUBLIC",
    status: "PUBLISHED",
    createdBy: "u-manager",
    updatedBy: "u-manager",
    createdAt: "2026-05-01T09:00:00Z",
    updatedAt: "2026-05-01T09:00:00Z",
  },
];

// -------- Reservations (staff portal) --------

export const mockReservations: Reservation[] = [
  {
    id: "r-001",
    reservationNumber: "STA-2026-000481",
    date: iso(today),
    time: "12:15",
    partySize: 2,
    seatingAreaId: "sa-restaurant",
    customer: {
      id: "c-1",
      firstName: "Regula",
      lastName: "Schmid",
      email: "regula.schmid@example.ch",
      phone: "+41 79 123 45 67",
    },
    occasion: "NORMAL",
    status: "CONFIRMED",
    source: "WEBSITE",
    createdAt: "2026-07-22T10:20:00Z",
    updatedAt: "2026-07-22T10:20:00Z",
  },
  {
    id: "r-002",
    reservationNumber: "STA-2026-000482",
    date: iso(today),
    time: "12:45",
    partySize: 6,
    seatingAreaId: "sa-garten",
    customer: {
      id: "c-2",
      firstName: "Peter",
      lastName: "Kaufmann",
      email: "p.kaufmann@example.ch",
      phone: "+41 44 555 12 12",
    },
    occasion: "BUSINESS",
    message: "Bitte ruhigen Tisch, Geschäftsessen.",
    status: "PENDING",
    source: "WEBSITE",
    createdAt: "2026-07-23T09:11:00Z",
    updatedAt: "2026-07-23T09:11:00Z",
  },
  {
    id: "r-003",
    reservationNumber: "STA-2026-000483",
    date: iso(today),
    time: "19:00",
    partySize: 12,
    seatingAreaId: "sa-saeli",
    customer: {
      id: "c-3",
      firstName: "Franziska",
      lastName: "Wettstein",
      email: "franziska.w@example.ch",
      phone: "+41 76 987 65 43",
    },
    occasion: "BIRTHDAY",
    message: "60. Geburtstag – Torte wird von uns gebracht.",
    status: "CONFIRMED",
    source: "TELEPHONE",
    assignedEmployeeId: "u-manager",
    createdAt: "2026-07-15T14:00:00Z",
    updatedAt: "2026-07-20T09:00:00Z",
  },
  {
    id: "r-004",
    reservationNumber: "STA-2026-000484",
    date: iso(today),
    time: "19:30",
    partySize: 4,
    seatingAreaId: "sa-restaurant",
    customer: {
      id: "c-4",
      firstName: "Yannick",
      lastName: "Roth",
      email: "yannick.roth@example.ch",
      phone: "+41 78 222 33 44",
    },
    occasion: "FAMILY",
    status: "CONFIRMED",
    source: "WEBSITE",
    createdAt: "2026-07-21T18:00:00Z",
    updatedAt: "2026-07-21T18:00:00Z",
  },
  {
    id: "r-005",
    reservationNumber: "STA-2026-000485",
    date: iso(today),
    time: "20:15",
    partySize: 2,
    seatingAreaId: "sa-stuebli",
    customer: {
      id: "c-5",
      firstName: "Ines",
      lastName: "Braun",
      email: "ines.braun@example.ch",
      phone: "+41 79 555 88 77",
    },
    occasion: "ANNIVERSARY",
    message: "10 Jahre Hochzeitstag.",
    status: "CONFIRMED",
    source: "EMAIL",
    createdAt: "2026-07-10T12:00:00Z",
    updatedAt: "2026-07-10T12:00:00Z",
  },
  {
    id: "r-006",
    reservationNumber: "STA-2026-000486",
    date: plus(1),
    time: "12:30",
    partySize: 3,
    seatingAreaId: "sa-restaurant",
    customer: {
      id: "c-6",
      firstName: "Karl",
      lastName: "Suter",
      email: "k.suter@example.ch",
      phone: "+41 44 300 20 10",
    },
    occasion: "NORMAL",
    status: "PENDING",
    source: "WEBSITE",
    createdAt: "2026-07-24T08:00:00Z",
    updatedAt: "2026-07-24T08:00:00Z",
  },
  {
    id: "r-007",
    reservationNumber: "STA-2026-000487",
    date: plus(2),
    time: "19:00",
    partySize: 8,
    seatingAreaId: "sa-garten",
    customer: {
      id: "c-7",
      firstName: "Meret",
      lastName: "Blumer",
      email: "meret@example.ch",
      phone: "+41 79 411 22 33",
    },
    occasion: "OTHER",
    status: "CONFIRMED",
    source: "STAFF_ENTRY",
    createdAt: "2026-07-24T09:15:00Z",
    updatedAt: "2026-07-24T09:15:00Z",
  },
  {
    id: "r-008",
    reservationNumber: "STA-2026-000488",
    date: plus(-1),
    time: "19:00",
    partySize: 2,
    seatingAreaId: "sa-restaurant",
    customer: {
      id: "c-8",
      firstName: "Silvan",
      lastName: "Egger",
      email: "silvan.e@example.ch",
      phone: "+41 78 141 51 61",
    },
    occasion: "NORMAL",
    status: "NO_SHOW",
    source: "WEBSITE",
    createdAt: "2026-07-18T10:00:00Z",
    updatedAt: "2026-07-23T21:30:00Z",
  },
  {
    id: "r-009",
    reservationNumber: "STA-2026-000489",
    date: plus(-2),
    time: "12:00",
    partySize: 4,
    seatingAreaId: "sa-garten",
    customer: {
      id: "c-9",
      firstName: "Nadine",
      lastName: "Kohler",
      email: "n.kohler@example.ch",
      phone: "+41 78 900 90 90",
    },
    occasion: "NORMAL",
    status: "COMPLETED",
    source: "WEBSITE",
    createdAt: "2026-07-15T10:00:00Z",
    updatedAt: "2026-07-22T14:30:00Z",
  },
  {
    id: "r-010",
    reservationNumber: "STA-2026-000490",
    date: plus(3),
    time: "18:30",
    partySize: 5,
    customer: {
      id: "c-10",
      firstName: "David",
      lastName: "Zeller",
      email: "david.zeller@example.ch",
      phone: "+41 79 222 11 33",
    },
    occasion: "BIRTHDAY",
    status: "PENDING",
    source: "WEBSITE",
    message: "Kindergeburtstag, gerne Kinderstuhl.",
    createdAt: "2026-07-24T11:15:00Z",
    updatedAt: "2026-07-24T11:15:00Z",
  },
];

// -------- Audit & notifications --------

export const mockAuditLogs: AuditLog[] = [
  {
    id: "a-1",
    actorId: "u-manager",
    actorName: "Marco Frei",
    action: "RESERVATION_STATUS_CHANGED",
    entityType: "Reservation",
    entityId: "r-003",
    summary: "Status auf CONFIRMED geändert",
    createdAt: "2026-07-20T09:00:00Z",
  },
  {
    id: "a-2",
    actorId: "u-admin",
    actorName: "Anna Berger",
    action: "USER_INVITED",
    entityType: "User",
    entityId: "u-employee-2",
    summary: "Mitarbeiter eingeladen (tobias.meier@…)",
    createdAt: "2026-07-20T09:12:00Z",
  },
  {
    id: "a-3",
    actorId: "u-manager",
    actorName: "Marco Frei",
    action: "OPENING_HOURS_CHANGED",
    entityType: "OpeningHours",
    entityId: "oh-week",
    summary: "Freitagabend bis 24:00 verlängert",
    createdAt: "2026-07-18T16:30:00Z",
  },
];

export const mockNotifications: Notification[] = [
  {
    id: "n-1",
    kind: "NEW_RESERVATION",
    title: "Neue Reservation",
    body: "Peter Kaufmann, 6 Personen, heute 12:45",
    createdAt: "2026-07-23T09:11:00Z",
    read: false,
    link: "/staff/reservierungen/r-002",
  },
  {
    id: "n-2",
    kind: "LARGE_GROUP",
    title: "Grosse Gruppe",
    body: "12 Personen im Sääli, heute 19:00",
    createdAt: "2026-07-22T10:00:00Z",
    read: false,
    link: "/staff/reservierungen/r-003",
  },
  {
    id: "n-3",
    kind: "UPCOMING_EVENT",
    title: "Event in einer Woche",
    body: "Sommernachts-Grill im Garten",
    createdAt: "2026-07-24T08:00:00Z",
    read: true,
  },
];
