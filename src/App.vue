<template>
  <v-app>
    <v-app-bar app color="primary" dark>
    </v-app-bar>

    <v-main>
      <ListSession />
    </v-main>
  </v-app>
</template>

<script>
import AddSession from './components/AddSession'
import ListSession from './components/ListSession'

export default {
  name: 'App',

  components: {
    AddSession, ListSession
  },

  data: () => ({
    //
  })
}
</script>
