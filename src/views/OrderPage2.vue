<template>
<v-container>
  <div class="text-h4">最後一步！</div>
 <br />
<div class="text-body" style="max-width: 330px;" >
  <div>
你報名的場次為：<span class="sessionName primary--text">{{ name }}</span>
  </div>

報名的日期有：<br />
<ul>
  <li v-for="(e, i) in showSelectedTime" :key="i">
    {{e}}
  </li>
</ul>
聯絡電話為：
<ul>
  <li v-if="phone">{{phone}}</li>
</ul>
<br /><br />

請將以上資訊複製後，<br />
用<span style="color: #4CAF50; font-weight: 800;">LINE 回傳</span>給我們，<br />
以便確認能夠聯繫到您，<br />

  ⬇️ FUN星球官方Line連結<br />
  <a href="https://lin.ee/lpYPloz" target="_blank">https://lin.ee/lpYPloz</a>
  <br /><br />

若電話與Line都<span style="border-bottom: 2px solid red;">未能聯繫，<br />
會刪除您該次的報名</span>，<br />
後續的異動與提醒會優先透過Line進行通知，<br />
緊急狀況才會經由電話聯絡。

  <div class="d-flex mt-5" >
    <!-- <v-btn outlined color="primary" @click="$emit('go_previous')"> 上一步 </v-btn> -->

    <v-btn color="primary" block @click="check" class="py-2" style="height: 56px;">
  不知道有沒有報名成功？<br />
  按這裡回去看即時名單！
    </v-btn>
  </div>

</div>

</v-container>
</template>

<script>
import axios from 'axios'
import dayjs from 'dayjs'
const mapWeek = ['日', '一', '二', '三', '四', '五', '六']
export default {
  props: {
    child_list: Array,
    parent_line: String,
    phone: String,
    selected_time: Array,
    sessionId: String
  },
  data: () => ({
    showSelectedTime: [],
    isLoading: false,
    name: '',
    timeList: [],
    min: 0,
    max: 0
  }),
  created () {
    this.load()
  },
  methods: {
    async load () {
      this.isLoading = true
      try {
        const res = await axios.post('/getSessionDetailById', {
          session_id: this.sessionId
        })
        const data = res.data
        this.name = data.name
        this.min = data.min
        this.max = data.max
        this.timeList = data.time_list.map((e, i) => {
          const obj = dayjs(e.datetime)
          return {
            ...e,
            datetime: `${obj.format('MM/DD')}(${mapWeek[obj.day()]}) ${obj.format('HH:mm')}`
          }
        })

        this.selected_time.forEach(timeId => {
          const idx = this.timeList.findIndex(t => t.time_id === timeId)
          if (idx !== -1) {
            if (this.max < this.timeList[idx].childList.length) {
              this.showSelectedTime.push(this.timeList[idx].datetime + ' (候補)')
            } else {
              this.showSelectedTime.push(this.timeList[idx].datetime)
            }
          }
        })
      } catch (err) {
        console.log('err', err)
        this.$toast.warning('load 錯誤')
      } finally {
        this.isLoading = false
      }
    },
    check () {
      location.reload()
      // this.$fire({ title: '報名成功', type: 'success' }).then(r => {
      // })
    }
  }

}
</script>

<style>
.sessionName{
  font-weight: 800;
  font-size: 18px;
}
</style>
