#### 1. 实现Home的子组件静态页面

- 子组件：`TypeNav`, `ListContainer`, `Recommend`, `Rank`, `Like`, `Floor`, `Brand`

- 三级分类导航 `TypeNav` 属于 `Home` 和 `Search` 两个页面共用，放入 `conponents` 中

  - 不要忘记在 `main.js` 中进行全局注册

  ```js
  import TypeNav from '@/components/TypeNav'
  //全局注册TypeNav  因为它是一个公用的组件
  Vue.component('TypeNav',TypeNav)
  ```

- 引入图片时注意修改路径

#### 2. postman测试后台api接口

#### 3. 定义前后台交互模块，对<a href='https://github.com/axios/axios'>axios</a>进行二次封装

- 配置基础路径和超时限制

- 使用 <a href='https://github.com/rstacruz/nprogress'>`nprogress`</a> 包添加进度条功能

  ```shell
  npm install --save nprogress
  ```

  - 附带介绍一个vscode插件： Search node_modules

- 设置成默认返回响应报文信息 `response.data`（返回的响应不再需要从data属性当中拿数据）

- 统一处理请求错误, 具体请求也可以选择处理或不处理

- 定义在 `@/ajax/Ajax.js` 中

```js
// 发送ajax请求模块，目的是对axios进行二次封装
import axios from 'axios';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

// 创建一个新的实例，而不是直接修改axios本身
const instance = axios.create({
  // 配置基础路径和超时限制
  baseURL: '/api', // 请求基础路径
  timeout: 20000, // 超时时间
});

instance.interceptors.request.use(
  config => {
    // 处理config（请求报文）
    // 添加额外功能（进度条）
    NProgress.start(); // 在请求拦截器中开始
    return config; // 返回这个config再继续请求，发送的报文信息就是新的config对象
	}
); // 内部不涉及this的直接用箭头

instance.interceptors.response.use(
  // 返回的响应不再需要从data属性当中拿数据，而是响应就是我们要的数据
  response => {
    NProgress.done(); // 在响应拦截器中停止
    return response.data // 设置成默认返回响应报文信息 response.data
  }, 
  // 统一处理请求错误, 具体请求也可以选择处理或不处理
  error => {
    NProgress.done();
    alert('发送请求失败' + error.message || '未知错误'); // 统一处理请求错误
    // new Error() 自定义错误信息
    // return Promise.reject(new Error('请求失败')); // 如果要进一步处理，就返回一个失败的promise 
    return new Promise(() => {}); // 如果不需要，就返回一个pending的promise终止promise链
  }
);

// 将axios工具暴露出去，后面发请求用
export default instance;

```

#### 4. 定义所有接口的请求函数模块

- 每个接口请求功能都定义成函数，以后哪里需要直接调用函数即可
- 定义在 `@/api/index.js` 中
  - 这个文件是所有的接口请求函数的文件
  - 每一个请求接口数据功能都给它定义成一个函数，以后哪里需要去请求数据，就调用对应的这个接口请求函数就好了

```js
import Ajax from '@/ajax/Ajax'; // 就是二次封装后的axios

// 请求三级分类列表数据
// 在axios配置对象中，data传body，params传query，真正的params参数只能在路径后面拼接
export const reqCatagoryList = () => {
  return Ajax({
    url: '/product/getBaseCategoryList',
    method: 'GET',
  });
};

// reqCatagoryList(); // 测试请求是否能够拿到数据用，同时要在main.js中引入api模块（模块想要运行必须在main中引入）
```

#### 5. 测试ajax请求及解决跨域问题

- 如果项目创建时选择了默认配置，需要先下载 `devServer`

  ```js
  npm install webpack-dev-server --save-dev
  ```

- 在 `vue.config.js` 中<a href='https://webpack.docschina.org/configuration/dev-server/#devserverproxy'>配置代理服务器</a>

  ```js
  module.exports = {
    // ...
    devServer: {
      proxy: {
        '/api': {
          target: 'http://182.92.128.115/',
        }
      }
    }
  };
  ```

- 成功响应

![image-20200813111012605](/Users/toonoisy/Library/Application Support/typora-user-images/image-20200813111012605.png)

#### 6. 使用vuex管理拿到的数据

- 如果项目创建时选择了默认配置，需要先下载 `vuex`
- 主文件

```js
import Vue from 'vue';
import Vuex from 'vuex';
import home from './home';
import user from './user';

Vue.use(Vuex);

const state = {};
const mutations = {};
const actions = {};
const getters = {};

export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters,
  // 将存放了不同数据的模块合并进来（分割模块，避免主文件臃肿，每个模块都有自己的4个核心对象）
  modules: {
    home,
    user,
  }
});
```

- `home.js` 

```js
import {reqCatagoryList} from '@/api';

const state = {
  catagoryList: [],
};
// 直接修改数据  （不允许出现if  for  异步操作）
const mutations = {
  RECEIVECATAGORYLIST(state, catagoryList) {
    state.catagoryList = catagoryList;
  }
};
// 异步请求获取数据 （允许出现if  for）
const actions = {
  async getCatagoryList({commit}) {
    // 用async函数更好
    // reqCategoryList().then(result => {
    //   commit('RECEIVECATEGORYLIST',result.data)
    // })

    const result = await reqCatagoryList();
    if (result.code === 200) {
      commit('RECEIVECATAGORYLIST', result.data); // commit 推送一个mutation
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

- 以上定义在 `@/store` 中
- 不要忘记在 `main.js` 中引入 `store` 并注入 `Vue` 中
- 接着编辑`@/components/TypeNav/index.vue`，从vuex中拿数据

```vue
<script>
import {mapState} from 'vuex';
export default {
  name: 'TypeNav',
  // 一旦挂载完成，即触发请求
  mounted() {
    this.getCatagoryList();
  },
  methods: {
    getCatagoryList() { // 单独定义成方法，需要发请求的时候调用即可
      this.$store.dispatch('getCatagoryList'); // dispatch 推送一个action
    }
  },
  // 组件要从vuex中取数据必须用computed，取方法用methods
  // 写完先去看看vue里面有没有数据
  computed: {
    // ...mapState(['categoryList']); // 错的
    ...mapState({
      // state是总的state，结构变成了: state:{home:{}, user:{},}
      // 只有state会按模块分成对象，其余三项不会
      catagoryList: state => state.home.catagoryList, // 数据在home
    }),
  },
}
</script>
```

#### 7. 将获取的数据展示到 TypeNav

- 分析数据结构

![image-20200813111316481](/Users/toonoisy/Library/Application Support/typora-user-images/image-20200813111316481.png)

- 在模板上展示数据 `v-for`

```html
<div class="sort">
    <div class="all-sort-list2">
        <div class="item" v-for="c1 in catagoryList" :key="c1.categoryId">
            <h3>
                <a href="">{{c1.categoryName}}</a>
            </h3>
            <div class="item-list clearfix">
                <div class="subitem">
                    <dl class="fore" v-for="c2 in c1.categoryChild" :key="c2.categoryId">
                        <dt>
                            <a href="">{{c2.categoryName}}</a>
                        </dt>
                        <dd>
                            <em v-for="c3 in c2.categoryChild" :key="c3.categoryId">
                                <a href="">{{c3.categoryName}}</a>
                            </em>
                        </dd>
                    </dl>
                </div>
            </div>
        </div>
    </div>
</div>
```

#### 8. 按需求优化 TypeNav 样式

- 鼠标悬停在链接上变色，需要修改一下公共样式
- 悬停在分类上背景色需要变化，修改分类组件的样式
- 三级分类列表宽度比较小，右边的缝隙比较大

#### 9. 移入移出一级分类显示和隐藏二三级分类

- 去掉原先css写的hover效果，改定义成class
- 添加移入移出事件，设计数据来控制class
  - 移出事件我们需要移出全部分类的时候才会消失，因此移出事件我们需要添加在外部一个div上

```html
<div class="item" :class="{item_on: currentIndex === index}" @mouseenter="moveIn(index)" v-for="(c1, index) in catagoryList" :key="c1.categoryId">
```

```js
data() {
  return {
    currentIndex: -1, // 默认item_on不会被生效
  }
},
```

```js
moveIn(index) {
	this.currentIndex = index; // 移入后触发事件回调，item_on生效 （不是最终版本）
},
```

- 这样做存在的问题：快速多次触发事件浏览器会卡顿，实际只能触发少量几次

#### 10. 对移入事件回调进行节流处理

- 使用js工具库 <a href='https://www.lodashjs.com/'>`lodash`</a> 提供的节流函数
  - 节流是多变少，防抖是多变一
  - 虽然在效果上看似没有变化，但是刻意处理过的，而不再是浏览器卡顿造成

```js
// import _ from 'lodash'; // 打包文件体积过大
import throttle from 'lodash/throttle'; // 仅引入throttle即可
```

```js
moveIn: throttle(function(index) {
  this.currentIndex = index;
}, 30, {'trailing': false}), // 如果不设置trailing为false（在刚触发就执行），会出现鼠标移出后才触发的情况
```

#### 11. 点击类别去到搜索页使用声明式导航和编程式导航的区别

- 声明式导航使用router-link标签，会创建过多的组件对象，导致卡顿
- 编程式导航使用事件处理，会出现很多的事件回调，内存占用还是比较大，效率依旧不高

#### 12. 事件委派（最终方案）处理点击类别跳转到search

- 给共同的父级元素（尽量加给最近的） `.container` 添加事件监听

- 问题1: 怎么知道点击的是不是a标签

  - 给a标签添加自定义属性，其中有的属性是每个a标签都有的

- 问题2: 怎么知道点击的是一级还是二级还是三级
  
  - 不同级添加不同的自定义属性
  
      ```html
      <a href="javascript:;" :data-categoryName='c1.categoryName' :data-category1Id='c1.categoryId'>{{c1.categoryName}}</a>
    ```
  
- 问题3: 参数怎么携带，要携带哪些参数
  
    - 自定义属性携带query参数，通过解构 `event.target.dataset` 获取
      - **注意 `event.target.dataset` 会把属性名转为全小写，而我们自己定义的时候多采用驼峰**

```js
// @/components/TypeNav/index.vue

// 点击全部商品分类回调（绑定给共同的父级元素）
toSearch(event) {
  //event 就是我们的事件对象（是浏览器封装的）
  let target = event.target //就是我们的目标元素（真正发生事件的儿子元素）
  let data = target.dataset //拿到目标元素身上所有的自定义属性组成的对象
  // data当中存在categoryname那么就是点击的a标签
  let {categoryname,category1id,category2id,category3id} = data
	
  //点击的就是a标签
  if(categoryname){
    let location = {
      name:'search'
    }
    // 提前定义好location的query属性，后面添加属性即可
    let query = {
      categoryName:categoryname
    }
    if(category1id){
      query.category1Id = category1id
    }else if(category2id){
      query.category2Id = category2id
    }else{
      query.category3Id = category3id
    }
    //到了这query参数就收集ok
    location.query = query


    //点击类别的时候带的是query参数，我们得去看看原来有没有params参数(用户搜素的关键字)，有的话也得带上
    if(this.$route.params){
      location.params = this.$route.params
    }

    this.$router.push(location)
  }//else{
  //   //点击不是a标签，不关心
  // }
},
```

#### 13. 处理三级分类列表数据多次请求的问题

- 之前我们是在 `TypeNav` 组件内部发请求，由于`TypeNav` 组件是多个页面公用，每次切换页面都会发送请求，这样做浪费带宽并且增加服务器负担
- 解决：放在 `app` 当中去发送请求，只用执行一次

```vue
<script>
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default {
  name: 'App',
  components:{
    Header,
    Footer
  },
  mounted() {
    this.getCategoryList();
  },
  methods:{
    getCategoryList() {
      this.$store.dispatch("getCategoryList");
    },
  }
}
</script>
```

#### 14. 公用组件TypeNav一级列表的初始显示隐藏

- 像这样频繁操作的显示隐藏用 `v-show`

```html
<div class="sort" v-show="isShow">
</div>
```

- 在 `mounted` 的时候判断当前路由是否为 `home`，修改变量 `isShow` 的值（默认为true），使非 `Home` 组件的`TypeNav` 隐藏

```js
mounted() {
  if (this.$route.path !== '/home') {
    this.isShow = false;
  }
  // 请求放到app中去发
  // this.getCatagoryList();
},
```

#### 15. 事件控制TypeNav一级列表在非Home组件的移入移出显示隐藏

- 给外层div添加移入移出事件
  - 第9步控制class的时候 `mouseleave`事件只需要一条语句 `currentIndex = -1`，这里丰富了功能，所以定义成完整的方法 `moveOutDiv`

```js
<div @mouseleave="moveOutDiv" @mouseenter="moveInDiv">
</div>
```

```js
moveInDiv(){
  this.isShow = true
},
moveOutDiv(){
  // 非home组件移出隐藏
  this.currentIndex = -1
  // home组件不受移出影响
  if(this.$route.path !== '/home'){
    this.isShow = false
  };
};
```

#### 16. 给三级分类添加过渡效果

- 给三级分类外层添加组件标签 `transition`，并起一个 `name`

```vue
<transition name="show">
    <div class="sort" v-show="isShow">
    </div>
</transition>
```

- 添加样式（注意添加在自身div样式下）

```css
.sort {
  ...

  &.show-enter {
    opacity: 0;
    height: 0;
  }

  &.show-leave {
    opacity: 1;
    height: 461px;
  }

  &.show-enter-active {
    transition: all .5s;
  }

  ...
}
```

#### 17. 合并分类的query参数和搜索关键字的params参数

- 点击search按钮的时候，去看看之前有没有query参数要带上

```js
// @/components/Header/index.vue

toSearch() {
  let location = {
    // path: '/',
    // params传参的对象写法必须是name+params组合，query传参没有硬性要求
    name: 'search',
    params: {
      // 如果直接传空串，路径会出问题
      keyword: this.keyword || undefined,  // undefined代表什么都不传
    },
    // query: {
    //   keyword: this.keyword.toUpperCase(),
    // }
  };

  // 点击搜索的时候应该去看看以前有没有query参数 （路由当中有没有）
  if (this.$route.query) {
    location.query = this.$route.query;
  };

  // this.$router.push('/search'); //
  // this.$router.push(location).catch(() => {}); // 不能一劳永逸
  this.$router.push(location);
};
```

- 点击类别选项的时候，去看看之前有没有params参数要带上
  - 见第12步 `toSearch`函数

#### 18. 使用mockjs模拟数据接口

- 设计ListContainer和Floor组件的json数据：`banner.json`, `floor.json`

- 使用<a href='mockjs.com'>mockjs</a>模拟数据接口，**其实就是给我们的json数据指定一个url路径去做请求**

  - 安装

    ```shell
    npm install mockjs
    ```

  - 使用：定义在 `src/mock/mockServer.js` 中

    ```js
    import mock from 'mockjs';
    import banner from './banner.json';
    import floor from '@/mock/floor';
    
    /* mock方法就是用来让我们模拟接口使用的
    	第一个参数是模拟的接口路径
    	第二个参数是返回的数据
    */
    mock.mock('/mock/banner',{code:200, data:banner}); 
    mock.mock('/mock/floor',{code:200, data:floor}) ;
    ```

  - 不要忘记在 `main` 中直接引入 `mockServer.js`

  - 在 `@/ajax` 下创建 `mockAjax.js`

    - 复制 `Ajax.js` 文件将请求基础路径修改为 `/mock` 即可
    - mock会拦截我们的ajax请求，不会真正去发送请求

    ```js
    const instance = axios.create({
      baseURL: '/mock',  // 往本地发请求（配置的proxy会判断）
      timeout: 20000, 
    });
    ```

  - mock数据支持一些随机语法，可以看<a href='http://mockjs.com/examples.html'>官方文档</a>

#### 19. mock数据的api接口请求函数

- 依旧定义在 `@/api/index.js` 中

```js
...
import mockAjax from '@/ajax/mockAjax';

//请求banner和floor mock的接口请求函数
export const reqBannerList = () => {
  return mockAjax({
    url:'/banner',
    method:'get' // mock数据的请求方式都是get
  })
};

export const reqFloorList = () => {
  return mockAjax({
    url:'/floor',
    method:'get'
  })
};
```

#### 20. mock数据的vuex编码

- 和categoryList的获取几乎一致，把mock接口当真正接口对待就好了
  - 接着编辑 `@/store/home.js`

```js
import {reqCategoryList,reqBannerList,reqFloorList} from '@/api';

const state = {
  categoryList:[],
  bannerList:[],
  floorList:[],
};
const mutations = {
  //直接修改数据  （不允许出现if  for  异步操作）
  RECEIVECATEGORYLIST(state,categoryList){
    state.categoryList = categoryList
  },
  RECEIVEBANNERLIST(state,bannerList){
    state.bannerList = bannerList
  },
  RECEIVEFLOORLIST(state,floorList){
    state.floorList = floorList
  },
};
const actions = {
  //异步请求获取数据  允许if  for  异步操作
  async getCategoryList({commit}){
    const result = await reqCategoryList();
    if(result.code === 200){
      commit('RECEIVECATEGORYLIST',result.data);
    }
  },

  async getBannerList({commit}){
    const result = await reqBannerList();
    if(result.code === 200){
      commit('RECEIVEBANNERLIST',result.data);
    }
  },
  async getFloorList({commit}){
    const result = await reqFloorList();
    if(result.code === 200){
      commit('RECEIVEFLOORLIST',result.data);
    }
  },
  
};
const getters = {
  // categoryList1(state){
  //   return state.categoryList;
  // }
};

export default {
  state,
  mutations,
  actions,
  getters
};
```

#### 21. 获取mock数据展示到 ListContainer 和 Floor

- 分析数据结构

![image-20200816154604530](/Users/toonoisy/Library/Application Support/typora-user-images/image-20200816154604530.png)

![image-20200816154907878](/Users/toonoisy/Library/Application Support/typora-user-images/image-20200816154907878.png)

- 注意使用mock数据的图片要全部挪到 `public/images` 下
- 接着编辑`@/pages/home/ListContainer`，从vuex中拿数据+展示

```vue
<template>
  <div class="list-container">
    <div class="sortList clearfix">
      <div class="center">
        <!--banner轮播，后续会抽成单独的模块-->
        <div class="swiper-container" ref="banner">
          <div class="swiper-wrapper">
            <div class="swiper-slide" v-for="banner in bannerList" :key="banner.id">
              <img :src="banner.imgUrl" />
            </div>
          </div>
          <div class="swiper-pagination"></div>
          <div class="swiper-button-prev"></div>
          <div class="swiper-button-next"></div>
        </div>
      </div>
      <div class="right">
        <div class="news">
          <h4>
            <em class="fl">尚品汇快报</em>
            <span class="fr tip">更多 ></span>
          </h4>
          <div class="clearix"></div>
          <ul class="news-list unstyled">
            <li>
              <span class="bold">[特惠]</span>备战开学季 全民半价购数码
            </li>
            <li>
              <span class="bold">[公告]</span>备战开学季 全民半价购数码
            </li>
            <li>
              <span class="bold">[特惠]</span>备战开学季 全民半价购数码
            </li>
            <li>
              <span class="bold">[公告]</span>备战开学季 全民半价购数码
            </li>
            <li>
              <span class="bold">[特惠]</span>备战开学季 全民半价购数码
            </li>
          </ul>
        </div>
        <ul class="lifeservices">
          <li class="life-item">
            <i class="list-item"></i>
            <span class="service-intro">话费</span>
          </li>
          <li class="life-item">
            <i class="list-item"></i>
            <span class="service-intro">机票</span>
          </li>
          <li class="life-item">
            <i class="list-item"></i>
            <span class="service-intro">电影票</span>
          </li>
          <li class="life-item">
            <i class="list-item"></i>
            <span class="service-intro">游戏</span>
          </li>
          <li class="life-item">
            <i class="list-item"></i>
            <span class="service-intro">彩票</span>
          </li>
          <li class="life-item">
            <i class="list-item"></i>
            <span class="service-intro">加油站</span>
          </li>
          <li class="life-item">
            <i class="list-item"></i>
            <span class="service-intro">酒店</span>
          </li>
          <li class="life-item">
            <i class="list-item"></i>
            <span class="service-intro">火车票</span>
          </li>
          <li class="life-item">
            <i class="list-item"></i>
            <span class="service-intro">众筹</span>
          </li>
          <li class="life-item">
            <i class="list-item"></i>
            <span class="service-intro">理财</span>
          </li>
          <li class="life-item">
            <i class="list-item"></i>
            <span class="service-intro">礼品卡</span>
          </li>
          <li class="life-item">
            <i class="list-item"></i>
            <span class="service-intro">白条</span>
          </li>
        </ul>
        <div class="ads">
          <img src="./images/ad1.png" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import Swiper from 'swiper';
import { mapState } from 'vuex';
export default {
  name: "ListContainer",
  mounted() {
    this.$store.dispatch('getBannerList');
  },
  computed: {
    ...mapState({
      bannerList: state => state.home.bannerList,
    }),
  },
};
</script>
```

- 由于有两个楼层，`Floor` 的数据我们在 `Home` 组件中请求获取

```vue
// @/pages/Home/index.vue

<template>
  <div>
    <TypeNav></TypeNav>
    <ListContainer></ListContainer>
    <Recommend></Recommend>
    <Rank></Rank>
    <Like></Like>
    <!-- 把当前遍历的floor数据传给Floor组件 -->
    <Floor v-for="floor in floorList" :key="floor.id" :floor='floor'></Floor>
    <Brand></Brand>
  </div>
</template>

<script>
import ListContainer from './ListContainer';
import Recommend from './Recommend';
import Rank from './Rank';
import Like from './Like';
import Floor from './Floor';
import Brand from './Brand';
import { mapState } from 'vuex';
import Swiper from 'swiper';

export default {
  name: 'Home',
  mounted() {
    this.$store.dispatch('getFloorList');
  },
  // floor有两个楼层，请求放在home发更合适
  computed: {
    ...mapState({
      floorList: state => state.home.floorList,
    }),
  },
  components: {
    ListContainer,
    Recommend,
    Rank,
    Like,
    Floor,
    Brand,
  }
}
</script>

<style lang="less" scoped>

</style>
```

- 接着编辑`@/pages/home/Floor`，展示数据

```vue
<template>
  <div class="floor">
    <div class="py-container">
      <div class="title clearfix">
        <h3 class="fl">{{floor.name}}</h3>
        <div class="fr">
          <ul class="nav-tabs clearfix">
            <!-- 用来展示的数据key写index可以 -->
            <li class="active" v-for="(nav, index) in floor.navList" :key="index">
              <a href="#tab1" data-toggle="tab">{{nav.text}}</a>
            </li>
          </ul>
        </div>
      </div>
      <div class="tab-content">
        <div class="tab-pane">
          <div class="floor-1">
            <div class="blockgary">
              <ul class="jd-list">
                <li v-for="(keyword, index) in floor.keywords" :key="index">{{keyword}}</li>
              </ul>
              <img :src="floor.imgUrl" />
            </div>
            <div class="floorBanner">
              <div class="swiper-container" ref="floorSwiper">
                <div class="swiper-wrapper">
                  <div class="swiper-slide" v-for="carousel in floor.carouselList" :key="carousel.id">
                    <img :src="carousel.imgUrl" />
                  </div>
              	</div>
                <div class="swiper-pagination"></div>
                <div class="swiper-button-prev"></div>
                <div class="swiper-button-next"></div>
              </div>
            </div>
            <div class="split">
              <span class="floor-x-line"></span>
              <div class="floor-conver-pit">
                <img :src="floor.recommendList[0]" />
              </div>
              <div class="floor-conver-pit">
                <img :src="floor.recommendList[1]" />
              </div>
            </div>
            <div class="split center">
              <img :src="floor.bigImg" />
            </div>
            <div class="split">
              <span class="floor-x-line"></span>
              <div class="floor-conver-pit">
                <img :src="floor.recommendList[2]" />
              </div>
              <div class="floor-conver-pit">
                <img :src="floor.recommendList[3]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Swiper from 'swiper';
export default {
  name: "Floor",
  // 声明接收属性
  props: ['floor',], // Home传过来的floor
};
</script>
```

#### 22. 使用swiper实现页面轮播的准备工作

- swiper的基本用法

  - 安装5版本，引入js（引入swiper模块即可）和css（公共css样式可以放main）

    ```shell
    npm i swiper@5
    ```

  - html基本结构，实例化等可以参考<a href='https://www.swiper.com.cn/usage/index.html'>官网</a>

- 解决swiper影响多个页面的bug

  - 给最外层容器 `.swiper-container`  添加 `ref`，通过 `this.$refs.xxx` 来找对应的轮播

#### 23. watch + nextTick解决ListContainer的swiper轮播

- **注意swiper必须在html结构形成后创建才会生效**
  - 现在我们的数据是动态的，如果在`monted` 内部去创建，数据还没请求回来，而页面结构是依赖数据v-for创建的，所以页面根本还未形成，轮播无效
    - 可以在`monted` 中使用延迟定时器去创建，但是不好
    - 也可以在 `updated` 中创建，但是页面有任何更新都会执行，影响效率
  - 最终方案：`watch` + `nextTick`
    - `watch` 一旦监视到数据变化就去实例化，太快了，页面结构也不一定形成，所以不能在 `watch` 中直接创建，而是要作为 `nextTick` 的回调
    - `nextTick`: 等待页面最近一次更新完成，才会调用它内部的回调（“拦路虎”）
      - 用 `this.$nextTick()` / `Vue.nextTick()` 都可
      - dom元素还未形成，但数据想往上面更新，就用nextTick

```vue
<script>
import Swiper from 'swiper';
import { mapState } from 'vuex';
export default {
  name: "ListContainer",
  mounted() {
    this.$store.dispatch('getBannerList');
    // swiper必须在html结构显示完成后创建才会生效，在mounted里实例化不合适
    // new Swiper (this.$refs.banner, {
    //   loop: true, // 循环模式选项      
    //   pagination: {
    //     el: '.swiper-pagination',
    //   },
    //   navigation: {
    //     nextEl: '.swiper-button-next',
    //     prevEl: '.swiper-button-prev',
    //   },
    // })
  },
  computed: {
    ...mapState({
      bannerList: state => state.home.bannerList,
    }),
  },
  // 如果想要的数据没有，就用computed去计算，有了就用watch去监视
  watch: {
    bannerList: {
      handler(newVal, oldVal) {
      /* 
        watch一旦监视到数据变化就去实例化，不给v-for时间，太快了
        最终方案：watch + nextTick
        nextTick: 等待页面最近一次更新完成，会调用它内部的回调
          - dom元素还未形成，但数据想往上面更新，就用nextTick
          - 用this.$nextTick() / Vue.nextTick() 都可
      */
        this.$nextTick(() => {
          new Swiper (this.$refs.banner, {
            // autoplay: true,
            loop: true, // 循环模式选项      
            pagination: {
              el: '.swiper-pagination',
            },
            navigation: {
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev',
            },
          });
        })
      },
    },
  },
};
</script>
```

#### 24. Floor的轮播直接在mounted当中实例化swiper

- 数据在组件v-for创建的时候就有了，不需要请求获取，所以在mounted里实例化ok

```vue
<script>
import Swiper from 'swiper';
import 'swiper/css/swiper.css';
export default {
  name: "Floor",
  props: ['floor',], // 声明接收属性
  mounted() {
    // 数据在组件v-for创建的时候就在home中请求获取了，所以在mounted里实例化ok
    new Swiper (this.$refs.floorSwiper, {
      loop: true, // 循环模式选项      
      pagination: {
        el: '.swiper-pagination',
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
    });
  },
};
</script>
```

#### 25. 使用监视的immediate配置让所有的轮播代码一致（为了抽取公共的组件）

- `ListContainer` 是在 `watch` 当中去创建swiper 因为组件创建的时候数据不一定更新
- `Floor` 是在 `mounted` 当中去创建swiper，因为内部组件创建的时候，数据已经存在了

- 加上 `immediate: true` 配置后，即使页面数据不改变，也能让回调执行一次，如此一来`Floor` 也可以在 `watch` 中实例化swiper

#### 26. 抽取公共的轮播组件

- 定义在 `@/components/Carousel/index.vue` 下

```vue
<template>
  <div class="swiper-container" ref="banner">
    <div class="swiper-wrapper">
      <div class="swiper-slide" v-for="banner in bannerList" :key="banner.id">
        <img :src="banner.imgUrl" />
      </div>
    </div>
    <div class="swiper-pagination"></div>
    <div class="swiper-button-prev"></div>
    <div class="swiper-button-next"></div>
  </div>
</template>

<script>
import Swiper from 'swiper';
import 'swiper/css/swiper.css';
export default {
  name: 'Carousel',
  props: ['bannerList'], // 使用轮播组件的页面传过来的数据
  // 想深度监视必须写成对象
  watch: {
    bannerList: {
      immediate: true, // 即使数据不改变，也能让回调执行一次
      handler(newVal, oldVal) {
        this.$nextTick(() => {
          new Swiper (this.$refs.banner, {
            // autoplay: true,
            loop: true, // 循环模式选项      
            pagination: {
              el: '.swiper-pagination',
            },
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

<style lang="less" scoped>

</style>
```

- 不要忘记在 `main.js` 中进行全局注册

```js
...
import 'swiper/css/swiper.css'; // 公共css样式可以放main

import Carousel from '@/components/Carousel';
Vue.component('Carousel', Carousel);
```

- 需要使用轮播的组件只要通过 `props` 传数据就可以了（接收的属性名必须都叫 `bannerList` ）

  - `@/pages/home/ListContainer`

    ```vue
    <Carousel :bannerList='bannerList'></Carousel>
    ```

  - `@/pages/home/Floor`

    ```vue
    <Carousel :bannerList='floor.carouselList'></Carousel>
    ```

