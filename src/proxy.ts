import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, locales } from "@/lib/i18n";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip Next.js internals, static assets, files with extensions
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return;
  }

  const hasLocale = locales.some(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`)
  );
  if (hasLocale) return;

  // Negotiate from Accept-Language; fall back to default (ar)
  const accept = request.headers.get("accept-language") ?? "";
  const preferred = accept
    .split(",")
    .map((p) => p.split(";")[0].trim().toLowerCase())
    .map((tag) => tag.split("-")[0]);
  const matched =
    locales.find((l) => preferred.includes(l)) ?? defaultLocale;

  const url = request.nextUrl.clone();
  url.pathname = `/${matched}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
