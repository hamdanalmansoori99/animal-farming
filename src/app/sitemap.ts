import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n";
import { ALL_SECTIONS, SECTION_SLUG } from "@/lib/animals";
import { listExistingSections } from "@/lib/content";

// Vercel / production URL. Override via NEXT_PUBLIC_SITE_URL env var for
// preview deployments or custom domains later.
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://animal-farming.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];
  const now = new Date();

  for (const locale of locales) {
    // Home
    entries.push({
      url: `${SITE_URL}/${locale}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    });

    // Guide index
    entries.push({
      url: `${SITE_URL}/${locale}/guide`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    });

    // One entry per live chapter — scan filesystem, don't list
    // "coming soon" URLs that return notFound.
    const present = await listExistingSections(locale);
    for (const sectionId of ALL_SECTIONS) {
      if (!present.has(sectionId)) continue;
      entries.push({
        url: `${SITE_URL}/${locale}/guide/${SECTION_SLUG[sectionId]}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.8,
      });
    }
  }

  return entries;
}
