import "server-only";

export const locales = ["ar", "en"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "ar";

export function hasLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export function isRtl(locale: Locale): boolean {
  return locale === "ar";
}

const dictionaries = {
  ar: () => import("@/dictionaries/ar.json").then((m) => m.default),
  en: () => import("@/dictionaries/en.json").then((m) => m.default),
} as const;

export type Dictionary = Awaited<ReturnType<(typeof dictionaries)["en"]>>;

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  return dictionaries[locale]();
}

export function alternateLocale(locale: Locale): Locale {
  return locale === "ar" ? "en" : "ar";
}
