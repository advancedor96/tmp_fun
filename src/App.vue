
<template>
<v-layout class="rounded rounded-md">
  <v-app-bar app density="compact" color="deep-purple accent-4" dark >
    <v-btn variant="text" v-if="$route.name !== 'OrderList'"  @click="$router.push('/OrderList')">
      <v-icon >mdi-arrow-left-bold</v-icon>
    </v-btn>
    <v-toolbar-title>Fun星球報名系統</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn variant="text" @click="toggleDarkMode"><v-icon>mdi-weather-night</v-icon></v-btn>
  </v-app-bar>
  <v-main>
    <RouterView />
    <v-footer padless absolute height="20" class="mt-9" style="bottom: 0; width: 100%;">
      <div class="text-center" style="width: 100%; color: #858585;font-size:12px;">
        Actived in 2022/03, made by ding. Vue3
      </div>
    </v-footer>
  </v-main>

</v-layout>
</template>
<script>
import { useTheme } from 'vuetify'
import axios from 'axios'
export default {
  data: () => ({
    group: null,
    iconName: '',
    theme: useTheme()
  }),

  created () {
    axios.defaults.baseURL = this.$apiUrl
  },
  mounted(){
    const themeName = localStorage.getItem('themeName')
      if (themeName) {
        this.theme.global.name = themeName
      }
  },
  methods: {
    toggleDarkMode () {
      this.theme.global.name = this.theme.global.current.dark ? 'customLightTheme' : 'customDarkTheme'
      localStorage.setItem('themeName', this.theme.global.name)
    }
  }
}
</script>


<style>
.v-label {
  --v-medium-emphasis-opacity: 1 ;
}
</style>
