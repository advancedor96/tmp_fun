<template>
<v-container class="mb-10">
  <OrderPage2 v-if="page===2" :child_list="child_list" :parent_line="parent_line"
    :phone="phone" :selected_time="selected_time"
    :sessionId="this.session_id"
    @go_previous="page=1"
    @the_submit="submit"
  />
  <div v-if="page===1 && publish===true">
    <v-img :src="`${$apiUrl}/upload/${image}`" max-width="940"  alt="xx" />
    <p class="text-body mt-4" style="white-space: pre-wrap;">{{text}} </p>

    <v-expansion-panels>
      <v-expansion-panel class="elevation-0">
        <v-expansion-panel-title expand-icon="mdi-menu-down">
          即時名單
          <v-chip color="blue" class="mr-2" variant="outlined">錄取</v-chip>
          <v-chip color="gray" text-color="grey" variant="outlined">候補</v-chip>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-data-table
            :headers="[
              { title: '時間', key: 'datetime' },
              { title: '備註', key: 'text' },
              { title: '報名狀況', key: 'situation' },
              { title: '成員', key: 'member' }
            ]"
            :items="timeList"
            :items-per-page="-1"
            hide-default-footer
            disable-sort
          >
            <template v-slot:[`item.situation`]="{ item }">
              <div v-if="item.childList.length< min" class="d-flex align-center">
                <v-sheet color="orange" width="20" height="20" class="rounded-circle" style="min-width:20px;"></v-sheet>
                <span class="ml-2">尚未成團，差{{min - item.childList.length}}人</span>
              </div>
              <div v-if="min<=item.childList.length && item.childList.length<max " class="d-flex align-center">
                <v-sheet color="green" width="20" height="20" class="rounded-circle" style="min-width:20px;"></v-sheet>
                <span class="ml-2">成團，尚有{{max - item.childList.length}}名額</span>
              </div>
              <div v-if="max <= item.childList.length" class="d-flex align-center">
                <v-sheet color="red" width="20" height="20" class="rounded-circle" style="min-width:20px;"></v-sheet>
                <span class="ml-2">成團，額滿，可候補</span>
              </div>
            </template>
            <template v-slot:[`item.member`]="{ item }">
              <v-chip v-for="(c, idx) in item.childList.slice(0, max)" :key="idx" color="blue" variant="outlined" class="mr-1 mb-1  ">{{c.child_name}}</v-chip>
              <v-chip v-for="(c, idx) in item.childList.slice(max, item.childList.length)" :key="'g'+idx" color="gray" text-color="grey" variant="outlined" class="mr-1">{{c.child_name}}</v-chip>
            </template>

          </v-data-table>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>

    <div class="colorInfo d-flex align-center mt-3 mb-2">
      <v-sheet color="green" width="20" height="20" class="rounded-circle d-inline-block mr-1" style="min-width:20px;"></v-sheet>代表尚有名額
      <v-sheet color="orange" width="20" height="20" class="ml-3 rounded-circle d-inline-block mr-1" style="min-width:20px;"></v-sheet>代表尚未達開場人數下限
      <v-sheet color="red" width="20" height="20" class="ml-3 rounded-circle d-inline-block mr-1" style="min-width:20px;"></v-sheet>代表已額滿，可候補
    </div>
    <div v-for="(e,i) in timeList" :key="'a'+i" class="d-flex align-center">
      <v-checkbox
          v-model="selected_time"
          :value="e.time_id"
          density="compact"
          style="height:40px;"
          :disabled="e.childList.length >= max+max_standby"
      >
        <template v-slot:label>
          <div class="align-center d-flex">
            <div v-if="e.childList.length< min" class="d-flex align-center">
              <v-sheet color="orange" width="20" height="20" class="rounded-circle d-inline-block"></v-sheet>
              <span class="ml-2">{{ e.datetime + ' ' + e.text}}</span>
            </div>
            <div v-if="min<=e.childList.length && e.childList.length<max" class="d-flex align-center">
              <v-sheet color="green" width="20" height="20" class="rounded-circle d-inline-block"></v-sheet>
              <span class="ml-2">{{ e.datetime + ' ' + e.text}}</span>
            </div>
            <div v-if="max <= e.childList.length && e.childList.length < max+max_standby" class="d-flex align-center">
              <v-sheet color="red" width="20" height="20" class="rounded-circle d-inline-block"></v-sheet>
              <span class="ml-2">{{ e.datetime + ' ' + e.text}}</span>
            </div>
            <div v-if="e.childList.length >= max+max_standby" class="d-flex align-center">
              <v-sheet color="black" width="20" height="20" class="rounded-circle d-inline-block"></v-sheet>
              <span class="ml-2" style="text-decoration: line-through;">{{ e.datetime + ' ' + e.text}} </span>
              <span >(已後補 {{e.childList.length - max}}人，無法再報名)</span>
            </div>
          </div>
        </template>
      </v-checkbox>

    </div>
    <v-form ref="form" v-model="valid" style="max-width: 400px;">
      <div v-for="(child, idx) in child_list" :key="idx" class="d-flex mt-2 align-center">
        <v-text-field
          label="小朋友稱呼"
          v-model="child_list[idx].child_name"
          :rules="[val => (val || '').length > 0 || '必填']"
          variant="outlined"
          density="compact"
          required
          prepend-icon="mdi-pac-man"
          style="height: 51px;"
        ></v-text-field>
        <v-btn variant="text" color="primary" @click="deleteItem(idx)">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </div>
      <div class="mt-2"   style="margin-left: 33px; margin-bottom: 20px;">
        <v-btn variant="outlined" color="primary" @click="child_list.push({ child_name: '', icon: 0 })">
          <v-icon dark left  >
            mdi-plus
          </v-icon>
          新增小朋友
        </v-btn>
      </div>

      <v-text-field label="家長LINE稱呼" variant="outlined" density="compact" v-model="parent_line"
          :rules="[val => (val || '').length > 0 || '必填']" required
          :prepend-icon="parent_icons[parent_idx]"
          @click:prepend="changeParentIcon(idx)"
      ></v-text-field>
      <v-text-field label="電話" variant="outlined" density="compact" v-model="phone"
        prepend-icon="mdi-cellphone"
        :rules="[val => (val || '').length > 0 || '必填', val => val.length === 10 || '手機號碼須為10個數字']" required
      ></v-text-field>
      <!-- 線上付款方式 -->
      <v-radio-group v-if="type==='線上'" v-model="online_payment" label="付款方式" row  class="mt-0">
        <v-radio label="單次匯款" value="single_pay"></v-radio>
        <v-radio label="扣儲值" value="discount_card"></v-radio>
      </v-radio-group>
      <v-text-field label="備註" counter maxlength="60" variant="outlined" dense v-model="note" prepend-icon="mdi-information-outline"></v-text-field>
      <div class="d-flex justify-space-between">
        <v-btn variant="outlined" color="primary" @click="$router.go(-1)"> 上一頁 </v-btn>
        <v-btn color="primary" @click="submit"> 送出資料 </v-btn>
      </div>
    </v-form>
  </div>
  <div v-if="page===1 && publish === false">
    <div class="d-flex text-h4 justify-space-between">抱歉， "{{name}}" 此活動已關閉。<br>
    按左上角的⬅ 看其他活動
    </div>
  </div>

  <v-overlay v-model="isLoading" class="align-center justify-center">
    <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
  </v-overlay>
</v-container>
</template>

<script>
import axios from 'axios'
import dayjs from 'dayjs'
import OrderPage2 from './OrderPage2.vue'
import { toast } from 'vue3-toastify';
const mapWeek = ['日', '一', '二', '三', '四', '五', '六']

export default {
  components: { OrderPage2 },
  name: 'Order',

  data: () => ({
    valid: true,
    session_id: '',
    page: 1,
    name: '',
    type: '',
    year_month: '',
    image: '',
    text: '',
    min: 0,
    max: 0,
    max_standby: 0,
    publish: true,
    timeList: [],

    selected_time: [],
    child_list: [{ child_name: '', icon: 0 }],
    parent_line: '',
    phone: '',
    online_payment: '',
    note: '',
    isLoading: true,
    icons: ['mdi-face-man', 'mdi-face-woman', 'mdi-robot', 'mdi-emoticon-devil'],
    parent_idx: 0,
    parent_icons: ['mdi-human-female-dance', 'mdi-human-greeting', 'mdi-google-downasaur']

  }),
  computed: {

  },

  created () {
    this.session_id = this.$route.params.s_id
    this.load()
  },
  methods: {
    changeParentIcon (idx) {
      this.parent_idx === this.parent_icons.length - 1
        ? this.parent_idx = 0
        : this.parent_idx++
    },
    changeIcon (idx) {
      this.child_list[idx].icon === this.icons.length - 1
        ? this.child_list[idx].icon = 0
        : this.child_list[idx].icon++
    },

    deleteItem (idx) {
      this.child_list.splice(idx, 1)
    },
    async load () {
      this.isLoading = true
      try {
        const res = await axios.post('/getSessionDetailById', {
          session_id: this.session_id
        })
        const data = res.data

        this.name = data.name
        this.type = data.type
        this.year_month = data.year_month
        this.image = data.image
        this.text = data.text
        this.min = parseInt(data.min)
        this.max = parseInt(data.max)
        this.max_standby = parseInt(data.max_standby)
        this.publish = data.publish === '1'

        this.timeList = data.time_list.map((e, i) => {
          // const childArr = e.childList.map((child, cid) => {
          //   if (this.max <= cid) return child.child_name + '(候補)'
          //   else return child.child_name
          // })
          const obj = dayjs(e.datetime)
          return {
            ...e,
            datetime: `${obj.format('MM/DD')}(${mapWeek[obj.day()]}) ${obj.format('HH:mm')}`
          }
        })
      } catch (err) {
        console.log('err', err)
        toast.warning('load 錯誤')
      } finally {
        this.isLoading = false
      }
    },

    async submit () {
      if (this.selected_time.length === 0) {
        toast.error('未選擇時段')
        return
      }
      this.$refs.form.validate()
      if (!this.valid) return false
      if (this.type === '線上' && this.online_payment === '') {
        toast.error('需選擇付款方式')
        return
      }

      const obj = {
        session_id: this.session_id,
        parent_line: this.parent_line,
        phone: this.phone,
        online_payment: this.online_payment,
        childList: this.child_list,
        timeIdList: this.selected_time.map(e => ({ time_id: e })),
        note: this.note
      }

      try {
        this.isLoading = true

        const checkIsPublished = await axios.post('/getSessionDetailById', {
          session_id: this.session_id
        })
        if (checkIsPublished.data.publish !== '1') {
          toast.error('報名失敗。此活動已關閉。請重新連線。')
          this.isLoading = false
          return false
        }

        const res = await axios.post('/addOrder', obj)
        if (res.status === 200) {
          this.$swal('報名成功').then(()=>{
            this.page = 2
          })
        }
      } catch (err) {
        this.$swal('失敗', "", "error")
        console.log('err', err)
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>
<style scoped>
.v-data-table :deep(.v-data-table__wrapper .v-data-table__mobile-row){
  min-height: 24px;
}
:deep(tr.v-data-table__mobile-table-row){
  margin-top: 18px;
}

</style>
