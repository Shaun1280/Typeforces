<template>
  <v-layout class="d-flex flex-column justify-center">
    <!-- buttons -->
    <v-flex class="text-center">
      <v-btn
        class="mx-2"
        fab
        dark
        color="indigo"
        title="Add Practice"
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
        title="Delete Practice"
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
        title="Modify Practice"
        @click="changeMode(2)"
      >
        <v-icon dark>
          mdi-pencil
        </v-icon>
      </v-btn>
    </v-flex>

    <!-- create contest -->
    <v-flex v-if="mode===1" row class="justify-center mt-10">
      <panel title="New Practice" width="60%">
        <v-text-field
          label="PracticeName*"
          :rules="[required]"
          v-model="practice.practice_name"
        ></v-text-field>
        <br />

        <v-textarea
          label="Content*"
          :rules="[required]"
          v-model="practice.content"
        ></v-textarea>

        <div class="danger-alert" v-html="error"></div>
        <v-btn @click="createPractice">Add Practice</v-btn>
      </panel>
    </v-flex>
    <!-- end of create contest -->

    <!-- modify contest -->
    <v-flex v-if="mode===2" row class="justify-center mt-10">
      <panel title="Modify Practice" width="60%">
        <v-text-field
          label="SearchName*"
          :rules="[required]"
          v-model="searchName"
          prepend-icon="mdi-magnify"
          hint="Enter practice name to modify"
          placeholder="Enter practice name to modify"
        ></v-text-field>
        <br />

        <v-text-field
          label="PracticeName*"
          :rules="[required]"
          v-model="practice.practice_name"
        ></v-text-field>
        <br />

        <v-textarea
          label="Content*"
          :rules="[required]"
          v-model="practice.content"
        ></v-textarea>

        <div class="danger-alert" v-html="error"></div>
        <v-btn @click="modifyPractice">Modify Practice</v-btn>
      </panel>
    </v-flex>
    <!-- end of modify contest -->

    <!-- delete contest -->
    <v-flex v-if="mode===3" row class="justify-center mt-10">
      <panel title="Delete Contest" width="60%">
        <v-text-field
          label="SearchName*"
          :rules="[required]"
          v-model="searchName"
          prepend-icon="mdi-magnify"
          hint="Enter practice name to delete"
          placeholder="Enter practice name to delete"
        ></v-text-field>
        <br />

        <v-textarea
          disabled
          label="Content"
          v-model="practice.content"
        ></v-textarea>

        <div class="danger-alert" v-html="error"></div>
        <v-btn @click="deletePractice">Delete Practice</v-btn>
      </panel>
    </v-flex>
    <!-- end of delete contest -->
  </v-layout>
</template>

<script>
import PracticeServices from '@/services/PracticeServices'
import _ from 'lodash'
import global from '@/global'

export default {
  data () {
    return {
      practice: {
        practice_name: null,
        content: null
      },
      searchName: null,
      error: null,
      required: (value) => !!value || 'Required.',
      mode: 1 // 1 add, 3 delete, 2 update
    }
  },
  methods: {
    // create practice
    async createPractice () {
      this.error = null

      const areAllFilledIn = Object
        .keys(this.practice)
        .every(key => !!this.practice[key])

      if (!areAllFilledIn) {
        this.error = 'Please fill in all the required fields'
        return
      }
      // call api
      try {
        const response = await PracticeServices.post(this.practice)
        console.log(response.data)
        this.error = 'success'
      } catch (error) {
        console.log(error)
        this.error = error.response.data.error
      }
    },
    // modify practice
    async modifyPractice () {
      this.error = null
      const areAllFilledIn = Object
        .keys(this.practice)
        .every(key => !!this.practice[key])

      if (!areAllFilledIn) {
        this.error = 'Please fill in all the required fields'
        return
      }
      // call api
      try {
        const response = await PracticeServices.put(this.practice)
        this.practice = response.data.practice
        this.practice.content = response.data.content.content
        this.searchName = this.contest.practice_name
        this.error = 'success'
      } catch (error) {
        console.log(error)
        this.error = error.response.data.error
      }
    },
    // delete contest
    async deletePractice () {
      this.error = null
      const areAllFilledIn = !!this.searchName

      if (!areAllFilledIn) {
        this.error = 'Please fill in all the required fields'
        // return
      }

      // try {
      //   await ContestServices.delete(this.contest.round_no)
      //   this.error = 'success'
      // } catch (error) {
      //   console.log(error)
      //   this.error = error.response.data.error
      // }
    },
    async changeMode (mode) {
      this.mode = mode
      this.searchName = null
      this.practice = {
        practice_name: null,
        content: null
      }
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
        await PracticeServices.get(value)
      } catch (error) {
        if (error.response && error.response.data) {
          this.error = error.response.data.error + '<br/>The practice may not exist'
        }
      }
    }, 1000)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
