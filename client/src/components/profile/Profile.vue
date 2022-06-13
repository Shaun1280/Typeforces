<template>
  <v-container>
    <v-row justify="space-around">
      <v-card width="80%">
        <v-toolbar
          color="blue"
          dark
          flat
        >
          <v-toolbar-title>Profile</v-toolbar-title>

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
                v-if="isSelfAdmin()"
                @click="navigateTo({name: 'manageContests'})"
              >
                <v-list-item-title>Manage contests</v-list-item-title>
              </v-list-item>

              <v-list-item
                v-if="isSelf()"
                @click="navigateTo({name: 'managePractices'})"
              >
                <v-list-item-title>Manage Practices</v-list-item-title>
              </v-list-item>

              <v-list-item
                @click="navigateTo({
                  name: 'userPractices',
                  params: {
                    username: $store.state.route.params.username
                  }
                })"
              >
                <v-list-item-title>{{isSelf() ? 'My practices' : 'User practices'}}</v-list-item-title>
              </v-list-item>

              <v-list-item
                v-if="isSelf()"
                @click="navigateTo({name: 'friend'})"
              >
                <v-list-item-title>Friends</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-toolbar>

        <v-tabs
          left
          background-color="blue"
          dark
        >
          <v-tab>
           {{user.user_name}}
          </v-tab>
          <v-tab>
           Competition History
          </v-tab>
          <v-tab>
           Practice History
          </v-tab>

          <v-tab-item>
            <profile-main :user="user"/>
          </v-tab-item>

         <v-tab-item>
            <profile-competition-history :user="user"/>
          </v-tab-item>

          <v-tab-item>
            <profile-practice-history :user="user"/>
          </v-tab-item>
        </v-tabs>
      </v-card>
    </v-row>
  </v-container>
</template>

<script>
import ProfileServices from '@/services/ProfileServices'
import ProfileMain from '@/components/profile/Profile-main'
import ProfileCompetitionHistory from '@/components/profile/Profile-competition-history'
import ProfilePracticeHistory from '@/components/profile/Profile-practice-history'
import global from '@/global'

export default {
  components: {
    ProfileMain,
    ProfileCompetitionHistory,
    ProfilePracticeHistory
  },
  data () {
    return {
      user: {
        rating: -1,
        register_time: 0,
        user_name: '',
        user_accuracy: null,
        user_wpm: null,
        title: 'unrated',
        competitionHistories: [],
        practiceHistories: []
      }
    }
  },
  methods: {
    navigateTo (route) {
      this.$router.push(route)
    },
    isSelfAdmin () { // 是否为 admin
      return this.isSelf() && this.$store.state.user.status === 'admin'
    },
    isSelf () { // 是否为本人
      return this.$store.state.isUserLoggedIn && this.$store.state.route.params.username === this.$store.state.user.user_name
    }
  },
  computed: {
    calcTitle () {
      return global.calcTitle(this.user.rating)
    },
    titleColor () {
      return global.titleColor(this.user.rating)
    },
    nameColor () {
      return global.nameColor(this.user.user_name, this.user.rating)
    },
    ratingColor () {
      return global.ratingColor(this.user.rating)
    },
    calcMaxTitle () {
      return global.calcTitle(this.maxRating)
    },
    maxTitleColor () {
      return global.titleColor(this.maxRating)
    },
    maxRatingColor () {
      return global.ratingColor(this.maxRating)
    },
    maxRating () {
      let mx = -1
      for (let history of this.user.competitionHistories) {
        if (history.post_rating === null) continue
        mx = Math.max(mx, history.prev_rating, history.post_rating)
      }
      return mx
    }
  },
  async mounted () {
    try {
      await global.checkLogin()

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
