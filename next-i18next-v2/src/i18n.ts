interface I18nConfig {
  locales: string[];
}

export const LOCALE_KEY = 'NEXT_LOCALE';
export const DEFAULT_LOCALE = '';

export async function getLocales(): Promise<I18nConfig> {
  throw new Error('Create your own `i18n.ts`');
}

export default async function getI18nData(config: {
  locale: string;
}): Promise<Record<string, any>> {
  throw new Error('Create your own `i18n.ts`');
}
