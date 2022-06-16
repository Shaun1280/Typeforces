<template>
  <v-flex>
    <profile-user :user="user"/>

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
import ProfileUser from '@/components/profile/Profile-user'
import global from '@/global'

export default {
  props: ['user'],
  components: {
    ProfileUser
  },
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
