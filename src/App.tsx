import { useEffect } from 'react'
import UpdateElectron from '@/components/update'
import './App.css'
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { t, i18n } = useTranslation();
  useEffect(() => {
    // 初始化时从主进程获取语言
    window.electronAPI.getLanguage().then((lng) => {
      if (lng !== i18n.language) {
        i18n.changeLanguage(lng); // 渲染进程同步语言
      }
    });

    // 监听主进程语言变化（可选，如果其他窗口也需要同步）
    window.electronAPI.onLanguageChanged((_, lng) => {
      i18n.changeLanguage(lng);
    });
  }, [i18n]);

  // 切换语言时通知主进程
  const changeLanguage = async (lng: Language) => {
    await i18n.changeLanguage(lng); // 渲染进程切换
    await window.electronAPI.changeLanguage(lng); // 主进程切换
  };

  return (
    <div>
      <h1>{t('welcome')}</h1>
      <button onClick={() => changeLanguage('en')}>English</button>
      <button onClick={() => changeLanguage('zh-CN')}>简体中文</button>
      <button onClick={() => changeLanguage('zh-TW')}>繁體中文</button>
    </div>
  );
};

function App() {
  return (
    <div className='App'>
      <LanguageSwitcher />
      <UpdateElectron />
    </div>
  )
}

export default App