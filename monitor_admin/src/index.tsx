import React from 'react';
import ReactDOM from 'react-dom/client';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import App from '@/src/app';
import './index.css';
import zMonitor from '../../packages/core/src';
import performance from '../../packages/performance/src';
import recordscreen from '../../packages/recordscreen/src';

// import zMonitor from '@zmonitor/core';
// import performance from '@zmonitor/performance';
// import recordscreen from '@zmonitor/recordscreen';

const dsn = import.meta.env.VITE_ZMONITOR_DSN;

zMonitor.init({
  dsn,
  appId: import.meta.env.VITE_APPID,
  silentWhiteScreen: true,
  skeletonProject: true,
  repeatCodeError: false,
  userId: '88888888',
  getProjectConfig: () => {
    return {
      projectEnv: 'development',
      projectIp: '192.168.130.4',
      projectVersion: '1.0.1',
      isSourceMap: true,
    };
  },
});

zMonitor.use(performance, null);
zMonitor.use(recordscreen, { recordScreenTime: 20 });

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <ConfigProvider
    locale={zhCN}
    theme={{
      components: {
        Menu: {
          iconSize: 16,
          subMenuItemBg: '#4684ff',
          // 菜单项背景
          darkItemBg: '#4684ff',
          // 菜单项文字颜色
          darkItemColor: 'white',
          // 菜单项文字hover颜色
          darkItemHoverBg: 'rgba(255,255,255,0.2)',
          // 菜单项文字颜色Hover颜色
          darkItemHoverColor: 'rgba(255,255,255,0.8)',
          // 菜单项选中背景
          darkItemSelectedBg: 'rgba(255, 255, 255,0.5)',
          // 菜单项选中颜色
          darkItemSelectedColor: 'white',
          darkSubMenuItemBg: '#4684ff',
        },
      },
    }}
  >
    <App />
  </ConfigProvider>
);
