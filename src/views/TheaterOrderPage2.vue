<template>
  <div class="TheaterOrderPage2">
    <div>你總共買了 ：</div>

    <div v-for="(e, i) in showSelectedArea" :key="e">
      {{ e.area_name }} * {{ e.num_seats }} 張
    </div>
    <div>總金額： NT$ {{totalPrice}}</div>

    <div class="mt-2">聯絡人： {{buyer_name}}</div>
    <div>聯絡電話： {{phone}}</div>
    <br />
    <pre>
⬇️匯款資訊如下⬇️
銀行：國泰世華（013）
帳號：699511096093
<div>金額：NT${{totalPrice}}</div>

匯款後請連同此頁面截圖，
回覆末五碼至<span style="color: #4CAF50; font-weight: 800;">LINE 回傳</span>，以便我們對帳，
<b style="color: red;">若訂購後隔天晚上11:00無收到回傳資料，即會刪除此次報名資料。</b>

⬇️ FUN星球官方Line連結
<a href="https://lin.ee/lpYPloz" target="_blank">https://lin.ee/lpYPloz</a>
  </pre>
<br />
<div>⚠️重覆報名、報名錯誤，皆需由官方LINE小編為您刪除整筆資料。</div>
  </div>
</template>

<script>
export default {
  props: {
    selected_area: Array,
    areaList: Array,
    phone: String,
    buyer_name: String,
    phone: String
  },
  computed: {
    totalPrice () {
      let total = 0
      this.selected_area.map((e, idx)=>{
        total +=e.num_seats* this.areaList[idx].price
      })
      return total
    },
    showSelectedArea(){
      return this.selected_area.filter(e=> e.num_seats > 0);
    }
  },

}
</script>

<style lang="scss" scoped>
.TheaterOrderPage2{
  height: calc(100vh - 150px);
}

</style>