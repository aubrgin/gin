import Vue from 'vue';
import App from './App.vue';

import { GinButton, GinInput } from '@aubrgin/gin-components';

Vue.config.productionTip = false;

Vue.component('GinButton', GinButton);
Vue.component('GinInput', GinInput);

Vue.prototype.log = () => {};


new Vue({
  render: h => h(App),
}).$mount('#app');
