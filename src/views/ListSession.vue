<template>
<v-container>
  <h1>場次列表</h1>
  <v-data-table
    :headers="headers"
    :items="sList"
    class="elevation-1"
    :items-per-page="-1"
    @click:row="handleClick"
  >
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
    handleClick (item) {
      this.$router.push(`/admin/session_detail/${item.session_id}`)
    },
    async load () {
      const res = await axios.get('http://api.funplanet.tw/list')
      this.sList = res.data.map(e => ({
        ...e,
        year_month: e.year_month.substring(0, 7)
      }))
    },
    editItem (sessionId) {
      console.log('clicked')
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
