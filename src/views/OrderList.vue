<template>
<v-container>
  <v-row class="align-center justify-space-between">
      <div class="text-h3">(客人)場次列表</div>
      <div class="d-flex" style="width:220px;">
        <v-select
          :items="['2021', '2022', '2023', '2024']"
          v-model="selected_year"
          label="年"
          dense
          class="mr-1"
        ></v-select>
        <v-select
          :items="['01','02','03','04','05','06','07','08','09','10','11','12' ]"
          v-model="selected_month"
          label="月"
          dense
        ></v-select>
        <v-btn outlined @click="changeFilter">確定</v-btn>
      </div>
  </v-row>
  <v-data-table
    :headers="headers"
    :items="sList"
    class="elevation-1"
    :items-per-page="-1"
    @click:row="handleClick"
  >
    <template v-slot:[`item.image`]="{ item }">
      <v-img :src="`http://api.funplanet.tw/upload/${item.image}`" width="100" alt="xx" />
    </template>
  </v-data-table>
</v-container>
</template>

<script>
import axios from 'axios'
import dayjs from 'dayjs'
export default {
  data: () => ({
    selected_year: '2022',
    selected_month: 2,
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
    async changeFilter () {
      try {
        const res = await axios.post('http://api.funplanet.tw/setSelectedYearMonth', {
          year: this.selected_year,
          month: this.selected_month
        })
        if (res.status === 200) {
          location.reload()
        }
      } catch (err) {
        console.log('err', err)
      }
    },
    handleClick (item) {
      this.$router.push(`/list/${item.session_id}`)
    },
    async load () {
      const selectedRes = await axios.post('http://api.funplanet.tw/getSelectedYearMonth')
      console.log('selectedRes', selectedRes)
      this.selected_year = selectedRes.data.year
      this.selected_month = selectedRes.data.month

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
