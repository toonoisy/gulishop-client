// mixin 实现vue组件的js代码复用
export const myMixin = {
  methods: {
    give(amount) {
      this.money -= amount;
      // $parent 父组件对象
      this.$parent.money += amount;
    }
  }

}