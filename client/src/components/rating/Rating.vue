<template>
  <v-flex row class="justify-center">
    <v-card style="width:80%">
      <v-card-title>
        Ranking
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
      </v-card-title>
      <v-data-table :headers="headers" :items="users" :search="search">
        <template v-slot:item.user_name="{ item }">
           <font
                v-for="(char, index) in item.user_name"
                :key="index + 'only'"
                class="name_font"
                v-bind:color="nameColor(item)[index]"
              >
              {{ char === ' ' ? '&nbsp;' : char }}
            </font>
        </template>
      </v-data-table>
    </v-card>
  </v-flex>
</template>

<script>
import global from '@/global'
import RatingServices from '@/services/RatingServices'

export default {
  data () {
    return {
      search: '',
      headers: [
        {
          text: 'Rank',
          align: 'start',
          sortable: false,
          value: 'rank',
          filterable: false
        },
        {
          text: 'User Name',
          align: 'start',
          sortable: false,
          value: 'user_name'
        },
        {
          text: 'Counrty',
          align: 'start',
          sortable: false,
          value: 'country'
        },
        {
          text: 'Rating',
          align: 'start',
          sortable: false,
          value: 'rating'
        },
        {
          text: 'Match',
          align: 'start',
          sortable: false,
          value: 'match',
          filterable: false
        }
      ],
      users: []
    }
  },
  computed: {},
  methods: {
    nameColor (item) {
      return global.nameColor(item.user_name, item.rating, [{}])
    }
  },
  async mounted () {
    try {
      const response = await RatingServices.index()
      this.users = response.data.users

      // 按 rating 从大到小排序
      this.users.sort((a, b) => b.rating - a.rating)

      let count = 1
      this.users.forEach((element, index) => {
        // rating 相同的排名相同
        if (index > 0 && this.users[index].rating !== this.users[index - 1].rating) {
          count = count + 1
        }
        Object.assign(element, {
          rank: count
        })
      })
      // console.log(this.users)
    } catch (error) {
      console.log(error)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.name_font {
  font-weight: 600
}
</style>
