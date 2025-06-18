import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

type Language = 'en' | 'zh-CN' | 'zh-TW';

const loadResources = async (lng: Language) => {
  const [common, settings] = await Promise.all([
    import(`../locales/${lng}/common.json`),
    import(`../locales/${lng}/settings.json`),
  ]);
  return { common: common.default, settings: settings.default };
};

export const initRendererI18n = async () => {
  const lng = (await window.electronAPI?.getLanguage()) || 'en';

  const resources = {
    [lng]: await loadResources(lng),
  };

  await i18n
    .use(initReactI18next)
    .init({
      lng,
      fallbackLng: 'en',
      ns: ['common', 'settings'],
      defaultNS: 'common',
      resources,
      interpolation: {
        escapeValue: false,
      },
      react: {
        useSuspense: false, // This prevents the need for Suspense
      },
    });

  return i18n;
};

// Initialize immediately and export the promise
export const i18nInitPromise = initRendererI18n();