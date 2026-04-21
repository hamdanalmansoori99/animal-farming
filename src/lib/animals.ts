// This file is named "animals" for historical reasons. The app is now
// a falconry-only product; the single "falcon" entry is retained because
// all chapter content, section metadata, and MDX loading still revolve
// around a canonical subject. If we add a second bird later (kestrel,
// hawk), this module generalises back cleanly.

import type { Locale } from "@/lib/i18n";

export type SectionId =
  | "overview"
  | "history"
  | "breeds"
  | "housing"
  | "nutrition"
  | "dailyCare"
  | "training"
  | "health"
  | "supplements"
  | "problems"
  | "breeding"
  | "glossary";

export const ALL_SECTIONS: readonly SectionId[] = [
  "overview",
  "history",
  "breeds",
  "housing",
  "nutrition",
  "dailyCare",
  "training",
  "health",
  "supplements",
  "problems",
  "breeding",
  "glossary",
] as const;

/** Maps SectionId to its filename slug under content/{locale}/falcons/ */
export const SECTION_SLUG: Record<SectionId, string> = {
  overview: "overview",
  history: "history",
  breeds: "breeds",
  housing: "housing",
  nutrition: "nutrition",
  dailyCare: "daily-care",
  training: "training",
  health: "health",
  supplements: "supplements",
  problems: "problems",
  breeding: "breeding",
  glossary: "glossary",
};

export const SLUG_TO_SECTION: Record<string, SectionId> = Object.fromEntries(
  Object.entries(SECTION_SLUG).map(([id, slug]) => [slug, id as SectionId])
);

/** The single subject of the guide. Retained as a record so the code
 *  generalises if we ever add more birds. */
export const FALCON = {
  slug: "falcons",
  emoji: "🦅",
  names: { ar: "الصقور", en: "Falcons" } as Record<Locale, string>,
  image: "/images/falcon-portrait.png",
} as const;

export type FalconSubject = typeof FALCON;
