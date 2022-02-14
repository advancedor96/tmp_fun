<template>
<v-container>
  <OrderPage2 v-if="page===2" :child_list="child_list" :parent_line="parent_line" :phone="phone" />
  <div v-if="page===1">
    <v-img :src="`http://api.funplanet.tw/upload/${image}`" max-width="940"  alt="xx" />
    <div class="text-h5">報名</div>
    <p class="text-body">{{name}} </p>
    <div class="text-h5">說明</div>
    <p class="text-body" style="white-space: pre-wrap;">{{text}} </p>
    <div class="text-h5">人數限制</div>
    <p class="text-body">{{min}} ~ {{max}}</p>
    <div class="text-h5">報名狀況</div>

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
    <div class="text-h5 mt-5">報名</div>

    <div v-for="(e,i) in timeList" :key="'a'+i" class="d-flex align-center">
        <v-checkbox
        v-model="selected_time"
        :label="e.datetime + e.text"
        :value="e.time_id"
      ></v-checkbox>
    </div>
    <div>
      <v-btn outlined color="primary" @click="child_list.push({ child_name: '', icon: 0 })">
        <v-icon dark left  >
          mdi-plus
        </v-icon>
        新增小朋友
      </v-btn>
    </div>
    <div v-for="(child, idx) in child_list" :key="idx" class="d-flex mt-2">
      <v-text-field
        label="小朋友稱呼"
        v-model="child_list[idx].child_name"
        :rules="[val => (val || '').length > 0 || '必填']"
        outlined
        dense
        required
        :prepend-icon="icons[child_list[idx].icon]"
        @click:prepend="changeIcon(idx)"
      ></v-text-field>
      <v-btn icon color="primary" @click="deleteItem(idx)">
        <v-icon>mdi-delete</v-icon>
      </v-btn>
    </div>

    <v-text-field
      label="家長LINE稱呼" outlined dense v-model="parent_line"
        :rules="[val => (val || '').length > 0 || '必填']" required
        prepend-icon="mdi-human-female"
    ></v-text-field>
    <v-text-field
      label="電話" outlined dense v-model="phone" prepend-icon="mdi-cellphone"
       :rules="[val => (val || '').length > 0 || '必填']" required
    ></v-text-field>
    <v-text-field label="備註" outlined dense v-model="note" prepend-icon="mdi-information-outline"></v-text-field>
    <div class="d-flex justify-space-between">
      <v-btn outlined color="primary" @click="$router.go(-1)"> 上一步 </v-btn>
      <v-btn color="primary" @click="submit"> 下一步 </v-btn>
    </div>
  </div>

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
import OrderPage2 from './OrderPage2.vue'
const mapWeek = ['日', '一', '二', '三', '四', '五', '六']

export default {
  components: { OrderPage2 },
  name: 'Order',

  data: () => ({
    session_id: '',
    page: 1,
    name: '',
    type: '',
    year_month: '',
    image: '',
    text: '',
    min: 0,
    max: 0,
    timeList: [],

    selected_time: [],
    child_list: [{ child_name: '', icon: 0 }],
    parent_line: '',
    phone: '',
    note: '',
    isLoading: true,
    icons: ['mdi-face-man', 'mdi-face-woman', 'mdi-robot', 'mdi-emoticon-devil']

  }),
  computed: {

  },

  created () {
    window.d = dayjs
    this.session_id = this.$route.params.s_id
    this.load()
  },
  methods: {
    changeIcon (idx) {
      this.child_list[idx].icon === this.icons.length - 1
        ? this.child_list[idx].icon = 0
        : this.child_list[idx].icon++
      // this.iconIndex === icons.length - 1
      //   ? this.iconIndex = 0
      //   : this.iconIndex++
    },

    deleteItem (idx) {
      this.child_list.splice(idx, 1)
    },
    async load () {
      this.isLoading = true
      try {
        const res = await axios.post('http://api.funplanet.tw/getSessionDetailById', {
          session_id: this.session_id
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
        this.$toast.warning('load 錯誤')
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
        if (this.child_list[i].child_name.trim() === '') {
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
        session_id: this.session_id,
        parent_line: this.parent_line,
        phone: this.phone,
        childList: this.child_list,
        timeIdList: this.selected_time.map(e => ({ time_id: e })),
        note: this.note
      }
      try {
        const res = await axios.post('http://api.funplanet.tw/addOrder', obj)
        if (res.status === 200) {
          this.page = 2
          this.$toast.success('送出資料')
        }
      } catch (err) {
        this.$alert('', '失敗', 'error')
        console.log('err', err)
      }
    }
  }
}
</script>
