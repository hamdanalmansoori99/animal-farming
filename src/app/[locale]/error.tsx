"use client";

import { useEffect } from "react";
import { Ornament } from "@/components/Ornament";

// Client error boundary for anything that throws inside the [locale] tree
// (MDX frontmatter parse errors, broken image paths, data-layer failures).
export default function LocaleError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log in production so Vercel picks it up; dev surfaces to the devtools.
    // eslint-disable-next-line no-console
    console.error("Route error boundary:", error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center gap-6 px-6 py-16 text-center">
      <p className="font-display text-6xl md:text-7xl text-(--color-rust-500)">
        !
      </p>
      <div className="text-(--color-gold-500)">
        <Ornament width={120} />
      </div>
      <h1 className="font-display text-2xl md:text-3xl text-(--color-foreground) leading-tight">
        Something went wrong · حدث خطأ غير متوقع
      </h1>
      <p className="max-w-md text-(--color-muted) leading-relaxed">
        We hit an unexpected error loading this page. You can try again, or
        head back to the home page.
        <br />
        واجهنا خطأً غير متوقع أثناء تحميل الصفحة. يمكنك المحاولة مرة أخرى أو
        العودة إلى الصفحة الرئيسية.
      </p>
      <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-full bg-(--color-foreground) px-5 py-2.5 text-sm font-medium text-(--color-background) hover:opacity-90 transition-opacity"
        >
          Try again · حاول مجدداً
        </button>
      </div>
      {error.digest && (
        <p className="mt-6 text-xs text-(--color-muted) font-mono">
          digest: {error.digest}
        </p>
      )}
    </div>
  );
}
