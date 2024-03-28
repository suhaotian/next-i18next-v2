import { describe, expect, test } from '@jest/globals';
import stringComparison from 'string-comparison';

import { transformAcceptLanguageToSortedArray } from '../src/accept-language-match';

const cos = stringComparison.cosine;

/*
  1. respect acceptLanguage sort
  2. respect matchLocales
  3. respect defaultLocale if 1,2 not mached
*/
describe('stringComparison', () => {
  test('transformAcceptLanguageToSortedArray case 1', () => {
    const acceptLanguage = `
en-US,en;q=0.9,zh;q=0.8,zh-CN;q=0.7,fr;q=0.6,ru;q=0.5,it;q=0.4`;
    const result = transformAcceptLanguageToSortedArray(acceptLanguage);
    const output = ['fr-FR', 'ru'];
    const locale = output.find((locale) => {
      const l = locale.toLowerCase();
      return result.find((item) => {
        const i = item.toLowerCase();
        return i === l;
      });
    });
    console.log(result, locale);
    if (locale) {
      // expect(locale).toBe(output[0]); ? ru or fr-FR
    } else {
      const a = output
        .map((item) => {
          const items = cos.sortMatch(item, result);
          const highest = {
            ...items[items.length - 1],
            locale: item,
          };
          return highest;
        })
        .sort((a, b) => b.rating - a.rating);
      console.log('a', a);
    }
    expect(result.join(',')).toBe(
      ['en-US', 'en', 'en', 'zh', 'zh-CN', 'zh', 'fr', 'ru', 'it'].join(',')
    );
  });

  test('transformAcceptLanguageToSortedArray case 2', () => {
    const acceptLanguage = `en-AU,en;q=0.9`;
    const result = transformAcceptLanguageToSortedArray(acceptLanguage);
    expect(result.join(',')).toBe(['en-AU', 'en', 'en'].join(','));
  });

  test('transformAcceptLanguageToSortedArray case 3', () => {
    const acceptLanguage = `;q=0.9`;
    const result = transformAcceptLanguageToSortedArray(acceptLanguage);
    expect(result.join(',')).toBe([].join(','));
  });
});
