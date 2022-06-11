<template>
  <v-card class="overflow-hidden" width="750">
    <v-app-bar
      color="blue"
      dark
      elevate-on-scroll
      scroll-target="#scrolling-techniques-7"
    >
      <v-app-bar-nav-icon></v-app-bar-nav-icon>

      <v-toolbar-title>Chat with {{targetName}}</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn icon>
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-app-bar>
    <v-sheet
      id="scrolling-techniques-7"
      class="overflow-y-auto"
      height="470"
    >
      <v-container>
        <v-row v-for="i in 10" :key=i dense>
          <v-col cols="12" :class="[i % 2 === 0 && `d-flex justify-end`]">
            <div>
              <v-subheader :class="[i % 2 === 0 && `justify-end`]">
                {{i % 2 === 1 ? 'Shane':'Me'}}
              </v-subheader>
              <v-alert
                color="rgb(227 237 241)"
                max-width=450
              >
                wAutoOverflOverflOverflOverflOverfllOverflOverflOverflOverfrflrflrfl你好
              </v-alert>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-sheet>

    <v-text-field
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
  data () {
    return {
      user: 1,
      text: '',
      targetName: 'Shane'
    }
  },
  methods: {
    sendMessage () {
      this.text = ''
      this.resetIcon()
    }
  },
  computed: {
  },
  async mounted () {
    await global.checkLogin()
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
