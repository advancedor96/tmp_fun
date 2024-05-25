<template>
<v-container class="mb-10">
  <div v-if="page===1">
    <v-img :src="`${$apiUrl}/upload/${image}`" max-width="940"  alt="xx" />
    <h1>劇場名稱</h1>
    <div>{{ name }}</div>
    <h1>說明</h1>
    <p class="text-body mt-4" style="white-space: pre-wrap;">{{text}} </p>

    <v-data-table
      :headers="[
        { title: '區域', key: 'name', width: 200 },
        { title: '座位數', key: 'max_seats', width: 200 },
        { title: '票價', key: 'price', width: 200 },
        { title: '說明', key: 'text' },
      ]"
      :items="areaList"
      :items-per-page="-1"
      hide-default-footer
      disable-sort
    >
    </v-data-table>
    <v-expansion-panels>
      <v-expansion-panel class="elevation-0">
        <v-expansion-panel-title expand-icon="mdi-menu-down">
          即時名單
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-data-table
            :headers="[
              { title: '區域', key: 'name', width: 200 },
              { title: '剩餘數量', key: 'remainingSeats', width: 200 },
              { title: '實際人', key: 'hiddenPeople', width: 200 },
            ]"
            :items="areaList"
            :items-per-page="-1"
            hide-default-footer
            disable-sort
          >
            <template v-slot:[`item.hiddenPeople`]="{ item }">
              <div>
                <div v-for="person in item.personList" :key="person">
                {{ person.buyer_name }} * {{ person.num_seats }}張
                </div>
              </div>
            </template>
          </v-data-table>          
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>

    <h2>買票</h2>
    <div v-for="(e,i) in areaList" :key="'a'+i" class="d-flex align-center">
      <div>{{  e.name }}</div>
      <v-number-input v-model="selected_area[i]" :min="0" control-variant="split" variant="outlined" density="compact" label="數量" :rules="[val => !!val && val >= 0 || '數字必須大於等於 0']" style="max-width: 150px;"></v-number-input>

    </div>
    <div>金額試算: NT${{totalPrice}} </div>

    <v-form ref="form" v-model="valid" style="max-width: 400px;">
      <v-text-field
        label="姓名"
        v-model="buyer_name"
        :rules="[val => (val || '').length > 0 || '必填']"
        variant="outlined"
        density="compact"
        required
        prepend-icon="mdi-pac-man"
        style="height: 51px;"
      ></v-text-field>

      <v-text-field label="LINE名稱" variant="outlined" density="compact" v-model="line"
          :rules="[val => (val || '').length > 0 || '必填']" required
      ></v-text-field>
      <v-text-field label="電話" variant="outlined" density="compact" v-model="phone"
        :rules="[val => (val || '').length > 0 || '必填', val => val.length === 10 || '手機號碼須為10個數字']" required
      ></v-text-field>
      <v-text-field label="備註" counter maxlength="60" variant="outlined" dense v-model="note"></v-text-field>
      <div class="d-flex justify-space-between">
        <v-btn variant="outlined" color="primary" @click="$router.go(-1)"> 上一頁 </v-btn>
        <v-btn color="primary" @click="submit"> 送出資料 </v-btn>
      </div>
    </v-form>
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

export default {
  components: { OrderPage2 },
  name: 'TheaterOrder',

  data: () => ({
    valid: true,
    theater_id: '',
    page: 1,
    name: '',
    year_month: '',
    image: '',
    text: '',
    areaList: [],

    selected_area: [],
    buyer_name: '',
    line: '',
    phone: '0911123123',
    note: '',
    isLoading: true,
    parent_idx: 0,

  }),
  computed: {

  },

  created () {
    this.theater_id = this.$route.params.t_id
    this.load()
  },
  computed: {
    totalPrice () {
      let total = 0
      this.areaList.forEach((e, i) => {
        total += this.selected_area[i] * e.price
      })
      return total
    }
  },
  methods: {
    async load () {
      this.isLoading = true
      try {
        const res = await axios.post('/getTheaterDetailById', {
          theater_id: this.theater_id
        })
        const data = res.data
        this.name = data.name
        this.year_month = data.year_month
        this.image = data.image
        this.text = data.text
        this.areaList = data.area_list.map(e=>{
          const totalNumSeats = e.personList.reduce((total, person) => total + person.num_seats, 0);
          const remainingSeats = e.max_seats - totalNumSeats;
          return {
            ...e,
            remainingSeats
          }
        })
        this.selected_area = this.areaList.map(e => 0)
        console.log('大資料:',this.areaList);
      } catch (err) {
        console.log('err', err)
        toast.warning('load 錯誤')
      } finally {
        this.isLoading = false
      }
    },

    async submit () {
      this.$refs.form.validate()
      if (!this.valid) return false
      let areaAndSeatsList = this.areaList.map((e, idx) => {
          if(this.selected_area[idx] > 0){
            return {
              area_id: e.area_id,
              num_seats: Number(this.selected_area[idx])
            }
          }else return null
        }).filter(e=>e!==null)


      if(areaAndSeatsList.length === 0){
        toast.error('請選擇座位數')
        return
      }

      const obj = {
        theater_id: this.theater_id,
        personName: this.personName,
        line: this.line,
        num_seats: this.num_seats,
        phone: this.phone,
        note: this.note,
        areaAndSeatsList
      }

      console.log('小資料:',obj);

      try {
        this.isLoading = true

        const checkIsPublished = await axios.post('/getTheaterDetailById', {
          theater_id: this.theater_id
        })
        if (checkIsPublished.data.publish !== 1) {
          toast.error('報名失敗。此活動已關閉。請重新連線。')
          this.isLoading = false
          return false
        }

        const res = await axios.post('/addTheaterOrder', obj)
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
