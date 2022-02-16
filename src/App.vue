<template>
  <v-app>

    <v-app-bar app color="deep-purple accent-4" dark>
      <v-app-bar-nav-icon @click="$router.push('/OrderList')"></v-app-bar-nav-icon>
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
    group: null
  }),

  watch: {
    group () {
      this.drawer = false
    }
  }
}
</script>

<style>

</style>
