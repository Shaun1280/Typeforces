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
          flex-wrap
          :style="`max-height: ${maxHeight}px`"
          overflow-y-auto
        >
          <v-chip
            v-for="(item, index) in content.content"
            :key="index"
            ref="vChips"
            label
            color="white"
            class="md-2 mt-2"
          >
            <font
              v-bind:class="`content_font ${index === cursor ? '_line' : ''}`"
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
      cursor: 0,
      vChips: null,
      maxHeight: 400,
      typingStatus: 0, // 0 wait for typing, 1 is typing, 2 end typing
      typingStartTime: (new Date()).getTime(),
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
    },
    adjustOffset (curoffsest, delta) {
      let arr = this.$refs.vChips
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].$el.offsetTop === curoffsest) {
          arr[i].$el.scrollIntoView()
        }
      }
    },
    keyDown () {
      const _this = this
      document.onkeypress = (event) => {
        event.preventDefault()
        // console.log(this.$refs)
        if (_this.typingStatus === 0) _this.typingStatus = 1
        else if (_this.typingStatus === 2) return

        // console.log(_this.$refs.vChips[_this.cursor].$el.offsetTop)

        let e = event || window.event
        let key = e.keyCode || e.which || e.charCode

        if ((String.fromCharCode(key)[0]) === _this.content.content[_this.cursor]) {
          if (_this.color[_this.cursor] !== 'red') {
            _this.$set(_this.color, _this.cursor, '#E0E0E0')
          }
          _this.cursor = _this.cursor + 1
          if (_this.cursor === _this.color.length) {
            _this.typingStatus = 2
          }
        } else _this.$set(_this.color, _this.cursor, 'red')

        if (_this.$refs.vChips[_this.cursor].$el.offsetTop >
          _this.maxHeight + 24) {
          _this.adjustOffset(_this.$refs.vChips[_this.cursor].$el.offsetTop, -_this.maxHeight)
        }
      }
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
    this.keyDown()
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

._line {
  border-left: 0.12rem solid black;
}

</style>
