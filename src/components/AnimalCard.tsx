import Image from "next/image";
import Link from "next/link";
import type { Animal } from "@/lib/animals";
import { animalImagePath } from "@/lib/animals";
import type { Dictionary, Locale } from "@/lib/i18n";
import { publicAsset } from "@/lib/assets";

export async function AnimalCard({
  animal,
  locale,
  dict,
}: {
  animal: Animal;
  locale: Locale;
  dict: Dictionary;
}) {
  const imgPath = await publicAsset(animalImagePath(animal));

  return (
    <Link
      href={`/${locale}/animals/${animal.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-(--color-border) bg-(--color-surface) warm-shadow-sm hover:warm-shadow hover:-translate-y-0.5 hover:border-(--color-accent-strong) transition-all duration-200"
    >
      {/* Portrait area */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-(--color-surface-elevated)">
        {imgPath ? (
          <Image
            src={imgPath}
            alt={animal.names[locale]}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover object-top transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <FallbackPortrait emoji={animal.emoji} />
        )}
      </div>

      {/* Caption */}
      <div className="px-4 py-3.5">
        <h3 className="font-display text-lg leading-tight text-(--color-foreground) group-hover:text-(--color-accent-strong)">
          {animal.names[locale]}
        </h3>
        <p className="mt-1 text-[0.7rem] uppercase tracking-[0.14em] text-(--color-muted)">
          {dict.farms[animal.farm]}
        </p>
      </div>
    </Link>
  );
}

function FallbackPortrait({ emoji }: { emoji: string }) {
  return (
    <div
      className="absolute inset-0 flex items-center justify-center bg-grain"
      style={{
        background:
          "radial-gradient(circle at 50% 40%, var(--cream-100) 0%, var(--cream-200) 60%, var(--cream-300) 100%)",
      }}
    >
      <span
        className="text-7xl select-none"
        style={{ filter: "drop-shadow(0 2px 4px rgba(60,38,22,0.15))" }}
        aria-hidden
      >
        {emoji}
      </span>
    </div>
  );
}
