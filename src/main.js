import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import VueSimpleAlert from 'vue-simple-alert'
import router from './router'
import VueToast from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-sugar.css'

Vue.prototype.$apiUrl = 'https://api.xn--mnq981l.com' // 之後要改成  https://api.funplanet.tw

Vue.config.productionTip = false
Vue.use(VueSimpleAlert)
Vue.use(VueToast, {
  duration: 2000, position: 'top-right'
})

new Vue({
  vuetify,
  router,
  render: h => h(App)
}).$mount('#app')
