<template>
  <v-app>
    <v-app-bar app color="deep-purple accent-4" dark>
      <v-btn icon v-if="$route.name !== 'OrderList'"  @click="$router.push('/OrderList')">
        <v-icon >mdi-arrow-left-bold</v-icon>
      </v-btn>
      <v-toolbar-title>Fun星球報名系統</v-toolbar-title>
    </v-app-bar>

    <v-main>
      <router-view/>
      <v-footer padless height="20" class="mt-9">
        <div class="text-center" style="width: 100%; color: #858585;font-size:12px;">
          Actived in 2022/04, made by ding.
        </div>
      </v-footer>
    </v-main>
  </v-app>
</template>
<script>

import axios from 'axios'
export default {
  data: () => ({
    drawer: false,
    group: null,
    iconName: ''
  }),

  watch: {
    group () {
      this.drawer = false
    }

  },
  created () {
    axios.defaults.baseURL = this.$apiUrl
    // axios.defaults.baseURL = 'https://api.xn--mnq981l.com' // 正式環境
  }
}
</script>

<style>

</style>
