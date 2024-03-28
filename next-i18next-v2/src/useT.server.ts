import { TOptions } from 'i18next';
import { headers } from 'next/headers';
import getI18nData, { LOCALE_KEY } from 'next-i18next-v2/i18n';
import { use } from 'react';

import i18n, { defaultNS } from './i18next';

export function useLocale() {
  const locale = headers().get(LOCALE_KEY) as string;
  return locale;
}

export function useT() {
  const locale = useLocale();
  const resource = use(
    getI18nData({
      locale,
    })
  );
  i18n.addResourceBundle(locale, defaultNS, resource);

  return {
    t: (...args: Parameters<typeof i18n.t>) => {
      if (typeof args[args.length - 1] === 'object') {
        (args[args.length - 1] as TOptions).lng = locale;
      } else {
        args.push({ lng: locale } as any);
      }
      return i18n.t(...args) as string;
    },
    resource,
  };
}
