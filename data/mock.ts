// Demo dataset. All content marked with `demo`/`unverified` MUST be reviewed
// before going public. Ported incrementally from the Lovable prototype as
// each page that needs it is migrated.

import type { DailyOpeningHours, MenuCategory, RestaurantEvent, SeatingArea } from "@/types";

export const DEMO_DISCLAIMER = "Demo-Inhalt – vor Veröffentlichung prüfen";

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
