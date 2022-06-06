<template>
  <v-flex row class="justify-center">
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

    <v-card style="width:80%">
      <v-card-title>
        Standing
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
      </v-card-title>
      <v-data-table :headers="headers" :items="record" :search="search">
        <template v-slot:item.User.user_name="{ item }">
           <font
                v-for="(char, index) in item.User.user_name"
                :key="index + 'only'"
                class="name_font"
                v-bind:color="nameColor(item)[index]"
              >
              {{ char === ' ' ? '&nbsp;' : char }}
            </font>
        </template>
      </v-data-table>
    </v-card>
  </v-flex>
</template>

<script>
import global from '@/global'
import ContestServices from '@/services/ContestServices'

export default {
  data () {
    return {
      dialog: false,
      error: 123,
      resStatus: 200, // 403 no access & redirect
      search: '',
      headers: [
        {
          text: 'Rank',
          align: 'start',
          sortable: false,
          value: 'rank'
        },
        {
          text: 'User Name',
          align: 'start',
          sortable: false,
          value: 'User.user_name'
        },
        {
          text: 'Country',
          align: 'start',
          sortable: false,
          value: 'User.country'
        },
        {
          text: 'Miss Count',
          align: 'start',
          sortable: false,
          value: 'miss_count',
          filterable: false
        },
        {
          text: 'Wpm',
          align: 'start',
          sortable: false,
          value: 'wpm',
          filterable: false
        },
        {
          text: 'Score',
          align: 'start',
          sortable: false,
          value: 'score',
          filterable: false
        }
      ],
      record: []
    }
  },
  computed: {},
  methods: {
    nameColor (item) {
      return global.nameColor(item.User.user_name, item.User.rating)
    },
    viewContestRedirect () {
      this.dialog = false
      if (this.resStatus === 403) {
        this.$router.push({name: 'contests'})
      }
    }
  },
  async mounted () {
    try {
      const response = await ContestServices.getStanding(this.$store.state.route.params.id)
      this.record = response.data.record

      // 按 score 从大到小排序
      this.record.sort((a, b) => b.score - a.score)

      // 添加排名
      let count = 1
      this.record.forEach((element, index) => {
        // score 相同的排名相同
        if (index > 0 && this.record[index].score !== this.record[index - 1].score) {
          count = count + 1
        }
        Object.assign(element, {
          rank: count
        })
      })
      // console.log(this.record)
    } catch (error) {
      if (error.response !== undefined) {
        if (error.response.status === 403) {
          this.resStatus = error.response.status
          this.error = error.response.data.error + '. <br/> Please login first. '
          this.dialog = true
        } else if (error.response.status === 400) {
          this.resStatus = error.response.status
          this.error = error.response.data.error
          this.dialog = true
        }
      } else {
        if (this.resStatus === 200) this.resStatus = 500
        this.error = error
        this.dialog = true
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
</style>
