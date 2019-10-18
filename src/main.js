import Vue from 'vue';
import fs from 'fs';
import ginFs from '@aubrgin/gin-fs';

import { GinButton, GinInput } from '@aubrgin/gin-components';

init();

async function initConfig() {
  if (!fs.existsSync(ginFs.ginPath)) {
    fs.mkdirSync(ginFs.ginPath);
    fs.writeFileSync(`${ginFs.ginPath}/package.json`, JSON.stringify({ "name": "gin" }));
  }
  if (!fs.existsSync(`${ginFs.ginPath}/gin`)) {
    fs.writeFileSync(`${ginFs.ginPath}/gin`, JSON.stringify(require('../config-example.json')));
  }
  const themePath = `${ginFs.ginPath}/${ginFs.getConfig('theme', 'gin')}`;

  if (!fs.existsSync(themePath)) {
    fs.writeFileSync(themePath, fs.readFileSync('gin.css'));
  }
}

async function init() {
  await initConfig();

  Vue.config.productionTip = false;

  Vue.component('GinButton', GinButton);
  Vue.component('GinInput', GinInput);

  Vue.prototype.log = () => {};

  const App = (await import('./App.vue')).default;
  new Vue({
    render: h => h(App),
  }).$mount('#app');
}
