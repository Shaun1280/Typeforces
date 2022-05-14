<template>
  <v-flex class="d-flex justify-center">
    <div class="homediv mt-16">
      <typical
        :steps="['Hello', 1000, 'Hello world!', 500]"
        :wrapper="'h1'"
      ></typical>
      <typical
        class="typicalWrapper"
        :steps="['Have', 1000, 'Have fun', 500, 'Have fun typing! :-) 👋', 1000]"
        :loop="Infinity"
        :wrapper="'h2'"
      ></typical>
    </div>
  </v-flex>
</template>

<script>
import typical from 'vue-typical'
export default {
  name: 'HelloWorld',
  components: {
    typical
  },
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.typicalWrapper::after {
  content: "|";
  animation: blink 1s infinite step-start;
}

@keyframes blink {
  50% {
    opacity: 0;
  }
}
</style>
