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
      >
        <v-icon dark>
          mdi-pencil
        </v-icon>
      </v-btn>
    </v-flex>

    <v-flex row class="justify-center mt-10">
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
  </v-layout>
</template>

<script>
import ContestServices from '@/services/ContestServices'

export default {
  data () {
    // Date.parse(new Date("2022/05/02 00:00:00"))
    return {
      date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      menu1: false,
      time: `20:00`,
      menu2: false,
      operation_type: 1, // 1 add, 2 delete, 3 update
      contest: {
        round_name: null,
        start_time: null,
        content: null,
        duration: null,
        division: null
      },
      error: null,
      required: (value) => !!value || 'Required.'
    }
  },
  methods: {
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
        console.log('success')
      } catch (error) {
        console.log(error)
        this.error = error.response.data.error
      }
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
</style>
