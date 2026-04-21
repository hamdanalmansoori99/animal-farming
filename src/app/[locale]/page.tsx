import Link from "next/link";
import { notFound } from "next/navigation";
import { hasLocale, getDictionary } from "@/lib/i18n";
import { ALL_SECTIONS } from "@/lib/animals";
import { listExistingSections, loadSection } from "@/lib/content";
import { Hero } from "@/components/Hero";
import { ChapterCard } from "@/components/ChapterCard";
import { publicAsset } from "@/lib/assets";

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const dict = await getDictionary(locale);

  const present = await listExistingSections(locale);

  // The twilight silhouette is the falconry-pivot hero; fall back to
  // the desert farm scene if it's not present yet.
  const heroImage =
    (await publicAsset("/images/twilight-silhouette.png")) ??
    (await publicAsset("/images/hero-home.png"));

  // Load frontmatter for every available chapter so the grid shows real
  // MDX titles and summaries.
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

  const stat = dict.labels.homeStat.replace(
    "{published}",
    String(present.size)
  );

  return (
    <>
      <Hero
        eyebrow={dict.labels.homeEyebrow}
        title={dict.site.title}
        tagline={dict.site.tagline}
        imageSrc={heroImage}
        imageAlt=""
        meta={<span>{stat}</span>}
        cta={{
          href: `/${locale}/guide/overview`,
          label: dict.labels.startWithOverview,
        }}
      />

      <div className="mx-auto max-w-6xl px-6 py-14 md:py-20">
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

        <div className="mt-16 flex justify-center">
          <Link
            href={`/${locale}/guide`}
            className="text-sm tracking-wide text-(--color-muted) link-underline"
          >
            {dict.labels.browseAll} →
          </Link>
        </div>
      </div>
    </>
  );
}
