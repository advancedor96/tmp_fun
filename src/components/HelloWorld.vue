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
  ></v-text-field>
  ~
  <v-text-field
    label="最大值"
    outlined
    dense
    v-model="max"
  ></v-text-field>

  </div>
  <v-btn color="primary" @click="addItem">
    新增日期
  </v-btn>
  <v-dialog v-model="showDatePicker" persistent width="290px">
    <v-card>
      <v-date-picker v-model="selected_date">
      </v-date-picker>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          text
          color="primary"
          @click="showDatePicker = false"
        >
          Cancel
        </v-btn>
        <v-btn
          text
          color="primary"
          @click="setSeletedDate"
        >
          OK
        </v-btn>
      </v-card-actions>

    </v-card>

  </v-dialog>
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
export default {
  name: 'HelloWorld',

  data: () => ({
    name: '',
    year: '2022',
    month: '',
    selected_date: '',
    selected_index: 0,
    showDatePicker: false,
    showDialog: false,
    type: '',
    image: [],
    text: '',
    min: '4',
    max: '6',
    time_list: [{
      date: '2022-01-01',
      time: '',
      text: ''
    }, {
      date: '2',
      time: '',
      text: ''
    }, {
      date: '3',
      time: '',
      text: ''
    }, {
      date: '4',
      time: '',
      text: ''
    }]

  }),
  methods: {
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
      this.showDatePicker = true
    },
    deleteItem (idx) {
      this.time_list.splice(idx, 1)
    },
    addItem () {
      this.time_list.push({ date: '', time: '', text: '' })
    },
    async save () {
      console.log('click')
      try {
        // const res = axios.post('http://api.funplanet.tw/addSession', {
        //   name: '從前端axios來的',
        //   year_month: '2022-01-01',
        //   type: 'axios寶寶故事',
        //   image: '',
        //   text: 'axios說明',
        //   min: '3',
        //   max: '5',
        //   time_list: [
        //     {
        //       date: '',
        //       time: '',
        //       text: ''
        //     },
        //     {
        //       date: '',
        //       time: '',
        //       text: ''
        //     }
        //   ]

        // })
        // console.log('完成')
      } catch (err) {
        console.log('err:', err)
      }
    }
  }
}
</script>
