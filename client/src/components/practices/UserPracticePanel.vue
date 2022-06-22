<template>
  <panel :title="title" :width="width">
    <template v-slot:action>
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
            @click="sortMode = 'latest'"
          >
            <v-list-item-title>Latest</v-list-item-title>
          </v-list-item>

          <v-list-item
            @click="sortMode = 'most liked'"
          >
            <v-list-item-title>MostLiked</v-list-item-title>
          </v-list-item>

          <v-list-item
            @click="navigateTo({ name: 'practices' })"
          >
            <v-list-item-title>All practices</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </template>

    <v-col>
      <v-card
        v-for="(practice, index) in visible"
        class="mt-4 md-4"
        :key="index"
        outlined
        elevation="1"
       >
        <v-flex
          v-if="$store.state.isUserLoggedIn"
          class="d-flex flex-row justify-start mt-1"
        >
          <v-btn
            @click="vote(practice)"
            right
            fab
            height="25px" width="25px"
            class="mybutton ml-2"
            title="Vote practice"
            dark
            outlined
            hover
          >
            <v-icon dark :color="voteColor[index]">
              mdi-star
            </v-icon>
          </v-btn>
          <div class="ml-2">{{practice.PracticeVotes ? practice.PracticeVotes.length : 0}}</div>
        </v-flex>
        <br v-if="!$store.state.isUserLoggedIn"/>

        Practice: {{practice.practice_name}}
        <br/><br/>

        <font
          v-for="(char, index3) in 'Author'"
          :key="index3"
        >
          {{char}}
        </font>
        <div
          @click="navigateTo({
            name: 'profile',
            params: {
              username: practice.User.user_name
            }
          })"
          class="mydiv"
        >
          <font
            v-for="(char, index2) in practice.User.user_name"
            :key="index2 + 'only'"
            class="name_font"
            v-bind:color="nameColor(practice.User)[index2]"
          >
            {{char}}
          </font>
        </div>
        <br/>

        Published: {{(new Date(practice.publish_time))}}
        <br/><br/>

        <v-card-actions class="justify-center">
          <v-btn
          rounded
          @click="navigateTo({name: 'viewPractice', params: {id: practice.practice_no}})"
          >
          Enter
          </v-btn>
        </v-card-actions>
      </v-card>

      <v-pagination
        v-model="page"
        class="my-4"
        :length="length"
      ></v-pagination>
    </v-col>
  </panel>
</template>

<script>
import PracticeServices from '@/services/PracticeServices'
import global from '@/global'

export default {
  props: [
    'title',
    'width',
    'practices',
    'pageSize'
  ],
  data () {
    return {
      page: 1,
      sortMode: 'latest'
    }
  },
  computed: {
    visible () {
      let ret = []

      const sorted = this.practices
      if (this.sortMode === 'latest') {
        sorted.sort(function (a, b) {
          return b.practice_no - a.practice_no
        })
      } else { // need changes
        sorted.sort(function (a, b) {
          return b.vote_count - a.vote_count
        })
      }

      for (let i = 0; i < sorted.length; i++) {
        if (Math.trunc(i / this.pageSize) + 1 === this.page) {
          ret.push(sorted[i])
        }
      }
      return ret
    },
    length () {
      return Math.max(1, Math.ceil(this.practices.length / this.pageSize))
    },
    voteColor () {
      if (!this.practices) return []
      let ret = new Array(this.practices.length)
      for (let i = 0; i < ret.length; i++) {
        ret[i] = 'grey'
        for (let votes of this.practices[i].PracticeVotes) {
          if (votes.voter_id === this.$store.state.user.id) {
            ret[i] = 'yellow'
            break
          }
        }
      }
      return ret
    }
  },
  methods: {
    navigateTo (route) {
      this.$router.push(route)
    },
    nameColor (User) {
      return global.nameColor(User.user_name, User.rating)
    },
    async vote (practice) {
      try {
        await PracticeServices.vote(practice.practice_no)
        practice.vote_count += 1
        practice.PracticeVotes.push({
          voter_id: this.$store.state.user.id
        })
      } catch (error) {
        if (error.response) {
          this.$store.dispatch('setDialog', {
            dialog: true,
            error: 'You can not vote again, nor cancel voting.',
            redirectName: null
          })
        }
      }
    }
  },
  mounted () {

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.mydiv :hover{
  cursor: pointer
}
</style>
