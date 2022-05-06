<template>
  <v-layout class="d-flex flex-column justify-center">
    <v-flex row class="justify-center">
      <panel title="Current or upcoming contests" width="60%">
        <v-col>
          <v-card
            hover
            v-for="(round, index) in unclosedContests"
            class="mt-4 md-4"
            shaped
            :key="index"
          >
            Round: {{round.round_name}}
            <br/>
            StartTime: {{new Date(round.start_time)}}
            <br/>
            Dutation: {{round.duration}} min
            <br/>
            Divison: {{round.division}}
            <br/>
            <div v-html="round.timeTag"></div>

            <v-card-actions class="justify-center">
              <v-btn
                class="md-4"
                rounded
                @click="navigateTo({name: 'viewContest', params: {id: round.round_no}})"
              >
                Enter
              </v-btn>
            </v-card-actions>
          </v-card>

          <v-pagination
            v-model="pageCurrent"
            class="my-4"
            :length="lengthCurrent"
          ></v-pagination>
        </v-col>
      </panel>
    </v-flex>

    <v-flex row class="justify-center mt-15">
      <panel title="Past contests" width="60%">
        <v-col>
          <v-card
            hover
            v-for="(round, index) in closedContests"
            class="mt-4 md-4"
            shaped
            :key="index"
          >
            Round: {{round.round_name}}
            <br/>
            StartTime: {{new Date(round.start_time)}}
            <br/>
            Dutation: {{round.duration}} min
            <br/>
            Divison: {{round.division}}
            <br/>
            <div v-html="round.timeTag"></div>

            <br/>

            <v-card-actions class="justify-center">
              <v-btn
                class="md-4"
                rounded
                @click="navigateTo({name: 'viewContest', params: {id: round.round_no}})"
              >
                Enter
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>

        <v-pagination
          v-model="pagePast"
          class="my-4"
          :length="lengthPast"
        ></v-pagination>
      </panel>
    </v-flex>
  </v-layout>
</template>

<script>
import ContestServices from '@/services/ContestServices'
import global from '@/global'

export default {
  data () {
    return {
      contests: [],
      pagePast: 1,
      pageCurrent: 1,
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
      let ret = []
      for (let i = 0; i < tmp.length; i++) {
        if (Math.trunc(i / 4) + 1 === this.pageCurrent) {
          ret.push(tmp[i])
        }
      }
      return ret
    },
    closedContests () {
      let tmp = this.contests.filter((contest) => {
        return (new Date(contest.start_time)).getTime() +
          contest.duration * 60000 < this.serverTime
      })
      tmp.sort(function (a, b) {
        return (new Date(b.start_time)) - (new Date(a.start_time))
      })
      let ret = []
      for (let i = 0; i < tmp.length; i++) {
        if (Math.trunc(i / 10) + 1 === this.pagePast) {
          ret.push(tmp[i])
        }
      }
      return ret
    },
    lengthPast () {
      let tmp = this.contests.filter((contest) => {
        return (new Date(contest.start_time)).getTime() +
          contest.duration * 60000 < this.serverTime
      })
      return Math.max(1, Math.ceil(tmp.length / 10))
    },
    lengthCurrent () {
      let tmp = this.contests.filter((contest) => {
        return (new Date(contest.start_time)).getTime() +
          contest.duration * 60000 >= this.serverTime
      })
      return Math.max(1, Math.ceil(tmp.length / 4))
    }
  },
  methods: {
    navigateTo (route) {
      this.$router.push(route)
    },
    setTimeTag () {
      this.contests.forEach((item) => {
        let timeDif = (new Date(item.start_time)).getTime() - this.serverTime
        if (timeDif > 0) {
          let days = parseInt(timeDif / (86400 * 1000))
          if (days) item.timeTag = `<br/> Before Start <br/> ${days} ${days === 1 ? 'day' : 'days'}`
          else {
            item.timeTag = `<br/> Before Start <br/> ${global.timeDifToString(timeDif)}<br/>`
          }
        } else {
          timeDif = (new Date(item.start_time)).getTime() - this.serverTime + item.duration * 60000
          if (timeDif > 0) {
            item.timeTag = `<br/> Before End <br/> ${global.timeDifToString(timeDif)}<br/>`
          } else item.timeTag = `<br/> Final Standing <br/>`
        }
      })
    }
  },
  async mounted () {
    try {
      const response = await ContestServices.index()
      this.contests = response.data.contests
      this.contests.forEach((item) => { // add time tag for each contest (end, close, ongoing...)
        return Object.assign(item, {timeTag: ``})
      })

      this.serverTime = (new Date(response.data.serverTime)).getTime()
      this.setTimeTag()

      let _this = this
      window.setInterval(() => { // used for count down
        setTimeout(function () {
          _this.serverTime = _this.serverTime + 1000
          _this.setTimeTag()
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
