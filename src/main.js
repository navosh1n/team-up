import Vue from 'vue';
import VueCompositionApi from '@vue/composition-api';

import App from '@/components/app';
import '@/registerServiceWorker';
import router from '@/router';
import store from '@/store';
import '@/plugins/element';
import '@/plugins/firebase';

Vue.use(VueCompositionApi);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
