import { app, BrowserWindow, shell, ipcMain } from 'electron'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import os from 'node:os'
import { ChannelMediaOptions, IRtcEngineEx, createAgoraRtcEngine } from 'agora-electron-sdk';
import { update } from './update'
import i18n from './i18n';

const require = createRequire(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url))

// The built directory structure
//
// ├─┬ dist-electron
// │ ├─┬ main
// │ │ └── index.js    > Electron-Main
// │ └─┬ preload
// │   └── index.mjs   > Preload-Scripts
// ├─┬ dist
// │ └── index.html    > Electron-Renderer
//
process.env.APP_ROOT = path.join(__dirname, '../..')

export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')
export const VITE_DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, 'public')
  : RENDERER_DIST

// Disable GPU Acceleration for Windows 7
if (os.release().startsWith('6.1')) app.disableHardwareAcceleration()

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName())

if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

let win: BrowserWindow | null = null
let agoraEngine: IRtcEngineEx = createAgoraRtcEngine();
const preload = path.join(__dirname, '../preload/index.mjs')
const indexHtml = path.join(RENDERER_DIST, 'index.html')

async function createWindow() {
  win = new BrowserWindow({
    title: '直播助手',
    backgroundColor: '#222222',
    titleBarStyle: 'hidden',
    darkTheme: true,
    titleBarOverlay: {
      color: '#222222',
      symbolColor: '#ffffff',
    },
    icon: path.join(process.env.VITE_PUBLIC, 'favicon.ico'),
    webPreferences: {
      preload,
      contextIsolation: true, // 必须开启
      nodeIntegration: false, // 必须关闭
      // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
      // nodeIntegration: true,

      // Consider using contextBridge.exposeInMainWorld
      // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
      // contextIsolation: false,
    },
  })

  if (VITE_DEV_SERVER_URL) { // #298
    win.loadURL(VITE_DEV_SERVER_URL)
    // Open devTool if the app is not packaged
    win.webContents.openDevTools()
  } else {
    win.loadFile(indexHtml)
  }

  // Test actively push message to the Electron-Renderer
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString())
  })

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url)
    return { action: 'deny' }
  })

  // Auto update
  update(win)
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  win = null
  if (process.platform !== 'darwin') app.quit()
})

app.on('second-instance', () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore()
    win.focus()
  }
})

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows()
  if (allWindows.length) {
    allWindows[0].focus()
  } else {
    createWindow()
  }
})

// New window example arg: new windows url
ipcMain.handle('open-win', (_, arg) => {
  const childWindow = new BrowserWindow({
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: false,
    },
  })

  if (VITE_DEV_SERVER_URL) {
    childWindow.loadURL(`${VITE_DEV_SERVER_URL}#${arg}`)
  } else {
    childWindow.loadFile(indexHtml, { hash: arg })
  }
})

// 获取当前语言
ipcMain.handle('get-language', () => i18n.language);

// 切换语言（主进程更新后通知渲染进程）
ipcMain.handle('change-language', async (_, lng: string) => {
  await i18n.changeLanguage(lng); // 主进程切换语言
  return i18n.language; // 返回新语言
});

// 添加 IPC 监听
ipcMain.handle('agora-require', () => {
  return require;
});
// 代理方法调用
ipcMain.handle('agora-call', (_, { method, args }) => {
  if (!agoraEngine) throw new Error('Agora engine not initialized');
  return agoraEngine[method](...args);
});
ipcMain.handle('agora-instance', () => {
  if (!agoraEngine) {
    agoraEngine = createAgoraRtcEngine();
  }
  return agoraEngine;
});

ipcMain.handle('agora-version', () => {
  return agoraEngine.getVersion();
});

ipcMain.handle('agora-init', (_, appId: string) => {
  // return agoraEngine.initialize;
  // try { 
  //   // 这里可以初始化 Agora SDK
  //   agoraEngine.initialize({
  //     appId,
  //     logConfig: { filePath: 'agora.log' },
  //     // 设置 SDK 运行模式为 Live
  //     // 默认为 Communication
  //     // Communication：通信模式
  //     // Live：直播模式
  //     // 直播模式下，可以开启视频画面的镜像
  //     // 默认为 Communication
  //     // mode: RtcConnectionType.RtcConnectionTypeLive,
  //   });
  // } catch (e) {
  //   console.error('initialize', e);
  // }
  // return {
  //   getVersion: () => {
  //     try {
  //       return agoraEngine?.getVersion();
  //     } catch (e) {
  //       console.error('Get version error:', e);
  //       return 'Error getting version';
  //     }
  //   },
  //   // 暴露其他常用方法
  //   joinChannel: (channel: string, token: string, uid: number, options: ChannelMediaOptions = {}) => {
  //     return agoraEngine?.joinChannel(token, channel, uid, options);
  //   }
  // };
})