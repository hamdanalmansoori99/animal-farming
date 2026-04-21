import Link from "next/link";
import type { SectionId } from "@/lib/animals";
import { SECTION_SLUG } from "@/lib/animals";
import type { Dictionary, Locale } from "@/lib/i18n";

export function ChapterCard({
  sectionId,
  available,
  locale,
  dict,
  title,
  summary,
}: {
  sectionId: SectionId;
  available: boolean;
  locale: Locale;
  dict: Dictionary;
  /** Optional override for the card title — when an MDX frontmatter title has been loaded. */
  title?: string;
  /** Optional one-line summary from the chapter's frontmatter. */
  summary?: string;
}) {
  const label = title ?? dict.sections[sectionId];
  const href = `/${locale}/guide/${SECTION_SLUG[sectionId]}`;

  if (!available) {
    return (
      <div
        aria-disabled
        className="flex flex-col gap-3 rounded-2xl border border-(--color-border) bg-(--color-surface) warm-shadow-sm p-6 opacity-60"
      >
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-display text-lg leading-tight text-(--color-foreground)">
            {label}
          </h3>
          <span className="shrink-0 rounded-full bg-(--color-surface-elevated) px-2.5 py-1 text-[0.65rem] uppercase tracking-[0.14em] text-(--color-muted)">
            {dict.labels.comingSoon}
          </span>
        </div>
        {summary && (
          <p className="text-sm leading-relaxed text-(--color-muted)">
            {summary}
          </p>
        )}
      </div>
    );
  }

  return (
    <Link
      href={href}
      className="group flex flex-col gap-3 rounded-2xl border border-(--color-border) bg-(--color-surface) warm-shadow-sm hover:warm-shadow hover:-translate-y-0.5 hover:border-(--color-accent-strong) transition-all duration-200 p-6"
    >
      <h3 className="font-display text-lg leading-tight text-(--color-foreground) group-hover:text-(--color-accent-strong) transition-colors">
        {label}
      </h3>
      {summary && (
        <p className="text-sm leading-relaxed text-(--color-muted)">
          {summary}
        </p>
      )}
      <span className="mt-auto inline-flex items-center gap-1.5 text-xs text-(--color-muted) group-hover:text-(--color-accent-strong) transition-colors">
        {dict.labels.openGuide}
        <span aria-hidden>→</span>
      </span>
    </Link>
  );
}
