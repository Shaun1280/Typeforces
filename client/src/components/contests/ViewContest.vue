<template>
  <v-layout class="d-flex flex-column justify-center">
    <v-flex class="text-center">
      <v-btn
        class="mx-2"
        fab
        dark
        color="indigo"
        title="Typing"
      >
        <v-icon dark>
          mdi-typewriter
        </v-icon>
      </v-btn>

      <v-btn
        class="mx-2"
        fab
        dark
        large
        color="cyan"
        title="Standing"
      >
        <v-icon dark>
          mdi-seal-variant
        </v-icon>
      </v-btn>
    </v-flex>

    <v-flex row class="justify-center mt-10">
      <panel
        v-bind:title="`Round ${contest.round_name}`"
        width="60%"
      >
        <v-flex
          class="d-flex justify-start"
          width="500"
          flex-wrap
        >
          <v-chip
            v-for="(item, index) in content.content"
            :key="index"
            label
            color=white
            class="md-2 mt-2"
          >
            <font
              class="content_font"
              v-bind:color="color[index]"
            >
              {{item === ' ' ? '␣' : item}}
            </font>
          </v-chip>
        </v-flex>
      </panel>
    </v-flex>
  </v-layout>
</template>

<script>
import ContestServices from '@/services/ContestServices'

export default {
  data () {
    return {
      contest: '',
      content: '',
      color: '',
      serverTime: (new Date()).getTime()
    }
  },
  methods: {
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
    const response = await ContestServices.show(this.$store.state.route.params.id)
    this.contest = response.data.contest
    this.content = response.data.content
    this.color = []
    this.color.length = this.content.content.length
    for (let i = 0; i < this.content.content.length; i++) {
      if (this.content.content[i] === ' ') this.color[i] = '#E0E0E0'
      else this.color[i] = 'black'
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
.content_font {
  font-family: "Ubuntu Mono", monospace;
  font-size: 1.8rem;
  line-height: 2.5rem;
}

.test {
  color: rgba(188, 115, 115, 0.566)
}
</style>
