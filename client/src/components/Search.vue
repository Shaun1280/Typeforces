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
      contests: []
    }
  },
  watch: {
    '$route.query.search': {
      immediate: true,
      async handler (value) {
        console.log('calling handler in Search.js')
        try {
          await SearchServices.index(value)
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
