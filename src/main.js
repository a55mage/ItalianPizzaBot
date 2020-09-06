import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import router from './router'
import '@babel/polyfill'

Vue.config.productionTip = false

import './styles/main.css'

new Vue({
  vuetify,
  router,
  render: h => h(App)
}).$mount('#app')
