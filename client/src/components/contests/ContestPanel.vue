<template>
  <panel :title="title" :width="width">
    <v-col>
      <v-card
        v-for="(round, index) in visible"
        class="mt-4 md-4"
        outlined
        :key="index"
        elevation="1"
       >
        <br>
        Round: {{round.round_name}}
        <br/>
        StartTime: {{new Date(round.start_time)}}
        <br/>
        Duration: {{round.duration}} min
        <br/>
        Divison: {{round.division}}
        <br/>
        <a
          class="md-4"
          v-html="round.timeTag"
          v-if="round.timeTag === '<br/> Final Standing <br/>'"
          @click="navigateTo({
            name: 'viewStanding',
            params: {
              id: round.round_no
            }
          })"
        ></a>

        <div
          class="md-4"
          v-html="round.timeTag"
          v-if="round.timeTag !== '<br/> Final Standing <br/>'"
        ></div>

        <v-card-actions class="justify-center">
          <v-btn
          class="md-4"
          rounded
          :disabled="btnDisabled[index]"
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
    'pageSize',
    'serverTime'
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
    },
    btnDisabled () {
      let ret = []
      for (let i = 0; i < this.contests.length; i++) {
        let startTime = this.contests[i].start_time
        ret.push((new Date(startTime)).getTime() > (this.serverTime))
      }
      return ret
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
