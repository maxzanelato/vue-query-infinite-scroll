import { createApp } from 'vue';
import { VueQueryPlugin, VueQueryPluginOptions } from 'vue-query';

import './style.css';
import App from './App.vue';

const vueQueryPluginOptions: VueQueryPluginOptions = {
  queryClientConfig: {
    defaultOptions: {
      queries: {
        suspense: true,
      },
    },
  },
};

createApp(App)
  .use(VueQueryPlugin, vueQueryPluginOptions)
  .mount('#app');
