import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { i18n } from "../i18n-config";

export function middleware(request: NextRequest) {
  const cookie = request.cookies.get("NEXT_LOCALE");
  const cookieLocale = cookie?.value;

  const pathname = request.nextUrl.pathname;
  //console.log(`Request Pathname: ${pathname}`);

  // Exclude static assets and API routes from locale redirection
  if (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/api/") ||
    pathname.match(/\.(jpg|jpeg|png|gif|ico|svg|css|js)$/)
  ) {
    //console.log('Path is for static asset or API route. Skipping locale redirection.');
    return NextResponse.next();
  }

  // Determine if the pathname includes a supported locale
  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) =>
      !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`,
  );
  //console.log(`Pathname Is Missing Locale: ${pathnameIsMissingLocale}`);

  if (pathnameIsMissingLocale) {
    // Use the cookie locale if available; otherwise, fall back to a default locale
    const preferredLocale = cookieLocale || i18n.defaultLocale;
    //console.log(`Redirecting to Preferred Locale: ${preferredLocale}`);

    // Redirect to the preferred locale
    const response = NextResponse.redirect(
      new URL(
        `/${preferredLocale}${pathname.startsWith("/") ? "" : "/"}${pathname}`,
        request.url,
      ),
    );

    // If the locale comes from cookie (user preference), no need to set it again
    if (!cookieLocale) {
      // Set the locale in a cookie for future requests
      //console.log(`Setting Cookie for Locale: ${preferredLocale}`);
      response.cookies.set("NEXT_LOCALE", preferredLocale, {
        path: "/",
        maxAge: 60 * 60 * 24 * 365,
      });
    }

    return response;
  } else if (cookieLocale && !pathname.startsWith(`/${cookieLocale}`)) {
    // If there's a cookie locale that doesn't match the current path's locale, consider updating the cookie.
    //console.log(`Cookie Locale and Path Locale Do Not Match. Current Path: ${pathname}`);
    const currentLocale = i18n.locales.find((locale) =>
      pathname.startsWith(`/${locale}`),
    );
    if (currentLocale) {
      //console.log(`Updating Cookie to Current Locale: ${currentLocale}`);
      const response = NextResponse.next();
      response.cookies.set("NEXT_LOCALE", currentLocale, {
        path: "/",
        maxAge: 60 * 60 * 24 * 365,
      });
      return response;
    }
  }

  // Proceed without modification if the request already includes a locale
  //console.log('Proceeding without modification.');
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
