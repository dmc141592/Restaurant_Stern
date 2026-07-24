// Demo dataset. All content marked with `demo`/`unverified` MUST be reviewed
// before going public. Ported incrementally from the Lovable prototype as
// each page that needs it is migrated — only the menu lives here so far.

import type { MenuCategory } from "@/types";

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
