interface RtcEngineContext {
  /**
   * The App ID issued by Agora for your project. Only users in apps with the same App ID can join the same channel and communicate with each other. An App ID can only be used to create one IRtcEngine instance. To change your App ID, call release to destroy the current IRtcEngine instance, and then create a new one.
   */
  appId?: string;
  /**
   * The channel profile. See ChannelProfileType.
   */
  channelProfile?: ChannelProfileType;
  /**
   * @ignore
   */
  license?: string;
  /**
   * The audio scenarios. Under different audio scenarios, the device uses different volume types. See AudioScenarioType.
   */
  audioScenario?: AudioScenarioType;
  /**
   * The region for connection. This is an advanced feature and applies to scenarios that have regional restrictions. The area codes support bitwise operation.
   */
  areaCode?: number;
  /**
   * The SDK log files are: agorasdk.log, agorasdk.1.log, agorasdk.2.log, agorasdk.3.log, and agorasdk.4.log.
   *  The API call log files are: agoraapi.log, agoraapi.1.log, agoraapi.2.log, agoraapi.3.log, and agoraapi.4.log.
   *  The default size of each SDK log file and API log file is 2,048 KB. These log files are encoded in UTF-8.
   *  The SDK writes the latest logs in agorasdk.log or agoraapi.log.
   *  When agorasdk.log is full, the SDK processes the log files in the following order:
   *  Delete the agorasdk.4.log file (if any).
   *  Rename agorasdk.3.log to agorasdk.4.log.
   *  Rename agorasdk.2.log to agorasdk.3.log.
   *  Rename agorasdk.1.log to agorasdk.2.log.
   *  Create a new agorasdk.log file.
   *  The overwrite rules for the agoraapi.log file are the same as for agorasdk.log. Sets the log file size. See LogConfig. By default, the SDK generates five SDK log files and five API call log files with the following rules:
   */
  logConfig?: LogConfig;
  /**
   * @ignore
   */
  threadPriority?: ThreadPriorityType;
  /**
   * @ignore
   */
  useExternalEglContext?: boolean;
  /**
   * Whether to enable domain name restriction: true : Enables the domain name restriction. This value is suitable for scenarios where IoT devices use IoT cards for network access. The SDK will only connect to servers in the domain name or IP whitelist that has been reported to the operator. false : (Default) Disables the domain name restriction. This value is suitable for most common scenarios.
   */
  domainLimit?: boolean;
  /**
   * Whether to automatically register the Agora extensions when initializing IRtcEngine : true : (Default) Automatically register the Agora extensions when initializing IRtcEngine. false : Do not register the Agora extensions when initializing IRtcEngine. You need to call enableExtension to register the Agora extensions.
   */
  autoRegisterAgoraExtensions?: boolean;
}
interface IRtcEngineEx {
    getVersion(): string;
    initialize(context: RtcEngineContext): number;
    createClient(mode: string): any;
    createStream(): any;
    createChannel(channel: string): any;
}

interface Window {
    agora: {
      call: <T = any>(method: string, ...args: any[]) => Promise<T>;
      require: (module: string) => any;
      getVersion: () => string;
      instance: () => IRtcEngineEx;
      initializeAgora: (context: RtcEngineContext) => number;
    };
    electron: {
        getLanguage: () => Promise<Language>;
        changeLanguage: (lng: Language) => Promise<any>;
        onLanguageChanged:(callback: (_:any, lng: string) => void) => void;
    };
}

type Language = 'en' | 'zh-CN' | 'zh';