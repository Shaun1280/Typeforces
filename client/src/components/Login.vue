<template>
  <v-layout class="d-flex justify-center">
    <panel title="Login" width="50%">
      <v-text-field
        label="Email"
        v-model="email"
      ></v-text-field>
      <br />
      <v-text-field
        label="Password"
        type="password"
        v-model="password"
      ></v-text-field>
      <br />
      <div class="danger-alert" v-html="error"></div>
      <v-btn @click="login">Login</v-btn>
    </panel>
  </v-layout>
</template>

<script>
import AuthenticationService from '@/services/AuthenticationService'

export default {
  data () {
    return {
      email: '',
      password: '',
      error: null
    }
  },
  methods: {
    async login () {
      try {
        const response = await AuthenticationService.login({
          email: this.email,
          password: this.password
        })
        console.log(response.data)
        this.$store.dispatch('setToken', response.data.token)
        this.$store.dispatch('setUser', response.data.user)
        this.$router.push('/')
      } catch (error) {
        this.error = error.response.data.error
      }
    }
  }
  // watch: {
  //   email (value) {
  //     console.log('email has changed', value)
  //   }
  // }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
