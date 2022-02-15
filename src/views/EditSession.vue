<template>
  <v-container>
   <h1>編輯場次</h1>
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
        outlined
        class="mr-2"
      ></v-select>
      <v-select
        :items="['1','2','3','4','5','6','7','8','9','10','11','12' ]"
        v-model="month"
        label="月"
        dense
        outlined
        class="mr-2"
      ></v-select>
      <v-select
        :items="['寶寶','招牌']"
        v-model="type"
        label="類型"
        dense outlined
      ></v-select>
    </div>

  <v-file-input
    label="上傳封面"
    filled
    prepend-icon="mdi-camera"
    @change="Preview_image"
    v-model="image"
  ></v-file-input>
  <div class="d-flex justify-center">
    <v-img :src="url" max-width="940"  />

  </div>
  <v-textarea
    outlined
    name="input-7-4"
    label="文字說明"
    v-model="text"
    class="mt-6"
  ></v-textarea>
  <div class="d-flex align-start">
  <div class="text-body">每場人數範圍：</div>
  <div class="d-flex" style="width: 200px;">
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

  </div>
  <v-btn color="primary" @click="addItem">
    新增日期
  </v-btn>
  <v-dialog v-model="showDatePicker" persistent width="290px">
    <v-card>
      <v-date-picker v-model="selected_date" @input="setSeletedDate">
      </v-date-picker>
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
      class="mr-2"
      style="max-width: 120px;"
    ></v-text-field>

    <v-text-field
      label="時間"
      outlined
      dense
      v-model="time_list[idx].time"
      @click="toggleTimePicker(idx)"
      class="mr-2"
      style="max-width: 120px;"
    ></v-text-field>

    <v-text-field
      label="備註"
      outlined
      dense
      v-model="time_list[idx].text"
    ></v-text-field>
    <v-btn color="primary" icon @click="deleteItem(idx)" >
      <v-icon>mdi-delete</v-icon>
    </v-btn>
  </div>
  <div>
    <v-btn color="primary" @click="save"> 儲存 </v-btn>
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
export default {
  name: 'EditSession',

  data: () => ({
    session_id: '',
    name: '',
    year: '2022',
    month: '',
    selected_date: '',
    selected_time: '',
    selected_index: 0,
    showDatePicker: false,
    showTimePicker: false,
    type: '',
    url: null,
    image: null,
    text: '',
    min: '3',
    max: '6',
    time_list: [],
    isLoading: true

  }),
  created () {
    window.d = dayjs
    this.session_id = this.$route.params.s_id
    this.load()
  },
  methods: {
    Preview_image () {
      this.url = URL.createObjectURL(this.image)
    },
    async load () {
      try {
        this.isLoading = true
        const res = await axios.post('http://api.funplanet.tw/getSessionDetailById', {
          session_id: this.session_id
        })
        const data = res.data

        this.name = data.name
        this.year = dayjs(data.year_month).format('YYYY')
        this.month = dayjs(data.year_month).format('M')
        this.type = data.type
        this.image = data.image
        this.url = `http://api.funplanet.tw/upload/${this.image}`
        this.text = data.text
        this.min = data.min
        this.max = data.max

        this.time_list = data.time_list.map((e, i) => {
          return {
            time_id: e.time_id,
            date: dayjs(e.datetime).format('YYYY-MM-DD'),
            time: dayjs(e.datetime).format('HH:mm'),
            text: e.text
          }
        })
      } catch (err) {
        console.log('err', err)
        this.$toast.warning('load 錯誤')
      } finally {
        this.isLoading = false
      }
    },
    setSeletedDate () {
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
      this.selected_date = this.time_list[this.selected_index].date
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
      this.selected_time = this.time_list[this.selected_index].time
      this.showTimePicker = true
    },
    deleteItem (idx) {
      this.time_list.splice(idx, 1)
    },
    addItem () {
      this.time_list.push({ date: '', time: '', text: '' })
    },
    async save () {
      if (this.image instanceof File) {
        // 當
        console.log('上傳新圖片')

        const imgObj = new FormData()
        imgObj.append('sendimage', this.image)
        try {
          const res = await axios.post('http://api.funplanet.tw/api-file-upload.php', imgObj, { 'Content-Type': 'multipart/form-data' })
          if (res.status === 200) {
          }
        } catch (err) {
          console.log('err:', err)
        }
      }

      const obj = {
        session_id: this.session_id,
        name: this.name,
        year_month: dayjs(`${this.year}-${this.month}-01`).format('YYYY-MM-DD'),
        type: this.type,
        image: typeof (this.image) === 'string' ? this.image : this.image.name,
        text: this.text,
        min: this.min,
        max: this.max,
        time_list: this.time_list.map(e => {
          return {
            datetime: dayjs(`${e.date} ${e.time}`).format('YYYY-MM-DD HH:mm:ss'),
            text: e.text,
            time_id: e.time_id
          }
        })
      }
      try {
        const res = await axios.post('http://api.funplanet.tw/updateSession', obj)
        this.$alert('', '更新成功', 'success').then((e) => {
          location.reload()
        })
      } catch (err) {
        this.$alert('', '失敗', 'error')
        console.log('err:', err)
      }
    }
  }
}
</script>
