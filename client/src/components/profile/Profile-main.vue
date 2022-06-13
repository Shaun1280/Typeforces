<template>
<v-flex>
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
        Average accuracy: {{user.user_accuracy ? user.user_accuracy : 'Unknown'}}
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
        Last Visit : {{user.last_visit ?
            (new Date(user.last_visit)).toISOString().substr(0, 10) :
            'Unknown'}}
        </div>

        <div class="font-weight-bold ml-8 mb-2">
        Registered: {{(new Date(user.register_time)).toISOString().substr(0, 10)}}
        </div>
    </v-card-text>
</v-flex>
</template>

<script>
import global from '@/global'

export default {
  props: ['user'],
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
