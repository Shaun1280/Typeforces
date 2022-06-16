<template>
  <v-container>
    <v-row justify="space-around">
      <v-card width="80%" :loading="loading">
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
                <v-list-item-title>My Friends</v-list-item-title>
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
        id: '',
        rating: -1,
        register_time: 0,
        user_name: '',
        user_accuracy: null,
        user_wpm: null,
        title: 'unrated',
        competitionHistories: [],
        practiceHistories: [],
        friendCount: 0,
        is_online: false
      },
      loading: 'white'
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
    },
    calc () {
      let wpm = 0
      let count = 0
      for (let history of this.user.competitionHistories) {
        if (history.post_rating === null) continue
        count++
        wpm += history.wpm
      }
      for (let history of this.user.practiceHistories) {
        count++
        wpm += history.wpm
      }
      if (!count) {
        this.user.user_wpm = null
      } else {
        this.user.user_wpm = wpm / count
      }
    },
    async getUser () {
      try {
        await global.checkLogin()

        console.log(this.$store.state.route.params.username)
        const response = await ProfileServices.index(this.$store.state.route.params.username)
        this.loading = false
        this.user = response.data
        this.calc()
        console.log(this.user)
      } catch (error) {
        this.loading = false
        console.log(error)
      }
    }
  },
  async mounted () {
    await this.getUser()
  },
  watch: {
    '$store.state.route.params.username': async function (value) {
      await this.getUser()
    }
  }
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
