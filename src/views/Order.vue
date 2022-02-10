<template>
  <v-container>
   <h1>家長報名</h1>
  <h2>圖</h2>
  <h2>說明</h2>
  <div class="d-flex">
    <h2>報名狀況</h2>
    <h2>人數限制：{{min}} ~ {{max}}</h2>

  </div>
  </v-container>
</template>

<script>
import axios from 'axios'
import dayjs from 'dayjs'
export default {
  name: 'Order',

  data: () => ({
    min: 0,
    max: 0

  }),
  created () {
    this.load()
    // console.log('id:', this.$route.params.s_id)
  },
  methods: {
    async load () {
      try {
        const res = await axios.post('http://api.funplanet.tw/getSessionById', {
          session_id: this.$route.params.s_id
        })
        const data = res.data[0]
        this.min = data.min
        this.max = data.max
      } catch (err) {
        console.log('err', err)
      }
    }
  }
}
</script>
