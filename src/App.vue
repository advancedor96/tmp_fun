<template>
  <v-app>
    <div id="nav">
      <router-link to="/admin/">(管理)場次列表</router-link> |
      <router-link to="/admin/AddSession">(管理)新增場次</router-link> |
      <router-link to="/OrderList">(客人)場次列表</router-link> |
    </div>
    <v-main>
    <router-view/>
    </v-main>
  </v-app>
</template>

<style>

</style>
