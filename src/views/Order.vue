<template>
  <v-container>
   <h1>家長報名</h1>

  </v-container>
</template>

<script>
import axios from 'axios'
import dayjs from 'dayjs'
export default {
  name: 'Order',

  data: () => ({

  }),
  created () {
    console.log('id:', this.$route.params.s_id)
  },
  methods: {
    async save () {

    }
  }
}
</script>
