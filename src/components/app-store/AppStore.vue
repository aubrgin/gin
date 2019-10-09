<template>
  <div class="app-store">
    <div v-if="loading" class="app-store-loading" v-text="'loading'" />
    <template v-else>
    <button
      v-for="app in apps"
      @click="toggleApp(app)"
      class="app-store-button"
      :class="[appInstalled(app) ? 'installed' : 'not-installed']"
    >
      <i :class="app.icon" />
      {{ app.name }}
      <div v-text="appInstalled(app) ? 'Uninstall' : 'Install'" />
    </button>
    </template>
  </div>
</template>


<script>
import ginFs from '@aubrgin/gin-fs';
import npm from 'npm-programmatic';

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
     stylesheet: `${ginFs.ginPath}node_modules/${app.stylesheet}`,
   }
 }

 function removeAppFromConfig(app) {
   let apps = getAppConfig();
   apps = apps.filter((conf) => app.name != conf.name);
   setAppConfig(apps);
 }

export default {
   name: 'AppStore',
   props: {
     availableApps: {
       type: Array,
       required: true,
     },
   },
   data() {
     return {
       loading: false,
       apps: [
         {
           name: 'Sql',
           packageName: '@aubrgin/gin-app-sql',
           icon: 'fa fa-handshake',
           stylesheet: '@aubrgin/gin-app-sql/dist/@aubrgin/gin-app-sql.css',
         },
         {
           name: 'Foo',
           packageName: '@aubrgin/gin-app-sql',
           icon: 'fa fa-handshake',
           stylesheet: '@aubrgin/gin-app-sql/dist/@aubrgin/gin-app-sql.css',
         },
       ],
     };
   },
   methods: {
     async toggleApp(app) {
       this.loading = true;
       if (this.appInstalled(app)) {
         await this.uninstallApp(app);
         removeAppFromConfig(app);
       } else {
         await this.installApp(app);
         addAppToConfig(app);
       }
       this.loading = false;
       this.$emit('reload-apps');
     },
     async installApp(app) {
       await npm.install([app.packageName], { cwd: ginFs.ginPath });
     },
     async uninstallApp(app) {
       await npm.uninstall([app.packageName], { cwd: ginFs.ginPath });
     },
     appInstalled(app) {
       return this.availableApps.find((installedApp) => installedApp.name === app.name);
     },
   },
}
</script>

<style lang="scss">
 .app-store {
   width: 100%;
   height: 100%;

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
     padding: 8px 16px;
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

     &:hover {
       background-color: var(--color-active);
     }
   }
 }
</style>
