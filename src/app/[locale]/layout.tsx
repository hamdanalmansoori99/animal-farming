import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  IBM_Plex_Sans_Arabic,
  Fraunces,
} from "next/font/google";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import "../globals.css";
import {
  getDictionary,
  hasLocale,
  isRtl,
  alternateLocale,
  locales,
} from "@/lib/i18n";
import { Logo } from "@/components/Logo";
import { Ornament } from "@/components/Ornament";
import { ThemeToggle } from "@/components/ThemeToggle";
import { publicAsset } from "@/lib/assets";

const NO_FOUC_SCRIPT = `(function(){try{var t=localStorage.getItem('theme');var d=t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches);if(d)document.documentElement.classList.add('dark');}catch(e){}})();`;

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const plexArabic = IBM_Plex_Sans_Arabic({
  variable: "--font-plex-arabic",
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata(
  { params }: LayoutProps<"/[locale]">
): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return {
    title: { default: dict.site.title, template: `%s · ${dict.site.title}` },
    description: dict.site.tagline,
  };
}

export default async function LocaleLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();

  const dict = await getDictionary(locale);
  const dir = isRtl(locale) ? "rtl" : "ltr";
  const other = alternateLocale(locale);
  const logoSrc = await publicAsset("/images/logo.png");

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${geistSans.variable} ${geistMono.variable} ${plexArabic.variable} ${fraunces.variable} h-full antialiased`}
    >
      <head>
        <meta name="color-scheme" content="light dark" />
        <script dangerouslySetInnerHTML={{ __html: NO_FOUC_SCRIPT }} />
      </head>
      <body className="min-h-full flex flex-col bg-(--color-background) text-(--color-foreground)">
        <header className="sticky top-0 z-40 border-b border-(--color-border) bg-(--color-background)/85 backdrop-blur supports-[backdrop-filter]:bg-(--color-background)/70">
          <div className="mx-auto max-w-6xl px-6 py-3.5 flex items-center justify-between gap-4">
            <Link
              href={`/${locale}`}
              className="flex items-center gap-2.5 text-(--color-foreground) hover:text-(--color-accent-strong) transition-colors"
            >
              {logoSrc ? (
                <Image
                  src={logoSrc}
                  alt={dict.site.title}
                  width={36}
                  height={36}
                  priority
                  className="h-9 w-9 object-contain"
                />
              ) : (
                <Logo size={28} title={dict.site.title} />
              )}
              <span className="font-display text-lg leading-none">
                {dict.site.title}
              </span>
            </Link>
            <nav className="flex items-center gap-3 sm:gap-5 text-sm text-(--color-foreground)">
              <Link href={`/${locale}`} className="link-underline hidden sm:inline">
                {dict.nav.home}
              </Link>
              <Link href={`/${locale}/animals`} className="link-underline">
                {dict.nav.animals}
              </Link>
              <ThemeToggle
                labels={{
                  toDark: dict.labels.themeToDark,
                  toLight: dict.labels.themeToLight,
                }}
              />
              <Link
                href={`/${other}`}
                className="rounded-full border border-(--color-border) bg-(--color-surface) px-3.5 py-1.5 text-(--color-foreground) hover:bg-(--color-surface-elevated) transition-colors"
                aria-label={`Switch to ${dict.nav.switchLanguage}`}
              >
                {dict.nav.switchLanguage}
              </Link>
            </nav>
          </div>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="mt-16 border-t border-(--color-border) bg-(--color-surface)">
          <div className="mx-auto max-w-6xl px-6 py-10 flex flex-col items-center gap-4">
            <div className="text-(--color-gold-500)">
              <Ornament width={140} />
            </div>
            <div className="flex items-center gap-2 text-(--color-foreground)">
              {logoSrc ? (
                <Image
                  src={logoSrc}
                  alt=""
                  width={24}
                  height={24}
                  className="h-6 w-6 object-contain"
                />
              ) : (
                <Logo size={20} />
              )}
              <span className="font-display text-base">{dict.site.title}</span>
            </div>
            <p className="text-xs text-(--color-muted)">
              © {new Date().getFullYear()}
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
