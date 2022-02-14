<template>
  <v-container>
    <OrderPage2 v-if="page===2" :child_list="child_list" :parent_line="parent_line" :phone="phone" />
    <div v-if="page===1">
      <div class="text-h3">家長報名-{{name}}</div>
      <v-img :src="`http://api.funplanet.tw/upload/${image}`"  alt="xx" />
      <div class="text-h4" style="white-space: pre-wrap;">說明</div>
      <p class="text-body">{{text}} </p>
      <div class="text-h4">人數限制</div>
      <p class="text-body">{{min}} ~ {{max}}</p>
      <div class="text-h4">報名狀況</div>

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
                <v-chip v-if="e.childList.length< min" color="orange" text-color="white" >尚未成團，差{{min - e.childList.length}}人</v-chip>
                <v-chip v-if="min<=e.childList.length && e.childList.length<max " color="green" text-color="white" >成團，尚有{{max - e.childList.length}}名額</v-chip>
                <v-chip v-if="max <= e.childList.length" color="red" text-color="white" >成團，額滿，可候補</v-chip>
              </td>
              <td>{{e.new_childList.join(', ')}}</td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
      <h1>報名</h1>

      <div v-for="(e,i) in timeList" :key="'a'+i" class="d-flex align-center">
          <v-checkbox
          v-model="selected_time"
          :label="e.datetime + e.text"
          :value="e.time_id"
        ></v-checkbox>
      </div>
      <div>
        <v-btn color="primary" @click="child_list.push('')">
          新增小朋友
        </v-btn>
      </div>
      <div v-for="(child, idx) in child_list" :key="idx" class="d-flex mt-2">
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
        下一步
      </v-btn>
    </div>

  </v-container>
</template>

<script>
import axios from 'axios'
import dayjs from 'dayjs'
import OrderPage2 from './OrderPage2.vue'
const mapWeek = ['日', '一', '二', '三', '四', '五', '六']
export default {
  components: { OrderPage2 },
  name: 'Order',

  data: () => ({
    page: 2,
    name: '',
    type: '',
    year_month: '',
    image: '',
    text: '',
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
  computed: {
    // handleChildList: function (achildList) {
    //   const resultStr = achildList.map((e, cid) => {
    //     if (this.max <= cid) {
    //       return e.child_name + '(候補)'
    //     } else {
    //       return e.child_name
    //     }
    //   }).join(', ')
    //   return resultStr
    // }
  },
  created () {
    window.d = dayjs
    this.load()
  },
  methods: {
    deleteItem (idx) {
      this.child_list.splice(idx, 1)
    },
    async load () {
      this.isLoading = true
      try {
        const res = await axios.post('http://api.funplanet.tw/getSessionDetailById', {
          session_id: this.$route.params.s_id
        })
        const data = res.data

        this.name = data.name
        this.type = data.type
        this.year_month = data.year_month
        this.image = data.image
        this.text = data.text
        this.min = data.min
        this.max = data.max
        this.timeList = data.time_list.map((e, i) => {
          const obj = dayjs(e.datetime)
          const childArr = e.childList.map((child, cid) => {
            if (this.max <= cid) {
              return child.child_name + '(候補)'
            } else {
              return child.child_name
            }
          })
          return {
            ...e,
            datetime: `${obj.format('MM/DD')}(${mapWeek[obj.day()]}) ${obj.format('HH:mm')}`,
            new_childList: childArr

          }
        })
      } catch (err) {
        console.log('err', err)
      } finally {
        this.isLoading = false
      }
    },

    async submit () {
      if (this.selected_time.length === 0) {
        this.$toast.warning('未選擇時段')
        return
      }
      for (let i = 0; i < this.child_list.length; i++) {
        if (this.child_list[i].trim() === '') {
          this.$toast.warning('小朋友欄位不可為空')
          return
        }
      }
      if (this.parent_line === '') {
        this.$toast.warning('未填line名稱')
        return
      }
      if (this.phone === '') {
        this.$toast.warning('未填電話')
        return
      }

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
          this.page = 2
        }
      } catch (err) {
        this.$alert('', '失敗', 'error')
        console.log('err', err)
      }
    }
  }
}
</script>
