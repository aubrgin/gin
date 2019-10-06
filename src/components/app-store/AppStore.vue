<template>
    <div class="app-store">
        <button
            v-for="app in apps"
            @click="installApp(app)"
            class="[availableApps.find((installedApp) => installedApp.name === app.name) ? 'installed' : 'not-installed']"
        >
        {{ app.name }}
    </button>
    </div>
</template>


<script>
import ginFs from '@aubrgin/gin-fs';
import npm from 'npm-programmatic';

 function addAppToConfig(app) {
     const apps = ginFs.getConfig('apps', 'gin');
     apps.push({
         ...app,
         path: `${ginFs.ginPath}node_modules/${app.packageName}`,
         stylesheet: `${ginFs.ginPath}node_modules/${app.stylesheet}`,
     });
     ginFs.setConfig('apps', apps, 'gin');
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
             apps: [
                 {
                     name: 'Sql',
                     packageName: '@aubrgin/gin-app-sql',
                     icon: 'fa-handshake',
                     stylesheet: '@aubrgin/gin-app-sql/dist/@aubrgin/gin-app-sql.css',
                 }
             ],
         };
     },
     methods: {
         async installApp(app) {
             await npm.install([app.packageName], { cwd: ginFs.ginPath });
             addAppToConfig(app);
             console.log(app, 'installed');
         }
     },
}
</script>

<style>
 .app-store {
     .installed {
         background-color: blue;
     }

     .not-installed {
         background-color: green;
     }
 }
</style>
