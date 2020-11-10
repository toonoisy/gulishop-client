#### 0. 购物车点击结算直接跳转到交易页面

#### 1. 基本配置

- 搬静态组件
- 配路由
- 接口请求函数

```js
// 请求创建订单的交易信息
export const reqTradeInfo = () => {
  return Ajax({
    url: '/order/auth/trade',
    method: 'GET',
  });
}

// 请求创建订单
export const reqSubmitOrder = (tradeNo, tradeInfo) => {
  return Ajax({
    url: `/order/auth/submitOrder?tradeNo=${tradeNo}`, // tradeNo 交易编号
    method: 'POST',
    data: tradeInfo, 
  });
}
```

- vuex编码
  - 新建 `@/store/trade.js`

```js
import {reqTradeInfo, } from '@/api';

const state = {
  tradeInfo: {},
};
const mutations = {
  RECEIVETRADEINFO(state, tradeInfo) {
    state.tradeInfo = tradeInfo;
  }
};
const actions = {
  async getTradeInfo({commit}) {
    const result = await reqTradeInfo();
    if (result.code === 200) {
      commit('RECEIVETRADEINFO', result.data);
    }
  }
};
const getters = {};

export default {
  state,
  mutations,
  actions,
  getters,
};
```

- 组件内发请求

```js
mounted() {
  this.getTradeInfo();
},
methods: {
  getTradeInfo() {
    this.$store.dispatch("getTradeInfo");
  },
  ...
}
```

#### 2. 数据展示

- 把较复杂的属性先计算出来

```js
	import { mapState } from "vuex";
  computed: {
    ...mapState({
      tradeInfo: (state) => state.trade.tradeInfo,
    }),
    detailArrayList() {
      return this.tradeInfo.detailArrayList || []; // 选购商品列表
    },
    userAddressList() {
      return this.tradeInfo.userAddressList || []; // 用户地址列表
    },
  },
```

#### 3. 点击切换默认地址

- 根据 isDefault 属性值切换 selected 类

- click回调修改 isDefault 属性值

```html
<div class="address clearFix" v-for="address in userAddressList" :key="address.id">
  <span class="username" :class="{selected: address.isDefault === '1'}">{{address.consignee}}</span>
  <p @click="changeDefault(address)">
    <span class="s1">{{address.userAddress}}</span>
    <span class="s2">{{address.phoneNum}}</span>
    <span class="s3" v-if="address.isDefault === '1'">默认地址</span>
  </p>
</div>
```

```js
changeDefault(address) {
  this.userAddressList.forEach((item) => (item.isDefault = "0"));
  address.isDefault = "1";
},
```

#### 4. 寄送地址要根据默认地址显示

- 把默认地址计算出来

```js
defaultAddress() {
  return this.userAddressList.find(item => item.isDefault === '1') || {};
},
```

#### 5. 订单件数

- 注意观察后台返回的 totalNum 是商品样数，并非总共件数，要计算下

```js
totalNum() {
  return this.detailArrayList.reduce((acc, cur) => {
    acc += cur.skuNum;
    return acc
  }, 0)
}
```

#### 6. 从订单交易页面提交订单跳转支付页面的逻辑

- 点击提交订单向后台发请求，成功后要把返回的 orderId 作为query参数携带在路由上跳转到支付页面
- orderId 只是为了传递给下一个页面，没必要存进vuex，在 `main.js` 中引入配置一下，直接调用请求函数发请求即可

```js
import * as API from '@/api';

new Vue({
  beforeCreate() {
    Vue.prototype.$bus = this; // 配置全局事件总线
    Vue.prototype.$API = API; // 让所有组件对象都能用API对象
    // （并不是配事件总线，因为它没法使用$on和$emit）
  },
  ...
}).$mount('#app');
```

```js
async submitOrder() {
  //先收集请求需要的参数
  let tradeNo = this.tradeInfo.tradeNo;
  let tradeInfo = {
    consignee: this.defaultAddress.consignee,   //用户名
    consigneeTel: this.defaultAddress.phoneNum,   //用户联系电话
    deliveryAddress: this.defaultAddress.userAddress, //用户地址
    paymentWay: "ONLINE",                    //支付方式
    orderComment: this.msg,              //用户的v-model留言
    orderDetailList: this.detailArrayList    //交易信息当中的商品详情
  };

  //发请求，创建订单
  const result = await this.$API.reqSubmitOrder(tradeNo, tradeInfo);
  if (result.code === 200) {
    //返回数据（订单编号）
    //携带数据跳转支付页面
    alert('订单创建成功，自动跳转支付页面')
    this.$router.push('/pay?orderId='+result.data)
  } else {
    alert("创建订单失败");
  }
},
```