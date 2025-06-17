import { useEffect, useState } from 'react'
import UpdateElectron from '@/components/update'
import logoVite from './assets/logo-vite.svg'
import logoElectron from './assets/logo-electron.svg'
import './App.css'
import { useTranslation } from 'react-i18next';
import { initRendererI18n } from './i18n/renderer';

const LanguageSwitcher = () => {
  const { t, i18n } = useTranslation(['common', 'settings']);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    initRendererI18n().then(() => setReady(true));
  }, []);

  const changeLanguage = async (lng: Language) => {
    await window.electronAPI.setLanguage(lng);
    await i18n.changeLanguage(lng);
  };

  if (!ready) return <div>Loading...</div>;

  return (
    <div>
      <h1>{t('common:welcome')}</h1>
      <button onClick={() => changeLanguage('en')}>English</button>
      <button onClick={() => changeLanguage('zh-CN')}>简体中文</button>
      <button onClick={() => changeLanguage('zh-TW')}>繁體中文</button>
    </div>
  );
};

function App() {
  const [count, setCount] = useState(0)
  return (
    <div className='App'>
      <div className='logo-box'>
        <a href='https://github.com/electron-vite/electron-vite-react' target='_blank'>
          <img src={logoVite} className='logo vite' alt='Electron + Vite logo' />
          <img src={logoElectron} className='logo electron' alt='Electron + Vite logo' />
        </a>
      </div>
      <h1>Electron + Vite + React  1111</h1>
      <LanguageSwitcher />
      <div className='card'>
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className='read-the-docs'>
        Click on the Electron + Vite logo to learn more
      </p>
      <div className='flex-center'>
        Place static files into the<code>/public</code> folder <img style={{ width: '5em' }} src='./node.svg' alt='Node logo' />
      </div>

      <UpdateElectron />
    </div>
  )
}

export default App