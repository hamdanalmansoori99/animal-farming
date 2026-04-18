import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { hasLocale, getDictionary, type Locale } from "@/lib/i18n";
import {
  getAnimal,
  sectionsFor,
  SECTION_SLUG,
  animalImagePath,
  type SectionId,
  type Animal,
} from "@/lib/animals";
import { listExistingSections } from "@/lib/content";
import { publicAsset } from "@/lib/assets";
import { Ornament } from "@/components/Ornament";

export default async function AnimalLandingPage({
  params,
}: PageProps<"/[locale]/animals/[slug]">) {
  const { locale, slug } = await params;
  if (!hasLocale(locale)) notFound();

  const animal = getAnimal(slug);
  if (!animal) notFound();

  const dict = await getDictionary(locale);
  const sections = sectionsFor(animal);
  const present = await listExistingSections(locale, animal.slug);
  const portrait = await publicAsset(animalImagePath(animal));

  const stat = dict.labels.chaptersPublished
    .replace("{published}", String(present.size))
    .replace("{total}", String(sections.length));

  return (
    <>
      <AnimalHero
        animal={animal}
        locale={locale}
        farmLabel={dict.farms[animal.farm]}
        stat={stat}
        portrait={portrait}
      />

      <div className="mx-auto max-w-3xl px-6 py-12 md:py-16">
        <ul>
          {sections.map((sectionId, idx) => (
            <ChapterRow
              key={sectionId}
              index={idx + 1}
              label={dict.sections[sectionId]}
              comingSoonLabel={dict.labels.comingSoon}
              chapterLabel={dict.labels.chapter}
              href={`/${locale}/animals/${animal.slug}/${SECTION_SLUG[sectionId]}`}
              available={present.has(sectionId)}
              isFirst={idx === 0}
            />
          ))}
        </ul>
      </div>
    </>
  );
}

function AnimalHero({
  animal,
  locale,
  farmLabel,
  stat,
  portrait,
}: {
  animal: Animal;
  locale: Locale;
  farmLabel: string;
  stat: string;
  portrait: string | null;
}) {
  return (
    <section className="relative overflow-hidden border-b border-(--color-border) bg-(--color-surface) bg-grain">
      {portrait && (
        <>
          <Image
            src={portrait}
            alt={animal.names[locale]}
            fill
            priority
            className="object-cover object-top opacity-95"
            sizes="100vw"
          />
          <div className="absolute inset-0 pointer-events-none hero-overlay" />
        </>
      )}
      <div className="relative mx-auto max-w-4xl px-6 py-16 md:py-24 text-center">
        {!portrait && (
          <div
            className="mx-auto mb-6 text-7xl md:text-8xl"
            style={{ filter: "drop-shadow(0 3px 6px rgba(60,38,22,0.18))" }}
            aria-hidden
          >
            {animal.emoji}
          </div>
        )}
        <span className="inline-block rounded-full border border-(--color-border) bg-(--color-surface)/70 px-3 py-1 text-xs uppercase tracking-[0.16em] hero-text-muted">
          {farmLabel}
        </span>
        <h1 className="mt-4 font-display text-4xl md:text-6xl leading-tight hero-text">
          {animal.names[locale]}
        </h1>
        <div className="mt-6 flex justify-center text-(--color-gold-500)">
          <Ornament />
        </div>
        <p className="mt-5 text-sm hero-text-muted">{stat}</p>
      </div>
    </section>
  );
}

function ChapterRow({
  index,
  label,
  comingSoonLabel,
  chapterLabel,
  href,
  available,
  isFirst,
}: {
  index: number;
  label: string;
  comingSoonLabel: string;
  chapterLabel: string;
  href: string;
  available: boolean;
  isFirst: boolean;
}) {
  const num = String(index).padStart(2, "0");

  const inner = (
    <div className="flex items-center gap-5 md:gap-8 py-5 md:py-6">
      <div className="shrink-0 w-12 md:w-14 text-end">
        <div
          className={`font-display text-2xl md:text-3xl leading-none transition-colors ${
            available
              ? "text-(--color-muted) group-hover:text-(--color-accent-strong)"
              : "text-(--color-border)"
          }`}
        >
          {num}
        </div>
        <div className="mt-1 text-[0.6rem] uppercase tracking-[0.18em] text-(--color-muted)">
          {chapterLabel}
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <h3
          className={`font-display text-lg md:text-xl ${
            available ? "text-(--color-foreground)" : "text-(--color-muted)"
          }`}
        >
          {label}
        </h3>
      </div>
      <div className="shrink-0">
        {available ? (
          <span
            className="text-(--color-accent) group-hover:text-(--color-accent-strong) transition-colors"
            aria-hidden
          >
            →
          </span>
        ) : (
          <span className="rounded-full bg-(--color-surface-elevated) px-2.5 py-1 text-[0.65rem] uppercase tracking-[0.14em] text-(--color-muted)">
            {comingSoonLabel}
          </span>
        )}
      </div>
    </div>
  );

  return (
    <li className={isFirst ? "" : "border-t border-(--color-border)"}>
      {available ? (
        <Link
          href={href}
          className="group block px-2 -mx-2 rounded-xl hover:bg-(--color-surface) transition-colors"
        >
          {inner}
        </Link>
      ) : (
        <div className="px-2 -mx-2">{inner}</div>
      )}
    </li>
  );
}
