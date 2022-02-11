<template>
  <v-container>
   <h1>家長報名</h1>
  <h2>圖</h2>
  <h2>說明</h2>
  <div class="d-flex">
    <h2>報名狀況</h2>
    <h2>人數限制：{{min}} ~ {{max}}</h2>

  </div>
  <v-simple-table>
    <template v-slot:default>
      <thead>
        <tr>
          <th class="text-left">時間</th>
          <th class="text-left">備註</th>
          <th class="text-left">報名狀況</th>
          <th class="text-left">成員</th>
        </tr>
      </thead>
      <tbody  v-if="!isLoading">
        <tr v-for="(e,i) in timeList" :key="i">
          <td>{{ e.datetime }}</td>
          <td>{{ e.text }}</td>
          <td>
            <v-chip v-if="e.childList.length< min" color="orange" text-color="white" >未成團，少{{min - e.childList.length}}人</v-chip>
            <v-chip v-if="min<=e.childList.length && e.childList.length<max " color="green" text-color="white" >成團，尚有{{max - e.childList.length}}名額</v-chip>
            <v-chip v-if="max <= e.childList.length" color="red" text-color="white" >成團，額滿。</v-chip>
          </td>
          <td>{{   e.childList.join(',')}}</td>
        </tr>
      </tbody>
    </template>
  </v-simple-table>
  <h1>報名</h1>

  <div v-for="(e,i) in timeList" :key="'a'+i" class="d-flex align-center">
      <v-checkbox
      v-model="selected_time"
      :label="e.datetime"
      :value="e.time_id"
    ></v-checkbox>
    <div>{{ e.text }}</div>
  </div>
  <v-btn color="primary" @click="child_list.push('')">
    新增小朋友
  </v-btn>
  <div v-for="(child, idx) in child_list" :key="idx" class="d-flex">
    <v-text-field
      label="小朋友稱呼"
      outlined
      dense
      v-model="child_list[idx]"
    ></v-text-field>
    <v-btn outlined color="primary" @click="deleteItem(idx)">
      <v-icon>mdi-delete</v-icon>
    </v-btn>
  </div>

  <v-text-field
    label="家長LINE稱呼" outlined dense v-model="parent_line"
  ></v-text-field>
  <v-text-field
    label="電話" outlined dense v-model="phone"
  ></v-text-field>
  <v-text-field
    label="備註" outlined dense v-model="note"
  ></v-text-field>
  <v-btn color="primary" @click="submit">
    送出
  </v-btn>
  </v-container>
</template>

<script>
import axios from 'axios'
import dayjs from 'dayjs'
const mapWeek = ['日', '一', '二', '三', '四', '五', '六']
export default {
  name: 'Order',

  data: () => ({
    min: 0,
    max: 0,
    timeList: [],
    selected_time: [],
    child_list: [''],
    parent_line: '',
    phone: '',
    note: '',
    isLoading: true

  }),
  created () {
    window.d = dayjs
    this.isLoading = true
    this.load()
    this.loadTimeList()
  },
  methods: {
    deleteItem (idx) {
      this.child_list.splice(idx, 1)
    },
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
    },
    async loadTimeList () {
      try {
        const res = await axios.post('http://api.funplanet.tw/getTimeBySessionId', {
          session_id: this.$route.params.s_id
        })
        this.timeList = res.data.map((e, i) => {
          const obj = dayjs(e.datetime)
          return {
            ...e,
            datetime: `${obj.format('MM/DD')}(${mapWeek[obj.day()]}) ${obj.format('HH:mm')}`

          }
        })

        for (let i = 0; i < this.timeList.length; i++) {
          await this.addChildList(i)
        }
      } catch (err) {
        console.log('err', err)
      } finally {
        this.isLoading = false
        console.log('finally')
      }
    },
    async addChildList (i) {
      try {
        this.timeList[i].childList = []
        const res = await axios.post('http://api.funplanet.tw/getChildByTimeId', {
          time_id: this.timeList[i].time_id
        })
        res.data.forEach(e => {
          this.timeList[i].childList.push(e.child_name)
        })
      } catch (err) {
        console.log('err', err)
      } finally {
      }
    },
    async submit () {
      if (this.selected_time.length === 0 || this.parent_line === '' || this.phone === '') {
        console.log('不可為空')
        return
      }
      this.child_list.forEach(e => {
        if (e === '') {
          console.log('不可為空')
        }
      })
      const obj = {
        parent_line: this.parent_line,
        phone: this.phone,
        childList: this.child_list.map(e => ({ child_name: e })),
        timeIdList: this.selected_time.map(e => ({ time_id: e })),
        note: this.note
      }
      try {
        const res = await axios.post('http://api.funplanet.tw/addOrder', obj)
        if (res.status === 200) {
          // this.$alert('', '新增成功', 'success')
          this.$fire({ title: '新增成功', type: 'success' }).then(r => {
            location.reload()
          })
        }
      } catch (err) {
        this.$alert('', '失敗', 'error')
        console.log('err', err)
      }
    }
  }
}
</script>
