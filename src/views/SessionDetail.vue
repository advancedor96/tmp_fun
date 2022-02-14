<template>
<v-container>
  <v-img :src="`http://api.funplanet.tw/upload/${image}`" max-width="940" alt="xx" />
  <div class="text-h5">名稱</div>
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
          <td>{{   e.childList.map(e=>e.child_name).join(',')}}</td>
        </tr>
      </tbody>
    </template>
  </v-simple-table>
  <div class="text-h5 mt-16">資料庫</div>
  <div v-for="(time, i) in timeList" :key="i" class="mt-3">
    <div class="text-h6">{{time.datetime}}</div>
    <v-simple-table dense   >
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-left">小朋友稱呼</th>
            <th class="text-left">家長LINE稱呼</th>
            <th class="text-left">家長手機</th>
            <th class="text-left">報名時間</th>
            <th class="text-left">備註</th>
            <th class="text-left">動作</th>
          </tr>
        </thead>
        <tbody  v-if="!isLoading">
          <tr v-for="(e,i) in time.orderList" :key="'time-'+i">
            <td>{{ e.child_name }}</td>
            <td>{{ e.parent_line }}</td>
            <td>{{ e.phone }}</td>
            <td>{{ e.created_at }}</td>
            <td>{{ e.note }}</td>
            <td>
              <v-tooltip top>
                <template v-slot:activator="{  on, attrs }">
                  <v-btn color="primary" icon @click="deleteItem(e.child_id, time.time_id)" v-bind="attrs" v-on="on">
                    <v-icon >mdi-delete</v-icon>
                  </v-btn>
                </template>
                <span>刪除此小朋友</span>
              </v-tooltip>
              <!-- <v-tooltip top>
                <template v-slot:activator="{ on, attrs}">
                  <v-btn color="red" icon @click="deleteOrder(e.order_id)" v-bind="attrs" v-on="on">
                    <v-icon >mdi-delete</v-icon>
                  </v-btn>
                </template>
                <span>刪除相關訂單</span>
              </v-tooltip> -->
            </td>

          </tr>
        </tbody>
      </template>
    </v-simple-table>

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
const mapWeek = ['日', '一', '二', '三', '四', '五', '六']
export default {
  name: 'SessionDetail',

  data: () => ({
    session_id: '',
    name: '',
    type: '',
    year_month: '',
    image: '',
    text: '',
    min: 0,
    max: 0,
    timeList: [],

    isLoading: true

  }),
  async created () {
    await this.load()
  },
  methods: {
    async deleteItem (childId, timeId) {
      const r = await this.$fire({
        title: '確定刪除此小朋友？',
        text: '',
        type: 'warning',
        confirmButtonText: '確認',
        showCancelButton: true
      })
      if (r.value === true) {
        try {
          const res = await axios.post('http://api.funplanet.tw/deleteOrderByChildId', {
            child_id: childId,
            time_id: timeId
          })
          if (res.status === 200) {
            location.reload()
          }
        } catch (err) {
          console.log('err', err)
        }
      }
    },
    // async deleteOrder (orderId) {
    //   const r = await this.$fire({
    //     title: '確定刪除此小朋友的同一筆訂單？',
    //     text: '',
    //     type: 'warning',
    //     confirmButtonText: '確認',
    //     showCancelButton: true
    //   })
    //   if (r.value === true) {
    //     try {
    //       const res = await axios.post('http://api.funplanet.tw/deleteOrderByOrderId', {
    //         order_id: orderId
    //       })
    //       if (res.status === 200) {
    //         location.reload()
    //       }
    //     } catch (err) {
    //       console.log('err', err)
    //     }
    //   }
    // },
    async load () {
      this.isLoading = true
      this.session_id = this.$route.params.s_id

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
          return {
            ...e,
            datetime: `${obj.format('MM/DD')}(${mapWeek[obj.day()]}) ${obj.format('HH:mm')}`

          }
        })
        for (let i = 0; i < this.timeList.length; i++) {
          await this.setOrderByTimeId(this.timeList[i].time_id, i)
        }
      } catch (err) {
        console.log('err', err)
        this.$toast.warning('抓資料錯誤')
      } finally {
        this.isLoading = false
      }
    },
    async setOrderByTimeId (timeId, idx) {
      try {
        const res = await axios.post('http://api.funplanet.tw/getOrderByTimeId', {
          time_id: timeId
        })
        this.timeList[idx].orderList = res.data
      } catch (err) {
        console.log('err', err)
        this.$toast.warning('設定時段失敗')
      } finally {
      }
    }

  }
}
</script>
