import Vue from 'vue';
import App from './App.vue';

import '@/assets/css/tailwind.css';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faFireAlt, faPlus, faLink, faCheck, faTrashAlt, faRedoAlt, faCheckDouble, faStar, faSave } from '@fortawesome/free-solid-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
library.add([faFireAlt, faPlus, faLink, faCheck, faTrashAlt, faRedoAlt, faCheckDouble, faStar, faGithub, faSave]);

Vue.component('font-awesome-icon', FontAwesomeIcon);

import store from './store';

import '@/assets/scss/index.scss';

Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
  store: store
}).$mount('#app');
