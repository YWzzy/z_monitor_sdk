import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import ZMonitor from '../../packages/core/src';
import performance from '../../packages/performance/src';
import recordscreen from '../../packages/recordscreen/src';

// import zMonitor from '@zmonitor/core';
// import performance from '@zmonitor/performance';
// import recordscreen from '@zmonitor/recordscreen';

Vue.use(ZMonitor, {
  dsn: 'http://localhost:8080/reportData',
  appId: '6538865438263703',
  silentWhiteScreen: false,
  skeletonProject: true,
  repeatCodeError: true,
  userId: '43527840-fc18-4d52-a12c-e369a694de87',
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

    console.log('data', data);
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
