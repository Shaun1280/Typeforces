<template>
  <v-layout class="d-flex flex-column justify-center">
    <v-flex row class="justify-center">
      <practice-panel
        title='Practices'
        width="60%"
        :practices="practices"
        pageSize="12"
      />
    </v-flex>
  </v-layout>
</template>

<script>
import PracticeServices from '@/services/PracticeServices'
import PracticePanel from '@/components/practices/PracticePanel'
import global from '@/global'

export default {
  components: {
    PracticePanel
  },
  data () {
    return {
      practices: []
    }
  },
  methods: {
  },
  async mounted () {
    try {
      await global.checkLogin()

      // get all practices
      const response = await PracticeServices.index()

      this.practices = response.data.practices

      for (let i of this.practices) i.vote_count = i.PracticeVotes.length
    } catch (error) {
      console.log(error)
    }
  },
  destroyed () {
    clearInterval(this.IntervalTime)
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
