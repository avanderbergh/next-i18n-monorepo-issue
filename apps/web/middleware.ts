import {
  initAcceptLanguageHeaderDetector,
  initRequestCookiesDetector,
} from "i18n/src/i18n";

import { NextRequest, NextResponse } from "next/server";

import { detectLocale, locales } from "i18n/src/i18n/i18n-util";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  if (pathnameIsMissingLocale) {
    const acceptLanguageHeaderDetector =
      initAcceptLanguageHeaderDetector(request);

    const requestCookiesDetector = initRequestCookiesDetector({
      cookies: request.cookies.toString(),
    });

    const locale = detectLocale(
      acceptLanguageHeaderDetector,
      requestCookiesDetector
    );

    return NextResponse.redirect(new URL(`/${locale}${pathname}`, request.url));
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    `/((?!api|_next/static|_next/image|favicon.ico|en|de).*)`,
  ],
};
