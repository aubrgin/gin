<template>
  <div class="tab-view">
    <div
      class="flex-container"
      :style="{ flexDirection: 'row', height: '32px' }"
    >
      <button
        v-for="(app, index) in layout"
        class="tab"
        :key="app.key"
        :class="{ active: index===activeIndex }"
        @click="activeIndex=index"
      >
        <div
          class="tab-text"
          v-text="app.name"
        />
        <button
          class="close-button"
          @click.stop="closeApp(index)"
          v-text="'X'"
        />
      </button>
      <button
        class="open-app"
        @click.stop="onOpenApp"
        v-text="'+'"
      />
    </div>
    <div class="tab-container">
      <component
        :is="component.component"
        v-for="(component, index) in layout"
        v-show="activeIndex === index"
        :key="component.key"
        :event="transmittedEvent"
        v-bind="{ ...component.props, ...appProps }"
        @eventCatched="$emit('eventCatched')"
        @close="closeApp(index)"
      />
    </div>
  </div>
</template>

<script>
import layout from './layout';

export default {
  name: 'TabView',
  mixins: [layout],
};
</script>

<style lang="scss">
 @import "../../assets/scss/index.scss";

 $tab-height: 32px;

 .tab-view {
   height: 100%;
   position: absolute;
   width: 100%;

   .tab {
     position: relative;
     flex-grow: 1;
     text-transform: uppercase;
     font-weight: bold;
     font-size: 16px;
     color: var(--color-text-inactive);
     cursor: pointer;

     &:nth-child(even) {
       background-color: var(--color-primary);
     }
     &:nth-child(odd) {
       background-color: var(--color-alternate);
     }

     &:hover {
       background-color: var(--color-active);
       color: var(--color-text);
     }

     &.active {
       background-color: var(--color-background);
       color: var(--color-text);
       cursor: default;
     }

     .tab-text {
       vertical-align: middle;
       text-overflow: ellipsis;
       white-space: nowrap;
       width: calc(100% - 32px);
     }

     .close-button {
       position: absolute;
       right: 0;
       top: 0;
       height: var(--tab-height);
       width: var(--tab-height);
       color: var(--color-text-inactive);
       cursor: pointer;
       background-color: inherit;

       &:hover {
         color: var(--color-text);
         background-color: var(--shadow-white-light);
       }
     }
   }

   .tab-container {
     height: calc(100% - 32px);
     width: 100%;
     background-color: var(--color-background);
     position: absolute;
     top: var(--tab-height);
     left: 0;
     border: 5px solid var(--shadow-white-light);
   }

   .open-app {
     color: var(--color-text-inactive);
     cursor: pointer;
     width: var(--tab-height);
     font-size: 24px;
     border-bottom: none;
     padding: inherit;

     &:nth-child(even) {
       background-color: var(--color-primary);
     }
     &:nth-child(odd) {
       background-color: var(--color-alternate);
     }

     &:hover {
       color: var(--color-text);
       background-color: var(--color-active);
       border-color: var(--color-active);
     }
   }
 }

</style>
