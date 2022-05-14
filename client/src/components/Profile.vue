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
                  <v-list-item-title>Manage Practices</v-list-item-title>
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
            <div class="ml-10">
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
              <font>{{user.status ? `(${user.status})` : ''}}</font>
            </div>
          </v-card-title>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-text>
          <div class="font-weight-bold ml-8 mb-2 row justify-center">
            Contest rating: &nbsp;
            <font v-bind:color="ratingColor">
              {{user.competitionHistories.length ? user.rating: 'Unrated'}}
            </font>

            <div v-if="user.competitionHistories.length">
              &nbsp;(max.
              <font v-bind:color="titleColor">
                {{calcTitle}}
              </font>
              ,
              <font v-bind:color="ratingColor">
                {{maxRating}}
              </font>
              )
            </div>
          </div>

          <div class="font-weight-bold ml-8 mb-2">
            WPM :
          </div>

          <div class="font-weight-bold ml-8 mb-2">
            Average accuracy:
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
import global from '@/global'

export default {
  data () {
    return {
      user: {
        rating: 1500,
        register_time: 0,
        user_name: '',
        title: 'unrated',
        competitionHistories: []
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
      return global.calcTitle(this.user.rating, this.user.competitionHistories)
    },
    titleColor () {
      return global.titleColor(this.user.rating, this.user.competitionHistories)
    },
    nameColor () {
      return global.nameColor(this.user.user_name, this.user.rating, this.user.competitionHistories)
    },
    ratingColor () {
      return global.ratingColor(this.user.rating, this.user.competitionHistories)
    },
    maxRating () {
      return this.user.rating
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
