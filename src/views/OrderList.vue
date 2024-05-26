<template>
<v-container>
  <v-row class="align-center justify-center">
      <div class="text-h3 mt-3">{{showMonth}}月場次列表</div>
  </v-row>
  <v-row class="mt-5 justify-space-between pr-2">
    <v-btn variant="outlined" color="primary" class="ml-2" @click="loadPreviousMonth">上個月</v-btn>
    <v-btn variant="outlined" color="primary" class="ml-2" @click="load">當月</v-btn>
    <v-btn variant="outlined" color="primary" class="ml-2" @click="loadNextMonth">下個月</v-btn>
  </v-row>

  <v-row class="mb-15 justify-center justify-md-space-between justify-sm-center">
    <v-card elevation="2" v-for="(item, i) in sList" :key="i" class="mt-4 mx-2" width="370"
    @click="showItem(item)">
      <v-img cover :src="`${$apiUrl}/upload/${item.image}`" max-width="940" min-height="370">
        <template v-slot:error>
          <v-img class="mx-auto" height="300" max-width="500" src="https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg"
          ></v-img>
        </template>
      </v-img>
    </v-card>

  </v-row>

  <v-overlay v-model="isLoading" class="align-center justify-center">
    <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
  </v-overlay>
</v-container>
</template>

<script>
import axios from 'axios'
import dayjs from 'dayjs'
import { toast } from 'vue3-toastify';
export default {
  data: () => ({
    sList: [],
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
    showItem(item){
      if (item.event_type === 'session') {
        this.$router.push(`/list/${item.s_or_t_id}`)
      } else if(item.event_type === 'theater') {
        this.$router.push(`/listTheater/${item.s_or_t_id}`)
      } else{
        toast.warning('無此項目')
      }

    },
    async load () {
      try {
        this.isLoading = true

        const res = await axios.get(`/clientList/${this.dayjsObj.format('YYYY')}/${this.dayjsObj.format('MM')}`)
        this.sList = res.data
        // this.sList = res.data.filter(e => e.event_type === 'session')
        console.log('來了：',this.sList);
        
        this.showMonth = this.dayjsObj.format('M')
      } catch (err) {
        console.log('err', err)
        toast.warning('load 錯誤')
      } finally {
        this.isLoading = false
      }
    },
    async loadPreviousMonth () {
      try {
        this.isLoading = true
        const prevMonthDayjsObj = this.dayjsObj.subtract(1, 'month')

        const res = await axios.get(`/clientList/${prevMonthDayjsObj.format('YYYY')}/${prevMonthDayjsObj.format('MM')}`)
        this.sList = res.data
        // this.sList = res.data.filter(e => e.event_type === 'session')
        this.showMonth = prevMonthDayjsObj.format('M')
      } catch (err) {
        console.log('err', err)
        toast.warning('load 錯誤')
      } finally {
        this.isLoading = false
      }
    },
    async loadNextMonth () {
      try {
        this.isLoading = true
        const nextMonthDayjsObj = this.dayjsObj.add(1, 'month')

        const res = await axios.get(`/clientList/${nextMonthDayjsObj.format('YYYY')}/${nextMonthDayjsObj.format('MM')}`)
        this.sList = res.data
        // this.sList = res.data.filter(e => e.event_type === 'session')
        this.showMonth = nextMonthDayjsObj.format('M')
      } catch (err) {
        console.log('err', err)
        toast.warning('load 錯誤')
      } finally {
        this.isLoading = false
      }
    }

  }
}
</script>

<style>

</style>
