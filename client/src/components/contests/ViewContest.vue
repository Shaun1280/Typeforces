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
      // time management
      typingStartTime: (new Date()).getTime(),
      timeLeft: (new Date()).getTime()
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
    keyDown () {
      const _this = this
      document.onkeypress = (event) => {
        event.preventDefault()
        // console.log(this.$refs)
        if (_this.typingStatus === 0) {
          _this.typingStatus = 1
          _this.typingStartTime = (new Date()).getTime()
        } else if (_this.typingStatus === 2) return

        // console.log(_this.$refs.vChips[_this.cursor].$el.offsetTop)

        let e = event || window.event
        let key = e.keyCode || e.which || e.charCode

        if ((String.fromCharCode(key)[0]) === _this.content.content[_this.cursor]) {
          if (_this.color[_this.cursor] !== 'red') { // don't change missed char color
            _this.$set(_this.color, _this.cursor, '#E0E0E0')
          }
          _this.cursor = _this.cursor + 1
        } else {
          if (_this.color[_this.cursor] !== 'red') { // first wrong
            _this.$set(_this.color, _this.cursor, 'red')
            _this.missCount++
          }
        }

        if (_this.cursor === _this.color.length) { // typing end
          _this.typingStatus = 2
          // send data...
        }

        // scroll contents
        if (_this.cursor < _this.color.length &&
          _this.$refs.vChips[_this.cursor].$el.offsetTop >
          _this.maxHeight + 24) {
          _this.adjustOffset(_this.$refs.vChips[_this.cursor].$el.offsetTop, -_this.maxHeight)
        }
      }
    }
  },
  async mounted () {
    const response = await ContestServices.show(this.$store.state.route.params.id)
    this.contest = response.data.contest

    // time management
    this.timeLeft = (new Date(this.contest.start_time)).getTime() - response.data.serverTime + this.contest.duration * 60000
    let _this = this

    // used for count down
    window.setInterval(() => {
      setTimeout(function () {
        if (_this.timeLeft > 0) _this.timeLeft = _this.timeLeft - 1000
      }, 0)
    }, 1000)

    // used for wpm & accuracy
    window.setInterval(() => {
      setTimeout(function () {
        // calc wpm
        if (_this.typingStatus === 2) return
        _this.wpm = (_this.cursor) / ((new Date()).getTime() - _this.typingStartTime) * 200 * 60
        if (isNaN(_this.wpm)) _this.wpm = 0
        // calc accuracy
        _this.accuracy = (_this.cursor - _this.missCount) / (_this.cursor) * 100
        if (isNaN(_this.accuracy)) _this.accuracy = 100
      }, 0)
    }, 250)

    // typing content related
    this.content = response.data.content
    this.color = []
    this.color.length = this.content.content.length
    for (let i = 0; i < this.content.content.length; i++) {
      if (this.content.content[i] === ' ') this.color[i] = '#E0E0E0'
      else this.color[i] = 'black'
    }

    // key press event
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
