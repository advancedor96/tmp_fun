<template>
<v-container class="mb-10">
  <TheaterOrderPage2 v-if="page===2" 
    :selected_area="selected_area"  
    :areaList="areaList"
    :buyer_name="buyer_name"
    :phone="phone"

    @go_previous="page=1"
    @the_submit="submit"
  />
  <div v-if="page===1">
    <v-img :src="`${$apiUrl}/upload/${image}`" max-width="940"  alt="xx" />
    <div class="text-h4 mt-3">{{ name }}</div>
    <div class="text-h5 mt-3">說明</div>
    <p class="text-body mt-4" style="white-space: pre-wrap;">{{text}} </p>

    <v-data-table
      :headers="[
        { title: '區域', key: 'name', width: 200 },
        { title: '座位數', key: 'max_seats', width: 100 },
        { title: '票價', key: 'price', width: 100 },
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
          <div class="text-h5">即時名單</div> 
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-data-table
            :headers="[
              { title: '區域', key: 'name', width: 200 },
              { title: '剩餘座位', key: 'remainingSeats', width: 60 },
              { title: '聯絡人', key: 'hiddenPeople', width: 200 },
            ]"
            :items="areaList"
            :items-per-page="-1"
            hide-default-footer
            disable-sort
          >
            <template v-slot:[`item.hiddenPeople`]="{ item }">
              <div>
                <v-chip v-for="person in item.personList" :key="person" variant="outlined" class="mr-2 mb-1">
                    {{ maskString(person.buyer_name) }} * {{ person.num_seats }}位
                </v-chip>
              </div>
            </template>
          </v-data-table>          
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>

    <div class="text-h4 mt-3">選擇票種</div>
    <v-table>
      <thead>
        <tr><th class="text-left">區域</th><th class="text-left">票價</th><th class="text-left">數量</th></tr>
      </thead>
      <tbody>
        <tr v-for="(e,i) in areaList" :key="'a'+i">
          <td class="text-left">{{  e.name }}  <br /> <div class="text-subtitle-1">{{ e.text }}</div>  </td>
          <td class="text-left">$ {{  e.price }}
            <div v-if="e.remainingSeats>0 && e.remainingSeats <=5">剩 {{ e.remainingSeats }}張</div>
            <div v-else-if="e.remainingSeats===0">已售完</div>
          </td>
          <td class="text-right">
            <v-number-input v-model="selected_area[i].num_seats" :min="0" :max="Math.min(e.remainingSeats, 8)"
            control-variant="split" variant="outlined" density="compact" @update:modelValue="(val)=>updateNumber(val, i)" label="" :rules="[val => !!val && val >= 0]" style="max-width: 150px;"></v-number-input>
          </td>
        </tr>
        <tr>
          <td>總金額</td>
          <td></td>
          <td class="text-left">NT$ <span class="bigger">{{totalPrice}}</span></td>
        </tr>
      </tbody>
    </v-table>

    <div class="text-h4 mt-3">個人資訊</div>
    <v-form ref="form" v-model="valid" style="max-width: 400px;">
      <v-text-field
        label="姓名"
        v-model="buyer_name"
        :rules="[val => (val || '').length > 0 || '必填']"
        variant="outlined"
        density="compact"
        required
        class="mt-5"
        style="height: 51px;"
      ></v-text-field>

      <v-text-field label="LINE名稱" variant="outlined" density="compact" v-model="line"
          :rules="[val => (val || '').length > 0 || '必填']" required class="mt-4"
      ></v-text-field>
      <v-text-field label="電話" variant="outlined" density="compact" v-model="phone" class="mt-3"
        :rules="[val => (val || '').length > 0 || '必填', val => val.length === 10 || '手機號碼須為10個數字']" required
      ></v-text-field>
      <v-text-field label="備註" counter maxlength="60" variant="outlined" dense v-model="note" class="mt-3"></v-text-field>
      <div class="d-flex justify-space-between">
        <v-btn variant="outlined" color="primary" @click="$router.go(-1)"> 上一頁 </v-btn>
        <v-btn color="primary" @click="clickNext"> 下一步 </v-btn>
      </div>
    </v-form>
  </div>

  <v-overlay v-model="isLoading" class="align-center justify-center">
    <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
  </v-overlay>
  <v-dialog v-model="confirmDialog" width="auto"  :persistent="true">
    <v-card max-width="600" title="⚠️確認資料">
      <v-card-text>
        <div class="text-h5 text-red-darken-1 mb-3">請檢查您選擇的區域和張數再送出，訂錯的話要全部重來哦～</div>
        <div v-for="(area, idx) in neatSelectedArea" :key="area">
        {{ area.area_name }} * {{ area.num_seats }}張
        </div>
      </v-card-text>
      <v-card-actions>
        <v-btn text="取消" variant="outlined"  @click="confirmDialog = false"></v-btn>
        <v-spacer></v-spacer>
        <v-btn color="primary" variant="outlined" @click="clickConfirm" >確認送出</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</v-container>
</template>

<script>
import axios from 'axios'
import dayjs from 'dayjs'
import TheaterOrderPage2 from './TheaterOrderPage2.vue'
import { toast } from 'vue3-toastify';

export default {
  components: { TheaterOrderPage2 },
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
    phone: '',
    note: '',
    isLoading: true,
    parent_idx: 0,
    confirmDialog: false

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
      this.selected_area.map((e, idx)=>{
        total +=e.num_seats* this.areaList[idx].price
      })
      return total
    },
    neatSelectedArea () {
      return this.selected_area.filter(e=> e.num_seats > 0);
    }
  },
  methods: {

    updateNumber(val, idx){
      const selectedSeats = this.selected_area.reduce((total, area)=>(total+area.num_seats), 0);
      if(selectedSeats >8){
        toast.info('一人最多8張票')
        this.selected_area[idx].num_seats = val -1
      }
    },
    async clickNext(){
      this.$refs.form.validate()
      if (!this.valid) return false

      if(this.neatSelectedArea.length === 0){
        this.$swal('請至少選擇1個座位', "", "question")
        return
      }

      try {
        let res = await axios.post('/addTheaterOrderPrecheck', {
          theater_id: this.theater_id,
          areaAndSeatsList: this.neatSelectedArea
        })
        console.log('res.data:',res);
        if(res.status == 200){
          console.log('pre check 成功',);
          this.confirmDialog = true;
        }
      } catch (err) {
        console.log('回覆',err.response.data);
        if(err.response.data.status === 'not_enough'){
          let area_name = err.response.data.area_name
          let available_seats = err.response.data.available_seats
          let requested_seats = err.response.data.requested_seats
          this.$swal('喔喔', `${area_name} 只剩${available_seats}張票，不足您請求的 ${requested_seats} 張。請更新數量`, "info")
          this.loadPureData();
        }
      } 
      
    },  
    clickConfirm(){
      this.confirmDialog = false
      this.submit()
    },
    async loadPureData () {
      this.isLoading = true
      try {
        const res = await axios.post('/getTheaterDetailById', {
          theater_id: this.theater_id
        })
        const data = res.data
        this.areaList = data.area_list.map(e=>{
          const totalNumSeats = e.personList.reduce((total, person) => total + person.num_seats, 0);
          const remainingSeats = e.max_seats - totalNumSeats;
          return {
            ...e,
            remainingSeats
          }
        })
      } catch (err) {
        console.log('err', err)
      } finally {
        this.isLoading = false
      }
    },
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
        this.selected_area = this.areaList.map(e => ({
          area_id: e.area_id,
          area_name: e.name,
          num_seats: 0
        }))
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
      // let areaAndSeatsList = this.selected_area.filter(e=> e.num_seats > 0);

      if(this.neatSelectedArea.length === 0){
        toast.error('請至少選擇1個座位')
        return
      }

      const obj = {
        theater_id: this.theater_id,
        buyer_name: this.buyer_name,
        line: this.line,
        num_seats: this.num_seats,
        phone: this.phone,
        note: this.note,
        areaAndSeatsList: this.neatSelectedArea
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
        console.log('回覆',err.response.data);
        if (err.response.data.status === 'exceed_8') {
          this.$swal('失敗', '最多訂購8張', "error");
        } else if (err.response.data.status === 'not_enough') {
          let area_name = err.response.data.area_name
          let available_seats = err.response.data.available_seats
          let requested_seats = err.response.data.requested_seats
          this.$swal('喔喔', `${area_name} 只剩${available_seats}張票，不足您請求的 ${requested_seats} 張。請更新頁面`, "error")
        } else {
            this.$swal('失敗', '未知錯誤，截圖回報管理員', "error");
        }
      } finally {
        this.isLoading = false
      }
    },
    maskString(str) {
      if (str.length <= 1) {
        return str; // 如果字符串長度小於等於1，則不進行遮罩
      }

      if (str.length === 2) {
        // 如果字符串長度為2，將最後一個字符替換為 "*"
        return str.charAt(0) + '○';
      }
      
      // 提取第一個字符和最後一個字符
      const firstChar = str.charAt(0);
      const lastChar = str.charAt(str.length - 1);
      
      // 中間的部分固定為 "*"
      const maskedMiddle = '○';
      
      // 拼接結果
      return firstChar + maskedMiddle + lastChar;
    }
  }
}
</script>
<style scoped>
.bigger{
  font-size: 24px;
  color: var(--v-theme-primary);
}
</style>
