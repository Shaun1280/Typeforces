<template>
  <v-layout class="d-flex justify-center">
    <v-card width="50%">
      <div color="white elevation-2">
        <v-toolbar flat dense color="blue" dark>
          <v-toolbar-title>Register</v-toolbar-title>
        </v-toolbar>

        <div class="pl-4 pr-4 pt-2 pb-2">
          <v-text-field
            label="Email"
            v-model="email"
          ></v-text-field>
          <br />
          <v-text-field
            label="Password"
            v-model="password"
          ></v-text-field>
          <br />
          <div class="error1" v-html="error"></div>
          <v-btn @click="register">Register</v-btn>
        </div>
      </div>
    </v-card>
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
    async register () {
      try {
        await AuthenticationService.register({
          email: this.email,
          password: this.password
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
.error1 {
  color: red
}
</style>
