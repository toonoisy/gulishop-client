<template>
  <ul>
    <li v-for="(todo, index) in todos" :key="todo.id">
      <!-- 遍历展示的同时把数据传给父组件 -->
      <slot :todo='todo' :index='index'>
        {{todo.text}}
      </slot>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'List',
  props: {
    todos: Array
  }
}
</script>