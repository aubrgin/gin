<template>
  <gin-button
    class="app-button"
    @click="$emit('click')"
  >
    <div :class="['fa', 'fa-2x', app.icon]" />
    <div
      class="app-name"
      v-text="app.name"
    />
    <div
      class="app-shortcut"
      v-text="app.shortcut"
    />
  </gin-button>
</template>

<script>
export default {
  name: 'AppMenuButton',
  props: {
    app: {
      type: Object,
      required: true,
      validator(value) { return value.name && value.icon; },
    },
  },
};
</script>
