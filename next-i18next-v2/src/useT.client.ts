import { useParams } from 'next/navigation';

import i18n from './i18next';

export function useLocale() {
  const params = useParams<{ locale: string }>();
  return params.locale;
}

export function useT() {
  return {
    t: (...args: Parameters<typeof i18n.t>) => {
      return i18n.t(...args) as string;
    },
    resource: {} as Record<string, any>,
  };
}
