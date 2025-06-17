interface Window {
    agora: {
      createClient: () => any;
      getScreenSources: () => Promise<any>;
      setupScreenSharing: (sourceId: string) => void;
    };
    electronAPI: {
        getLanguage: () => Language;
        setLanguage: (lng: Language) => void;
    };
}

type Language = 'en' | 'zh-CN' | 'zh-TW';

interface Schema {
    language: string;
}