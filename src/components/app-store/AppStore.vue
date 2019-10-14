<template>
  <div class="app-store">
    <div v-if="loading" class="app-store-loading" v-text="'loading'" />
    <template v-else>
      <div>
      Available apps
      </div>
      <gin-button
        v-for="app in apps"
        @click="selectedApp = { ...app }"
        class="app-store-button"
      >
        <i :class="app.icon" />
        {{ app.name }}
      </gin-button>
      <hr>
      <div>
        Installed apps
      </div>
      <gin-button
        v-for="app in cleanedApps"
        @click="selectedApp = app"
        class="app-store-button"
      >
        <i :class="app.icon" />
        {{ app.name }}
      </gin-button>
      <hr>
      <template v-if="selectedApp">
        <div>
          config
        </div>
        <gin-button @click="addApp(selectedApp)">
          Add
        </gin-button>
        <gin-button @click="selectedApp = undefined">
          Close
        </gin-button>
        <gin-tree :edit="true" v-model="selectedApp" />
      </template>
    </template>
  </div>
</template>


<script>
import ginFs from '@aubrgin/gin-fs';
import npm from 'npm-programmatic';
import { GinButton, GinTree } from '@aubrgin/gin-components';

 function getAppConfig() {
   return ginFs.getConfig('apps', 'gin');
 }

 function setAppConfig(apps) {
   ginFs.setConfig('apps', apps, 'gin');
 }

 function addAppToConfig(app) {
   const apps = getAppConfig();
   apps.push(buildApp(app));
   setAppConfig(apps);
 }

 function buildApp(app) {
   return {
     ...app,
     path: `${ginFs.ginPath}node_modules/${app.packageName}`,
     stylesheet: app.stylesheet ? `${ginFs.ginPath}node_modules/${app.stylesheet}` : undefined,
   }
 }

 function removeAppFromConfig(app) {
   let apps = getAppConfig();
   apps = apps.filter((conf) => app.name != conf.name);
   setAppConfig(apps);
 }

export default {
   name: 'AppStore',
   components: {
     GinButton,
     GinTree
   },
   props: {
     availableApps: {
       type: Array,
       required: true,
     },
   },
   computed: {
     cleanedApps() {
       return this.availableApps.map((app) => {
         const rtn = { ...app };
         delete rtn.component;
         return rtn;
       });
     }
   },
   data() {
     return {
       loading: false,
       appList: [],
       selectedApp: '',
       apps: [
         {
           name: 'Sql',
           packageName: '@aubrgin/gin-app-sql',
           icon: 'fa fa-handshake',
           stylesheet: '@aubrgin/gin-app-sql/dist/@aubrgin/gin-app-sql.css',
         },
         {
           name: 'Http Client',
           packageName: '@aubrgin/gin-app-http-client',
           icon: 'fa fa-handshake',
         },
         {
           name: 'Web view',
           packageName: '@aubrgin/gin-app-web-view',
           stylesheet: '@aubrgin/gin-app-web-view/dist/@aubrgin/gin-app-web-view.css',
           icon: 'fa fa-handshake',
         },
         {
           name: 'JSON',
           packageName: '@aubrgin/gin-app-json',
           icon: 'fa fa-handshake',
         },
         {
           name: 'Color picker',
           packageName: '@aubrgin/gin-app-color-picker',
           icon: 'fa fa-handshake',
         },
         {
           name: 'Fontawesome catalog',
           packageName: '@aubrgin/gin-app-fontawesome',
           icon: 'fa fa-handshake',
         },
       ],
     };
   },
   async created() {
     this.appList = await npm.list(ginFs.ginPath)
   },
   methods: {
     async installApp(app) {
       await npm.install([app.packageName], { cwd: ginFs.ginPath, save: true });
     },
     appInstalled(app) {
       return this.appList.find((installedApp) => installedApp.name === app.name);
     },
     async addApp(app) {
       this.loading = true;
       if (!this.appInstalled(app)) {
         await this.installApp(app);
       }
       addAppToConfig(app);
       this.selectedApp = undefined;
       this.$emit('reload-apps');
       this.loading = false;
     },
   },
}
</script>

<style lang="scss">
 .app-store {
   width: 100%;
   height: 100%;
   overflow-y: scroll;

   .app-store-loading {
     font-size: 100px;
     text-transform: uppercase;
     position: absolute;
     top: 50%;
     left: 50%;
     transform: translate(50%, 50%);
     width: 100%;
     height: 100%;
   }

   .app-store-button {
     width: 128px;
     border: none;
     cursor: pointer;
     margin: 8px;
     color: var(--color-text);

     &.installed {
       background-color: var(--color-primary);
     }

     &.not-installed {
       background-color: green;
       background-color: var(--color-alternate);
     }
   }
 }
</style>
