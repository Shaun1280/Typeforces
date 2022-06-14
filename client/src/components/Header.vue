<template>
  <v-card
    color="grey"
    flat
    tile
    class="mb-10"
  >
    <v-toolbar dense class="blue">
      <v-btn
        text
        fab
        small
        class="blue white--text"
        title="Home"
        @click="navigateTo({name: 'root'})"
      >
        <v-icon small>mdi-home</v-icon>
      </v-btn>

      <v-btn
        text
        left
        class="blue white--text ml-2"
        @click="navigateTo({name: 'contests'})"
      >
        <v-icon small>mdi-rocket</v-icon>
        Contests
      </v-btn>

      <v-btn
        text
        left
        class="blue white--text ml-2"
        @click="navigateTo({name: 'practices'})"
      >
        <v-icon small>mdi-dumbbell</v-icon>
        Practices
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
          v-if="$store.state.route.name !== `viewContest` && $store.state.route.name !== `viewPractice`"
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
        icon
        class="blue white--text"
        v-if="$store.state.isUserLoggedIn"
        title="profile"
        @click="navigateTo({name: 'profile', params: {username: $store.state.user.user_name}})"
      >
        <v-icon dark>
          mdi-account-circle
        </v-icon>
      </v-btn>

      <v-btn
        icon
        class="blue white--text"
        color="indigo"
        title="logout"
        v-if="$store.state.isUserLoggedIn"
        @click="logout"
      >
        <v-icon dark>
          mdi-export
        </v-icon>
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
    }, 500),
    initWebSocket () {
      this.websock = new WebSocket('ws://localhost:8000')
      this.websock.onmessage = this.websocketonmessage
      this.websock.onerror = this.websocketonerror
      this.websock.onopen = this.websocketonopen
      this.websock.onclose = this.websocketclose
    },
    websocketonerror () {
      console.log('WebSocket in header, connection failed')
    },
    websocketonmessage (e) {
      // 数据接收
      console.log(JSON.parse(e.data))
    },
    websocketonopen () {
      this.websock.send(JSON.stringify({
        type: 'LOGIN',
        data: { user: this.$store.state.user }
      }))
      console.log('websocket in header, opened')
    },
    websocketclose (e) {
      // 关闭连接
      console.log('WebSocket in header, closed', e)
    }
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
    },
    '$store.state.user': function (newValue, oldValue) {
      this.websock.send(JSON.stringify({
        type: 'LOGIN',
        data: { user: newValue }
      }))
      this.websock.send(JSON.stringify({
        type: 'LOGOUT',
        data: { user: oldValue }
      }))
    }
  },
  mounted () {
    this.initWebSocket()
  }
}

</script>

<style scoped>
</style>
