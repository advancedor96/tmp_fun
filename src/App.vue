<template>
  <v-app>

    <v-app-bar app color="deep-purple accent-4" dark>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>Fun星球報名系統</v-toolbar-title>
    </v-app-bar>
    <v-navigation-drawer v-model="drawer" absolute temporary>
      <v-list nav dense >
        <v-list-item-group
          v-model="group"
          active-class="deep-purple--text text--accent-4"
        >
          <v-list-item @click="$router.push('/admin')">
            <v-list-item-title>(管理)場次列表</v-list-item-title>
          </v-list-item>

          <v-list-item @click="$router.push('/admin/AddSession')">
            <v-list-item-title>(管理)新增場次</v-list-item-title>
          </v-list-item>

          <v-list-item @click="$router.push('/OrderList')">
            <v-list-item-title>(客人)場次列表</v-list-item-title>
          </v-list-item>

        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

      <!-- <router-link to="/admin/">(管理)場次列表</router-link> |
      <router-link to="/admin/AddSession">(管理)新增場次</router-link> |
      <router-link to="/OrderList">(客人)場次列表</router-link> | -->
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
