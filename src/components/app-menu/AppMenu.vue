<template>
  <div
    class="backdrop"
    @click="close"
  >
    <div class="app-menu">
      <AppMenuButton
        v-for="app in availableApps"
        :key="app.name"
        :app="app"
        @click="$emit('chooseApp', app)"
      />
      <button
        class="app-menu-close"
        @click="close"
        v-text="'X'"
      />
    </div>
  </div>
</template>

<script>
import AppMenuButton from './AppMenuButton.vue';

export default {
  name: 'AppMenu',
  components: { AppMenuButton },
  props: {
    availableApps: {
      type: Array,
      required: true,
    },
  },
  methods: {
    close() {
      this.$emit('close');
    },
  },
};
</script>

<style lang="scss">
 @import "../../assets/scss/index.scss";

 .backdrop {
   position: absolute;
   width: 100%;
   height: 100%;
   top: 0;
   left: 0;

   .app-menu {
     position: absolute;
     margin: auto;
     width: 60%;
     height: 60%;
     top: 20%;
     left: 20%;
     background-color: var(--color-primary);
     z-index: 2;
     padding: 2%;
     box-shadow: 10px 10px 5px 5px var(--shadow-black-medium);

     .app-button {
       position: relative;
       width: 21%;
       height: 21%;
       margin: 2%;
       padding: 0px;
       cursor: pointer;
       color: var(--color-text-inactive);
       background-color: var(--color-background);
       box-shadow: 3px 3px 3px 3px var(--shadow-black-medium);

       &:hover {
         background-color: var(--color-active);
         color: var(--color-background);
       }
       .fa {
         padding: 4px;
       }

       .app-name {
       }

       .app-shortcut {
         position: absolute;
         top: 0;
         right: 0;
       }
     }

     .app-menu-close {
       position: absolute;
       top: 0;
       right: 0;
       cursor: pointer;
       color: #797990;
       background-color: var(--color-background);
       box-shadow: 1px 1px 1px 1px var(--shadow-black-medium);
       height: 24px;
       width: 24px;

       &:hover {
         background-color: #797990;
         color: var(--color-background);
       }
     }
   }
 }
</style>
