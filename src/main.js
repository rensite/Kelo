import Vue from 'vue'
import App from './App.vue'

import autosize from 'v-autosize/dist/plugin'
Vue.use(autosize)

import '@/assets/css/tailwind.css'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faFireAlt, faPlus, faLink, faCheck, faTrashAlt, faRedoAlt, faCheckDouble, faStar } from '@fortawesome/free-solid-svg-icons'
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
library.add([faFireAlt, faPlus, faLink, faCheck, faTrashAlt, faRedoAlt, faCheckDouble, faStar, faGithub])

Vue.component('font-awesome-icon', FontAwesomeIcon)

import store from './store'

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  store: store
}).$mount('#app')
