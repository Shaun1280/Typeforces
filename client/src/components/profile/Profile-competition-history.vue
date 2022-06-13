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
          {{item.post_rating - item.prev_rating}}
        </font>
      </template>
    </v-data-table>
  </v-flex>
</template>

<script>
import global from '@/global'

export default {
  props: ['user'],
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
