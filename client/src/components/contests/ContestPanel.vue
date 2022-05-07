<template>
  <panel :title="title" :width="width">
    <v-col>
      <v-card
        hover
        v-for="(round, index) in visible"
        class="mt-4 md-4"
        shaped
        :key="index"
       >
        Round: {{round.round_name}}
        <br/>
        StartTime: {{new Date(round.start_time)}}
        <br/>
        Dutation: {{round.duration}} min
        <br/>
        Divison: {{round.division}}
        <br/>
        <div v-html="round.timeTag"></div>

        <v-card-actions class="justify-center">
          <v-btn
          class="md-4"
          rounded
          @click="navigateTo({name: 'viewContest', params: {id: round.round_no}})"
          >
          Enter
          </v-btn>
        </v-card-actions>
      </v-card>

      <v-pagination
        v-model="page"
        class="my-4"
        :length="length"
      ></v-pagination>
    </v-col>
  </panel>
</template>

<script>
export default {
  props: [
    'title',
    'width',
    'contests',
    'pageSize'
  ],
  data () {
    return {
      page: 1
    }
  },
  computed: {
    visible () {
      let ret = []
      for (let i = 0; i < this.contests.length; i++) {
        if (Math.trunc(i / this.pageSize) + 1 === this.page) {
          ret.push(this.contests[i])
        }
      }
      return ret
    },
    length () {
      return Math.max(1, Math.ceil(this.contests.length / this.pageSize))
    }
  },
  methods: {
    navigateTo (route) {
      this.$router.push(route)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
