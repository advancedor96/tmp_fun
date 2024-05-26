
import { createApp } from 'vue'
import { createPinia } from 'pinia'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { VTimePicker } from 'vuetify/labs/VTimePicker'
import { VNumberInput } from 'vuetify/labs/VNumberInput'

import App from './App.vue'
import router from './router'

import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import Vue3Toastify from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

const customLightTheme = {
  dark: false,
  colors: {
    primary: '#673ab7',
  },
}
const customDarkTheme =  {
  dark: true,
  colors: {
    primary: '#ff9800',
  },
}

const vuetify = createVuetify({
  theme: {
    defaultTheme: 'customLightTheme',
    themes: { customLightTheme, customDarkTheme }
  },
  directives,

  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
  components: {
    ...components,
    VTimePicker,
    VNumberInput
  }
})

const app = createApp(App)
app.use(VueSweetalert2);
app.config.globalProperties.$apiUrl = 'https://api.funplanet.tw'
// app.config.globalProperties.$apiUrl = 'http://localhost'

app.use(createPinia())
app.use(router)
app.use(vuetify)
app.use(Vue3Toastify, {autoClose:3000})

app.mount('#app')
