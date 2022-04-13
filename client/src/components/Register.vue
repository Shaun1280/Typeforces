<!-- <template>
  <v-layout column>
    <v-flex xs2 offset-xs3>
      <div color="white elevation-2">
        <v-toolbar flat dense color="blue" dark>
          <v-toolbar-title>Register</v-toolbar-title>
        </v-toolbar>

        <div class="pl-4 pr-4 pt-2 pb-2">
          <input
            type="email"
            name="email"
            v-model="email"
            placeholder="email"
          />
          <br />
          <input
            type="password"
            name="password"
            v-model="password"
            placeholder="password"
          />
          <br />
          <div class="error" v-html="error"></div>
          <v-btn @click="register">Register</v-btn>
        </div>
      </div>
    </v-flex>
  </v-layout>
</template> -->

<template>
  <div class="d-flex justify-center">
    <v-card max-width="600">
        <v-form
          ref="form"
          class="ma-8"
          elevation="2"
        >
            <v-text-field
              label="Name"
            ></v-text-field>

            <v-btn
              color="success"
              class="mr-4"
            >
            Register
          </v-btn>
      </v-form>
    </v-card>
  </div>
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
.error {
  color: red
}
</style>
