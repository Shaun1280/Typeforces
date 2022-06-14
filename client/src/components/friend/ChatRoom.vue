<template>
  <v-card class="overflow-hidden" width="750">
    <v-app-bar
      color="blue"
      dark
      elevate-on-scroll
      scroll-target="#scrolling-techniques-7"
    >
      <v-app-bar-nav-icon></v-app-bar-nav-icon>

      <v-toolbar-title>Chat {{target === null ? `` : `with ` + target.User.user_name}}</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn v-if="target!==null" icon @click="close">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-app-bar>
    <v-sheet
      id="scrolling-techniques-7"
      class="overflow-y-auto"
      height="470"
    >
      <v-container v-if="target!==null">
        <v-row v-for="i in 10" :key=i dense>
          <v-col cols="12" :class="[i % 2 === 0 && `d-flex justify-end`]">
            <div>
              <v-subheader :class="[i % 2 === 0 && `justify-end`]">
                {{i % 2 === 1 ? target.User.user_name: 'Me'}}
              </v-subheader>
              <v-alert
                color="rgb(227 237 241)"
                max-width=450
                class="mb-0"
              >
                wAutoOverflOverflOverflOverflOverfllOverflOverflOverflOverfrflrflrfl你好
              </v-alert>
              <v-subheader :class="[i % 2 === 0 && `justify-end`]">
                2022-6-13
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
      v-if="target!==null"
      v-model="text"
      outlined
      placeholder="Type your message here"
      prepend-icon="mdi-comment"
      hide-details="true"
      :append-outer-icon="'mdi-send'"
      class="ma-2"
      clearable
      @click:append-outer="sendMessage"
    >
    </v-text-field>
  </v-card>
</template>

<script>
import global from '@/global'

export default {
  props: [
    'target'
  ],
  data () {
    return {
      user: 1,
      text: '',
      closed: true,
      readedMessage: [],
      unreadedMessage: []
    }
  },
  methods: {
    sendMessage () {
      this.text = ''
      this.resetIcon()
    },
    close () {
      this.$emit('close')
    }
  },
  computed: {
  },
  async mounted () {
    await global.checkLogin()
  },
  watch: {
    target (value) {
      // console.log('target has changed', value)
      this.target = value

      if (this.target !== null) {

      }
    }
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
  display: inherit;
  text-align: start;
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
