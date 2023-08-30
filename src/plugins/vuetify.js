import Vue from 'vue'
import Vuetify from 'vuetify/lib/framework'

Vue.use(Vuetify)

const vuetify = new Vuetify({
  theme: {
    // dark: true, // Enable dark mode
    themes: {
      light: {
        primary: '#6200ea' // Replace this with your desired primary color
      },
      dark: {
        primary: '#ff9800' // Replace this with your desired primary color
      }
    }
  }
})
export default new Vuetify({
})
