import { TOptions } from 'i18next';
import getI18nData from 'next-i18next-v2/i18n';

import i18n, { defaultNS } from './i18next';
import { useLocale } from './useT.server';

export async function useT() {
  const locale = useLocale();

  const resource = await getI18nData({ locale });
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
