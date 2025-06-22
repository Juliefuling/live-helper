import { Outlet } from 'react-router-dom';
import './AfterLogin.scss';
const AfterLogin = () => {
  return (
    <div className="layout flex h-screen w-full flex-col">
      <div className="app-header">
        直播助手
      </div>
      <div className='main-content'>
        <Outlet />
      </div>
    </div>
  );
};

export default AfterLogin;