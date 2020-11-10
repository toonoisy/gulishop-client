#### 1. 基本配置

- 搬静态组件

  - 是一个一级路由`@/pages/Detail`

- 在`Search`中把点击跳转详情页的a标签（商品图片，标题）替换成`router-link`

  - 需要携带params参数，即商品id

  ```vue
  <router-link :to="`/detail/${goods.id}`">
  ```

- 配置路由

  - `@/router/routes.js`

  ```js
    {
      path: '/detail/:skuId',
      component: Detail,
    },
  ```

  - `@/router/index.js` 
    - 配置滚动行为，让跳转的页面滚动到顶部

  ```js
  const router = new VueRouter({
  	...
    scrollBehavior (to, from, savedPosition) {
      return { x: 0, y: 0 }
    },
  });
  ```

#### 2. 动态展示准备工作

- 定义接口请求函数

```js
export const reqGoodsDetailInfo = (skuId) => {
  return Ajax({
    url: `/item/${skuId}`,
    method: 'GET',
  });
}
```

- vuex编码
  - 新建 `@/store/detail.js`
  - 要传商品id
  - 把内部复杂数据先计算出来

```js
import {reqGoodsDetailInfo} from '@/api';

const state = {
  goodsDetailInfo: {},
};
const mutations = {
  RECEIVEGOODSDETAILINFO(state, goodsDetailInfo) {
    state.goodsDetailInfo = goodsDetailInfo;
  }
};
const actions = {
  // 要传skuId
  async getGoodsDetailInfo({commit}, skuId) {
    const result = await reqGoodsDetailInfo(skuId);
    if (result.code === 200) {
      commit('RECEIVEGOODSDETAILINFO', result.data);
    }
  }
};
// 把内部复杂数据先计算出来
const getters = {
  categoryView(state) {
    return state.goodsDetailInfo.categoryView || {};
  },
  skuInfo(state) {
    return state.goodsDetailInfo.skuInfo || {};
  },
  spuSaleAttrList(state) {
    return state.goodsDetailInfo.spuSaleAttrList || [];
  },
};

export default {
  state,
  mutations,
  actions,
  getters,
};
```

- 组件内请求数据

```vue
<script>
import ImageList from "./ImageList/ImageList";
import Zoom from "./Zoom/Zoom";
import { mapGetters } from "vuex";

export default {
  name: "Detail",
  mounted() {
    this.getGoodsDetailInfo();
  },
  methods: {
    // 要传skuId
    getGoodsDetailInfo() {
      this.$store.dispatch("getGoodsDetailInfo", this.$route.params.skuId);
    },
  },
  computed: {
    ...mapGetters(["categoryView", "skuInfo", "spuSaleAttrList"]),
  },
  components: {
    ImageList,
    Zoom,
  },
};
</script>
```

#### 3. 左侧预览区

- 使用两个子组件实现：`ImageList` 缩略图区域，`Zoom` 预览图及放大镜区域

- 要实现的动态展示及功能

  - **两个组件的图片展示（假报错的处理）**

    - 请求是在父组件 `Detail` 中发的，数据要从父组件传`props` 过来

    ```html
    <div class="previewWrap">
      <!--放大镜效果-->
      <Zoom :imgList="imgList" />
      <!-- 小图列表 -->
      <ImageList :imgList="imgList" />
    </div>
    ```

    - 数据的传递和接收都需要计算时间，刚开始可能是空的，所以出现报错，等真正拿到后页面又正常渲染了
      - 解决：把较复杂的属性a.b先算出来

    ```js
    // 不提前算出来会出现a.b.c假报错
    computed: {
      ...mapGetters(["categoryView", "skuInfo", "spuSaleAttrList"]),
        imgList() {
        return this.skuInfo.skuImageList || [];
      },
    },
    ```

  - **点击 `ImageList` 的图片绑定 `active` 类**
    - 初始是下标为0也就是第一张图有 `active` 类，所以我们定义一个 `defaultIndex` 为0，再通过一个点击回调修改`defaultIndex` 为当前点击的图的下标，就可以通过判断 `index === defaultIndex` 来绑定 `active` 类了
  - **点击 `ImageList` 的图片 `Zoom` 图片跟着切换**
    - 在 `Zoom` 中也定义一个 `defaultIndex` 为0，用作当前显示图片的下标，为了方便我们直接把当前图片计算出来
    - 然后`Zoom`定义一个回调（接收数据）， 再`this.$bus.$on`绑定给总线，`ImageList` 在触发自己的修改下标回调时也同时`this.$bus.$emit`触发这个回调，并且把当前下标传过去修改`Zoom` 的 `defaultIndex`
    - `Zoom` 的 `defaultIndex` 被修改后，计算得到的当前图片自然也被更改
  - **`ImageList` 组件图片的轮播效果**
    - 依旧使用swiper实现
  - **放大镜**

- `@/pages/Detail/ImageList` 

```vue
<template>
  <div class="swiper-container" ref="imgList">
    <div class="swiper-wrapper">
      <div class="swiper-slide" v-for="(img, index) in imgList" :key="img.id">
        <img :src="img.imgUrl" :class="{active: index === defaultIndex}" @click="changeDefaultIndex(index)">
      </div>
    </div>
    <div class="swiper-button-next"></div>
    <div class="swiper-button-prev"></div>
  </div>
</template>
```

```vue
<script>
  import Swiper from 'swiper';
  export default {
    name: "ImageList",
    props: ['imgList'],
    // data, computed 都是响应属性
    data() {
      return {
        defaultIndex: 0,
      }
    },
    methods: {
      changeDefaultIndex(index) {
        this.defaultIndex = index; // 为了切换缩略图active类
        this.$bus.$emit('changeDefaultIndex', index);
      }
    },
    watch: {
      imgList: {
        immediate: true, // 即使数据不改变，也能让回调执行一次
        handler(newVal, oldVal) {
          this.$nextTick(() => {
            new Swiper (this.$refs.imgList, {
              // autoplay: true,
              slidesPerView : 5, // 每视图页
              slidesPerGroup : 5, // 每组
              loop: true, // 循环模式选项      
              navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
              },
            });
          })
        },
      },
    },
  }
</script>
```

- `@/pages/Detail/Zoom` 

  - 放大镜逻辑

    - 先算鼠标坐标
      - `event.offsetX`, `event.offsetY`（都是相对于目标元素的偏移量）
    - 再算蒙板坐标
      - 要使鼠标在蒙板中心，也就是蒙板要在xy轴各往左上偏移自身宽高的一半
      - 而鼠标坐标和蒙板初始左上坐标一致，所以利用鼠标坐标减去自身宽高(`offsetWidth`/`offsetHeight` 自身带边框的宽高)一半即得到需要的坐标
    - 限制蒙板移动范围
      - 不能让蒙板跟鼠标一样随处移动，当蒙板xy小于0要纠正为0，大于自身宽高要纠正为自身宽高

    - 大图反向移动蒙板坐标的2倍（比例就是预览图和大图容器的宽高比）
    - 设置蒙板和大图的left/top，注意要加单位px

```vue
<template>
  <div class="spec-preview">
    <!-- 
			imgList[defaultIndex].imgUrl
      a.b.c假报错：
      数据的传递和接收都需要计算时间，刚开始可能是个空的，所以出现报错，但数据真正拿到后页码又正常渲染了
      解决：把较复杂但属性a.b先算出来
    -->
    <img :src="defaultImg.imgUrl" />
    <!-- 移动时承载事件的div -->
    <div class="event" @mousemove="move"></div> 
    <div class="big">
      <img :src="defaultImg.imgUrl" ref='bigImg'/>
    </div>
    <div class="mask" ref='mask'></div>
  </div>
</template>
```

```vue
<script>
  export default {
    name: "Zoom",
    props: ['imgList'],
    mounted() {
      this.$bus.$on('changeDefaultIndex', this.changeDefaultIndex);
    },
    data() {
      return {
        defaultIndex: 0, // 默认下标 带橙色边框
      }
    },
    methods: {
      changeDefaultIndex(index) {
        this.defaultIndex = index; // 为了切换缩略图对应小图
      },
      move(event) {
        let mask = this.$refs.mask;
        let bigImg = this.$refs.bigImg;
        // client 相对于视口 page 页面 offset 元素本身
        // 鼠标位置
        let mouseX = event.offsetX;
        let mouseY = event.offsetY;
        // 蒙板位置（左上）
        let maskX = mouseX - mask.offsetWidth / 2; // offsetWidth 带边框布局宽度 clientWidth 不带
        let maskY = mouseY - mask.offsetHeight / 2;
        if(maskX < 0) {
          maskX = 0;
        } else if(maskX > mask.offsetWidth) {
          maskX = mask.offsetWidth;
        }
        if(maskY < 0) {
          maskY = 0;
        } else if(maskY > mask.offsetHeight) {
          maskY = mask.offsetHeight;
        }
        mask.style.left = maskX + 'px';
        mask.style.top = maskY + 'px';
        bigImg.style.left = -2 * maskX + 'px';
        bigImg.style.top = -2 * maskY + 'px';

      },
    },
    computed: {
      defaultImg() {
        return this.imgList[this.defaultIndex] || {}; // {}空对象备胎，避免拿不到undefined报错
      }
    },
  }
</script>
```



#### 4. 右侧商品信息数据展示

```html
<div class="goodsDetail">
  <h3 class="InfoName">{{skuInfo.skuName}}</h3>
  <p class="news">{{skuInfo.skuDesc}}</p>
  <div class="priceArea">
    <div class="priceArea1">
      <div class="title">价&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;格</div>
      <div class="price">
        <i>¥</i>
        <em>{{skuInfo.price}}</em>
        <span>降价通知</span>
      </div>
      <div class="remark">
        <i>累计评价</i>
        <em>65545</em>
      </div>
    </div>
    <!-- 以下全部假数据 -->
    <div class="priceArea2">
      ...
    </div>
  </div>
  <div class="support">
    ...
  </div>
</div>
```

#### 5. 右侧销售属性动态展示/点击切换/商品数量处理

- 数据结构复杂（已经提前算出来了），注意观察

- 绑定点击回调 `changeIsChecked` 修改其 `isChecked` 属性，并通过判断该属性值给元素添加 `active` 类
-  `changeIsChecked` 运用排它思维，先通过遍历将所有选项 `isChecked` 设为‘0’，再给当前选项修改为‘1’
- 给数量输入框双向绑定一个 `skuNum`  初始为1，按加减按钮自增自减即可，注意自减不能小于0

```html
<div class="choose">
  <div class="chooseArea">
    <div class="choosed"></div>
    <dl v-for="spuSaleAttr in spuSaleAttrList" :key="spuSaleAttr.id">
      <dt class="title">{{spuSaleAttr.saleAttrName}}</dt>
      <dd
          changepirce="0"
          :class="{active: spuSaleAttrValue.isChecked === '1'}"
          v-for="spuSaleAttrValue in spuSaleAttr.spuSaleAttrValueList"
          :key="spuSaleAttrValue.id"
          @click="changeIsChecked(spuSaleAttr.spuSaleAttrValueList, spuSaleAttrValue)"
          >{{spuSaleAttrValue.saleAttrValueName}}</dd>
    </dl>
  </div>
  <div class="cartWrap">
    <div class="controls">
      <!-- 注意：文本框输入的一概是字符串，而点+-是数字 -->
      <input autocomplete="off" class="itxt" v-model="skuNum" /> 
      <a href="javascript:" class="plus" @click="skuNum++">+</a>
      <a href="javascript:" class="mins" @click="skuNum > 1 ? skuNum-- : skuNum = 1">-</a>
    </div>
    <div class="add">
      <!-- 
        此处不能用声明式导航
        因为不是直接跳转，而是先在详情页发请求给后台，后台返回成功数据后才手动push到添加成功页面 
      -->
      <a href="javascript:" @click="addShopCart">加入购物车</a>
    </div>
  </div>
</div>
```

```js
export default {
  name: "Detail",
  data() {
    return {
      skuNum: 1
    }
  },
  mounted() {
    this.getGoodsDetailInfo();
  },
  methods: {
    getGoodsDetailInfo() {
      this.$store.dispatch("getGoodsDetailInfo", this.$route.params.skuId);
    },
    // 排它
    changeIsChecked(attrValueList, attrValue) {
      attrValueList.forEach(item => {
        item.isChecked = '0';
      });
      attrValue.isChecked = '1';
    },
    ...
  },
  computed: {
    ...mapGetters(["categoryView", "skuInfo", "spuSaleAttrList"]),
  },
  components: {
    ImageList,
    Zoom,
  },
};
```

#### 6. 添加购物车及跳转到成功页面

- 加入购物车链接不能使用声明式导航
  - 不是直接跳转，而是先在详情页发请求给后台，后台返回成功数据后才手动push到添加成功页面（ `AddCartSuccess` 组件）

```html
<a href="javascript:" @click="addShopCart">加入购物车</a>
```

