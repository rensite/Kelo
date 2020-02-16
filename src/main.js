import Vue from 'vue'
import App from './App.vue'

import autosize from 'v-autosize/dist/plugin'
Vue.use(autosize)

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
