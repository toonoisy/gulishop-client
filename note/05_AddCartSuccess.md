#### 1. 基本配置

- 搬静态组件
- 修复样式
  - 使用了图标字体（在reset.css中import引入的），所以要把图标字体文件夹和css文件也搬过来放在 `public` 下

- 配置路由

```js
import AddCartSuccess from '@/pages/AddCartSuccess';
export default [
  ...
  {
    path: '/addcartsuccess', // 前台路由，切换组件
      component: AddCartSuccess,
  },
];
```

- 接口请求函数

```js
//请求添加或者修改购物车（或者修改购物车数量）
export const reqAddOrUpdateCart = (skuId, skuNum) => {
  return Ajax({
    // 请求路径
    url: `/cart/addToCart/${ skuId }/${ skuNum }`, // params是路径的一部分，query不是
    method: 'POST',
    // params: query, // 使用配置对象配置query
    // data: params, // 使用配置对象配置params
  })
}
```

- vuex编码
  - 新建 `@/store/shopcart.js`
  - 不要忘记在 `index` 中引入
  - 请求有成功失败，失败时不要返回一个正常值，而是返回一个携带error的失败的promise，这样我们在组件中请求数据的时候就可以处理

```js
import { reqAddOrUpdateCart, } from "@/api";

const state = {
  shopCartList: [],
};
const mutations = {
  RECEIVESHOPCARTLIST(state, shopCartList) {
    state.shopCartList = shopCartList;
  }
};

// reqAddOrUpdateCart返回的结果没有data，写一个异步请求的action就好
const actions = {
  // context 占位的
  // async返回的一定是一个promise，它的状态由async的return值决定
  async addOrUpdateCart(context, {skuId, skuNum}) {
    const result = await reqAddOrUpdateCart(skuId, skuNum);
    if(result.code === 200) {
      return 'ok';
    } else {
      // 不能返回一个正常值
      return Promise.reject(new Error('failed'));
      // throw Error('failed');
    }
  },
};
const getters = {};

export default {
  state,
  mutations,
  actions,
  getters,
};
```

#### 2. Detail组件发请求（点击添加购物车）

- 在 `Detail`  中点击添加购物车后，不是直接跳转，而是先发请求给后台，后台返回成功数据后才手动push到添加成功页面
- `addOrUpdateCart` 是一个async函数，返回的必定是一个promise对象，我们上面处理过让它请求失败返回失败的promise，这边回调里就可以try...catch一下这个promise的结果，从而作出相应的处理
- push的路径需要带一个query参数 `skuNum`
  - 小的数据通过路由传，大的用存储方案解决
-  `AddCartSuccess` 需要用到商品信息做数据展示，所以我们要使用 `sessionStorage` 保存下数据
  - 注意要先主动把数据转成json字符串，免得被自动转普通字符串变成{object, Object}

```html
<a href="javascript:" @click="addShopCart">加入购物车</a>
```

```js
methods: {
  ...
  async addShopCart() {
    // 先发请求给后台
    // 后台返回添加结果
    try {
      await this.$store.dispatch('addOrUpdateCart', {skuId:this.skuInfo.id, skuNum:this.skuNum}); 
      alert('添加购物车成功，页面将自动跳转');
      // 传递大的数据，用存储方案解决，不要用路由传递
      // 先主动转成json字符串，免得被转字符串变成{object, object}
      sessionStorage.setItem('SKUINFO_KEY', JSON.stringify(this.skuInfo));
      // 通过路由传商品数量（小的数据）
      this.$router.push(`/addCartSuccess?skuNum=${this.skuNum}`);
    } catch (err) {
      alert(err.message);
    }
  },
},
```

#### 3. 数据展示

- 从 `sessionStorage` 中取数据出来

```vue
<template>
  <div class="cart-complete-wrap">
    <div class="cart-complete">
      <h3><i class="sui-icon icon-pc-right"></i>商品已成功加入购物车！</h3>
      <div class="goods">
        <div class="left-good">
          <div class="left-pic">
            <img :src="skuInfo.skuDefaultImg">
          </div>
          <div class="right-info">
            <p class="title">{{skuInfo.skuName}}</p>
            <p class="attr">颜色：WFZ5099IH/5L钛金釜内胆 数量：{{$route.query.skuNum}}</p>
          </div>
        </div>
        <div class="right-gocart">
          <router-link class="sui-btn btn-xlarge" :to="`/detail/${skuInfo.id}`">查看商品详情</router-link>
          <router-link to="/shopcart">去购物车结算</router-link>
          <!-- <a href="javascript:" class="sui-btn btn-xlarge">查看商品详情</a>
          <a href="javascript:" >去购物车结算 > </a> -->
        </div>
      </div>
    </div>
  </div>
</template>
```

```vue
<script>
  export default {
    name: 'AddCartSuccess',
    data() {
      return {
        skuInfo: JSON.parse(sessionStorage.getItem('SKUINFO_KEY') || {}), // 获取不存在的key返回null，所以{}备胎
      }
    }
  }
</script>
```

