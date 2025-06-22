import Language from "@/components/language";
import Update from "@/components/update";
import { useEffect } from "react";
// import * as AgoraSDK from 'agora-electron-sdk';

const loadAgoraSDK = async () => {
    const module = await require('agora-electron-sdk')
    return module.default || module
  }
const Live = () => {
    useEffect(() => {
        const fun = async () => {
            // const require = window.agora.require;
            // const module = await require('agora-electron-sdk')
            // const AgoraRtcEngine = require('./agora-loader.cjs');
            // const AgoraRtcEngine = await loadAgoraSDK()
            const agoraEngine = await window.agora.instance();
            // console.log('rr', require, module);
            const version = await window.agora.getVersion();
            console.log('agoraEngine----1   ', version);
            try {
                setTimeout( async () => {
                    const res = await window.agora.call('initialize', {
                        appId: 'f0c0c0c0-c0c0-c0c0-c0c0-c0c0c0c0c0c0',
                    })
                    console.log('agoraEngine----2', res);
                }, 1000)
            } catch (error) {
                console.log('error', error);
            }
            // try {
            //     const res = await window.agora.initializeAgora({
            //         appId: 'f0c0c0c0-c0c0-c0c0-c0c0-c0c0c0c0c0c0',
            //         channelProfile: 1,
            //         audioScenario: 0,
            //         areaCode: 0,
            //         logConfig: {
            //             level: 0,
            //             filePath: 'agorasdk.log',
            //         }
            //     })
            // } catch (error) { 
            //     console.log('agoraEngine----0', error);
            // }
            
        }
        fun();
    }, []);    
    return (
        <div className="flex-center">
            <div className="card">
                直播页面
                <Language />
                <Update />
            </div>
        </div>
    )
};

export default Live;