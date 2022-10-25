import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import VueSimpleAlert from 'vue-simple-alert'
import router from './router'
import VueToast from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-sugar.css'

Vue.prototype.$apiUrl = 'https://api.funplanet.tw' // 2022/10/25搬家

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
