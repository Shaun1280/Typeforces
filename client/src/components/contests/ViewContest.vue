<template>
  <v-layout class="d-flex flex-column justify-center">
    <v-flex class="text-center">
      <v-btn
        class="mx-2"
        fab
        dark
        color="indigo"
        title="Typing"
        @click="mode = 0"
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
        @click="mode = 1"
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
        <template v-slot:action>
          <v-spacer></v-spacer>
          <v-toolbar-title>Wpm: {{wpm.toFixed(1)}}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-title>Miss: {{missCount}}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-title>Accuracy: {{accuracy.toFixed(1)}}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-title>{{timeTag}}</v-toolbar-title>
        </template>

        <v-flex
          class="d-flex justify-start"
          flex-wrap
          :style="`max-height: ${maxHeight}px`"
          overflow-y-auto
          ref="contentContainer"
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

    <v-dialog
      v-model="dialog"
      persistent
      max-width="290"
    >
      <v-card>
        <v-card-title class="text-h5">
          Message
        </v-card-title>

        <v-card-text v-html="error">
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="green darken-1"
            text
            @click="viewContestRedirect"
          >
            OK
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-layout>
</template>

<script>
import ContestServices from '@/services/ContestServices'
import global from '@/global'

export default {
  data () {
    return {
      contest: '',
      content: '',
      color: '',
      cursor: 0,
      vChips: null,
      maxHeight: 400,
      mode: 0, // 0 typing, 1 view standing
      // user data
      wpm: 0,
      missCount: 0,
      accuracy: 100.00,
      typingStatus: 0, // 0 wait for typing, 1 is typing, 2 end typing
      score: 0,
      // time management
      typingStartTime: (new Date()).getTime(),
      timeLeft: -1,
      dialog: false,
      error: 123
    }
  },
  computed: {
    timeTag: function () {
      if (this.timeLeft > 0) return `${global.timeDifToString(this.timeLeft)}`
      else return `Closed`
    }
  },
  methods: {
    adjustOffset (curoffsest, delta) {
      let arr = this.$refs.vChips
      for (let i = this.cursor; i < arr.length; i++) {
        if (arr[i].$el.offsetTop === curoffsest) {
          arr[i].$el.scrollIntoView()
          return
        }
      }
    },
    keyDown () { // if mode = 1(view standing), do nothing
      const _this = this
      window.onkeypress = (event) => {
        event.preventDefault()
        // console.log(this.$refs)
        if (_this.mode === 1 || _this.typingStatus === 2) return
        else if (_this.typingStatus === 0) {
          _this.typingStatus = 1
          _this.typingStartTime = (new Date()).getTime()
        }

        // console.log(_this.$refs.vChips[_this.cursor].$el.offsetTop)

        let e = event || window.event
        let key = e.keyCode || e.which || e.charCode

        if ((String.fromCharCode(key)[0]) === _this.content.content[_this.cursor]) {
          if (_this.color[_this.cursor] !== 'red') { // don't change missed char color
            _this.$set(_this.color, _this.cursor, '#E0E0E0')
            _this.score += 100
          }
          _this.cursor = _this.cursor + 1
        } else {
          if (_this.color[_this.cursor] !== 'red') { // first wrong
            _this.$set(_this.color, _this.cursor, 'red')
            _this.missCount++
            _this.score -= 500
          }
        }

        if (_this.cursor === _this.color.length) { // typing end
          _this.typingStatus = 2
          console.log(_this.score)
          _this.score += Math.trunc(_this.wpm * 5)
          console.log(_this.score)
          _this.score += Math.trunc(_this.contest.duration +
            ((new Date(_this.contest.start_time)).getTime() - _this.typingStartTime) / 60000)
          console.log(_this.score)
          // send data...
        }

        // scroll contents
        if (_this.cursor < _this.color.length &&
          _this.$refs.vChips[_this.cursor].$el.offsetTop >
          _this.maxHeight + 24) {
          _this.adjustOffset(_this.$refs.vChips[_this.cursor].$el.offsetTop, -_this.maxHeight)
        }
      }
    },
    calc () {
      if (this.typingStatus === 2) return
      // calc wpm
      this.wpm = (this.cursor) / ((new Date()).getTime() - this.typingStartTime) * 200 * 60
      if (isNaN(this.wpm)) this.wpm = 0
      // calc accuracy
      this.accuracy = (this.cursor - this.missCount) / (this.cursor) * 100
      if (isNaN(this.accuracy)) this.accuracy = 100
    },
    viewContestRedirect () {
      this.dialog = false

      if (this.error !== 'The contest has closed. <br/> You can only view standing or go to practice.') {
        this.$router.push({name: 'contests'})
      }
    }
  },
  async mounted () {
    try {
      const response = await ContestServices.show(this.$store.state.route.params.id)
      this.contest = response.data.contest

      // 检查比赛是否开始
      if ((new Date(this.contest.start_time)).getTime() - response.data.serverTime > 0) {
        throw String('Access denied. <br/> The contest has not started yet.')
      }

      // time management
      this.timeLeft = (new Date(this.contest.start_time)).getTime() - response.data.serverTime + this.contest.duration * 60000

      let _this = this
      // used for count down
      _this.IntervalTime1 = setInterval(() => {
        setTimeout(function () {
          if (_this.timeLeft > 0) _this.timeLeft = _this.timeLeft - 1000
        }, 0)
      }, 1000)

      // used for wpm & accuracy
      _this.IntervalTime2 = setInterval(() => {
        setTimeout(function () {
          _this.calc()
        }, 0)
      }, 80)

      // typing content related
      this.content = response.data.content
      this.color = []
      this.color.length = this.content.content.length
      for (let i = 0; i < this.content.content.length; i++) {
        if (this.timeLeft <= 0 || this.content.content[i] === ' ') this.color[i] = '#E0E0E0'
        else this.color[i] = 'black'
      }

      if (this.timeLeft <= 0) {
        this.error = 'The contest is closed. <br/> You can only view standing or go to practice.'
        this.dialog = true
        this.cursor = this.content.length
      }

      // key press event
      if (this.timeLeft > 0) this.keyDown()
    } catch (error) {
      if (error.response !== undefined && error.response.status === 403) {
        this.error = error.response.data.error + '. <br/> Please login first. '
        this.dialog = true
      } else {
        this.error = error
        this.dialog = true
      }
    }
  },
  destroyed () {
    window.onkeypress = () => {}
    clearInterval(this.IntervalTime1)
    clearInterval(this.IntervalTime2)
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
