<template>
  <v-card class="overflow-hidden" width="750">
    <v-app-bar
      color="blue"
      dark
      elevate-on-scroll
      scroll-target="#scrolling-techniques-7"
    >
      <v-app-bar-nav-icon></v-app-bar-nav-icon>

      <v-toolbar-title>Chat {{session === null ? `` : `with ` + session.User.user_name}}</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn v-if="session!==null" icon @click="close">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-app-bar>
    <v-sheet
      id="scrolling-techniques-7"
      class="overflow-y-auto"
      height="470"
    >
      <v-container v-if="session!==null">
        <v-row v-for="(element, index) in viewed" :key="index + 'msg'" dense>
          <v-col cols="12" :class="[element.sender_id === $store.state.user.id && `d-flex justify-end`]">
            <div>
              <v-subheader :class="[element.sender_id === $store.state.user.id && `justify-end`]">
                {{element.sender_id !== $store.state.user.id ? session.User.user_name: 'Me'}}
              </v-subheader>
              <v-alert
                color="rgb(227 237 241)"
                :style="element.sender_id === $store.state.user.id
                  ? `width:fit-content;word-break:break-all;display:flex;justify-content:end;margin-left:auto;`
                  : `width:fit-content;word-break:break-all;display:flex;justify-content:end;margin-right:auto;`"
                class="mb-0"
              >
                {{element.content}}
              </v-alert>
              <v-subheader :class="[element.sender_id === $store.state.user.id && `justify-end`]">
                {{getTime(element.send_time)}}
              </v-subheader>
            </div>
          </v-col>
        </v-row>
      </v-container>
      <v-container v-else>
        <v-img
          src="static/chat.png"
          contain
          aspect-ratio="2.2"
        ></v-img>
        <h2 class="pt-2">Choose a friend and start chatting!</h2>
      </v-container>
    </v-sheet>

    <v-text-field
      v-if="session!==null"
      v-model="text"
      outlined
      placeholder="Type your message here"
      prepend-icon="mdi-comment"
      hide-details="true"
      :append-outer-icon="'mdi-send'"
      class="ma-2"
      clearable
      @click:append-outer="sendMessage"
      @keyup.enter="sendMessage"
    >
    </v-text-field>
  </v-card>
</template>

<script>
import global from '@/global'
import MessageServices from '@/services/MessageServices'

export default {
  props: [
    'session'
  ],
  data () {
    return {
      text: '',
      closed: true,
      hasUnviewed: null,
      viewed: []
    }
  },
  methods: {
    sendMessage () {
      if (this.text === '') return
      let msg = {
        sender_id: this.$store.state.user.id,
        receiver_id: this.$store.state.user.id === this.session.id2 ? this.session.id1 : this.session.id2,
        content: this.text,
        send_time: new Date() - (new Date()).getTimezoneOffset() * 60000
      }
      this.viewed = this.viewed.concat(msg)
      this.text = ''
      MessageServices.postNew(msg)
    },
    getTime (timestamp) {
      let date = new Date(timestamp)
      let time = date.toISOString().substr(11, 2) + ':' + date.toISOString().substr(14, 2)
      date = date.toISOString().substr(0, 10)
      return date + ' ' + time
    },
    close () {
      this.$emit('close')
    },
    async getUnviewed () {
      if (!this.session || !this.session.hasUnviewed) return
      const msg = await MessageServices.getUnviewed({id1: this.session.id1, id2: this.session.id2})
      this.hasUnviewed = false
      this.session.hasUnviewed = false
      msg.data.sort((a, b) => a.send_time.localeCompare(b.send_time))
      this.viewed = this.viewed.concat(msg.data)
      await MessageServices.setViewed(msg.data)
    },
    async getViewed () {
      if (!this.session) return
      const msg = await MessageServices.getViewed({id1: this.session.id1, id2: this.session.id2})
      msg.data.sort((a, b) => a.send_time.localeCompare(b.send_time))
      this.viewed = msg.data
    },
    async checkUnviewed () {
      const ret = await MessageServices.checkNew(
        this.session.id1 === this.$store.state.user.id
          ? {sender_id: this.session.id2, receiver_id: this.session.id1}
          : {sender_id: this.session.id1, receiver_id: this.session.id2}
      )
      // console.log(this.session)
      // console.log(ret.data.hasUnviewed)
      this.hasUnviewed = ret.data.hasUnviewed
    },
    // 定时事件
    createIntervals () {
      let _this = this
      _this.IntervalTime1 = setInterval(() => {
        setTimeout(async function () {
          const promises = [_this.checkUnviewed()]
          await Promise.all(promises)
        }, Math.floor(Math.random() * 1000))
      }, 5000)
    }
  },
  computed: {
  },
  async mounted () {
    await global.checkLogin()
    if (this.session) {
      this.hasUnviewed = this.session.hasUnviewed
    }
  },
  watch: {
    session: {
      handler (newValue, oldValue) {
        // console.log('old', oldValue)
        // console.log('new', newValue)
        this.session = newValue
        if (newValue !== oldValue) {
          clearInterval(this.IntervalTime1)
          this.text = ''
          if (this.session) {
            this.hasUnviewed = this.session.hasUnviewed
          }
          this.viewed = []
          if (newValue !== null) {
            this.getViewed()
            this.checkUnviewed()
            this.createIntervals()
          }
        }
      },
      deep: true
    },
    hasUnviewed (newValue, oldValue) {
      // console.log('old', oldValue)
      // console.log('new', newValue)
      this.hasUnviewed = newValue
      if (this.hasUnviewed === true) {
        this.getUnviewed()
      }
    }
  },
  async destroyed () {
    clearInterval(this.IntervalTime1)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.name_font {
  font-weight: 600
}

.title_font {
  font-weight: 600
}

/deep/ .v-alert__wrapper {
  align-items: start;
  border-radius: inherit;
  text-align: start;
  display: inherit;
}

/deep/ .v-subheader {
    display: flex;
    height: 24px;
    font-size: .875rem;
    font-weight: 500;
    padding: 0 4px;
}

.v-alert {
    padding: 10px;
}

/deep/ .v-alert__content {
  color: rgb(28 103 192);
  font-weight: 500;
}

</style>
