<template>
  <v-layout class="d-flex flex-column justify-center">
    <v-flex row class="justify-center">
      <panel title="Searched User" width="60%">
        <v-col>
          <v-card
            hover
            v-for="(user, index) in visibleUser"
            class="mt-4 md-4"
            shaped
            :key="index"
            >
            Round: {{user.user_name}}
            <br/>
            Rating: {{user.rating}}
            <br/>

            <v-card-actions class="justify-center">
              <v-btn
              class="md-4"
              rounded
              >
              Visit
              </v-btn>
            </v-card-actions>
          </v-card>

          <v-pagination
            v-model="pageUser"
            class="my-4"
            :length="userLength"
          ></v-pagination>
        </v-col>
      </panel>
    </v-flex>

    <v-flex row class="justify-center mt-15">
      <contest-panel
        title='Searched Contests'
        width="60%"
        :contests="contests"
        pageSize="3"
      />
    </v-flex>
  </v-layout>
</template>

<script>
import SearchServices from '@/services/SearchServices'
import ContestPanel from '@/components/contests/ContestPanel'
import global from '@/global'

export default {
  data () {
    return {
      users: [],
      pageUser: 1,
      contests: [],
      practices: [],
      serverTime: (new Date()).getTime()
    }
  },
  components: {
    ContestPanel
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
    visibleUser () {
      let ret = []
      for (let i = 0; i < this.users.length; i++) {
        if (Math.trunc(i / 3) + 1 === this.pageUser) {
          ret.push(this.users[i])
        }
      }
      return ret
    },
    userLength () {
      return Math.max(1, Math.ceil(this.users.length / 3))
    }
  },
  destroyed () {
    clearInterval(this.IntervalTime)
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
