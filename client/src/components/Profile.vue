<template>
  <v-container>
    <v-row justify="space-around">
      <panel width="70%">
        <template v-slot:action>
          <v-app-bar
            flat
            color="rgba(0, 0, 0, 0)"
          >
            <v-toolbar-title class="text-h6 white--text pl-0">
              Profile
            </v-toolbar-title>

            <v-spacer></v-spacer>

            <v-menu
              left
              bottom
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  icon
                  color="white"
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </template>

              <v-list>
                <v-list-item
                  v-if="$store.state.isUserLoggedIn && $store.state.user.status==='admin'"
                  @click="navigateTo({name: 'manageContests'})"
                >
                  <v-list-item-title>Manage contests</v-list-item-title>
                </v-list-item>

                <v-list-item
                  @click="() => {}"
                >
                  <v-list-item-title>Competition history</v-list-item-title>
                </v-list-item>

                <v-list-item
                  @click="() => {}"
                >
                  <v-list-item-title>Practice history</v-list-item-title>
                </v-list-item>

                <v-list-item
                  @click="() => {}"
                >
                  <v-list-item-title>Friends</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-app-bar>
        </template>

        <v-card-text height="20%">
          <v-card-title class="black--text mt-8">
            <v-avatar size="64" color="grey">
              <v-icon dark>
                mdi-account-circle
              </v-icon>
            </v-avatar>
            <div class="ml-3">
              <!-- user title -->
              <font
                v-for="(char, index) in calcTitle"
                :key="index"
                class="title_font"
                v-bind:color="titleColor"
              >
                {{char === ' ' ? '&nbsp;' : char}}
              </font>
              <br/>
              <!-- user name & status -->
              <font
                v-for="(char, index) in user.user_name"
                :key="index + 'only'"
                class="name_font"
                v-bind:color="nameColor[index]"
              >
                {{char}}
              </font>
              <br/>
              <font>({{user.status}})</font>
            </div>
          </v-card-title>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-text>
          <div class="font-weight-bold ml-8 mb-2">
            Contest rating: {{user.rating}} (max. Internation Grandmaster, 2657)
          </div>
          <div class="font-weight-bold ml-8 mb-2">
            WPM :
          </div>

          <div class="font-weight-bold ml-8 mb-2">
            Average accuracy: 100
          </div>

          <div class="font-weight-bold ml-8 mb-2">
            Email: {{user.email}}
          </div>

          <div class="font-weight-bold ml-8 mb-2">
            Country: {{user.country}}
          </div>

          <div class="font-weight-bold ml-8 mb-2">
            Friend of : 0 users
          </div>

          <div class="font-weight-bold ml-8 mb-2">
            Last Visit : {{user.last_visit}}
          </div>

          <div class="font-weight-bold ml-8 mb-2">
            Registered: {{(new Date(user.register_time)).toISOString().substr(0, 10)}}
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
      </panel>
    </v-row>
  </v-container>
</template>

<script>
import ProfileServices from '@/services/ProfileServices'

export default {
  data () {
    return {
      user: {
        rating: 1500,
        register_time: 0,
        user_name: '',
        title: 'unrated'
      }
    }
  },
  methods: {
    navigateTo (route) {
      this.$router.push(route)
    }
  },
  computed: {
    calcTitle () {
      if (this.user.rating < 1200) return 'Newbie'
      else if (this.user.rating < 1500) return 'Pupil'
      else if (this.user.rating < 1600) return 'Specialist'
      else if (this.user.rating < 1900) return 'Expert'
      else if (this.user.rating < 2100) return `Candidate Master`
      else if (this.user.rating < 2300) return 'Master'
      else if (this.user.rating < 2400) return `International Master`
      else if (this.user.rating < 2600) return 'Grandmaster'
      else if (this.user.response < 3000) return `International Grandmaster`
      else return `Legendary Grandmaster`
    },
    titleColor () {
      if (this.user.rating < 1200) return '#778899'
      else if (this.user.rating < 1500) return '#008000'
      else if (this.user.rating < 1600) return '#03A89E'
      else if (this.user.rating < 1900) return '#0000FF'
      else if (this.user.rating < 2100) return '#AA00AA'
      else if (this.user.rating < 2300) return '#FA8C00'
      else if (this.user.rating < 2400) return '#FF8C00'
      else return '#FF0000'
    },
    nameColor () {
      let ret = []
      ret.length = this.user.user_name.length
      let color
      if (this.user.rating < 1200) color = '#778899'
      else if (this.user.rating < 1500) color = '#008000'
      else if (this.user.rating < 1600) color = '#03A89E'
      else if (this.user.rating < 1900) color = '#0000FF'
      else if (this.user.rating < 2100) color = '#AA00AA'
      else if (this.user.rating < 2300) color = '#FA8C00'
      else if (this.user.rating < 2400) color = '#FF8C00'
      else color = '#FF0000'
      for (let i = 0; i < ret.length; i++) {
        ret[i] = color
        if (i === 0 && this.user.rating >= 3000) ret[i] = '#000000'
      }
      return ret
    }
  },
  async mounted () {
    try {
      console.log(this.$store.state.route.params.username)
      const response = await ProfileServices.index(this.$store.state.route.params.username)
      this.user = response.data
      console.log(this.user)
    } catch (error) {
      console.log(error)
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
.name_font {
  font-weight: 600
}

.title_font {
  font-weight: 600
}
</style>
