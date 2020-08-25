<template>
  <div>
    <h2>自定义带Hover提示的按钮(HintButton)</h2>
    <el-button type='primary' icon='el-icon-plus' size='mini' round @click="test"></el-button>
    <el-button type='danger' icon='el-icon-delete' size='mini' round></el-button>
    <HintButton type='primary' icon='el-icon-plus' size='mini' round title='新增'></HintButton>
    <HintButton type='danger' icon='el-icon-delete' size='mini' round title='删除'></HintButton>
  </div>
</template>

<script type="text/ecmascript-6">
  import HintButton from './HintButton';
  export default {
    name: 'AttrsListenersTest',

    methods: {
      test() {
        alert(111);
      }
    },
    components: {
      HintButton,
    }
  }
</script>
