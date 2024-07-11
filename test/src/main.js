import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

// 根据环境变量引入不同路径的 ZMonitor 模块
let ZMonitor, performance, recordscreen;
console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'local') {
  ZMonitor = require('../../packages/core/src').default;
  performance = require('../../packages/performance/src').default;
  recordscreen = require('../../packages/recordscreen/src').default;
} else {
  ZMonitor = require('@zmonitor/core').default;
  performance = require('@zmonitor/performance').default;
  recordscreen = require('@zmonitor/recordscreen').default;
}

Vue.use(ZMonitor, {
  dsn: 'http://localhost:8080/reportData',
  appId: '8749155290628577',
  silentWhiteScreen: false,
  skeletonProject: true,
  repeatCodeError: true,
  userId: '897a4042-870f-4a41-8de2-cc85b39fabaf',
  handleHttpStatus(data) {
    function safeStringify(response) {
      try {
        return JSON.stringify(response);
      } catch (e) {
        return {
          code: 500,
          message: 'JSON.stringify error',
        };
      }
    }
    let { url, response } = data;
    // code为200，接口正常，反之亦然
    let { code } = typeof response === 'string' ? safeStringify(response) : response;
    if (url.includes('/getErrorList')) {
      return code === 200 ? true : false;
    } else {
      return true;
    }
  },
});
ZMonitor.use(performance);
ZMonitor.use(recordscreen, { recordScreentime: 15 });

Vue.use(ElementUI, { size: 'mini' });
Vue.config.productionTip = false;

setTimeout(() => {
  new Vue({
    router,
    store,
    render: h => h(App),
  }).$mount('#app');
}, 2000);
