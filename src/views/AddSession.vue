<template>
  <v-container>
   <h1>新增場次</h1>
   <v-text-field
      label="場次名稱"
      v-model="name"
    ></v-text-field>
    <div class="d-flex">
      <v-select
        :items="['2021', '2022', '2023', '2024']"
        v-model="year"
        label="年"
        dense
      ></v-select>
      <v-select
        :items="['1','2','3','4','5','6','7','8','9','10','11','12' ]"
        v-model="month"
        label="月"
        dense
      ></v-select>
      <v-select
        :items="['寶寶','招牌']"
        v-model="type"
        label="類型"
        dense
      ></v-select>
    </div>

  <v-file-input
    label="上傳封面"
    filled
    prepend-icon="mdi-camera"
    :value="image"
  ></v-file-input>
  <v-textarea
    outlined
    name="input-7-4"
    label="文字說明"
    v-model="text"
  ></v-textarea>
  <div class="d-flex">
  <h3>每場人數範圍：</h3>
  <v-text-field
    label="最小值"
    outlined
    dense
    v-model="min"
    type="number"
    width="50"
  ></v-text-field>
  ~
  <v-text-field
    label="最大值"
    outlined
    dense
    v-model="max"
    type="number"
  ></v-text-field>

  </div>
  <v-btn color="primary" @click="addItem">
    新增日期
  </v-btn>
  <v-dialog v-model="showDatePicker" persistent width="290px">
    <v-card>
      <v-date-picker v-model="selected_date" @input="setSeletedDate">
      </v-date-picker>
      <!-- <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text color="primary" @click="showDatePicker = false"> Cancel </v-btn>
        <v-btn text color="primary" @click="setSeletedDate">OK</v-btn>
      </v-card-actions> -->
    </v-card>
  </v-dialog>
  <v-dialog v-model="showTimePicker" persistent width="290px">
    <v-card>
      <v-time-picker
        ampm-in-title
        format="ampm"
        v-model="selected_time"
        scrollable
      ></v-time-picker>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text color="primary" @click="showTimePicker = false"> Cancel </v-btn>
        <v-btn text color="primary" @click="setSeletedTime">OK</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <!-- 這裡用 v-for 用 .length 疑似有問題 -->
  <div v-for="(i,idx) in time_list.length" :key="idx" class="d-flex">

    <v-text-field
      label="日期"
      outlined
      dense
      v-model="time_list[idx].date"
      @click="toggleDatePicker(idx)"
    ></v-text-field>

    <v-text-field
      label="時間"
      outlined
      dense
      v-model="time_list[idx].time"
      @click="toggleTimePicker(idx)"
    ></v-text-field>

    <v-text-field
      label="備註"
      outlined
      dense
      v-model="time_list[idx].text"
    ></v-text-field>
    <v-btn color="primary" @click="deleteItem(idx)">
      <v-icon>mdi-delete</v-icon>
    </v-btn>
  </div>
  <v-btn color="primary" @click="save">
    儲存
  </v-btn>
  </v-container>
</template>

<script>
import axios from 'axios'
import dayjs from 'dayjs'
export default {
  name: 'AddSession',

  data: () => ({
    name: '',
    year: '2022',
    month: '',
    selected_date: '',
    selected_time: '',
    selected_index: 0,
    showDatePicker: false,
    showTimePicker: false,
    type: '',
    image: [],
    text: '',
    min: '3',
    max: '6',
    time_list: [{
      date: '',
      time: '',
      text: ''
    }, {
      date: '',
      time: '',
      text: ''
    }, {
      date: '',
      time: '',
      text: ''
    }, {
      date: '',
      time: '',
      text: ''
    }]

  }),
  created () {
    window.d = dayjs
  },
  methods: {
    setSeletedDate () {
      console.log('執行setSeletedDate ')

      this.time_list[this.selected_index].date = this.selected_date
      this.showDatePicker = false

      for (let i = this.selected_index; i < this.time_list.length; i++) {
        if (this.time_list[i].date === '') {
          this.time_list[i].date = this.selected_date
        }
      }
    },
    toggleDatePicker (i) {
      this.selected_index = i
      this.showDatePicker = true
    },
    setSeletedTime () {
      this.time_list[this.selected_index].time = this.selected_time
      this.showTimePicker = false

      for (let i = this.selected_index; i < this.time_list.length; i++) {
        if (this.time_list[i].time === '') {
          this.time_list[i].time = this.selected_time
        }
      }
    },
    toggleTimePicker (i) {
      this.selected_index = i
      this.showTimePicker = true
    },
    deleteItem (idx) {
      this.time_list.splice(idx, 1)
    },
    addItem () {
      this.time_list.push({ date: '', time: '', text: '' })
    },
    async save () {
      const obj = {
        name: this.name,
        year_month: dayjs(`${this.year}-${this.month}-01`).format('YYYY-MM-DD'),
        type: this.type,
        image: this.image,
        text: this.text,
        min: this.min,
        max: this.max,
        time_list: this.time_list.map(e => {
          return {
            datetime: dayjs(`${e.date} ${e.time}`).format('YYYY-MM-DD HH:mm:ss'),
            text: e.text
          }
        })
      }

      try {
        const res = await axios.post('http://api.funplanet.tw/addSession', obj)
        this.$alert('', '新增成功', 'success').then((e) => {
          this.$router.push('/admin')
        })
      } catch (err) {
        this.$alert('', '失敗', 'error')
        console.log('err:', err)
      }
    }
  }
}
</script>
