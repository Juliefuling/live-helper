import path from 'path';
import { app } from 'electron';
import Backend from 'i18next-fs-backend';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// 获取语言文件绝对路径
const localesPath = path.join(app.getAppPath(), 'locales');

export const initMainI18n = async () => {
  await i18n
    .use(Backend)
    .use(LanguageDetector) // 自动检测浏览器语言
    .use(initReactI18next)
    .init({
      lng: 'en',
      fallbackLng: 'en',
      ns: ['common', 'settings'],
      defaultNS: 'common',
      backend: {
        loadPath: path.join(localesPath, '{{lng}}/{{ns}}.json'),
      },
      interpolation: {
        escapeValue: false,
      },
    });
};

// 供主进程使用
export const t = i18n.t;