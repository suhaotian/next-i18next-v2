import i18next from 'i18next';

export const defaultNS = 't';

const i18n = i18next.createInstance({ defaultNS: 't', ns: [defaultNS], resources: {} });

i18n.init({ defaultNS: 't', ns: [defaultNS], resources: {} });

export default i18n;
