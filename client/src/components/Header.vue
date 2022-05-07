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
        <v-icon small>mdi-home</v-icon>
        Home
      </v-btn>

      <v-btn
        text
        left
        class="blue white--text"
        @click="navigateTo({name: 'contests'})"
      >
        <v-icon small>mdi-rocket</v-icon>
        Contests
      </v-btn>

      <v-btn
        text
        left
        class="blue white--text"
        @click="navigateTo({name: 'rating'})"
      >
        <v-icon small>mdi-fencing</v-icon>
        Rating
      </v-btn>

      <v-spacer></v-spacer>

      <div>
        <v-text-field
          hint="Search contest/practice/user"
          dense
          prepend-icon="mdi-magnify"
          v-model="search"
          @keyup.enter.native="goToSearch"
        >
        </v-text-field>
      </div>

      <v-btn icon>
        <v-icon small>mdi-heart</v-icon>
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
        <v-icon small>mdi-atom</v-icon>
        Manage Contests
      </v-btn>

      <v-btn
        text
        class="blue white--text"
         v-if="$store.state.isUserLoggedIn"
        @click="navigateTo({name: 'profile'})"
      >
        <v-icon small>mdi-account</v-icon>
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
        <v-icon small>mdi-dots-vertical</v-icon>
      </v-btn>
    </v-toolbar>
  </v-card>
</template>

<script>
import _ from 'lodash'

export default {
  data () {
    return {
      search: ''
    }
  },
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
    },
    goToSearch: _.debounce(async function () {
      this.$router.push({
        name: 'Search',
        query: {
          search: this.search
        }
      })
    }, 500)
  },
  watch: {
    search: _.debounce(async function (value) {
      const route = {
        name: this.$store.state.route.name
      }
      if (this.search !== '') {
        route.query = {
          search: this.search
        }
      }
      this.$router.push(route)
    }, 1000),
    '$route.query.search': {
      immediate: true,
      handler (value) {
        this.search = value
      }
    }
  }
}

</script>

<style scoped>
</style>
