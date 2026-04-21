import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { hasLocale, getDictionary } from "@/lib/i18n";
import { SLUG_TO_SECTION } from "@/lib/animals";
import { loadSection } from "@/lib/content";
import { Ornament } from "@/components/Ornament";
import {
  FalconSpeciesProvider,
  FalconSpeciesTabs,
  SpeciesOnly,
} from "@/components/FalconSpecies";
import {
  SupplementModeProvider,
  SupplementModeTabs,
  ModeOnly,
  PharmaceuticalWarning,
  TimingEntry,
} from "@/components/SupplementMode";
import { ProblemCard } from "@/components/ProblemCard";

export default async function SectionPage({
  params,
}: PageProps<"/[locale]/guide/[section]">) {
  const { locale, section } = await params;
  if (!hasLocale(locale)) notFound();

  const sectionId = SLUG_TO_SECTION[section];
  if (!sectionId) notFound();

  const dict = await getDictionary(locale);
  const loaded = await loadSection(locale, sectionId);
  if (!loaded.exists) notFound();

  const { frontmatter, body } = loaded;
  const sourcesCount = frontmatter.sources.length;
  const sourcesLabel =
    sourcesCount === 1
      ? dict.labels.section_one_source
      : dict.labels.section_n_sources.replace("{n}", String(sourcesCount));

  const mdxComponents = {
    FalconSpeciesTabs: () => (
      <FalconSpeciesTabs
        locale={locale}
        selectorLabel={dict.falconSpecies.selectorLabel}
      />
    ),
    SpeciesOnly,
    SupplementModeTabs: () => (
      <SupplementModeTabs
        locale={locale}
        selectorLabel={dict.supplementMode.selectorLabel}
      />
    ),
    ModeOnly,
    PharmaceuticalWarning: () => (
      <PharmaceuticalWarning message={dict.supplementMode.warning} />
    ),
    TimingEntry: (props: {
      situation: string;
      organic: string;
      pharmaceutical?: string;
    }) => (
      <TimingEntry
        {...props}
        labels={{
          firstLine: dict.supplementMode.firstLineLabel,
          vet: dict.supplementMode.vetLineLabel,
        }}
      />
    ),
    ProblemCard: (props: {
      problem: string;
      causes: string;
      action: string;
      vet?: string;
    }) => (
      <ProblemCard
        {...props}
        labels={{
          causes: dict.problems.causes,
          action: dict.problems.action,
          vet: dict.problems.vet,
        }}
      />
    ),
  };

  const articleBody = (
    <>
      <div className="prose-article mt-10">
        <MDXRemote source={body} components={mdxComponents} />
      </div>

      {frontmatter.sources.length > 0 && (
        <footer className="mt-14">
          <div className="rounded-2xl border border-(--color-border) bg-(--color-surface-elevated) p-6 md:p-8">
            <h2 className="font-display text-base text-(--color-foreground) mb-4">
              {dict.labels.sources}
            </h2>
            <ol className="list-decimal ps-5 space-y-2 text-sm text-(--color-foreground)">
              {frontmatter.sources.map((src, i) => (
                <li key={i}>
                  {src.url ? (
                    <a
                      href={src.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-(--color-accent-strong) underline underline-offset-2 hover:opacity-80"
                    >
                      {src.title}
                    </a>
                  ) : (
                    <span>{src.title}</span>
                  )}
                  {src.citation && (
                    <span className="text-(--color-muted)"> — {src.citation}</span>
                  )}
                </li>
              ))}
            </ol>
          </div>
        </footer>
      )}

      <div className="mt-12 flex justify-center">
        <Link
          href={`/${locale}/guide`}
          className="inline-flex items-center gap-2 text-sm text-(--color-muted) link-underline"
        >
          <span aria-hidden>←</span>
          {dict.labels.backToGuide}
        </Link>
      </div>
    </>
  );

  return (
    <>
      {/* Breadcrumb */}
      <nav
        aria-label="breadcrumb"
        className="border-b border-(--color-border) bg-(--color-background)/80"
      >
        <div className="mx-auto max-w-3xl px-6 py-3 flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-(--color-muted)">
          <Link href={`/${locale}/guide`} className="hover:text-(--color-foreground)">
            {dict.nav.guide}
          </Link>
          <span aria-hidden>›</span>
          <span className="text-(--color-foreground)">
            {dict.sections[sectionId]}
          </span>
        </div>
      </nav>

      <article className="mx-auto max-w-2xl px-6 pt-10 pb-20 md:pt-16">
        <header className="text-center">
          <p className="text-xs uppercase tracking-[0.18em] text-(--color-accent-strong)">
            {dict.sections[sectionId]}
          </p>
          <h1 className="mt-4 font-display text-3xl md:text-5xl text-(--color-foreground) leading-tight">
            {frontmatter.title}
          </h1>
          {frontmatter.summary && (
            <p className="mt-5 text-lg text-(--color-muted) leading-relaxed">
              {frontmatter.summary}
            </p>
          )}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-(--color-muted)">
            {frontmatter.lastReviewed && (
              <span>
                {dict.labels.lastReviewed} · {frontmatter.lastReviewed}
              </span>
            )}
            {sourcesCount > 0 && (
              <>
                <span aria-hidden>·</span>
                <span>{sourcesLabel}</span>
              </>
            )}
          </div>
          <div className="mt-7 flex justify-center text-(--color-gold-500)">
            <Ornament />
          </div>
        </header>

        <FalconSpeciesProvider>
          <SupplementModeProvider>{articleBody}</SupplementModeProvider>
        </FalconSpeciesProvider>
      </article>
    </>
  );
}
