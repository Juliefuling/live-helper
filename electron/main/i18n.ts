import { app } from 'electron';
import path from 'path';
import i18next from 'i18next';
import Backend from 'i18next-fs-backend'; // 文件系统加载翻译文件

// 初始化主进程 i18n
i18next.use(Backend).init({
  lng: 'en', // 默认语言
  fallbackLng: 'en',
  ns: ['common', 'settings'],
  defaultNS: 'common',
  backend: {
    loadPath: path.join(app.getAppPath(), 'public/locales/{{lng}}/{{ns}}.json'),
  },
  interpolation: { escapeValue: false },
});

export default i18next;