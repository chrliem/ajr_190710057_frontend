import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import vuetify from '@/plugins/vuetify' 
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import moment from 'moment'



Vue.config.productionTip = false
Vue.prototype.moment = moment

Vue.prototype.$http = axios;
Vue.prototype.$api = 'https://atmajogjarental.christiandsetiawan.xyz/api'
Vue.prototype.$baseURL = 'https://atmajogjarental.christiandsetiawan.xyz'

new Vue({
  vuetify,
  router,
  render: h => h(App)
}).$mount('#app')
