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
      <gin-button
        class="app-menu-close"
        @click="close"
      >
        X
      </gin-button>
    </div>
  </div>
</template>

<script>
import AppMenuButton from './AppMenuButton.vue';

export default {
  name: 'AppMenu',
   components: {
     AppMenuButton,
   },
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
     background-color: var(--color-background-menu);
     z-index: 1;
     padding: 2%;
     box-shadow: 10px 10px 5px 5px var(--shadow-black-medium);

     .app-button {
       position: relative;
       margin: 2%;
       padding: 0px;
     }

     .app-menu-close {
       position: absolute;
       top: 0;
       right: 0;
       cursor: pointer;
     }
   }
 }
</style>
