import loadable from '@loadable/component';


export const pages = {
    Login: loadable(() => import('./login/index')),
    Live: loadable(() => import('./live/index')),
    Error: loadable(() => import('./Error')),
};