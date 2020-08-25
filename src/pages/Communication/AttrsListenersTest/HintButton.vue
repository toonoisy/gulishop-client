<template>
  <a href='javascript:;' :title='title'>
    <!-- v-bind='$attrs' 把父组件传过来的除了props，class, style以外的属性一次性绑定上 -->
    <!-- v-on='$listeners' 把父组件传过来的自定义事件一次性绑定上 -->
    <el-button v-bind='$attrs' v-on='$listeners'></el-button>
  </a>
</template>

<script>
export default {
  name: 'HintButton',
  props: ['title']
  
}
</script>

<style lang="less" scoped>

</style>