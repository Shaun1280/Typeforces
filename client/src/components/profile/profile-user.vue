<template>
<v-card-text height="20%">
    <v-card-title class="black--text mt-8">

    <div class="d-flex flex-column justify-center">
      <v-row>
        <v-avatar size="64" color="grey">
          <v-icon dark>
            mdi-account-circle
          </v-icon>
        </v-avatar>
      </v-row>

      <v-btn
        v-if="showButton1()"
        @click="friendRequest()"
        small
        fab
        height="25px" width="25px"
        class="mybutton"
        title="Add friend"
        dark
        color="red"
        elevation="2"
        hover
      >
        <v-icon dark small>
          mdi-plus
        </v-icon>
      </v-btn>

      <v-btn
        v-if="showButton2()"
        small
        fab
        height="25px" width="25px"
        class="mybutton"
        title="My friend"
        dark
        color="yellow"
        elevation="2"
        hover
      >
        <v-icon dark small>
          mdi-heart
        </v-icon>
      </v-btn>
    </div>

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
</template>

<script>
import global from '@/global'
import FriendServices from '@/services/FriendServices'

export default {
  props: ['user'],
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
    },
    showButton1 () {
      if (!this.$store.state.isUserLoggedIn) return false
      if (this.$store.state.user.user_name === this.$store.state.route.params.username) return false
      return this.user.isFriend === 0
    },
    showButton2 () {
      if (!this.$store.state.isUserLoggedIn) return false
      if (this.$store.state.user.user_name === this.$store.state.route.params.username) return false
      return this.user.isFriend === 1
    },
    async friendRequest () {
      try {
        if (!this.$store.state.isUserLoggedIn) return
        const response = await FriendServices.friendRequest({
          id: this.user.id
        })
        this.$store.dispatch('setDialog', {
          dialog: true,
          error: response.data.msg,
          redirectName: null
        })
      } catch (error) {
        console.log(error)
        this.$store.dispatch('setDialog', {
          dialog: true,
          error: error,
          redirectName: null
        })
      }
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

.mybutton {
  margin-left: 6px;
  margin-top: -2px
}
</style>
