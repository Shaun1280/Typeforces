<template>
<v-flex>
    <profile-user :user="user"/>

    <v-divider></v-divider>

    <v-card-text>
        <!-- max rating part -->
        <div class="font-weight-bold ml-8 mb-2 row justify-center">
        Contest rating: &nbsp;
        <font v-bind:color="ratingColor">
            {{user.rating !== -1 ? user.rating: 'Unrated'}}
        </font>

        <div v-if="user.rating !== -1">
            &nbsp;(max.
            <font v-bind:color="maxTitleColor">
            {{calcMaxTitle}}
            </font>
            ,
            <font v-bind:color="maxRatingColor">
            {{maxRating}}
            </font>
            )
        </div>
        </div>
        <!-- end of max rating part -->

        <div class="font-weight-bold ml-8 mb-2">
        WPM : {{user.user_wpm ? user.user_wpm : 'Unknown'}}
        </div>

        <div class="font-weight-bold ml-8 mb-2">
        Email: {{user.email}}
        </div>

        <div class="font-weight-bold ml-8 mb-2">
        Country: {{user.country}}
        </div>

        <div class="font-weight-bold ml-8 mb-2">
        Friend of : {{user.friendCount}} users
        </div>

        <div class="font-weight-bold ml-8 mb-2">
        Last Visit : {{!user.is_online ?
            (new Date(user.last_visit)) :
            'Online now'}}
        </div>

        <div class="font-weight-bold ml-8 mb-2">
        Registered: {{(new Date(user.register_time)).toISOString().substr(0, 10)}}
        </div>
    </v-card-text>
</v-flex>
</template>

<script>
import ProfileUser from '@/components/profile/Profile-user'
import global from '@/global'

export default {
  props: ['user'],
  components: {
    ProfileUser
  },
  data () {
    return {}
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
