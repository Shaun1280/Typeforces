<template>
  <v-layout class="d-flex flex-column justify-center">
    <v-flex row class="justify-center">
      <v-card width="60%">
        <v-toolbar flat dense class="blue" dark>
          <v-toolbar-title>Searched User</v-toolbar-title>
          <slot name="action" />
        </v-toolbar>
        <v-data-table
          :headers="headers"
          :items="users"
          :items-per-page="5"
          loader-height="0"
        >
          <template v-slot:item.user_name="{ item }">
            <div
              @click="navigateTo({
                name: 'profile',
                params: {
                  username: item.user_name
                }
              })"
              class="mydiv"
            >
              <font
                v-for="(char, index) in item.user_name"
                :key="index + 'only'"
                v-bind:color="nameColor(item)[index]"
              >
                {{char}}
              </font>
            </div>
          </template>
        </v-data-table>
      </v-card>
    </v-flex>

    <v-flex row class="justify-center mt-15">
      <contest-panel
        title='Searched Contests'
        width="60%"
        :contests="contests"
        pageSize="3"
      />
    </v-flex>

    <v-flex row class="justify-center mt-15">
      <search-practice-panel
        title='Searched Practices'
        width="60%"
        :practices="practices"
        pageSize="3"
      />
    </v-flex>
  </v-layout>
</template>

<script>
import SearchServices from '@/services/SearchServices'
import ContestPanel from '@/components/contests/ContestPanel'
import SearchPracticePanel from '@/components/practices/SearchPracticePanel'
import global from '@/global'

export default {
  data () {
    return {
      users: [],
      contests: [],
      practices: [],
      serverTime: (new Date()).getTime()
    }
  },
  components: {
    ContestPanel,
    SearchPracticePanel
  },
  watch: {
    '$route.query.search': {
      immediate: true,
      async handler (value) {
        if (!value) {
          this.users = []
          this.contests = []
          this.practices = []
          return
        }

        try {
          const response = await SearchServices.index(value)
          this.contests = response.data.contests

          this.contests.forEach((item) => { // add time tag for each contest (end, close, ongoing...)
            return Object.assign(item, {timeTag: ``})
          })
          global.setTimeTag(this.contests, this.serverTime)
          let _this = this
          clearInterval(_this.IntervalTime)
          _this.IntervalTime = setInterval(() => {
            _this.serverTime = _this.serverTime + 1000
          }, 1000)

          this.users = response.data.users
          for (const user of this.users) {
            if (user.rating === -1) user.rating = null
          }
          this.users.sort(function (a, b) {
            return b.rating - a.rating
          })
          this.practices = response.data.practices
          this.serverTime = response.data.serverTime
        } catch (error) {
          console.log(error)
        }
      }
    },
    serverTime: {
      immediate: true,
      handler (value) {
        this.serverTime = value
        this.contests.push({})
        this.contests.pop()
        global.setTimeTag(this.contests, this.serverTime)
      }
    }
  },
  computed: {
    headers () {
      return [
        {
          text: 'User',
          align: 'start',
          value: 'user_name'
        },
        { text: 'Country', sortable: false, value: 'country' },
        {
          text: 'Rating',
          value: 'rating'
        }
      ]
    }
  },
  methods: {
    navigateTo (route) {
      this.$router.push(route)
    },
    nameColor (User) {
      return global.nameColor(User.user_name, User.rating ? User.rating : -1)
    }
  },
  destroyed () {
    clearInterval(this.IntervalTime)
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.mydiv :hover{
  cursor: pointer
}
</style>
