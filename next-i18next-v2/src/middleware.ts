import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getLocales, DEFAULT_LOCALE, LOCALE_KEY } from 'next-i18next-v2/i18n';

import { acceptLanguageMatchLocale } from './accept-language-match';

const countryLocales = [
  {
    id: 'Japan',
    languages: ['ja', 'en'],
  },
  {
    id: 'China',
    languages: ['zh-CN', 'zh-TW', 'zh-HK'],
  },
];

// locale: LOCALE_COUNTRY

export function createMiddleware() {
  return async function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    const { locales } = await getLocales();

    // Check if there is any supported locale in the pathname
    const pathnameIsMissingLocale = locales.every(
      (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
    );

    // Redirect if there is no locale
    if (pathnameIsMissingLocale) {
      const [locale, localeInCookie] = getLocale(request, locales);

      // e.g. incoming request is /products
      // The new URL is now /en-US/products
      const nextUrl = new URL(
        `/${locale}${pathname.startsWith('/') ? '' : '/'}${pathname}`,
        request.url
      );
      const response = NextResponse.redirect(nextUrl);

      if (localeInCookie && locale !== localeInCookie) {
        response.cookies.set(LOCALE_KEY, locale);
        response.headers.set(LOCALE_KEY, locale);
      }

      return response;
    } else {
      const response = NextResponse.next();
      const locale = pathname.split('/')[1];
      response.cookies.set(LOCALE_KEY, locale);
      response.headers.set(LOCALE_KEY, locale);
      return response;
    }
  };
}

function getLocale(request: NextRequest, locales: string[]) {
  // get default locale
  const localeInCookie = request.cookies.get(LOCALE_KEY)?.value;
  let defaultLocale = DEFAULT_LOCALE;
  if (localeInCookie && locales.find((item) => item === localeInCookie)) {
    defaultLocale = localeInCookie;
  }

  // use cookie
  if (defaultLocale === localeInCookie) return [localeInCookie, localeInCookie] as const;

  const acceptLanguage =
    request.headers.get('Accept-Language') || request.headers.get('accept-language') || '';
  const locale = acceptLanguageMatchLocale(acceptLanguage, locales, defaultLocale);
  return [locale, localeInCookie] as const;
}
