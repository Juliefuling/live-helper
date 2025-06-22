import resolve from 'vite-plugin-resolve';
export const ConfigResolvePlugin = () => {
  return resolve({
    'agora-electron-sdk': `
      const { createAgoraRtcEngine } = require("agora-electron-sdk")
      export {
        createAgoraRtcEngine
      }
    `,
  });
};