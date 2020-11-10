#### 1. 实现Search与searchSelector静态组件

- `searchSelector` 是 `Search` 组件的一个子组件

#### 2. 搜索商品列表数据接口请求函数及测试（参考接口文档）

- 接着编辑 `@/api/index.js`
  - `searchParams` 搜索条件参数，必须要有(不传报201，参数有问题)，至少是一个没有属性的空对象，由组件传递
    - 如果是空对象：搜索请求获取的是全部数据
    - 如果有搜索条件：代表搜索条件匹配的对象

```js
export const reqGoodsListInfo = (searchParams) => {
  return Ajax({
    url: '/list',
    method: 'POST',
    // 请求体参数
    data: searchParams,
  });
}
```

#### 3. Search模块vuex编码(发请求/拿数据/存数据)

- 新建模块 `@/store/search.js`

```js
import {reqGoodsListInfo} from '@/api';

const state = {
  goodsListInfo: {},
};
const mutations = {
  RECEIVEGOODSLISTINFO(state, goodsListInfo) {
    state.goodsListInfo = goodsListInfo;
  }
};
const actions = {
  // 通过dispatch传参时，第一个参数是context对象
  // 从第二个参数起，传递多个参数时要保存在对象中传递，只一个参数不需要
  async getGoodsListInfo({commit}, searchParams) {
    const result = await reqGoodsListInfo(searchParams);
    if (result.code === 200) {
      commit('RECEIVEGOODSLISTINFO', result.data);
    }
  }
};
// 先在getter中较复杂的属性计算出来，防止出现a.b.c结构造成假报错
// getters 计算state得到数据
const getters = {
  attrsList(state) {
    return state.goodsListInfo.attrsList || [];
  },
  goodsList(state) {
    return state.goodsListInfo.goodsList || [];
  },
  trademarkList(state) {
    return state.goodsListInfo.trademarkList || [];
  },
};

export default {
  state,
  mutations,
  actions,
  getters,
};
```

#### 4. 商品列表数据的获取(computed)及商品列表的展示

-  `@/pages/Search/index.vue` 

```js
    computed: {
      // 拿到商品列表 v-for展示
      ...mapGetters(['goodsList']),
    },
```

- 数据展示

```vue
<template>
  <div>
    <TypeNav />
    <div class="main">
      <div class="py-container">
        <!--bread-->
        <div class="bread">
          <ul class="fl sui-breadcrumb">
            <li>
              <a href="#">全部结果</a>
            </li>
          </ul>
          <ul class="fl sui-tag">
            <li class="with-x" v-show="searchParams.categoryName">
              {{searchParams.categoryName}}
              <i @click="removeCategoryName">×</i>
            </li>
            <li class="with-x" v-show="searchParams.keyword">
              {{searchParams.keyword}}
              <i @click="removeKeyword">×</i>
            </li>
            <!-- 用v-show时，如果trademark不存在，就设置为空串，否则是undefined会报错；v-if不会有这种情况 -->
            <li class="with-x" v-show="searchParams.trademark">
              {{(searchParams.trademark ? searchParams.trademark : '').split(':')[1]}} 
              <i @click="removeTrademark">×</i>
            </li>
            <li class="with-x" v-for="(prop, index) in searchParams.props" :key="index">
              {{prop.split(':')[1]}} 
              <i @click="removeProp(index)">×</i>
            </li>

          </ul>
        </div>

        <!--selector-->
        <SearchSelector @searchForTrademark='searchForTrademark' @searchForAttrValue='searchForAttrValue' />

        <!--details-->
        <div class="details clearfix">
          <div class="sui-navbar">
            <div class="navbar-inner filter">
              <ul class="sui-nav">
                <li class="active">
                  <a href="#">综合</a>
                </li>
                <li>
                  <a href="#">销量</a>
                </li>
                <li>
                  <a href="#">新品</a>
                </li>
                <li>
                  <a href="#">评价</a>
                </li>
                <li>
                  <a href="#">价格⬆</a>
                </li>
                <li>
                  <a href="#">价格⬇</a>
                </li>
              </ul>
            </div>
          </div>
          <div class="goods-list">
            <ul class="yui3-g">
              <li class="yui3-u-1-5" v-for="goods in goodsList" :key="goods.id">
                <div class="list-wrap">
                  <div class="p-img">
                    <a href="item.html" target="_blank"><img :src="goods.defaultImg" /></a>
                  </div>
                  <div class="price">
                    <strong>
                      <em>¥</em>
                      <i>{{goods.price}}</i>
                    </strong>
                  </div>
                  <div class="attr">
                    <a target="_blank" href="item.html" title="促销信息，下单即赠送三个月CIBN视频会员卡！【小米电视新品4A 58 火爆预约中】">{{goods.title}}</a>
                  </div>
                  <div class="commit">
                    <i class="command">已有<span>2000</span>人评价</i>
                  </div>
                  <div class="operate">
                    <a href="success-cart.html" target="_blank" class="sui-btn btn-bordered btn-danger">加入购物车</a>
                    <a href="javascript:void(0);" class="sui-btn btn-bordered">收藏</a>
                  </div>
                </div>
              </li>

            </ul>
          </div>
          <div class="fr page">
            <div class="sui-pagination clearfix">
              <ul>
                <li class="prev disabled">
                  <a href="#">«上一页</a>
                </li>
                <li class="active">
                  <a href="#">1</a>
                </li>
                <li>
                  <a href="#">2</a>
                </li>
                <li>
                  <a href="#">3</a>
                </li>
                <li>
                  <a href="#">4</a>
                </li>
                <li>
                  <a href="#">5</a>
                </li>
                <li class="dotted"><span>...</span></li>
                <li class="next">
                  <a href="#">下一页»</a>
                </li>
              </ul>
              <div><span>共10页&nbsp;</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
```

#### 5. 品牌和属性数据的获取及展示

-  `@/pages/Search/searchSelector` 

```vue
<script>
  import { mapGetters } from 'vuex';
  export default {
    name: 'SearchSelector',
    
    // 拿到属性和品牌数据，属性要双层v-for
    computed: {
      ...mapGetters(['attrsList', 'trademarkList']),
    },
    
    methods: {
      searchForTrademark(trademark) {
        this.$emit('searchForTrademark', trademark);
      },
      searchForAttrValue(attr, attrValue) {
        this.$emit('searchForAttrValue', attr, attrValue);
      },
    },
  }
</script>
```

- 数据展示
  - 属性要双层v-for

```vue
<template>
  <div class="clearfix selector">
    <div class="type-wrap logo">
      <div class="fl key brand">品牌</div>
      <div class="value logos">
        <ul class="logo-list">
          <li v-for="trademark in trademarkList" :key="trademark.tmId" @click="searchForTrademark(trademark)">
            {{trademark.tmName}}
          </li>
        </ul>
      </div>
      <div class="ext">
        <a href="javascript:void(0);" class="sui-btn">多选</a>
        <a href="javascript:void(0);">更多</a>
      </div>
    </div>
    <div class="type-wrap" v-for="attr in attrsList" :key="attr.attrId">
      <div class="fl key">{{attr.attrName}}</div>
      <div class="fl value">
        <ul class="type-list">
          <li v-for="(attrValue, index) in attr.attrValueList" :key="index">
            <a href="javacript:;" @click="searchForAttrValue(attr, attrValue)">{{attrValue}}</a>
          </li>
        </ul>
      </div>
      <div class="fl ext"></div>
    </div>
  </div>
</template>
```

#### 6. 初始化搜索及按照分类和关键字搜索

- 初始化搜索: 设置初始参数对象 `searchParams`，包含用户所有可能搜索的条件和初始值（**搜索页都需要**）
- 按照分类和关键字搜索: 在 `beforeMount` 阶段处理请求条件（考虑到用户可能是点击商品分类或搜索关键字跳转search的），提取成函数 `handleSearchParams`
  - 把路由当中的`keyword`（`params`中）还有相关的类别名称及类别id（`query`中）获取到，添加到`searchParams`当中
    - 如果有那么搜索条件当中就有了，如果没有那就是初始化参数
  - 遍历 `searchParams` 的每个搜索条件，如果某个参数是空串，就删掉这个属性
    - 节省传递数据占用的带宽，让后端压力减小

```vue
<script>
  import SearchSelector from './SearchSelector/SearchSelector'
  import { mapGetters } from 'vuex';
  export default {
    name: 'Search',
    data() {
      return {
        // 初始化参数：用户所有可能搜索的条件(看数据示例)
        searchParams: {
          category1Id: '',
          category2Id: '',
          category3Id: "",
          categoryName: "",
          keyword: "",
          order: "1:desc",
          pageNo: 1,
          pageSize: 2,
          props: [],
          trademark: "",
        }
      }
    },
    // beforMount 一般用来同步处理数据（参数）
    beforeMount() {
      this.handleSearchParams();
    },
    // mounted 一般用来异步请求数据
    mounted() {
      this.getGoodsListInfo();
    },
    // 商品列表数据的获取
    methods: {
      getGoodsListInfo() {
        this.$store.dispatch('getGoodsListInfo', this.searchParams);
      },
      // 处理请求参数
      handleSearchParams() {
        let {keyword} = this.$route.params;
        let {categoryName, category1Id, category2Id, category3Id} = this.$route.query;
        let searchParams = {
          ...this.searchParams,
          keyword,
          categoryName,
          category1Id,
          category2Id,
          category3Id,
        };
        // 如果某个参数是空串，就删掉这个属性
        Object.keys(searchParams).forEach(item => {
          // 形参不能. 只能[]
          if (searchParams[item] === '') {
            delete searchParams[item];
          }
        });
        this.searchParams = searchParams;
      },
      // 如果是在search组件内的跳转，全部使用replace，如此一来点击返回可直接退回home页面
      removeCategoryName() {
        this.searchParams.categoryName = '';
        // categoryName删掉了，也就是改变了query，这时候路径带上params就好
        // this.$router.push({name: 'search', params: this.$route.params});
        this.$router.replace({name: 'search', params: this.$route.params});
      },
      removeKeyword() {
        this.searchParams.keyword = '';
        // keyword删掉了，也就是改变了params，这时候路径带上query就好
        // this.$router.push({name: 'search', query: this.$route.query});
        this.$router.replace({name: 'search', query: this.$route.query});
      },
      searchForTrademark(trademark) {
        this.searchParams.trademark = `${trademark.tmId}:${trademark.tmName}`;
        this.getGoodsListInfo();
      },
      removeTrademark() {
        this.searchParams.trademark = '';
        this.getGoodsListInfo();
      },
      searchForAttrValue(attr, attrValue) {
        let isTrue = this.searchParams.props.some(item => item === `${attr.attrId}:${attrValue}:${attr.attrName}`);
        if (isTrue) return;
        this.searchParams.props.push(`${attr.attrId}:${attrValue}:${attr.attrName}`); // ["属性ID:属性值:属性名"]
        this.getGoodsListInfo();
      },
      removeProp(index) {
        this.searchParams.props.splice(index, 1);
        this.getGoodsListInfo();
      }
    },
    computed: {
      // 拿到商品列表 v-for展示
      ...mapGetters(['goodsList']),
    },
    // 监视路由对象，一旦发生变化，处理请求参数并发请求
    // 解决search页输入搜索参数或者点击类别不会发请求的bug
	  // 原因是因为mounted只能执行一次 search是一个路由组件，切换的时候才会创建和销毁
    watch: {
      $route() {
        this.handleSearchParams();
        this.getGoodsListInfo();
      }
    },
    components: {
      SearchSelector
    }
  }
</script>
```

#### 7. 解决输入搜索参数或者点击类别不会发请求的bug

- 原因是mounted中发请求只能执行一次，search是一个路由组件，切换的时候才会创建和销毁，期间根本不会再发请求
- 监视路由对象，一旦发生变化，处理请求参数并发请求

```js
    watch: {
      $route() {
        this.handleSearchParams();
        this.getGoodsListInfo();
      }
    },
```

#### 8. 面包屑的显示和删除（路径没有变化的bug处理）

- 结构不能v-for，要一个个展示

```html
<!--bread-->
<div class="bread">
  <ul class="fl sui-breadcrumb">
    <li>
      <a href="#">全部结果</a>
    </li>
  </ul>
  <ul class="fl sui-tag">
    <li class="with-x" v-show="searchParams.categoryName">
      {{searchParams.categoryName}}
      <i @click="removeCategoryName">×</i>
    </li>
    
    <li class="with-x" v-show="searchParams.keyword">
      {{searchParams.keyword}}
      <i @click="removeKeyword">×</i>
    </li>
    
    <!-- 用v-show时，如果trademark不存在，就设置为空串，否则是undefined会报错；v-if不会有这种情况 -->
    <li class="with-x" v-show="searchParams.trademark">
      {{(searchParams.trademark ? searchParams.trademark : '').split(':')[1]}} 
      <i @click="removeTrademark">×</i>
    </li>
    
    <!-- v-for和v-if可以同时出现，v-for优先级更高 -->
    <li class="with-x" v-for="(prop, index) in searchParams.props" :key="index">
      {{prop.split(':')[1]}} 
      <i @click="removeProp(index)">×</i>
    </li>
  </ul>
</div>
```

- 路径没有变化的bug处理：重新发请求没有用，要改变路由
  - 已经设置过监视，只要路由变化，也会发请求（见第6步），此时直接`push` 或 `replace`重写路径即可

```js
methods: {
  //删除面包屑当中的关键字请求参数
  removeKeyword() {
    this.searchParams.keyword = "";
    // this.getGoodsListInfo();
    // 路径没有变化的bug处理: 重新发请求没有用，要改变路由
    // keyword删掉了，也就是改变了params，这时候路径带上query就好
    this.$router.replace({name:'search', query: this.$route.query})
  },

  //使用自定义事件组件通信（子向父），达到根据品牌搜索
  searchForTrademark(trademark){
    //回调函数再谁当中，谁就是接收数据的
    this.searchParams.trademark = `${trademark.tmId}:${trademark.tmName}`
    this.getGoodsListInfo();
  },
  //删除面包屑当中的品牌参数
  removeTrademark(){
    this.searchParams.trademark = ""
    this.getGoodsListInfo();
  },
  removeProp(index){
    //删除某一个下标的属性值
    this.searchParams.props.splice(index,1)
    this.getGoodsListInfo();
  },
  ...
}
```



#### 9. 按照品牌搜索商品

- 品牌和属性都在子组件`searchselector`中，我们选择**自定义事件**的方式完成子向父通信

  - 父组件定义事件和回调并传给子组件

  ```html
  <SearchSelector @searchForTrademark='searchForTrademark' />
  ```

  ```js
  methods: {
  	...
    searchForTrademark(trademark) {
      // 组合成后台需要的格式
      this.searchParams.trademark = `${trademark.tmId}:${trademark.tmName}`;
      this.getGoodsListInfo();
    },
    removeTrademark() {
      this.searchParams.trademark = '';
      this.getGoodsListInfo();
    },
    ...
  },
  ```

  - 子组件触发(`$emit`)点击事件回调向父组件传数据 `trademark`

  ```html
  <div class="fl key brand">品牌</div>
  <div class="value logos">
    <ul class="logo-list">
      <li v-for="trademark in trademarkList" :key="trademark.tmId" @click="searchForTrademark(trademark)">
        {{trademark.tmName}}
      </li>
    </ul>
  </div>
  ```

  ```js
  methods: {
    //需要给父亲传递trademark数据，让父亲去发请求
    searchForTrademark(trademark) {
      //哪里在触发事件（$emit）哪里就是发送数据的
      this.$emit('searchForTrademark', trademark);
    },
    ...
  },
  ```

#### 10. 按照属性值搜索商品

- 父组件定义事件和回调并传给子组件
  - 注意要先去判断props当中是否已经存在这个点击的属性值条件（可以使用数组方法`indexOf`或`some`），如果有了就不需要再重复发请求

```html
<SearchSelector @searchForTrademark='searchForTrademark' @searchForAttrValue='searchForAttrValue' />
```

```js
methods: {
  ...
  // 使用自定义事件组件通信（子向父），达到根据属性值搜索
  searchForAttrValue(attr, attrValue) {
    // 要先去判断props当中是否已经存在这个点击的属性值条件，如果有了就不需要再去发请求
    let num = this.searchParams.props.indexOf(`${attr.attrId}:${attrValue}:${attr.attrName}`)
    if(num !== -1) return 
    
    // let isTrue = this.searchParams.props.some(item => item === `${attr.attrId}:${attrValue}:${attr.attrName}`);
    // if (isTrue) return;
    
    this.searchParams.props.push(`${attr.attrId}:${attrValue}:${attr.attrName}`); // ["属性ID:属性值:属性名"]
    this.getGoodsListInfo();
  },
  removeProp(index) {
    this.searchParams.props.splice(index, 1);
    this.getGoodsListInfo();
  },
  ...
}
```

- 子组件触发回调向父组件传数据  `attr`, `attrValue`

```html
<div class="fl value">
  <ul class="type-list">
    <li v-for="(attrValue, index) in attr.attrValueList" :key="index">
      <a href="javascript:;" @click="searchForAttrValue(attr,attrValue)">{{attrValue}}</a>
      <!-- "属性ID:属性值:属性名" -->
    </li>
  </ul>
</div>
```

```js
methods:{
  ...
	searchForAttrValue(attr,attrValue){
		this.$emit('searchForAttrValue',attr,attrValue)
	},
  ...
}
```

#### 11.  解决在search页面多次跳转不能直接返回home页面的问题（push和replace的问题）

- 如果是在 `Search` 组件内的跳转，全部使用replace

  - `@/components/TypeNav`

  ```js
      toSearch(event) {
        let data = event.target.dataset;
        let { categoryname, category1id, category2id, category3id } = data;
        if (categoryname) {
          let location = { name: "search" };
          let query = {
            categoryName: categoryname,
          };
          if (category1id) {
            query.category1Id = category1id;
          } else if (category2id) {
            query.category2Id = category2id;
          } else {
            query.category3Id = category3id;
          }
          location.query = query;
  
          if (this.$route.params) {
              location.params = this.$route.params;
          };
  				// 判断是否是search组件内的跳转
          if (this.$route.path === '/search') {
            this.$router.replace(location);
          } else {
            this.$router.push(location);
          }
  
          // this.$router.push(location);
        }
      },
  ```

  -  `@/pages/Search/index.vue` 
    - 见第4步 `removeCategoryName` & `removeCategoryName` 函数

#### 12. 解决删除关键字后，输入框没有更新的bug

- 使用**全局事件总线**，`Search`中删除关键字则通知`Header`

  - 首先将全局事件总线对象（vm）定义到 Vue 的原型对象上
    - 为了所有实例对象都能够使用

  ```js
  new Vue({
    beforeCreate() {
      /*
        全局事件总线本质就是一个对象
        满足条件：
        1、 所有的组件对象都可以看到这个对象   (决定了这个对象必须是在Vue的原型当中)
        2、 这个对象必须能够使用$on和$emit    (决定了这个对象必须是能够调用到Vue原型的$on和$emit)
      最终我们选择了vm作为事件总线是最简单的，因为本来我们就要有一个vm对象，直接拿来作为总线就好了
      */
    Vue.prototype.$bus = this;
    },
    ...
  })
  ```
  
  - 接受数据方 `Header` 绑定自定义事件
  
  ```js
    mounted() {
      this.$bus.$on('clearKeyword', this.clearKeyword);
    },
  methods: {
    	clearKeyword() {
      this.keyword = '';
      },
    	...
    },
  ```
  
  - 发送数据方 `Search` 触发自定义事件
  
  ```js
  	methods: {
  		...
      removeKeyword() {
      	// 通知header组件清空关键字（触发header在mounted中绑定的自定义事件）
        this.$bus.$emit('clearKeyword'); 
        this.searchParams.keyword = '';
        // this.$router.push({name: 'search', query: this.$route.query});
        this.$router.replace({name: 'search', query: this.$route.query});
      },
  	},
  ```

#### 13. 分析排序数据的4种情况

`order: "1:desc",`

- 排序标志 `orderFlag`：'1' 综合排序，'2' 价格排序
- 排序类型 `orderType`：'desc'降序，'asc'升序
- 4种情况：综合升序，综合降序，价格升序，价格降序

```js
      // 把需要用到的复杂属性算出来，优化代码可读性
      orderFlag() {
        return this.searchParams.order.split(':')[0];
      },
      orderType() {
        return this.searchParams.order.split(':')[1];
      },
```

#### 14. 动态确定排序标志和排序类型

- 背景色谁有
  - 通过 `orderFlag` 判断加 `active` 类

- 图标的处理
  - 用什么 ---> iconfont 生成在线css链接导入 `index.html`
    - 可以在编辑项目中修改下`FontClass`前缀（去掉“-”），写起来方便
  - 在哪里显示 ---> `v-if` 通过 `orderFlag` 判断
  - 什么时候切换上下 ---> `v-if` 通过 `orderType` 判断

```html
<div class="sui-navbar">
  <div class="navbar-inner filter">
    <ul class="sui-nav">
      <li :class="{active: orderFlag === '1'}" @click="changeOrder('1')">
        <a href="#">
          综合
          <!-- 用对象绑定类使用最多 -->
          <i class="iconfont" :class="{iconup: orderType === 'asc', icondown: orderType === 'desc'}" v-if="orderFlag === '1'"></i>
        </a>
      </li>
      <li>
        <a href="#">销量</a>
      </li>
      <li>
        <a href="#">新品</a>
      </li>
      <li>
        <a href="#">评价</a>
      </li>
      <li :class="{active: orderFlag === '2'}" @click="changeOrder('2')">
        <a href="#">
          价格
          <i class="iconfont" :class="{iconup: orderType === 'asc', icondown: orderType === 'desc'}" v-if="orderFlag === '2'"></i>
        </a>
      </li>
    </ul>
  </div>
</div>
```

- 点击切换排序规则
  - 如果点的是跟之前同一个orderFlag，只要改变orderType就好
    - 三元运算符判断改变orderType
  - 如果点的不是同一个orderFlag，要改变orderFlag，orderType默认一个就好
  - 点击排序项的时候传递自身的orderFlag数据，一个 `changeOrder` 方法搞定

```js
      //综合和价格排序切换规则
      changeOrder(orderFlag) {
        // 原始排序标志
        // let originOrderFlag = this.searchParams.order.split(':')[0];
        let originOrderFlag = this.orderFlag;
        // 原始排序类型
        // let originOrderType = this.searchParams.order.split(':')[1];
        let originOrderType = this.orderType;
        let newOrder = '';
        // 点的是同一个标志，只要改变排序类型就好
        if (orderFlag === originOrderFlag) {
          newOrder = `${originOrderFlag}:${originOrderType === 'desc' ? 'asc' : 'desc'}`;
        // 点的不是同一个标志，要改变排序标志，排序类型默认就好
        } else {
          newOrder = `${orderFlag}:desc`;
        };
        // 把新的排序规则给搜索参数
        this.searchParams.order = newOrder;
        this.getGoodsListInfo();
        this.searchParams.pageNo = 1;
      },
```

#### 15. 自定义通用的分页组件

- 搬静态组件

- 定义成全局组件

  -  `@/components/Pagination`
  - `main.js` 引入+全局注册
  - 已经在`App.vue`中使用过 `router-view` 了
  - `Search`组件中使用 `<Pagination />`

- 动态组件的逻辑和功能

  - 分页组件所需要的从父组件`Search`传递的数据是哪些 ---> 通过`props`传递当前页码，每页数量，总条数，连续页数（一般都是奇数个）
    - `@/pages/Search`

    ```vue
    <Pagination 
    :currentPageNum='searchParams.pageNo' 
    :total='goodsListInfo.total'
    :pageSize='searchParams.pageSize'
    :continueSize='5'
    @changePageNum='changePageNum'></Pagination>
    ```

    - `@/components/Pagination`
    
    ```js
    	// 接收props三种写法：数组/对象/对象的复杂写法
  	props: {
        currentPageNum: {
          type: Number,
          default: 1, //default和required有一个就好
          // // 自定义验证规则
          // validator:
        },
        total: Number,
        pageSize: {
          type: Number,
          default: 5, // 不传的时候的默认值
        },
        continueSize: Number,
      },
    ```
    
  - 分页内部需要计算的数据是哪些 ---> 总页数，连续页码的起始和结束
    - 先判断连续页码是不是比最大的页码还要大，如果是那么start=1  end就是最大页码
    - 普通情况：start  =   当前页码 - 连续页码/2 取整；end   =    当前页码 + 连续页码/2 取整
    - 特殊情况：如果start求出来比1还小，那么start修正为1，end需要+修正的偏移量；如果end求出来比最大页码还大，同样end修正为最大页码start需要-修正的偏移量
  
  ```js
    computed: {
      // 计算总页码
      totalPageNum() {
        return Math.ceil(this.total / this.pageSize);
      },
      // 计算连续页起始结束页码
      startEnd() {
        // disNum 要修正的页数
        let start, end, disNum;
        let { currentPageNum, continueSize, totalPageNum } = this;
        if (continueSize >= totalPageNum) {
          start = 1;
          end = totalPageNum;
        } else {
        start = currentPageNum - Math.floor(continueSize / 2);
          end = currentPageNum + Math.floor(continueSize / 2);
          // 修正左边出现的小于1的页码
          if (start <= 1) {
            disNum = 1 - start;
            start += disNum;
            end += disNum;
          }
          // 修正右边出现的大于总页码的情况
          if (end >= totalPageNum) {
            disNum = end - totalPageNum;
            start -= disNum;
            end -= disNum;
          }
      };
        // 返回超过一个值，放数组或者对象里
        return { start, end };
      },
    },
  ```
  
  - 动态显示页码
  - 第一页/最末页/“···” 三种btn什么时候显示和隐藏
      - 只有算出来的start > 1时第一页btn才显示
      - 只有算出来的end < 总页码时最末页btn才显示
      - 只有start > 2时左侧的···才显示
      - 只有end < 总页码-1时右侧的···才显示
    - 连续页码btn怎么显示
      - v-for遍历end页码数字，同时加个v-if条件让仅大于start的页码显示（遍历数字都是从1拿起）
      - v-for优先级比v-if高
    - 上下页翻btn什么时候禁止操作
      - 当前页码为1时禁止上翻
      - 当前页码为最末页时禁止下翻
    - 什么时候是选中状态 
    - 如果`currentPageNum`和点击的页码一致，那么就添加active类
  
  ```vue
  <template>
    <div class="pagination">
      <button :disabled="currentPageNum === 1" @click="$emit('changePageNum', currentPageNum - 1)">上一页</button>
      <!-- 这里和总页码active可以不加，因为已经修正过了 -->
      <button v-if="startEnd.start > 1" :class="{active: currentPageNum === 1}" @click="$emit('changePageNum', 1)">1</button>
      <button v-if="startEnd.start > 2">···</button>
      <!-- 连续页 -->
      <!-- v-for遍历数字，从1拿起，所以加个v-if条件 -->
      <button
        v-for="page in startEnd.end"
        :key="page"
        v-if="page >= startEnd.start"
        :class="{active: currentPageNum === page}"
        @click="$emit('changePageNum', page)"
      >{{page}}</button>
      <button v-if="startEnd.end < totalPageNum - 1">···</button>
      <!-- 这里active可以不加 -->
      <button
        v-if="startEnd.end < totalPageNum"
        @click="$emit('changePageNum', totalPageNum)"
      >{{totalPageNum}}</button>
      <button :disabled="currentPageNum === totalPageNum" @click="$emit('changePageNum', currentPageNum + 1)">下一页</button>
      <button style="margin-left: 30px">共 {{total}} 条</button>
    </div>
  </template>
  ```
  
  - 点击页码修改当前页码值
  
    - 父组件`Search`传一个修改页码的函数（修改搜索条件中的页码）过来，这边点击btn触发事件时把需要更新的页码传过去
      - 翻页：+1或-1
      - 首页：1
      - 末页：总页数
      - 其余btn传当前页码即可
    - 更新页码父组件要去发请求
  
    ```js
    changePageNum(page) {
      this.searchParams.pageNo = page;
      this.getGoodsListInfo();
    },
    ```
  
  - 父组件其他搜索条件更新，需要修改当前页码为1
  
    - `Search`中每一个更新搜索条件的方法都要增加一行代码 `this.searchParams.pageNo = 1`
      - `removeCategoryName`, `removeKeyword`, `searchForTrademark`, `removeTrademark`, `searchForAttrValue`, `removeProp`, `changeOrder`

