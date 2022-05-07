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
Vue.prototype.$api = 'http://127.0.0.1:8000/api'
Vue.prototype.$baseURL = 'http://127.0.0.1:8000'

new Vue({
  vuetify,
  router,
  render: h => h(App)
}).$mount('#app')
