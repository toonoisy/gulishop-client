<template>
  <div style="background: #ccc; height: 50px;">
    <h3>儿子小明: 有存款: {{money}}</h3>
    <button @click="give(50)">给BABA钱: 50</button>
  </div>
</template>

<script>
import {myMixin} from './myMixins';
export default {
  name: 'Son',
  mixins: [myMixin],
  data () {
    return {
      money: 30000
    }
  },

  // methods: {
  //   give() {
  //     this.money -= 50;
  //     this.$parent.money += 50;
  //   }
  // }
}
</script>
