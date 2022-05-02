<template>
  <v-layout class="d-flex justify-center">
    <pannel title="Contests" width="50%">
      <div
        v-for="round in contests"
        :key="round.round_no">
        Round: {{round.round_name}}
        StartTime: {{new Date(round.start_time)}}
        Dutation: {{round.duration}} minutes
        Div-{{round.division}}
      </div>
    </pannel>
  </v-layout>
</template>

<script>
import ContestServices from '@/services/ContestServices'

export default {
  data () {
    return {
      contests: null
    }
  },
  methods: {

  },
  async mounted () {
    const response = await ContestServices.index()
    this.contests = response.data
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
