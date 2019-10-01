<template>
  <div id="app">
    <div class="root-app">
      <Root
        :event="currentEvent"
        v-bind="appProps"
        @eventCatched="clearEvent"
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
import config from './config/config.js';
import RowView from './components/layout/RowView.vue';
import TabView from './components/layout/TabView.vue';


const rootName = config.get('gin/root');

let Root;
 if (rootName === 'RowView') {
   Root = RowView;
 } else if (rootName === 'TabView') {
   Root = TabView;
 }

 async function importPackage(path) {
   let module;
   try {
     module = await import(`./components/${path}.vue`);
   } catch (_) {}
   if (!module) {
     try {
       module = await import(`gin-app-${path}`);
     } catch (_) {}
   }
   if (!module) {
     try {
       const [org, pack] = path.split('/');
       module = global.require(`${org}/gin-app-${pack}`);
       // TODO find a better way to do this...
       require(`../node_modules/${org}/gin-app-${pack}/dist/${org}/gin-app-${pack}.css`);
     } catch (_) {}
   }
   return module && module.default
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
      keys: config.get('gin/keys'),
      availableApps: [],
      appProps: {
        openApp: this.openApp,
        keys: config.get('gin/keys'),
        config: config,
      },
    };
  },
  created() {
    document.addEventListener('keydown', this.manageEvent);
    config.get('gin/apps').forEach(async(app) => {
      this.availableApps.push({
        component: await importPackage(app.path),
        ...app,
      });
    });
  },
  methods: {
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
