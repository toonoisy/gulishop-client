#### 基本配置

- 搬静态组件
- 配路由（有两个二级路由）
- 接口请求函数
- 组件内直接请求数据

#### 数据展示

- 合并单元格 ---> colspan / rowspan

```vue
<!-- 
后面这几个单元格 判断如果是第一行就显示对应的内容
如果不是第一行，就不用显示了，因为一会我们要合并到第一行
-->

<template v-if="index === 0">
<!-- template这个标签不会影响我们的页面结构和css样式，可以把想要统一处理的元素用它包起来 -->
<td
    :rowspan="order.orderDetailList.length"
    width="8%"
    class="center"
    >{{order.consignee}}</td>
<td :rowspan="order.orderDetailList.length" width="13%" class="center">
  <ul class="unstyled">
    <li>总金额¥{{order.totalAmount}}</li>
    <li>{{order.paymentWay === "ONLINE"? '在线支付' : '货到付款'}}</li>
  </ul>
  </td>
<td :rowspan="order.orderDetailList.length" width="8%" class="center">
  <a href="#" class="btn">{{order.orderStatusName}}</a>
  </td>
<td :rowspan="order.orderDetailList.length" width="13%" class="center">
  <ul class="unstyled">
    <li>
      <a href="mycomment.html" target="_blank">评价|晒单</a>
  </li>
  </ul>
  </td>
</template>

```



#### element-ui分页器