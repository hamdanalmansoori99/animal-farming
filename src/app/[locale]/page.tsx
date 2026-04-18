import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { hasLocale, getDictionary, type Locale } from "@/lib/i18n";
import {
  ANIMALS,
  animalsByFarm,
  getAnimal,
  type Animal,
} from "@/lib/animals";
import { AnimalCard } from "@/components/AnimalCard";
import { Hero } from "@/components/Hero";
import { Ornament } from "@/components/Ornament";
import { loadSection } from "@/lib/content";
import { publicAsset } from "@/lib/assets";

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const dict = await getDictionary(locale);

  const farm1 = animalsByFarm("farm1");
  const farm2 = animalsByFarm("farm2");

  const heroImage = await publicAsset("/images/hero-home.png");
  const featuredAnimal = getAnimal("falcons");
  const featured = featuredAnimal
    ? await loadSection(locale, featuredAnimal.slug, "overview")
    : { exists: false as const };
  const featuredImage = featuredAnimal
    ? await publicAsset(`/images/animals/${featuredAnimal.slug}.png`)
    : null;

  const farmCount = new Set(ANIMALS.map((a) => a.farm)).size;
  const stat = dict.labels.stat_animals_farms
    .replace("{animals}", String(ANIMALS.length))
    .replace("{farms}", String(farmCount));

  return (
    <>
      <Hero
        eyebrow={dict.labels.homeEyebrow}
        title={dict.site.title}
        tagline={dict.site.tagline}
        imageSrc={heroImage}
        imageAlt=""
        meta={<span>{stat}</span>}
      />

      <div className="mx-auto max-w-6xl px-6">
        {/* Featured guide */}
        {featuredAnimal && featured.exists && (
          <section className="mt-14 md:mt-20">
            <FeaturedGuide
              animal={featuredAnimal}
              locale={locale}
              eyebrow={dict.labels.featuredEyebrow}
              title={featured.frontmatter.title}
              summary={featured.frontmatter.summary}
              cta={dict.labels.openGuide}
              imageSrc={featuredImage}
            />
          </section>
        )}

        {/* Farm One */}
        <FarmSection
          title={dict.farms.farm1}
          animals={farm1}
          locale={locale}
          dict={dict}
        />

        {/* Farm Two */}
        <FarmSection
          title={dict.farms.farm2}
          animals={farm2}
          locale={locale}
          dict={dict}
        />

        <div className="my-20 flex justify-center">
          <Link
            href={`/${locale}/animals`}
            className="text-sm tracking-wide text-(--color-muted) link-underline"
          >
            {dict.labels.browseAll} →
          </Link>
        </div>
      </div>
    </>
  );
}

function FarmSection({
  title,
  animals,
  locale,
  dict,
}: {
  title: string;
  animals: readonly Animal[];
  locale: Locale;
  dict: Awaited<ReturnType<typeof getDictionary>>;
}) {
  return (
    <section className="mt-16 md:mt-20">
      <header className="mb-8 flex flex-col items-center text-center">
        <h2 className="font-display text-2xl md:text-3xl text-(--color-foreground)">
          {title}
        </h2>
        <div className="mt-3 text-(--color-gold-500)">
          <Ornament width={90} />
        </div>
      </header>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {animals.map((a) => (
          <AnimalCard key={a.slug} animal={a} locale={locale} dict={dict} />
        ))}
      </div>
    </section>
  );
}

function FeaturedGuide({
  animal,
  locale,
  eyebrow,
  title,
  summary,
  cta,
  imageSrc,
}: {
  animal: Animal;
  locale: Locale;
  eyebrow: string;
  title: string;
  summary?: string;
  cta: string;
  imageSrc: string | null;
}) {
  return (
    <Link
      href={`/${locale}/animals/${animal.slug}/overview`}
      className="group grid md:grid-cols-2 overflow-hidden rounded-3xl border border-(--color-border) bg-(--color-surface) warm-shadow hover:warm-shadow hover:border-(--color-accent-strong) transition-colors"
    >
      <div className="relative aspect-[5/4] md:aspect-auto bg-(--color-surface-elevated)">
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={animal.names[locale]}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover object-top"
          />
        ) : (
          <div
            className="absolute inset-0 flex items-center justify-center bg-grain"
            style={{
              background:
                "radial-gradient(circle at 50% 40%, var(--cream-100) 0%, var(--cream-200) 60%, var(--cream-300) 100%)",
            }}
          >
            <span
              className="text-9xl"
              style={{ filter: "drop-shadow(0 4px 8px rgba(60,38,22,0.18))" }}
              aria-hidden
            >
              {animal.emoji}
            </span>
          </div>
        )}
      </div>
      <div className="p-8 md:p-10 flex flex-col justify-center">
        <p className="text-xs uppercase tracking-[0.18em] text-(--color-accent-strong) mb-3">
          {eyebrow}
        </p>
        <h3 className="font-display text-2xl md:text-3xl text-(--color-foreground) leading-tight">
          {title}
        </h3>
        {summary && (
          <p className="mt-4 text-(--color-muted) leading-relaxed">
            {summary}
          </p>
        )}
        <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-(--color-foreground) group-hover:text-(--color-accent-strong) transition-colors">
          {cta} <span aria-hidden>→</span>
        </span>
      </div>
    </Link>
  );
}

