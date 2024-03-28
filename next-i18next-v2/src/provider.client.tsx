'use client';

import i18n, { defaultNS } from './i18next';

export default function Provider({
  locale,
  resource,
  children,
}: {
  locale: string;
  resource: Record<string, any>;
  children: React.ReactNode;
}) {
  i18n.addResourceBundle(locale, defaultNS, resource);
  i18n.options.fallbackLng = locale;

  return children;
}
