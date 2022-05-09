<template>
  <v-layout class="d-flex justify-center">
    <panel title="Register" width="50%">
      <v-text-field
        label="Email"
        autocomplete="off"
        v-model="email"
      ></v-text-field>
      <br />
      <v-text-field
        label="Username"
        type="username"
        v-model="username"
      ></v-text-field>
      <v-text-field
        label="Password"
        type="password"
        autocomplete="new-password"
        v-model="password"
      ></v-text-field>
      <br />
      <div class="danger-alert" v-html="error"></div>
      <v-btn @click="register">Register</v-btn>
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
      username: '',
      error: null
    }
  },
  methods: {
    async register () {
      this.error = null
      try {
        await AuthenticationService.register({
          email: this.email,
          user_name: this.username,
          password: this.password
        })
        this.$router.push({
          name: 'login'
        })
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
