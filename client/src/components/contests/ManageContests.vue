<template>
  <v-layout class="d-flex flex-column justify-center">
    <!-- buttons -->
    <v-flex class="text-center">
      <v-btn
        class="mx-2"
        fab
        dark
        color="indigo"
        title="Add Contest"
        @click="changeMode(1)"
      >
        <v-icon dark>
          mdi-plus
        </v-icon>
      </v-btn>

      <v-btn
        class="mx-2"
        fab
        dark
        color="red"
        title="Delete Upcoming Contest"
        @click="changeMode(3)"
      >
        <v-icon dark>
          mdi-delete
        </v-icon>
      </v-btn>

      <v-btn
        class="mx-2"
        fab
        dark
        large
        color="cyan"
        title="Modify Contest"
        @click="changeMode(2)"
      >
        <v-icon dark>
          mdi-pencil
        </v-icon>
      </v-btn>
    </v-flex>

    <!-- create contest -->
    <v-flex v-if="mode===1" row class="justify-center mt-10">
      <v-flex xs4>
        <panel title="New Contest">
          <v-text-field
            label="RoundName*"
            :rules="[required]"
            v-model="contest.round_name"
          ></v-text-field>
          <br />

          <!-- calendar -->
          <v-menu
            ref="menu1"
            v-model="menu1"
            :close-on-content-click="false"
            :return-value.sync="date"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="date"
                label="Picker in menu"
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="date"
              no-title
              scrollable
            >
              <v-spacer></v-spacer>
              <v-btn
                text
                color="primary"
                @click="menu1 = false"
              >
                Cancel
              </v-btn>
              <v-btn
                text
                color="primary"
                @click="$refs.menu1.save(date)"
              >
                OK
              </v-btn>
            </v-date-picker>
          </v-menu>

          <!-- time-picker -->
          <v-menu
            ref="menu2"
            v-model="menu2"
            :close-on-content-click="false"
            :nudge-right="40"
            :return-value.sync="time"
            transition="scale-transition"
            offset-y
            max-width="290px"
            min-width="290px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="time"
                label="Picker in menu"
                prepend-icon="mdi-clock-time-four-outline"
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-time-picker
              v-if="menu2"
              v-model="time"
              full-width
              @click:minute="$refs.menu2.save(time)"
            ></v-time-picker>
          </v-menu>

          <v-autocomplete
            :items="['1', '30', '60', '90']"
            label="Duration(minutes)*"
            :rules="[required]"
            v-model="contest.duration"
          ></v-autocomplete>
          <br />

          <v-autocomplete
            :items="['Div1', 'Div2', 'Div1 + Div2']"
            label="Division*"
            :rules="[required]"
            v-model="contest.division"
          ></v-autocomplete>
          <br />
        </panel>
      </v-flex>

      <v-flex xs6>
        <panel title="New Contest Content" class="ml-4">
          <v-textarea
            label="Content*"
            :rules="[required]"
            v-model="contest.content"
          ></v-textarea>

          <div class="danger-alert" v-html="error"></div>
          <v-btn @click="createContest">Add Contest</v-btn>
        </panel>
      </v-flex>
    </v-flex>
    <!-- end of create contest -->

    <!-- modify contest -->
    <v-flex v-if="mode===2" row class="justify-center mt-10">
      <v-flex xs4>
        <panel title="Modify Contest">
          <v-text-field
            label="SearchName*"
            :rules="[required]"
            v-model="searchName"
            prepend-icon="mdi-magnify"
            hint="Enter round name to modify"
            placeholder="Enter round name to modify"
          ></v-text-field>
          <br />

          <v-text-field
            label="RoundName*"
            :rules="[required]"
            v-model="contest.round_name"
          ></v-text-field>
          <br />

          <!-- calendar -->
          <v-menu
            ref="menu1"
            v-model="menu1"
            :close-on-content-click="false"
            :return-value.sync="date"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="date"
                label="Picker in menu"
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="date"
              no-title
              scrollable
            >
              <v-spacer></v-spacer>
              <v-btn
                text
                color="primary"
                @click="menu1 = false"
              >
                Cancel
              </v-btn>
              <v-btn
                text
                color="primary"
                @click="$refs.menu1.save(date)"
              >
                OK
              </v-btn>
            </v-date-picker>
          </v-menu>

          <!-- time-picker -->
          <v-menu
            ref="menu2"
            v-model="menu2"
            :close-on-content-click="false"
            :nudge-right="40"
            :return-value.sync="time"
            transition="scale-transition"
            offset-y
            max-width="290px"
            min-width="290px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="time"
                label="Picker in menu"
                prepend-icon="mdi-clock-time-four-outline"
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-time-picker
              v-if="menu2"
              v-model="time"
              full-width
              @click:minute="$refs.menu2.save(time)"
            ></v-time-picker>
          </v-menu>

          <v-autocomplete
            :items="[1, 30, 60, 90]"
            label="Duration(minutes)*"
            :rules="[required]"
            v-model="contest.duration"
          ></v-autocomplete>
          <br />

          <v-autocomplete
            :items="['Div1', 'Div2', 'Div1 + Div2']"
            label="Division*"
            :rules="[required]"
            v-model="contest.division"
          ></v-autocomplete>
          <br />
        </panel>
      </v-flex>

      <v-flex xs6>
        <panel title="Modified Contest Content" class="ml-4">
          <v-textarea
            label="Content*"
            :rules="[required]"
            v-model="contest.content"
          ></v-textarea>

          <div class="danger-alert" v-html="error"></div>
          <v-btn @click="modifyContest">Modify Contest</v-btn>
        </panel>
      </v-flex>
    </v-flex>
    <!-- end of modify contest -->

    <!-- delete contest -->
    <v-flex v-if="mode===3" row class="justify-center mt-10">
      <v-flex xs4>
        <panel title="Delete Contest">
          <v-text-field
            label="SearchName*"
            :rules="[required]"
            v-model="searchName"
            prepend-icon="mdi-magnify"
            hint="Enter round name to delete"
            placeholder="Enter round name to delete"
          ></v-text-field>
          <br />

          <!-- calendar -->
          <v-menu
            ref="menu1"
            v-model="menu1"
            :close-on-content-click="false"
            :return-value.sync="date"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                disabled
                v-model="date"
                label="Picker in menu"
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="date"
              no-title
              scrollable
            >
              <v-spacer></v-spacer>
              <v-btn
                text
                color="primary"
                @click="menu1 = false"
              >
                Cancel
              </v-btn>
              <v-btn
                text
                color="primary"
                @click="$refs.menu1.save(date)"
              >
                OK
              </v-btn>
            </v-date-picker>
          </v-menu>

          <!-- time-picker -->
          <v-menu
            disabled
            ref="menu2"
            v-model="menu2"
            :close-on-content-click="false"
            :nudge-right="40"
            :return-value.sync="time"
            transition="scale-transition"
            offset-y
            max-width="290px"
            min-width="290px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                disabled
                v-model="time"
                label="Picker in menu"
                prepend-icon="mdi-clock-time-four-outline"
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-time-picker
              v-if="menu2"
              v-model="time"
              full-width
              @click:minute="$refs.menu2.save(time)"
            ></v-time-picker>
          </v-menu>

          <v-autocomplete
            disabled
            :items="[1, 30, 60, 90]"
            label="Duration(minutes)"
            v-model="contest.duration"
          ></v-autocomplete>
          <br />

          <v-autocomplete
            disabled
            :items="['Div1', 'Div2', 'Div1 + Div2']"
            label="Division"
            v-model="contest.division"
          ></v-autocomplete>
          <br />
        </panel>
      </v-flex>

      <v-flex xs6>
        <panel title="Deleted Contest Content" class="ml-4">
          <v-textarea
            disabled
            label="Content"
            v-model="contest.content"
          ></v-textarea>

          <div class="danger-alert" v-html="error"></div>
          <v-btn @click="deleteContest">Delete Contest</v-btn>
        </panel>
      </v-flex>
    </v-flex>
    <!-- end of delete contest -->
  </v-layout>
</template>

<script>
import ContestServices from '@/services/ContestServices'
import _ from 'lodash'
import global from '@/global'

export default {
  data () {
    // Date.parse(new Date("2022/05/02 00:00:00"))
    return {
      date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      menu1: false,
      time: `20:00`,
      menu2: false,
      contest: {
        round_name: null,
        start_time: null,
        content: null,
        duration: null,
        division: null
      },
      searchName: null,
      error: null,
      required: (value) => !!value || 'Required.',
      mode: 1 // 1 add, 3 delete, 2 update
    }
  },
  methods: {
    // create contest
    async createContest () {
      this.error = null
      this.contest.start_time = Date.parse(`${this.date} ${this.time}`)
      const areAllFilledIn = Object
        .keys(this.contest)
        .every(key => !!this.contest[key])

      if (!areAllFilledIn) {
        this.error = 'Please fill in all the required fields'
        return
      }
      // call api
      try {
        await ContestServices.post(this.contest)
        this.error = 'success'
      } catch (error) {
        console.log(error)
        this.error = error.response.data.error
      }
    },
    // modify contest
    async modifyContest () {
      this.error = null
      this.contest.start_time = Date.parse(`${this.date} ${this.time}`)
      const areAllFilledIn = Object
        .keys(this.contest)
        .every(key => !!this.contest[key])

      if (!areAllFilledIn) {
        this.error = 'Please fill in all the required fields'
        return
      }
      // call api
      try {
        const response = await ContestServices.put(this.contest)
        this.contest = response.data.contest
        this.contest.content = response.data.content.content
        this.searchName = this.contest.round_name
        this.error = 'success'
      } catch (error) {
        console.log(error)
        this.error = error.response.data.error
      }
    },
    // delete contest
    async deleteContest () {
      this.error = null
      const areAllFilledIn = !!this.searchName

      if (!areAllFilledIn) {
        this.error = 'Please fill in all the required fields'
        return
      }
      try {
        await ContestServices.delete(this.contest.round_no)
        this.error = 'success'
      } catch (error) {
        console.log(error)
        this.error = error.response.data.error
      }
    },
    async changeMode (mode) {
      this.mode = mode
      this.date = (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10)
      this.menu1 = false
      this.time = `20:00`
      this.menu2 = false
      this.searchName = null
      this.contest = {
        round_name: null,
        start_time: null,
        content: null,
        duration: null,
        division: null
      }
      console.log(this.contest)
      this.error = null
    }
  },
  async mounted () {
    await global.checkLogin()
  },
  watch: {
    // for modifying contest, get contest info first
    searchName: _.debounce(async function (value) {
      try {
        this.error = null
        if (this.mode === 1 || value === null || value === undefined) return
        const response = await ContestServices.get(value)
        this.contest = response.data.contest

        const date = new Date(new Date(this.contest.start_time).getTime() - (new Date()).getTimezoneOffset() * 60000)
        this.date = date.toISOString().substr(0, 10)
        this.time = date.toISOString().substr(11, 2) + ':' + date.toISOString().substr(14, 2)
      } catch (error) {
        this.contest = {
          round_name: null,
          start_time: null,
          content: null,
          duration: null,
          division: null
        }
        if (error.response && error.response.data) {
          this.error = error.response.data.error + '<br/>The contest may not exist'
        }
      }
    }, 1000)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
