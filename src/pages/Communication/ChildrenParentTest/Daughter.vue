<template>
  <div style="background: #ccc; height: 50px;">
    <h3>女儿小红: 有存款: {{money}}</h3>
    <button @click="give(100)">给BABA钱: 100</button>
  </div>
</template>

<script>
import {myMixin} from './myMixins';
export default {
  name: 'Daughter',
  mixins: [myMixin],
  data () {
    return {
      money: 20000
    }
  },

  // methods: {
  //   give() {
  //     this.money -= 100;
  //     // $parent 父组件对象
  //     this.$parent.money += 100;
  //   }
  // }
}
</script>
