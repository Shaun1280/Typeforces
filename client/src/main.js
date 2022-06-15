// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuetify from 'vuetify'
import { sync } from 'vuex-router-sync'
import store from '@/store/store'
import Panel from '@/components/globals/Panel'
import MyDialog from '@/components/globals/Dialog'
import VueCountryCode from 'vue-country-code-select'

Vue.config.productionTip = false
Vue.use(Vuetify)
Vue.use(VueCountryCode)

const vuetify = new Vuetify()

sync(store, router)

Vue.component('panel', Panel)
Vue.component('mydialog', MyDialog)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  vuetify: vuetify,
  components: { App },
  template: '<App/>'
})
