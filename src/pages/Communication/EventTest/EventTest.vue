<template>
  <div>
    <h1 @click="test1($event, 333)">EventTest组件</h1>
    <!-- 
      绑定给html元素的事件是dom原生事件，由浏览器调用
      绑定给vue组件的事件是自定义事件，要自己去调用才会触发
      自定义事件名称可以和原生事件名称一样
      要想给vue组件绑定原生事件需要在事件名称后加.native修饰符
    -->
    <Event1 @click.native='test2'></Event1>
    <Event2 @click="test3" @xxx='test4'></Event2>
  </div>
</template>

<script type="text/ecmascript-6">
  import Event1 from './Event1.vue'
  import Event2 from './Event2.vue'

  export default {
    name: 'EventTest',

    components: {
      Event1,
      Event2,
    },

    methods: {
      test1(event, num) {
        console.log(event, num);
      },
      test2(ev) {
        alert(ev.target.innerHTML);
      },
      test3() {
        alert(111);
      },
      test4(event) {
        console.log(event);
      },
    }
  }
</script>
