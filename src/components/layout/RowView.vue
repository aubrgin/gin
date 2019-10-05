<template>
  <div
    ref="container"
    class="flex-container flex-container-row row-view"
  >
    <button
      @click="onOpenApp(0)"
      v-text="'+'"
    />
    <template v-for="(child, index) in layout">
      <div
        :key="child.key"
        class="flex-item"
        :style="{ width: `${widths[index]}px` }"
        :class="{ active: index === activeIndex }"
        @click="chooseApp(index)"
      >
        <component
          :is="child.component"
          v-bind="child.props"
          :event="transmittedEvent"
          @close="layout.splice(index, 1)"
        />
      </div>
      <template v-if="index !== layout.length-1">
        <div
          :key="child.key + 'resizer'"
          class="resizer vertical-resizer"
          @mousedown.left="resize($event, index)"
        />
      </template>
    </template>
  </div>
</template>

<script>
import layout from './layout';

export default {
  name: 'SplitView',
  mixins: [layout],
  data() {
    return {
      widths: [],
      isMounted: false,
    };
  },
  computed: {
    containerSize() {
      if (!this.isMounted) {
        return { width: 0, height: 0 };
      }
      return {
        width: this.$refs.container.clientWidth,
        height: this.$refs.container.clientHeight,
      };
    },
  },
  watch: {
    containerSize(newValue, oldValue) {
      const delta = newValue.width - oldValue.width;
      for (let i = 0; i < this.widths.length; i++) {
        this.$set(this.widths, i, this.widths[i] + (delta / this.layout.length));
      }
    },
    layout() {
      this.widths = Array.from({ length: this.layout.length }).map(() => window.innerWidth / this.layout.length);
    },
  },
  mounted() {
    this.isMounted = true;
  },
  created() {
    this.widths = Array.from({ length: this.layout.length }).map(() => window.innerWidth / this.layout.length);
  },
  methods: {
    resize(mouseDownEvent, index) {
      const initialX = mouseDownEvent.clientX;
      const initialWidth = this.widths[index];
      const resize = (event) => {
        const newValue = event.clientX - initialX + initialWidth;
        const delta = this.widths[index] - newValue;
        this.$set(this.widths, index, newValue);
        this.$set(this.widths, index + 1, this.widths[index + 1] + delta);
      };
      document.addEventListener('mousemove', resize);
      document.addEventListener('mouseup', () => {
        document.removeEventListener('mousemove', resize);
      });
    },
  },
};
</script>

<style lang="scss">
 @import '../../assets/scss/index.scss';

 .close-app {
     position: absolute;
     top: 0;
     left: 0;
 }
.flex-container {
    display: flex;
    height: 100%;
    flex-direction: row;
}

 .flex-item {
   position: relative;
     flex-grow: 1;
   border: 5px solid rgba(255, 255, 255, 0.1);
   &.active {
     border: 5px solid rgba(255, 255, 255, 0.5);
   }
 }
 .vertical-resizer {
     width: 3px;
     background-color: $color-alternate;
     cursor: ew-resize;
 }
</style>
