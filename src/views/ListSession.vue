<template>
<v-container>

  <v-row class="align-center justify-space-between">
      <div class="text-h3">場次列表</div>
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
    <template v-slot:[`item.action`]="{ item }">
      <v-btn color="primary" icon @click.stop="editItem(item.session_id)">
        <v-icon >mdi-pencil</v-icon>
      </v-btn>

      <v-btn color="primary" icon @click.stop="deleteItem(item.session_id)">
        <v-icon >mdi-delete</v-icon>
      </v-btn>
    </template>
  </v-data-table>
</v-container>
</template>

<script>
import axios from 'axios'
import dayjs from 'dayjs'
export default {
  data: () => ({
    sList: [],
    selected_year: '2022',
    selected_month: 2,
    headers: [
      { text: '名稱', value: 'name' },
      { text: '類型', value: 'type' },
      { text: '月份', value: 'year_month' },
      { text: '縮圖', value: 'image' },
      { text: '動作', value: 'action' }
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
      this.$router.push(`/admin/session_detail/${item.session_id}`)
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
    },
    editItem (sessionId) {
      this.$router.push(`/admin/edit_session/${sessionId}`)
    },
    async deleteItem (sessionId) {
      const r = await this.$fire({
        title: '確定刪除此場次？',
        text: '',
        type: 'warning',
        confirmButtonText: '確認',
        showCancelButton: true
      })
      if (r.value === true) {
        try {
          const res = await axios.post('http://api.funplanet.tw/deleteSession', {
            session_id: sessionId
          })
          if (res.status === 200) {
            location.reload()
          }
        } catch (err) {
          console.log('err', err)
        }
      }
    }
  }
}
</script>

<style>

</style>
