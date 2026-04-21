import Link from "next/link";
import { Ornament } from "@/components/Ornament";

// Branded 404 page — matches the site's editorial palette and typography.
// Locale-aware via the URL but does not depend on reading params (not-found
// is rendered from anywhere inside the [locale] segment).
export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center gap-6 px-6 py-16 text-center">
      <p className="font-display text-6xl md:text-7xl text-(--color-accent-strong)">
        404
      </p>
      <div className="text-(--color-gold-500)">
        <Ornament width={120} />
      </div>
      <h1 className="font-display text-2xl md:text-3xl text-(--color-foreground) leading-tight">
        Page not found · الصفحة غير موجودة
      </h1>
      <p className="max-w-md text-(--color-muted) leading-relaxed">
        The page you&rsquo;re looking for doesn&rsquo;t exist, or has moved.
        <br />
        لم يتم العثور على هذه الصفحة أو أنها نُقلت إلى مكان آخر.
      </p>
      <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/ar"
          className="rounded-full border border-(--color-border) bg-(--color-surface) px-5 py-2.5 text-sm text-(--color-foreground) hover:bg-(--color-surface-elevated) transition-colors"
        >
          الرئيسية
        </Link>
        <Link
          href="/en"
          className="rounded-full border border-(--color-border) bg-(--color-surface) px-5 py-2.5 text-sm text-(--color-foreground) hover:bg-(--color-surface-elevated) transition-colors"
        >
          Home
        </Link>
      </div>
    </div>
  );
}
