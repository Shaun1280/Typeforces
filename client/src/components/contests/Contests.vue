<template>
  <v-layout class="d-flex flex-column justify-center">
    <v-flex row class="justify-center">
      <panel title="Current or upcoming contests" width="60%">
        <v-col>
          <v-card
            hover
            v-for="round in unclosed"
            class="mt-4 md-4"
            shaped
            :key="round.round_no"
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
        </v-col>
      </panel>
    </v-flex>

    <v-flex row class="justify-center mt-15">
      <panel title="Past contests" width="60%">
        <v-col>
          <v-card
            hover
            v-for="(round, index) in closed"
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
              >
                Enter
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </panel>
    </v-flex>
  </v-layout>
</template>

<script>
import ContestServices from '@/services/ContestServices'

export default {
  data () {
    return {
      contests: [],
      serverTime: (new Date()).getTime()
    }
  },
  computed: {
    unclosed () {
      return this.contests.filter((contest) => {
        return (new Date(contest.start_time)).getTime() +
          contest.duration * 60000 >= this.serverTime
      })
    },
    closed () {
      return this.contests.filter((contest) => {
        return (new Date(contest.start_time)).getTime() +
          contest.duration * 60000 < this.serverTime
      })
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
          let hours = parseInt(timeDif % (86400 * 1000) / (60 * 60 * 1000))
          let minutes = parseInt(timeDif % (60 * 60 * 1000) / (60 * 1000))
          let seconds = parseInt(timeDif % (60 * 1000) / 1000)
          if (days) item.timeTag = `<br/> Before Start <br/> ${days} ${days === 1 ? 'day' : 'days'}`
          else {
            let s1 = `${hours < 10 ? `0${hours}` : `${hours}`}`
            let s2 = `${minutes < 10 ? `0${minutes}` : `${minutes}`}`
            let s3 = `${seconds < 10 ? `0${seconds}` : `${seconds}`}`
            item.timeTag = `<br/> Before Start <br/> ${s1} : ${s2} : ${s3}<br/>`
          }
        } else {
          timeDif = (new Date(item.start_time)).getTime() - this.serverTime + item.duration * 60000
          if (timeDif > 0) {
            let hours = parseInt(timeDif % (86400 * 1000) / (60 * 60 * 1000))
            let minutes = parseInt(timeDif % (60 * 60 * 1000) / (60 * 1000))
            let seconds = parseInt(timeDif % (60 * 1000) / 1000)
            let s1 = `${hours < 10 ? `0${hours}` : `${hours}`}`
            let s2 = `${minutes < 10 ? `0${minutes}` : `${minutes}`}`
            let s3 = `${seconds < 10 ? `0${seconds}` : `${seconds}`}`
            item.timeTag = `<br/> Before End <br/> ${s1} : ${s2} : ${s3}<br/>`
          } else item.timeTag = `<br/> Final Standing <br/>`
        }
      })
    }
  },
  async mounted () {
    const response = await ContestServices.index()
    this.contests = response.data.contests
    this.contests.forEach((item) => {
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
