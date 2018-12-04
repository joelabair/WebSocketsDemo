import Vue from 'vue'
import App from './App.vue'

import 'material-design-icons-iconfont/dist/material-design-icons.css'
import 'vuetify/dist/vuetify.min.css'

import Vuetify from 'vuetify'
Vue.use(Vuetify)

Vue.config.productionTip = false

import VueSocketIO from 'vue-socket.io';

Vue.use(new VueSocketIO({
	debug: true,
	connection: window.location.href.replace(/\/[^\/]*$/, '')
}));

import VueChatScroll from 'vue-chat-scroll'
Vue.use(VueChatScroll)

new Vue({
  render: h => h(App)
}).$mount('#app')
