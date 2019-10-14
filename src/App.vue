<template>
  <div id="app">
    <div class="root-app">
      <Root
        :event="currentEvent"
        v-bind="appProps"
        @eventCatched="clearEvent"
        @reload-apps="reloadApps"
      />
    </div>
    <AppMenu
      v-if="choice"
      :available-apps="availableApps"
      @close="closeAppMenu"
      @chooseApp="chooseApp"
    />
    <div
      class="command"
      v-text="currentEvent.map((event) => event.key).join('')"
    />
  </div>
</template>

<script>
import AppMenu from './components/app-menu/AppMenu.vue';
import RowView from './components/layout/RowView.vue';
import WebView from './components/WebView.vue';
import AppStore from './components/app-store/AppStore.vue';
import TabView from './components/layout/TabView.vue';
import os from 'os';
import ginFs from '@aubrgin/gin-fs';
import fs from 'fs';

const rootName = ginFs.getConfig('root', 'gin');

function injectCss(css) {
    var linkElement = document.createElement('link');
    linkElement.setAttribute('rel', 'stylesheet');
    linkElement.setAttribute('type', 'text/css');
    linkElement.setAttribute('href', 'data:text/css;charset=UTF-8,' + encodeURIComponent(css));
    document.getElementsByTagName('head')[0].appendChild(linkElement);
}

let Root;
if (rootName === 'RowView') {
    Root = RowView;
} else if (rootName === 'TabView') {
    Root = TabView;
}

function importApp(app) {
    if (app.stylesheet) injectCss(fs.readFileSync(app.stylesheet));
    return global.require(app.path).default;
}

const availableApps = [
    {
        name: 'RowView',
        component: RowView,
        icon: 'fa-align-justify fa-rotate-90',
        shortcut: 'KeyR',
    },
    {
        name: 'TabView',
        component: TabView,
        icon: 'fa-table',
        shortcut: 'KeyT',
    },
   {
     name: 'AppStore',
     component: AppStore,
     icon: 'fa-handshake',
     shortcut: 'KeyA',
   },
    {
        name: 'WebView',
        component: WebView,
        icon: 'fa-handshake',
        shortcut: 'KeyW',
    },
];

 async function awaitArray(array) {
   const awaited = [];
   awaited.length = array.length;
   for (let promise of array) {
     awaited.push(await promise);
   }
   return awaited;
 }

export default {
    name: 'Gin',
    components: {
    AppMenu,
    Root,
  },
  data() {
    return {
      choice: undefined,
      currentEvent: [],
      keys: ginFs.getConfig('keys', 'gin'),
      availableApps,
      appProps: {
        openApp: this.openApp,
        keys: ginFs.getConfig('keys', 'gin'),
        availableApps,
      },
    };
  },
  created() {
    document.addEventListener('keydown', this.manageEvent);
    injectCss(fs.readFileSync(`${ginFs.ginPath}/${ginFs.getConfig('theme', 'gin')}`))
    injectCss(fs.readFileSync('node_modules/@aubrgin/gin-components/dist/@aubrgin/gin-components.css'));
    this.reloadApps();
  },
  methods: {
    async reloadApps() {
      this.availableApps = availableApps;
      this.availableApps.concat(
        await awaitArray(
          ginFs.getConfig('apps', 'gin').map(async(app) => {
            this.availableApps.push({
              component: await importApp(app),
              ...app,
            });
          }),
        )
      );
      this.$set(this.availableApps)
    },
    clearEvent() {
      this.currentEvent = [];
    },
    manageEvent(event) {
      if (document.activeElement !== document.body) {
        if (event.key === this.keys.stop) {
          document.activeElement.blur();
        }
        return;
      }
      if (event.key === this.keys.stop || document.activeElement !== document.body) {
        this.clearEvent();
        if (this.choice) this.closeAppMenu();
      } else if (this.choice) {
        const choosenApp = this.availableApps.find((app) => app.shortcut === event.code);
        if (choosenApp) this.chooseApp(choosenApp);
      } else {
        this.currentEvent.push(event);
      }
    },
    chooseApp(app) {
      this.choice.resolve({ ...app, key: Math.random(), props: { ...app.props, ...this.appProps } });
      this.clearChoice();
    },
    closeAppMenu() {
      this.choice.reject();
      this.clearChoice();
    },
    clearChoice() {
      this.choice = undefined;
      this.clearEvent();
    },
    openApp() {
      this.choice = {};
      this.choice.promise = new Promise((resolve, reject) => {
        this.choice.resolve = resolve;
        this.choice.reject = reject;
      });
      return this.choice.promise;
    },
  },
};
</script>

<style lang="scss">
@import 'assets/scss/index.scss';

button {
 border: none;
 font-weight: bold;
}
:focus,
:active:focus,
.active:focus,
.focus,
:active.focus,
.active.focus {
  outline: none !important;
}
html, body, #app {
  background-color: black;
  height: 100%;
  margin: 0;
  font-family: Arial, Helvetica, sans-serif;

  > .root-app {
    height: 100%;
    position: absolute;
    width: 100%;
  }
}
* {
  overflow: hidden;
  box-sizing: border-box;
  color: var(--color-text);
}
.command {
    position: absolute;
    bottom: 0;
    left: 0;
    color: white;
    font-family: monospace;
    white-space: pre;
}
</style>
