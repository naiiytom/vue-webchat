import Vue from 'vue'
import App from './App.vue'
import Chat from './lib/vue-beautiful-chat.umd.min.js'

Vue.config.productionTip = false
Vue.use(Chat)

new Vue({
  render: h => h(App)
}).$mount('#app')
