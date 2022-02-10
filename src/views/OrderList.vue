<template>
<v-container>
  <h1>(客人)場次列表</h1>
  <v-data-table
    :headers="headers"
    :items="sList"
    class="elevation-1"
    :items-per-page="-1"
    @click:row="handleClick"
  ></v-data-table>
</v-container>
</template>

<script>
import axios from 'axios'
import dayjs from 'dayjs'
export default {
  data: () => ({
    sList: [],
    headers: [
      { text: '名稱', value: 'name' },
      { text: '類型', value: 'type' },
      { text: '月份', value: 'year_month' },
      { text: '縮圖', value: 'image' }
    ]

  }),
  created () {
    this.load()
  },
  methods: {
    handleClick (item) {
      this.$router.push(`/list/${item.session_id}`)
    },
    async load () {
      const res = await axios.get('http://api.funplanet.tw/list')
      this.sList = res.data.map(e => ({
        ...e,
        year_month: e.year_month.substring(0, 7)
      }))
    }
  }
}
</script>

<style>

</style>
