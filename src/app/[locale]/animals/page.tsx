import { notFound } from "next/navigation";
import { hasLocale, getDictionary } from "@/lib/i18n";
import { ANIMALS } from "@/lib/animals";
import { AnimalCard } from "@/components/AnimalCard";
import { Hero } from "@/components/Hero";

export default async function AnimalsIndexPage({
  params,
}: PageProps<"/[locale]/animals">) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const dict = await getDictionary(locale);

  return (
    <>
      <Hero size="sm" title={dict.nav.animals} />
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {ANIMALS.map((a) => (
            <AnimalCard key={a.slug} animal={a} locale={locale} dict={dict} />
          ))}
        </div>
      </div>
    </>
  );
}
