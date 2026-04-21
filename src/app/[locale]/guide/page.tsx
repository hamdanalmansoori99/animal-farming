import { notFound } from "next/navigation";
import Link from "next/link";
import { hasLocale, getDictionary } from "@/lib/i18n";
import { ALL_SECTIONS } from "@/lib/animals";
import { listExistingSections, loadSection } from "@/lib/content";
import { Hero } from "@/components/Hero";
import { ChapterCard } from "@/components/ChapterCard";

export default async function GuideIndexPage({
  params,
}: PageProps<"/[locale]/guide">) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();

  const dict = await getDictionary(locale);
  const present = await listExistingSections(locale);

  // Pull frontmatter (title + summary) for every available chapter so the
  // card grid shows real MDX-authored copy instead of just dictionary labels.
  const frontmatters = new Map<
    string,
    { title?: string; summary?: string }
  >();
  await Promise.all(
    ALL_SECTIONS.filter((s) => present.has(s)).map(async (s) => {
      const loaded = await loadSection(locale, s);
      if (loaded.exists) {
        frontmatters.set(s, {
          title: loaded.frontmatter.title,
          summary: loaded.frontmatter.summary,
        });
      }
    })
  );

  const stat = dict.labels.chaptersPublished
    .replace("{published}", String(present.size))
    .replace("{total}", String(ALL_SECTIONS.length));

  return (
    <>
      <Hero size="sm" title={dict.nav.guide} meta={<span>{stat}</span>} />

      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {ALL_SECTIONS.map((sectionId) => {
            const fm = frontmatters.get(sectionId);
            return (
              <ChapterCard
                key={sectionId}
                sectionId={sectionId}
                available={present.has(sectionId)}
                locale={locale}
                dict={dict}
                title={fm?.title}
                summary={fm?.summary}
              />
            );
          })}
        </div>

        <div className="mt-12 flex justify-center">
          <Link
            href={`/${locale}`}
            className="text-sm tracking-wide text-(--color-muted) link-underline"
          >
            ← {dict.nav.home}
          </Link>
        </div>
      </div>
    </>
  );
}
