<template>
  <v-card v-bind:width="width">
    <div class="white elevation-2">
      <v-toolbar flat dense class="blue" dark>
        <v-toolbar-title>{{title}}</v-toolbar-title>
        <slot name="action" />
      </v-toolbar>

      <div class="pl-4 pr-4 pt-2 pb-2">
        <slot>
          No slot content defined.
        </slot>
      </div>
    </div>
  </v-card>
</template>

<script>
export default {
  props: {
    title: String,
    width: String
  }
}
</script>

<style scoped>
</style>
