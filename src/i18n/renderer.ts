import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// 动态加载语言文件（通过 HTTP）
const loadResources = async (lng: Language) => {
  const [common, settings] = await Promise.all([
    import(`../locales/${lng}/common.json`),
    import(`../locales/${lng}/settings.json`),
  ]);
  return { common: common.default, settings: settings.default };
};

export const initRendererI18n = async () => {
  const lng = await window.electronAPI?.getLanguage();

  const resources = {
    [lng]: await loadResources(lng),
  };

  await i18n.use(initReactI18next).init({
    lng,
    fallbackLng: 'en',
    ns: ['common', 'settings'],
    defaultNS: 'common',
    resources,
    interpolation: {
      escapeValue: false,
    },
  });

  return i18n;
};