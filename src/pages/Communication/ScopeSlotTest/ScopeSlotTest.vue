<template>
  <div>
    <h2>效果一: 显示TODO列表时, 已完成的TODO为绿色</h2>
    <!-- 
      作用域插槽：子向父传递动态数据，父向子传递带动态数据的标签
      数据在子组件展示，但结构由父组件决定
     -->
    <List :todos='todos'>
      <template slot-scope="slotProps">
        <span :style="{color: slotProps.todo.isComplete? 'hotpink' : 'black'}">{{slotProps.todo.text}}</span>
      </template>
    </List>
    
    <hr>

    <h2>效果二: 显示TODO列表时, 带序号, TODO的颜色为蓝绿搭配</h2>
    <List :todos='todos'>
      <template slot-scope="slotProps">
        <span :style="{color: slotProps.index % 2 === 1? 'blue' : 'green'}">
          {{slotProps.index + 1}} {{slotProps.todo.text}}
        </span>
      </template>
    </List>
  </div>
</template>

<script type="text/ecmascript-6">
  import List from './List'
  export default {
    name: 'ScopeSlotTest',
    data () {
      return {
        todos: [
          {id: 1, text: 'AAA', isComplete: false},
          {id: 2, text: 'BBB', isComplete: true},
          {id: 3, text: 'CCC', isComplete: false},
          {id: 4, text: 'DDD', isComplete: false},
        ]
      }
    },

    components: {
      List
    }
  }
</script>
