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
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json', // 从 public/locales 加载
    },
    interpolation: { escapeValue: false },
  });

export default i18next;