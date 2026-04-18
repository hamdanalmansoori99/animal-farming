import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";
import type { Locale } from "@/lib/i18n";
import { SECTION_SLUG, type SectionId } from "@/lib/animals";

const SourceSchema = z.object({
  title: z.string(),
  url: z.string().url().optional(),
  citation: z.string().optional(),
});

const FrontmatterSchema = z.object({
  title: z.string(),
  summary: z.string().optional(),
  // YAML auto-parses unquoted ISO dates to Date; accept either and normalize to ISO string.
  lastReviewed: z
    .union([z.string(), z.date()])
    .optional()
    .transform((v) =>
      v instanceof Date ? v.toISOString().slice(0, 10) : v
    ),
  sources: z.array(SourceSchema).default([]),
});

export type ContentSource = z.infer<typeof SourceSchema>;
export type Frontmatter = z.infer<typeof FrontmatterSchema>;

export type LoadedSection = {
  frontmatter: Frontmatter;
  body: string; // raw MDX body (no frontmatter)
  exists: true;
} | {
  exists: false;
};

const CONTENT_ROOT = path.join(process.cwd(), "src", "content");

function sectionFilePath(locale: Locale, animalSlug: string, section: SectionId): string {
  const sectionSlug = SECTION_SLUG[section];
  return path.join(CONTENT_ROOT, locale, animalSlug, `${sectionSlug}.mdx`);
}

export async function loadSection(
  locale: Locale,
  animalSlug: string,
  section: SectionId
): Promise<LoadedSection> {
  const filePath = sectionFilePath(locale, animalSlug, section);
  let raw: string;
  try {
    raw = await fs.readFile(filePath, "utf8");
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") {
      return { exists: false };
    }
    throw err;
  }

  const { data, content } = matter(raw);
  const parsed = FrontmatterSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error(
      `Invalid frontmatter in ${filePath}: ${parsed.error.message}`
    );
  }
  return { exists: true, frontmatter: parsed.data, body: content };
}

export async function listExistingSections(
  locale: Locale,
  animalSlug: string
): Promise<Set<SectionId>> {
  const dir = path.join(CONTENT_ROOT, locale, animalSlug);
  const present = new Set<SectionId>();
  try {
    const files = await fs.readdir(dir);
    for (const [section, slug] of Object.entries(SECTION_SLUG)) {
      if (files.includes(`${slug}.mdx`)) {
        present.add(section as SectionId);
      }
    }
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code !== "ENOENT") throw err;
  }
  return present;
}
