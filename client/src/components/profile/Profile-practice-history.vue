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
      :items="user.practiceHistories"
      :items-per-page="5"
    >
      <template v-slot:item.Practice.practice_name="{ item }">
        <a
          @click="$router.push({
            name: 'viewPractice',
            params: {
              id: item.practice_no
            }
          })"
        >
          {{item.Practice.practice_name}}
        </a>
      </template>
    </v-data-table>
  </v-flex>
</template>

<script>
import global from '@/global'

export default {
  props: ['user'],
  methods: { },
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
          text: '#',
          align: 'start',
          value: 'practice_history_id'
        },
        {
          text: 'Practice',
          value: 'Practice.practice_name'
        },
        {
          text: 'Wpm',
          value: 'wpm'
        },
        {
          text: 'Missed',
          value: 'miss_count'
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
