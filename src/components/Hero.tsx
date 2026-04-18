import Image from "next/image";
import Link from "next/link";
import { Ornament } from "@/components/Ornament";

type HeroProps = {
  eyebrow?: string;
  title: string;
  tagline?: string;
  imageSrc?: string | null;
  imageAlt?: string;
  /** Visual size — "lg" for home/animal landing, "sm" for index pages */
  size?: "lg" | "sm";
  cta?: { href: string; label: string };
  meta?: React.ReactNode;
};

export function Hero({
  eyebrow,
  title,
  tagline,
  imageSrc,
  imageAlt = "",
  size = "lg",
  cta,
  meta,
}: HeroProps) {
  const padY = size === "lg" ? "py-16 md:py-24" : "py-10 md:py-14";

  return (
    <section className="relative overflow-hidden bg-(--color-surface) bg-grain border-b border-(--color-border)">
      {imageSrc && (
        <>
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            priority
            className="object-cover opacity-95"
            sizes="100vw"
          />
          {/* Soft top + bottom fade — leaves the middle of the photo visible */}
          <div
            className="absolute inset-0 pointer-events-none hero-overlay"
          />
        </>
      )}

      <div className={`relative mx-auto max-w-4xl px-6 ${padY} text-center`}>
        {eyebrow && (
          <p className="text-xs uppercase tracking-[0.18em] mb-4 hero-text-muted">
            {eyebrow}
          </p>
        )}
        <h1
          className={`font-display leading-tight hero-text ${
            size === "lg" ? "text-4xl md:text-6xl" : "text-3xl md:text-4xl"
          }`}
        >
          {title}
        </h1>
        {tagline && (
          <p className="mt-5 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed hero-text-muted">
            {tagline}
          </p>
        )}
        <div className="mt-7 flex justify-center text-(--color-gold-500)">
          <Ornament />
        </div>
        {meta && (
          <div className="mt-5 text-sm hero-text-muted">{meta}</div>
        )}
        {cta && (
          <div className="mt-8">
            <Link
              href={cta.href}
              className="inline-flex items-center gap-2 rounded-full bg-(--color-foreground) px-6 py-3 text-(--color-background) font-medium hover:opacity-90 transition-opacity"
            >
              {cta.label}
              <span aria-hidden>→</span>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
