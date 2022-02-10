<template>
  <v-app>
    <div id="nav">
      <router-link to="/">場次列表</router-link> |
      <router-link to="/AddSession">新增場次</router-link>
    </div>
    <v-main>
    <router-view/>
    </v-main>
  </v-app>
</template>

<style>

</style>
