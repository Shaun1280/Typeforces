<template>
  <v-layout class="d-flex flex-column justify-center">
    <v-flex class="text-center">
      <v-btn
        class="mx-2"
        fab
        dark
        color="indigo"
        title="Refresh"
        @click="mode = 0, refresh = true"
      >
        <v-icon dark>
          mdi-refresh
        </v-icon>
      </v-btn>
    </v-flex>

    <v-flex row class="justify-center mt-10">
      <panel
        v-bind:title="`Practice： ${practice.practice_name}`"
        width="60%"
      >
        <template v-slot:action>
          <v-spacer></v-spacer>
          <v-toolbar-title>Wpm: {{wpm.toFixed(1)}}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-title>Miss: {{missCount}}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-title>Accuracy: {{accuracy.toFixed(1)}}</v-toolbar-title>
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

    <!-- refresh hint -->
    <v-dialog
      v-model="refresh"
      max-width="290"
    >
      <v-card>
        <v-card-title class="text-h5">
          Message
        </v-card-title>

        <v-card-text>
          Are you sure to refresh?
          <br/>
          Your typing data won't be saved.
          <br/>
          Make sure you wanna do that.
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            color="green darken-1"
            text
            @click="refresh = false, $router.go(0)"
          >
            Do it anyway
          </v-btn>

          <v-btn
            color="green darken-1"
            text
            @click="refresh = false"
          >
            Cancle
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import PracticeServices from '@/services/PracticeServices'
import global from '@/global'

export default {
  data () {
    return {
      practice: '',
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
      // time management
      typingStartTime: (new Date()).getTime(),
      refresh: false
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

        if ((String.fromCharCode(key)[0]) === _this.content.content[_this.cursor]) {
          if (_this.color[_this.cursor] !== 'red') { // don't change missed char color
            _this.$set(_this.color, _this.cursor, '#E0E0E0')
            _this.rightCount++
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
    async sendData () {
      try {
        const response = await PracticeServices.postHistory(this.practice.practice_no, {
          miss_count: this.missCount,
          type_progress: this.cursor,
          wpm: this.wpm
        })

        console.log(response)

        this.$store.dispatch('setDialog', {
          dialog: true,
          error: 'Your typing data has been submited. <br/> Good luck!',
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
    // 定时事件
    createIntervals () {
      let _this = this
      // used for wpm & accuracy
      _this.IntervalTime1 = setInterval(() => {
        setTimeout(function () {
          if (_this.typingStatus === 2) return
          _this.calc()
        }, 0)
      }, 80)
    }
  },
  async mounted () {
    try {
      await global.checkLogin()

      const response = await PracticeServices.show(this.$store.state.route.params.id)
      this.practice = response.data.practice

      // 定时事件
      this.createIntervals()

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
          error: error + '<br/> The practice may not exist.',
          redirectName: null
        })
      }
    }
  },
  destroyed () {
    window.onkeypress = () => {}
    clearInterval(this.IntervalTime1)
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
