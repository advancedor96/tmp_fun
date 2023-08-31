<template>
<v-container>
  <v-row class="align-center justify-center">
      <div class="text-h3 mt-3">{{showMonth}}月場次列表</div>
  </v-row>
  <v-row class="mt-5 justify-space-between pr-2">
        <v-btn outlined color="primary" class="ml-2" @click="loadPreviousMonth">上個月</v-btn>
        <v-btn outlined color="primary" class="ml-2" @click="load">當月</v-btn>
        <v-btn outlined color="primary" class="ml-2" @click="loadNextMonth">下個月</v-btn>
  </v-row>

  <v-row class="mb-15 justify-center justify-md-space-between justify-sm-center">
    <v-card elevation="2" v-for="(item, i) in sList" :key="i" class="mt-4 mx-2" width="370"
      @click="$router.push(`/list/${item.session_id}`)">
      <v-img :src="`${$apiUrl}/upload/${item.image}`" max-width="940"></v-img>
    </v-card>

  </v-row>

  <v-overlay :value="isLoading">
    <v-progress-circular
      indeterminate
      size="64"
    ></v-progress-circular>
  </v-overlay>
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
    ],
    isLoading: false,
    dayjsObj: null,
    showMonth: ''

  }),
  created () {
    this.dayjsObj = dayjs()

    this.load()
  },
  methods: {
    handleClick (item) {
      this.$router.push(`/list/${item.session_id}`)
    },
    async load () {
      try {
        this.isLoading = true

        const res = await axios.get(`/clientList/${this.dayjsObj.format('YYYY')}/${this.dayjsObj.format('MM')}`)
        this.sList = res.data.filter(e => e.publish === '1') //列表裡就算已經發佈的，透過前端隱藏。
        this.showMonth = this.dayjsObj.format('M')
      } catch (err) {
        console.log('err', err)
        this.$toast.warning('load 錯誤')
      } finally {
        this.isLoading = false
      }
    },
    async loadPreviousMonth () {
      try {
        this.isLoading = true
        const prevMonthDayjsObj = this.dayjsObj.subtract(1, 'month')

        const res = await axios.get(`/clientList/${prevMonthDayjsObj.format('YYYY')}/${prevMonthDayjsObj.format('MM')}`)
        this.sList = res.data.filter(e => e.publish === '1') //列表裡就算已經發佈的，透過前端隱藏。
        this.showMonth = prevMonthDayjsObj.format('M')
      } catch (err) {
        console.log('err', err)
        this.$toast.warning('load 錯誤')
      } finally {
        this.isLoading = false
      }
    },
    async loadNextMonth () {
      try {
        this.isLoading = true
        const nextMonthDayjsObj = this.dayjsObj.add(1, 'month')

        const res = await axios.get(`/clientList/${nextMonthDayjsObj.format('YYYY')}/${nextMonthDayjsObj.format('MM')}`)
        this.sList = res.data.filter(e => e.publish === '1') //列表裡就算已經發佈的，透過前端隱藏。
        this.showMonth = nextMonthDayjsObj.format('M')
      } catch (err) {
        console.log('err', err)
        this.$toast.warning('load 錯誤')
      } finally {
        this.isLoading = false
      }
    }

  }
}
</script>

<style>

</style>
