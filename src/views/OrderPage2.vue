<template>
<div>
<a href="https://lin.ee/lpYPloz">https://lin.ee/lpYPloz</a>
<p>
最後請點擊上方連結，<br />
加入FUN星球官方LINE，<br />
回傳「聯絡電話與小朋友稱呼」給我們，<br />
<code>
{{ phone}}，{{child_list.join(',')}}<br />
家長名稱：{{parent_line}}
</code><br/>
例：「0912345678，喬治」<br />
以便確認能夠聯繫到您🙏<br /><br />

若電話與Line都未能聯繫，<br />
會刪除您該次的報名，<br />
後續的異動與提醒會優先透過Line進行通知，<br />
緊急狀況才會經由電話聯絡。
</p>
<v-btn color="primary" @click="submit">
  完成
</v-btn>
</div>
</template>

<script>
export default {
  props: {
    child_list: Array,
    parent_line: String,
    phone: String
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
