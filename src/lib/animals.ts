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

/** Maps SectionId to its filename slug under content/{locale}/{animal}/ */
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

export type FarmId = "farm1" | "farm2";

export type Animal = {
  slug: string;
  farm: FarmId;
  names: Record<Locale, string>;
  emoji: string;
  /**
   * Optional public-relative path to a portrait image (e.g. "/images/animals/falcons.jpg").
   * Computed automatically from slug — drop a JPG at public/images/animals/{slug}.jpg
   * and the card / hero will pick it up at build time. Override here if needed.
   */
  image?: string;
  /** Sections supported for this animal. Default: ALL_SECTIONS minus any in `disabled`. */
  disabled?: readonly SectionId[];
};

/** Returns the conventional image path for an animal, even if the file isn't present. */
export function animalImagePath(animal: Animal): string {
  return animal.image ?? `/images/animals/${animal.slug}.png`;
}

export const ANIMALS: readonly Animal[] = [
  // Farm 1
  { slug: "falcons",       farm: "farm1", emoji: "🦅", names: { ar: "الصقور",       en: "Falcons" } },
  { slug: "salukis",       farm: "farm1", emoji: "🐕", names: { ar: "السلوقي",      en: "Salukis" } },
  { slug: "dogs",          farm: "farm1", emoji: "🐶", names: { ar: "الكلاب",       en: "Dogs" } },
  { slug: "arabian-oryx",  farm: "farm1", emoji: "🦌", names: { ar: "المها العربي", en: "Arabian Oryx" } },
  { slug: "horses",        farm: "farm1", emoji: "🐎", names: { ar: "الخيول",       en: "Horses" } },
  // Farm 2
  { slug: "chickens",      farm: "farm2", emoji: "🐓", names: { ar: "الدجاج",       en: "Chickens" } },
  { slug: "lambs",         farm: "farm2", emoji: "🐑", names: { ar: "الحملان",      en: "Lambs" } },
  { slug: "sheep",         farm: "farm2", emoji: "🐏", names: { ar: "الأغنام",      en: "Sheep" } },
  { slug: "camels",        farm: "farm2", emoji: "🐪", names: { ar: "الإبل",        en: "Camels" } },
  { slug: "pigeons",       farm: "farm2", emoji: "🕊️", names: { ar: "الحمام",       en: "Pigeons" } },
  { slug: "cows",          farm: "farm2", emoji: "🐄", names: { ar: "الأبقار",      en: "Cows" } },
];

export function getAnimal(slug: string): Animal | undefined {
  return ANIMALS.find((a) => a.slug === slug);
}

export function sectionsFor(animal: Animal): readonly SectionId[] {
  if (!animal.disabled) return ALL_SECTIONS;
  return ALL_SECTIONS.filter((s) => !animal.disabled!.includes(s));
}

export function animalsByFarm(farm: FarmId): readonly Animal[] {
  return ANIMALS.filter((a) => a.farm === farm);
}
