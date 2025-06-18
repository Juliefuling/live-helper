interface Window {
    agora: {
      createClient: () => any;
      getScreenSources: () => Promise<any>;
      setupScreenSharing: (sourceId: string) => void;
    };
    electronAPI: {
        getLanguage: () => Promise<Language>;
        changeLanguage: (lng: Language) => Promise<any>;
        onLanguageChanged:(callback: (_:any, lng: string) => void) => void;
    };
}

type Language = 'en' | 'zh-CN' | 'zh-TW';

interface Schema {
    language: string;
}