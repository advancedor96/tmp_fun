<template>
<v-container>
  <div class="text-h4">最後一步！</div>
<div class="d-flex justify-center">
  <img width="250" height="250" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPoAAAD6AQAAAACgl2eQAAABvUlEQVR4Xu2Y3W3DMAyECWiAjOTVNZIHEMDej5o6QZG+9gATTiLTXx+upI5Kqj/HrPfMW9yA4wYcN+AQMAvxmEOJVceqWkz5WQyA13pMXPXAosd54N35IIC6kJfGZhhOBGafxMQEA+MsXMyTzANaLWd1fR7F9tv5IMDbf12v3/zhfwM7kPHGkZvtSALkWqUCsesgUO2XBUAdHQybRTJpAvSBLIA7XZ0mvcovOXMUwM/BljuwADPkyS/VDAD41DJLFwGU7zyiAO53l2bxuIWFTOxnoEQA02Od1UGlAGOmoHCX/0MKgA9uGXgXcpz17WQOwC2zdEpZOpno0Lv/KgjgNERpeMpS73F9eETmAJMy2XLstKGuY73qKTMCkHEJG2w5rCVckQOg02RfPJa4avtpFMDS+HbQzbB3wO9kDsAyOV+yL5tAGrAHOl3LY70JsHBJwHS+9TUQkr81zijAQawp2YuZBlCU6oXG4+3yfHwZKAEAXtwvGvFNK3uXGQHofAKApywrhe5WpAFTG5969T49VtIA5TnfaWLDv79FAS11i/ZFT3a0Igjgvb/PMigTwq/FSgA+xQ04bsBxA46/gS/xzQSDURzQNAAAAABJRU5ErkJggg==" alt="">
</div>
 <br />
<div class="text-body" >
你報名的日期有：<br />
<ul>
  <li v-for="(e, i) in showSelectedTime" :key="i">
    {{e}}
  </li>
</ul>
你的聯絡電話為：
<ul>
  <li v-if="phone">{{phone}}</li>
</ul>
<br /><br />

請掃碼或點下方連結加入FUN星球官方LINE，並將以上兩個資訊複製回傳給我們，<br />
以便確認能夠聯繫到您🙏<br />
Line連結：<a href="https://lin.ee/lpYPloz" target="_blank">https://lin.ee/lpYPloz</a><br />

若電話與Line都未能聯繫，<br />
會刪除您該次的報名，<br />
後續的異動與提醒會優先透過Line進行通知，<br />
緊急狀況才會經由電話聯絡。

</div>

<div class="d-flex justify-center mt-5">
  <v-btn color="primary" @click="submit">點我看報名狀況</v-btn>
</div>
</v-container>
</template>

<script>
export default {
  props: {
    child_list: Array,
    parent_line: String,
    phone: String,
    selected_time: Array,
    timeList: Array
  },
  data: () => ({
    showSelectedTime: []
  }),
  created () {
    this.selected_time.forEach(timeId => {
      const idx = this.timeList.findIndex(t => t.time_id === timeId)
      if (idx !== -1) {
        this.showSelectedTime.push(this.timeList[idx].datetime)
      }
    })
  },
  methods: {
    submit () {
      this.$fire({ title: '報名成功', type: 'success' }).then(r => {
        location.reload()
      })
    }
  }

}
</script>

<style>

</style>
