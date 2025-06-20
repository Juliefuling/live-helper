import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend'; // HTTP 加载翻译文件

// 初始化渲染进程 i18n
i18next
  .use(Backend)
  .use(initReactI18next)
  .init({
    lng: 'en', // 默认语言（后续由主进程同步）
    fallbackLng: 'en',
    ns: ['common', 'settings'],
    defaultNS: 'common',
    backend: {
      loadPath: '../../locales/{{lng}}/{{ns}}.json', // 从 public/locales 加载
    },
    interpolation: { escapeValue: false },
    detection: {
        order: ['querystring', 'localStorage', 'navigator'],
        caches: ['localStorage']
    }
  });

export default i18next;