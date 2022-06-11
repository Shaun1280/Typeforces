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
        @click="mode = 0, openStanding()"
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

    <!-- <Mydialog :dialog="dialog" :redirectName="'contests'"/> -->
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
      rightCount: 0,
      missCount: 0,
      accuracy: 100.00,
      typingStatus: 0, // 0 wait for typing, 1 is typing, 2 end typing
      score: 0,
      // time management
      typingStartTime: (new Date()).getTime(),
      timeLeft: -1
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
      window.onkeypress = async (event) => {
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
        let preMissCount = _this.missCount
        let preCursor = _this.cursor

        if ((String.fromCharCode(key)[0]) === _this.content.content[_this.cursor]) {
          if (_this.color[_this.cursor] !== 'red') { // don't change missed char color
            _this.$set(_this.color, _this.cursor, '#E0E0E0')
            _this.score += 100
            _this.rightCount++
          }
          _this.cursor = _this.cursor + 1
        } else {
          if (_this.color[_this.cursor] !== 'red') { // first wrong
            _this.$set(_this.color, _this.cursor, 'red')
            _this.missCount++
            _this.score -= 500
          }
        }

        // 只要输入了则记录，防止刷新/推出弃赛
        if ((_this.cursor === 1 && preCursor === 0) ||
          (_this.cursor === 0 && _this.missCount === 1 && preMissCount === 0)) {
          _this.calc()
          await ContestServices.postHistory(this.contest.round_no, {
            miss_count: this.missCount,
            type_progress: this.cursor,
            wpm: this.wpm,
            score: this.score
          })
        }

        if (_this.cursor === _this.color.length) { // typing end
          _this.typingStatus = 2
          _this.calc()
          // send data
          await _this.sendData()
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
      // calc wpm
      this.wpm = (this.cursor) / ((new Date()).getTime() - this.typingStartTime) * 200 * 60
      if (isNaN(this.wpm)) this.wpm = 0
      // calc accuracy
      this.accuracy = (this.rightCount) / (this.missCount + this.rightCount) * 100
      if (isNaN(this.accuracy)) this.accuracy = 100
    },
    // 返回得分
    calcScore () {
      let ret = this.score
      let penalty = ((new Date(this.contest.start_time)).getTime() -
        this.typingStartTime) / 60000
      ret += Math.trunc(this.wpm * 5)
      // 打完字才有随时间的额外加分
      if (this.typingStatus === 2) {
        ret += Math.trunc(2000 * (this.contest.duration + penalty) /
          this.contest.duration)
      }
      return ret
    },
    async sendData () {
      try {
        await ContestServices.postHistory(this.contest.round_no, {
          miss_count: this.missCount,
          type_progress: this.cursor,
          wpm: this.wpm,
          score: this.calcScore()
        })

        this.$store.dispatch('setDialog', {
          dialog: true,
          error: 'Your typing data has been submited. <br/> You can choose to participant again,' +
          ' better performance will be recorded. <br/> Notice that you may get score penalty for follow-up attempts.',
          redirectName: null
        })
      } catch (error) {
        console.log(error.response.data)
        if (error.response) {
          this.$store.dispatch('setDialog', {
            dialog: true,
            error: error.response.data.error,
            redirectName: null
          })
        }
      }
    },
    // 打开排名新窗口
    openStanding (route) {
      let info = this.$router.resolve({
        name: 'viewStanding',
        params: {
          id: this.$store.state.route.params.id
        }
      })
      window.open(info.href, '_blank')
    },
    // 定时事件
    createIntervals () {
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
          if (_this.typingStatus === 2) return
          _this.calc()
        }, 0)
      }, 80)

      // for typing update
      _this.IntervalTime3 = setInterval(() => {
        setTimeout(async function () {
          if (_this.typingStatus === 1) {
            await ContestServices.postHistory(_this.contest.round_no, {
              miss_count: _this.missCount,
              type_progress: _this.cursor,
              wpm: _this.wpm,
              score: _this.calcScore()
            })
          }
        }, Math.floor(Math.random() * 1000))
      }, 10000)
    }
  },
  async mounted () {
    try {
      await global.checkLogin()

      const response = await ContestServices.show(this.$store.state.route.params.id)
      this.contest = response.data.contest

      // 检查比赛是否开始
      if ((new Date(this.contest.start_time)).getTime() - response.data.serverTime > 0) {
        this.$store.dispatch('setDialog', {
          dialog: true,
          error: 'Access denied. <br/> The contest has not started yet.',
          redirectName: 'contests'
        })
        return
      }

      // time management
      this.timeLeft = (new Date(this.contest.start_time)).getTime() - response.data.serverTime + this.contest.duration * 60000

      // 定时事件
      this.createIntervals()

      // typing content related
      this.content = response.data.content
      this.color = []
      this.color.length = this.content.content.length
      for (let i = 0; i < this.content.content.length; i++) {
        if (this.timeLeft <= 0 || this.content.content[i] === ' ') this.color[i] = '#E0E0E0'
        else this.color[i] = 'black'
      }

      if (this.timeLeft <= 0) {
        this.$store.dispatch('setDialog', {
          dialog: true,
          error: 'The contest is closed. <br/> You can only view standing or go to practice.',
          redirectName: null
        })
        this.cursor = 0
        return
      }

      // key press event
      if (this.timeLeft > 0) this.keyDown()
    } catch (error) {
      if (error.response !== undefined && error.response.status === 403) {
        this.$store.dispatch('setDialog', {
          dialog: true,
          error: error.response.data.error + '. <br/> Please login first. ',
          redirectName: 'contests'
        })
      } else {
        this.$store.dispatch('setDialog', {
          dialog: true,
          error: error,
          redirectName: null
        })
      }
    }
  },
  async destroyed () {
    window.onkeypress = () => {}
    clearInterval(this.IntervalTime1)
    clearInterval(this.IntervalTime2)
    clearInterval(this.IntervalTime3)
  },
  watch: {
    timeLeft (newValue, oldValue) {
      if (oldValue > 0 && newValue <= 0) { // 比赛结束刷新
        this.$router.go(0)
      }
    }
  }
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
