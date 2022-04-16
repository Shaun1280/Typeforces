<template>
  <v-card
    color="grey"
    flat
    tile
    class="mb-10"
  >
    <v-toolbar dense class="blue">
      <v-app-bar-nav-icon></v-app-bar-nav-icon>

      <v-toolbar-title>
        <button
          text
          tile
          class="blue white--text"
          @click="navigateTo({name: 'root'})">
          Home
        </button>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn icon>
        <v-icon>mdi-magnify</v-icon>
      </v-btn>

      <v-btn icon>
        <v-icon>mdi-heart</v-icon>
      </v-btn>

      <v-btn
        text
        class="blue white--text"
        @click="navigateTo({name: 'login'})"
      >
        Login
      </v-btn>

      <v-btn
        text
        class="blue white--text"
        @click="navigateTo({name: 'register'})"
      >
        Sign Up
      </v-btn>

      <v-btn icon>
        <v-icon>mdi-dots-vertical</v-icon>
      </v-btn>
    </v-toolbar>
  </v-card>
</template>

<script>
export default {
  methods: {
    navigateTo (route) {
      this.$router.push(route)
    }
  }
}

</script>

<style scoped>
</style>
