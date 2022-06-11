<template>
  <v-dialog
    v-model="$store.state.dialog.dialog"
    persistent
    max-width="290"
  >
    <v-card>
      <v-card-title class="text-h5">
      Message
      </v-card-title>

      <v-card-text v-html="$store.state.dialog.error">
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
          <v-btn
          color="green darken-1"
          text
          @click="redirect"
          >
          OK
          </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>

export default {
  methods: {
    redirect () {
      const name = this.$store.state.dialog.redirectName
      this.$store.dispatch('setDialog', {
        dialog: false,
        error: null,
        redirectName: null
      })
      if (name) {
        this.$router.push({
          name: name
        })
      }
    }
  },
  mounted () {
    this.$store.dispatch('setDialog', {
      dialog: false,
      error: null,
      redirectName: null
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
