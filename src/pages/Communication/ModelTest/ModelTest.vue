<template>
  <div>
    <h2>深入v-model</h2>
    <!-- v-model本质是动态value属性和input事件监听的语法糖 -->
    <!-- <input type="text" :value="msg1" @input="msg1 = $event.target.value"> -->
    <input type="text" v-model="msg1">
    <br>
    <span>{{msg1}}</span>
    <br>
    <!-- 
      给组件标签(封装好的带表单项的复用性组件)使用v-model原理等同于如下： 
      父组件props传递一个value属性，并绑定一个自定义事件input
      带表单项的子组件要接收这个value，在input事件中触发这个自定义input并传递一个新值
    -->
    <!-- <CustomInput :value='msg2' @input='msg2 = $event'></CustomInput> -->
    <CustomInput v-model="msg2"></CustomInput>
    <span>我在父组件显示：{{msg2}}</span>
    <br>
  </div>
</template>

<script type="text/ecmascript-6">
  import CustomInput from './CustomInput.vue'
  export default {
    name: 'ModelTest',
    data() {
      return {
        msg1: '我好困',
        msg2: '我也好困',
      }
    },
    components: {
      CustomInput
    }
  }
</script>
