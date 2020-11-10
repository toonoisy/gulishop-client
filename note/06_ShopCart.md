#### 1. 基本配置

- 搬静态组件
- 调整结构样式
  - 调整css让各个项目对齐：删除第三项，剩余修改比例15  35  10 17 10 13
- 配路由
- 接口请求函数
- vuex编码
- 组件发请求，computed计算从vuex中获取数据

#### 2. 配合用户临时身份标识userTempId的使用获取购物车列表数据

- 如果不携带临时身份标识，从 `AddCartSuccess` 跳转过来发送请求是获取不到数据的（userTempId没值，没法在数据库表里对应找数据）

- 使用一个包 <a href='https://github.com/uuidjs/uuid'>`uuid`</a> 创建唯一的 `userTempId` （不用下载，已经在依赖里了）

  - 浏览器端创建，应用一打开就创建保存在`localStorage`
  - 创建一个工具函数模块，定义一个函数用来创建/取
    - `@/utils/userabout.js`

  ```js
  import { v4 as uuidv4 } from 'uuid';
  
  export function getUserTempId() {
    let userTempId = localStorage.getItem('USERTEMPID_KEY'); // 有就直接取
    if (!userTempId) { // 没有就创建一个存起来
      userTempId = uuidv4();
      localStorage.setItem('USERTEMPID_KEY', userTempId);
    }
    return userTempId;
  }
  ```
  - 在state里也存一份，为了方便获取，提高效率
    - `@/store/user.js`

  ```js
  import {getUserTempId} from '@/utils/userabout';
  
  const state = {
   userTempId: getUserTempId(), // 存给ajax用
  };
  const mutations = {};
  const actions = {};
  const getters = {};
  
  export default {
    state,
    mutations,
    actions,
    getters,
  };
  ```
    - 每次请求都携带上，尽量不要修改
      - `@/ajax/Ajax.js`

  ```js
  instance.interceptors.request.use(config => {
    NProgress.start();
    // 处理config：请求报文/添加额外功能（进度条）
    let userTempId = store.state.user.userTempId; // 把userTempId添加到每次请求的请求头中
    config.headers.userTempId = userTempId;
    return config; // 返回这个config再继续请求，发送对报文信息就是新的config对象
  });
  ```

#### 3. 购物车动态数据的展示

- 已选件数和总价都要使用 `reduce` 统计得出（reduce各种统计都可以用）

```vue
<template>
  <div class="cart">
    <h4>全部商品</h4>
    <div class="cart-main">
      <div class="cart-th">
        <div class="cart-th1">全部</div>
        <div class="cart-th2">商品</div>
        <div class="cart-th3">单价（元）</div>
        <div class="cart-th4">数量</div>
        <div class="cart-th5">小计（元）</div>
        <div class="cart-th6">操作</div>
      </div>
      <div class="cart-body">
        <ul class="cart-list" v-for="item in shopCartList" :key="item.id">
          <li class="cart-list-con1">
            <input type="checkbox" name="chk_list" :checked="item.isChecked === 1">
          </li>
          <li class="cart-list-con2">
            <img :src="item.imgUrl">
            <div class="item-msg">{{item.skuName}}</div>
          </li>
          <li class="cart-list-con4">
            <span class="price">{{item.cartPrice}}</span>
          </li>
          <li class="cart-list-con5">
            <a href="javascript:void(0)" class="mins" @click="updateItemNum(item, -1)">-</a>
            <input autocomplete="off" type="text" :value="item.skuNum" minnum="1" class="itxt">
            <a href="javascript:void(0)" class="plus">+</a>
          </li>
          <li class="cart-list-con6">
            <span class="sum">{{item.cartPrice * item.skuNum}}</span>
          </li>
          <li class="cart-list-con7">
            <a href="javascript:;" class="sindelet">删除</a>
            <br>
            <a href="#none">移到收藏</a>
          </li>
        </ul>
      </div>
    </div>
    <div class="cart-tool">
      <div class="select-all">
        <input class="chooseAll" type="checkbox" v-model="isCheckAll">
        <span>全选</span>
      </div>
      <div class="option">
        <a href="javascript:;">删除选中的商品</a>
        <a href="#none">移到我的关注</a>
        <a href="#none">清除下柜商品</a>
      </div>
      <div class="money-box">
        <div class="chosed">已选择
          <span>{{checkedNum}} </span>件商品</div>
        <div class="sumprice">
          <em>总价（不含运费） ：</em>
          <i class="summoney">{{totalAmount}}</i>
        </div>
        <div class="sumbtn">
          <a class="sum-btn" href="###" target="_blank">结算</a>
        </div>
      </div>
    </div>
  </div>
</template>
```

```js
    computed: {
      ...mapState({
        shopCartList: state => state.shopcart.shopCartList,
      }),
      isCheckAll: {
        get() {
          return this.shopCartList.every(item => item.isChecked === 1) && this.shopCartList.length > 0; // 所有商品都被选中且列表长度不能为0，返回true
        },
        set(val) {
          
        },
      },
      // 统计选中商品的数量
      // 统计用reduce (回调，初始值)
      checkedNum() {
        return this.shopCartList.reduce((acc, cur, index) => {
          if (cur.isChecked === 1) {
            acc += cur.skuNum;
          }
          return acc;
        }, 0)
      },
      totalAmount() {
        return this.shopCartList.reduce((acc, cur, index) => {
          if (cur.isChecked === 1) {
            acc += cur.skuNum * cur.skuPrice;
          }
          return acc;
        }, 0)
      }
    },
```

#### 4. 更新数量的逻辑

- 更新数量需要发请求并等后台返回状态结果
  - 使用之前定义过的请求函数 `reqAddOrUpdateCart` ，和对应vuex编码
- 最小数量为1，按 - 要做修正
- 用户输入数量后，最终文本框要显示原先数量+输入数量
  - 要给我文本框绑定一个change事件，传值给回调
    - change: 一定要有数据改变才触发，blur: 一旦失去焦点就触发
    - `event.target.value` 本身是个字符串，要注意转换成数字

```html
<li class="cart-list-con5">
  <a href="javascript:void(0)" class="mins" @click="updateItemNum(item, -1)">-</a>
  <input autocomplete="off" type="text" :value="item.skuNum" minnum="1" class="itxt" @change="updateItemNum(item, +$event.target.value)">
  <a href="javascript:void(0)" class="plus" @click="updateItemNum(item, 1)">+</a>
</li>
```

```js
// 更新商品数量
// modNum 要更新的数量（+1/-1/输入值），modNum和原数量相加至少得是1，如果小于1要做修正
async updateItemNum(item, modNum) {
  if (item.skuNum + modNum < 1) {
    modNum = 1 - item.skuNum;
  };
  // 要根据结果去做不同处理，所以用async...await + try...catch
  try {
    // 发请求去处理数量，返回成功后重新请求数据
    await this.$store.dispatch('addOrUpdateCart', {skuId:item.skuId, skuNum:modNum});
    this.getShopCartList();
  } catch (error) {
    alert(error.message);
  }
},
```

#### 5. 修改购物车单个的选中状态

- 处理checkbox交互两种方案：
  - v-model + getter/setter
  - :checked + @click
    - v-model本质也是:value+@input
  - 我们全选用了前者，单个用了后者，默认选中

```html
<li class="cart-list-con1">
  <input type="checkbox" name="chk_list" :checked="item.isChecked === 1" @click="updateOne(item)">
</li>
```

```js
// 请求更新单个状态
export const reqUpdateIsChecked = (skuId, isChecked) => {
  return Ajax({
    url: `/cart/checkCart/${skuId}/${isChecked}`,
    method: 'GET',
  });
}
```

```js
async updateIsChecked(context, {skuId, isChecked}) {
  const result = await reqUpdateIsChecked(skuId, isChecked);
  if(result.code === 200) {
    return 'ok';
  } else {
    return Promise.reject(new Error('failed')); // 函数return的不是这个promise，而是一个新的promise，如果是失败状态，原因是这个promise的原因；失败原因会发生失败穿透
  }
}, 
```

```js
async updateOne(item) {
  try {
    await this.$store.dispatch('updateIsChecked', {skuId:item.skuId, isChecked: +!item.isChecked}); // 注意isChecked要传的值是数字0/1，取反会变成布尔，要再用一元+转成数字
    this.getShopCartList();
  } catch (error) {
    alert(error.message);
  }
},
```

#### 6. 修改购物车多个的状态（全选）

- :checked + @click 方案

- 只有更新单个状态的接口，所以只能逐个地发请求处理
- 自己定义一个请求更新全部状态的action，传参isChecked值，然后在里面逐个dispatch请求更新单个的action，这样setter中只要dispatch当前这个action就好了（曲线救国）
  - dispatch不一定是用在组件里，也可以在一个action中dispatch另一个action
  - 本身选中状态跟传过来要修改的一样，就不发请求
  - 如果有不一样的，就需要发请求，而且每一个请求都成功，才算成功 
    - 善用 `Promise.all`

```js
// 请求更新全部选中状态（全选全不选）
async updateAllIsChecked({state, dispatch}, isChecked) { 
  let promises = [];
  state.shopCartList.forEach(item => {
    // 本身选中状态跟传过来要修改的一样，就不发请求
    if (item.isChecked === isChecked) return;
    // 如果有不一样的，就需要发请求，而且每一个请求都成功，才算成功 
    let promise = dispatch('updateIsChecked', {skuId:item.skuId, isChecked});
    promises.push(promise);
  });
  /* 
      处理多个promise的数组，如果都成功那么返回的promise才成功，结果是每个成功的结果数组,
      如果失败，返回第一个失败的promise的reason
  */
  return Promise.all(promises); // 函数返回的promise状态和这里的状态是一致的（注意不是同一个promise）
},
```

```js
      isCheckAll: {
        get() {
          return this.shopCartList.every(item => item.isChecked === 1) && this.shopCartList.length > 0; // 所有商品都被选中且列表长度不能为0，返回true
        },
        async set(val) {
          // 一旦状态有变，要让所有选项都修改成最新的val状态（true or false）
          try {
            // checkbox默认传true/false，我们要和1/0对应
            const result = await this.$store.dispatch('updateAllIsChecked', val ? 1: 0);
            console.log(result);
            this.getShopCartList();
          } catch (error) {
            alert(error.message);
          }
        },
      },
```

#### 7. 购物车的删除操作（单个和多个）

- 删除多个的逻辑和全选类似，也是自定义一个删除多个的action，然后逐个请求删除单个

```js
// 删除一个购物车数据
export const reqDeleteItem = (skuId) => {
  return Ajax({
    url: `/cart/deleteCart/${skuId}`,
    method: 'DELETE',
  });
}
```

```js
  // 请求删除单个商品
  async deleteItem({commit}, skuId) {
    const result = await reqDeleteItem(skuId);
    if (result.code === 200) {
      return 'ok';
    } else {
      return Promise.reject(new Error('failed'));
    };
  },

  // 请求删除全部商品
  async deleteAllChecked({state, dispatch}) {
    // 遍历每一个选项，如果未被选中就不做更改，选中则触发deleteItem将其删掉
    let promises = [];
    state.shopCartList.forEach(item => {
      if (item.isChecked === 0) return;
      let promise = dispatch('deleteItem', item.skuId);
      promises.push(promise);
    });
    return Promise.all(promises);
  },
```

```js
      async deleteOne(item) {
        try {
          await this.$store.dispatch('deleteItem', item.skuId)
          this.getShopCartList();
        } catch (error) {
          alert(error.message);
        }
      },
      async deleteAllChecked() {
        try {
          await this.$store.dispatch('deleteAllChecked');
          this.getShopCartList();
        } catch (error) {
          alert(error.message);
        }
      }
```

