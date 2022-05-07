<template>
  <v-layout class="d-flex flex-column justify-center">
    <v-flex row class="justify-center">
      <contest-panel
        title='Current or upcoming contests'
        width="60%"
        :contests="unclosedContests"
        pageSize="4"
      />
    </v-flex>

    <v-flex row class="justify-center mt-15">
      <contest-panel
        title='Past contests'
        width="60%"
        :contests="closedContests"
        pageSize="8"
      />
    </v-flex>
  </v-layout>
</template>

<script>
import ContestServices from '@/services/ContestServices'
import ContestPanel from '@/components/contests/ContestPanel'
import global from '@/global'

export default {
  components: {
    ContestPanel
  },
  data () {
    return {
      contests: [],
      serverTime: (new Date()).getTime()
    }
  },
  computed: {
    unclosedContests () {
      let tmp = this.contests.filter((contest) => {
        return (new Date(contest.start_time)).getTime() +
          contest.duration * 60000 >= this.serverTime
      })
      tmp.sort(function (a, b) {
        return (new Date(a.start_time)) - (new Date(b.start_time))
      })
      return tmp
    },
    closedContests () {
      let tmp = this.contests.filter((contest) => {
        return (new Date(contest.start_time)).getTime() +
          contest.duration * 60000 < this.serverTime
      })
      tmp.sort(function (a, b) {
        return (new Date(b.start_time)) - (new Date(a.start_time))
      })
      return tmp
    }
  },
  methods: {
  },
  async mounted () {
    try {
      const response = await ContestServices.index()
      this.contests = response.data.contests
      this.contests.forEach((item) => { // add time tag for each contest (end, close, ongoing...)
        return Object.assign(item, {timeTag: ``})
      })

      let _this = this
      this.serverTime = (new Date(response.data.serverTime)).getTime()
      global.setTimeTag(_this.contests, _this.serverTime)
      window.setInterval(() => { // used for count down
        setTimeout(function () {
          _this.serverTime = _this.serverTime + 1000
          global.setTimeTag(_this.contests, _this.serverTime)
        }, 0)
      }, 1000)
    } catch (error) {
      console.log(error)
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
</style>
