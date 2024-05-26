<template>
  <div class="TheaterOrderPage2">
    <div>你總共買了 ：</div>

    <div v-for="(e, i) in showSelectedArea" :key="e">
      {{ e.area_name }} * {{ e.num_seats }} 張
    </div>
    <div>總金額： NT$ {{totalPrice}}</div>

    <div>姓名： {{buyer_name}}</div>
    <div>聯絡電話： {{phone}}</div>

    <div>
    <br /><br />
    請將以上資訊複製後，<br />
    用<span style="color: #4CAF50; font-weight: 800;">LINE 回傳</span>給我們，<br />
    以便確認能夠聯繫到您，<br />

      ⬇️ FUN星球官方Line連結<br />
      <a href="https://lin.ee/lpYPloz" target="_blank">https://lin.ee/lpYPloz</a>
      <br /><br />

    </div>
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