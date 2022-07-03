<template>
<v-container>
  <div class="text-h4">最後一步！</div>
 <br />
<div class="text-body" style="max-width: 330px;" >
  <div>
你報名的場次為：<span class="sessionName">{{ name }}</span>
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

    <!-- <v-expansion-panels>
      <v-expansion-panel class="elevation-0">
        <v-expansion-panel-header>
          <div class="d-flex text-h4 justify-space-between">結果名單
            <span><v-chip color="blue" class="mr-2" outlined>錄取</v-chip><v-chip color="gray" text-color="grey" outlined>候補</v-chip></span>
          </div>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-data-table
            :headers="[
              { text: '時間', value: 'datetime' },
              { text: '備註', value: 'text' },
              { text: '報名狀況', value: 'situation' },
              { text: '成員', value: 'member' }
            ]"
            :items="this.timeList.filter(time=>  this.selected_time.findIndex(e=> e === time.time_id) !== -1 )"
            :items-per-page="-1"
            hide-default-footer
            disable-sort
          >
            <template v-slot:[`item.situation`]="{ item }">
              <div v-if="item.childList.length< min" class="d-flex align-center">
                <v-sheet color="orange" width="20" height="20" class="rounded-circle"></v-sheet>
                <span class="ml-2">尚未成團，差{{min - item.childList.length}}人</span>
              </div>
              <div v-if="min<=item.childList.length && item.childList.length<max " class="d-flex align-center">
                <v-sheet color="green" width="20" height="20" class="rounded-circle"></v-sheet>
                <span class="ml-2">成團，尚有{{max - item.childList.length}}名額</span>
              </div>
              <div v-if="max <= item.childList.length" class="d-flex align-center">
                <v-sheet color="red" width="20" height="20" class="rounded-circle"></v-sheet>
                <span class="ml-2">成團，額滿，可候補</span>
              </div>
            </template>
            <template v-slot:[`item.member`]="{ item }">
              <v-chip v-for="(c, idx) in item.childList.slice(0, max)" :key="idx" color="blue" outlined class="mr-1 mb-1  ">{{c.child_name}}</v-chip>
              <v-chip v-for="(c, idx) in item.childList.slice(max, item.childList.length)" :key="'g'+idx" color="gray" text-color="grey" outlined class="mr-1">{{c.child_name}}</v-chip>
            </template>

          </v-data-table>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels> -->
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
  color: #673ab7;
  font-weight: 800;
  font-size: 18px;
}
</style>
