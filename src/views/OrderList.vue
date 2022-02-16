<template>
<v-container>
  <v-row class="align-center justify-space-between">
      <div class="text-h3 mt-3">{{showMonth}}月場次列表</div>
      <div class="d-flex mt-3" >
        <v-btn outlined color="deep-purple" class="ml-2" @click="load">當月</v-btn>
        <v-btn outlined color="deep-purple" class="ml-2" @click="loadNextMonth">下個月</v-btn>
      </div>
  </v-row>

  <v-row class="justify-center">
    <v-card elevation="2" v-for="(item, i) in sList" :key="i" class="mt-4 mx-2" width="370"
      @click="$router.push(`/list/${item.session_id}`)">
      <v-img :src="`http://api.funplanet.tw/upload/${item.image}`" max-width="940"></v-img>
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

        const res = await axios.get(`http://api.funplanet.tw/clientList/${this.dayjsObj.format('YYYY')}/${this.dayjsObj.format('MM')}`)
        this.sList = res.data
        this.showMonth = this.dayjsObj.format('M')
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

        const res = await axios.get(`http://api.funplanet.tw/clientList/${nextMonthDayjsObj.format('YYYY')}/${nextMonthDayjsObj.format('MM')}`)
        this.sList = res.data
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
