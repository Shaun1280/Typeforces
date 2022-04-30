<template>
  <v-layout class="d-flex justify-center">
    <pannel title="Contests">
      <div
        v-for="round in contests"
        :key="round.round_no">
        {{round.round_name}}
        {{round.start_time}}
        {{round.duration}}
        {{round.division}}
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
    this.contests = await ContestServices.index()
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
