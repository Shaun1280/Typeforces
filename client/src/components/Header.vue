<template>
  <v-card
    color="grey"
    flat
    tile
    class="mb-10"
  >
    <v-toolbar dense class="blue">
      <v-app-bar-nav-icon></v-app-bar-nav-icon>

      <v-btn
        text
        left
        class="blue white--text"
        @click="navigateTo({name: 'root'})"
      >
        <v-icon>mdi-home</v-icon>
        Home
      </v-btn>

      <v-btn
        text
        left
        class="blue white--text"
        @click="navigateTo({name: 'contests'})"
      >
        <v-icon>mdi-rocket</v-icon>
        Contests
      </v-btn>

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
        v-if="!$store.state.isUserLoggedIn"
        @click="navigateTo({name: 'login'})"
      >
        Login
      </v-btn>

      <v-btn
        text
        class="blue white--text"
        v-if="!$store.state.isUserLoggedIn"
        @click="navigateTo({name: 'register'})"
      >
        Sign Up
      </v-btn>

      <v-btn
        text
        class="blue white--text"
         v-if="$store.state.isUserLoggedIn"
        @click="navigateTo({name: 'manageContests'})"
      >
        <v-icon>mdi-atom</v-icon>
        Manage Contests
      </v-btn>

      <v-btn
        text
        class="blue white--text"
         v-if="$store.state.isUserLoggedIn"
        @click="navigateTo({name: 'profile'})"
      >
        <v-icon>mdi-account</v-icon>
        Profile
      </v-btn>

      <v-btn
        text
        class="blue white--text"
        v-if="$store.state.isUserLoggedIn"
        @click="logout"
      >
        Log Out
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
    },
    logout () {
      this.$store.dispatch('setToken', null)
      this.$store.dispatch('setUser', null)
      this.$router.push({
        name: 'root'
      })
    }
  }
}

</script>

<style scoped>
</style>
