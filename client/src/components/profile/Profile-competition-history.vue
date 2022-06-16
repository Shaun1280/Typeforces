<template>
  <v-flex>
    <profile-user :user="user"/>

    <v-divider></v-divider>

    <v-data-table
      :headers="headers"
      :items="user.competitionHistories"
      :items-per-page="5"
    >
       <template v-slot:item.Round.round_no="{ item }">
        <a
          @click="$router.push({
            name: 'viewContest',
            params: {
              id: item.round_no
            }
          })"
        >
          {{item.Round.round_name}}
        </a>
      </template>

      <template v-slot:item.post_rating="{ item }">
        <font v-bind:color="ratingColor(item.post_rating)">
          {{item.post_rating}}
        </font>
      </template>

      <template v-slot:item.prev_rating="{ item }">
        <font v-bind:color="item.post_rating - item.prev_rating > 0 ? '#00B400' : '#778899'">
          {{item.post_rating - (item.prev_rating === -1 ? 0 : item.prev_rating)}}
        </font>
      </template>
    </v-data-table>
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
  methods: {
    ratingColor (rating) {
      return global.ratingColor(rating)
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
    },
    headers () {
      return [
        {
          text: 'Round',
          align: 'start',
          value: 'Round.round_no'
        },
        {
          text: 'Rank',
          value: 'rank'
        },
        {
          text: 'Score',
          value: 'score'
        },
        {
          text: 'Wpm',
          value: 'wpm'
        },
        {
          text: 'Missed',
          value: 'miss_count'
        },
        {
          text: 'Rating Change',
          value: 'prev_rating'
        },
        {
          text: 'New Rating',
          value: 'post_rating'
        }
      ]
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
