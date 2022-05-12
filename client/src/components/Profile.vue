<template>
  <v-container>
    <v-row justify="space-around">
      <v-card width="80%">
        <v-card-text
          height="20%"
          class="blue"
        >
          <v-app-bar
            flat
            color="rgba(0, 0, 0, 0)"
          >
            <v-toolbar-title class="text-h6 white--text pl-0">
              Profile
            </v-toolbar-title>

            <v-spacer></v-spacer>

            <v-btn
              color="white"
              icon
            >
              <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
          </v-app-bar>

          <v-card-title class="white--text mt-8">
            <v-avatar size="64" color="grey">
              <v-icon dark>
                mdi-account-circle
              </v-icon>
            </v-avatar>
            <div class="ml-3">
              <p> Internation Grandmaster </p>
              <p> John Doe </p>
              <p> Student </p>
            </div>
          </v-card-title>
        </v-card-text>

        <v-card-text>
          <div class="font-weight-bold ml-8 mb-2">
            Contest rating: 2633 (max. Internation Grandmaster, 2657)
          </div>
          <div class="font-weight-bold ml-8 mb-2">
            WPM :
          </div>

          <div class="font-weight-bold ml-8 mb-2">
            Average accuracy: 100
          </div>

          <div class="font-weight-bold ml-8 mb-2">
            Email: 2498861110@qq.com
          </div>

          <div class="font-weight-bold ml-8 mb-2">
            Country: China
          </div>

          <div class="font-weight-bold ml-8 mb-2">
            Friend of : 0 users
          </div>

          <div class="font-weight-bold ml-8 mb-2">
            Last Visit : Online now
          </div>

          <div class="font-weight-bold ml-8 mb-2">
            Registered: 7 years ago
          </div>
          <!-- <v-timeline
            align-top
            dense
          >
            <v-timeline-item
              v-for="message in messages"
              :key="message.time"
              :color="message.color"
              small
            >
              <div>
                <div class="font-weight-normal">
                  <strong>{{ message.from }}</strong> @{{ message.time }}
                </div>
                <div>{{ message.message }}</div>
              </div>
            </v-timeline-item>
          </v-timeline> -->
        </v-card-text>
      </v-card>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data () {
    return {
      user: {}
    }
  },
  methods: {

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
