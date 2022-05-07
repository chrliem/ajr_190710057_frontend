// src/plugins/vuetify.js

import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
// import DatetimePicker from 'vuetify-datetime-picker'
// import 'vuetify-datetime-picker/src/stylus/main.styl'

Vue.use(Vuetify)
// Vue.use(DatetimePicker)


const opts = {}

export default new Vuetify(opts)