<template>
  <div>
    <h2>BABA有存款: {{money}}</h2>
    <button @click="borrowFromXm">找小明借钱100</button><br>
    <button @click="borrowFromXh">找小红借钱150</button><br>
    <button @click="borrowFromAll">找所有孩子借钱200</button><br>
    
    <br>
    <Son ref='son'/>

    <br>
    <Daughter ref='daughter'/>
  </div>
</template>

<script>
import Son from './Son'
import Daughter from './Daughter'

export default {
  name: 'ChildrenParentTest',
  data () {
    return {
      money: 1000
    }
  },

  methods: {
    borrowFromXm() {
      this.money += 100;
      this.$refs.son.money -= 100;
    },
    borrowFromXh() {
      this.money += 150;
      this.$refs.daughter.money -= 150;
    },
    borrowFromAll() {
      this.money += 200 * 2;
      // this.$children.money -= 200;
      // $children 所有直接子组件对象组成的数组
      this.$children.forEach(x => x.money -= 200);
    },

  },

  components: {
    Son,
    Daughter
  }
}
</script>

<style>

</style>
