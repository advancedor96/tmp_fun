<template>
  <v-app>

    <v-app-bar app color="deep-purple accent-4" dark>
      <v-btn icon v-if="$route.name !== 'OrderList'"  @click="$router.push('/OrderList')">
        <v-icon >mdi-arrow-left-bold</v-icon>
      </v-btn>
      <!-- <v-app-bar-nav-icon @click="$router.push('/OrderList')"></v-app-bar-nav-icon> -->
      <v-toolbar-title>Fun星球報名系統</v-toolbar-title>
    </v-app-bar>

    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>
<script>

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
  }
}
</script>

<style>

</style>
