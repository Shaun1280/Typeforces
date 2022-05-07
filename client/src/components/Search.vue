<template>
  <v-layout class="d-flex flex-column justify-center">
    <v-flex row class="justify-center">
    </v-flex>
  </v-layout>
</template>

<script>
import SearchServices from '@/services/SearchServices'

export default {
  data () {
    return {
      users: [],
      contests: [],
      practices: []
    }
  },
  watch: {
    '$route.query.search': {
      immediate: true,
      async handler (value) {
        if (value === undefined) return
        console.log('calling handler in Search.js', value)
        try {
          const response = await SearchServices.index(value)
          this.contests = response.data.contests
          this.users = response.data.users
          this.practices = response.data.practices
        } catch (error) {
          console.log(error)
        }
      }
    }
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
