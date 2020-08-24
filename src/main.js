import Vue from 'vue'; // 默认不带解析器的版本 esm
import App from '@/App';
import router from '@/router';
import store from '@/store';
import '@/mock/mockServer';
import 'swiper/css/swiper.css'; // 公共css样式放main
import * as API from '@/api';
import './validate';

import { MessageBox, Message, Pagination } from 'element-ui';
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$message = Message;
Vue.use(Pagination);

import VueLazyload from 'vue-lazyload';
import loading from '@/assets/images/loading.gif';
Vue.use(VueLazyload, { // 内部自定义了一个指令lazy
  loading,  // 指定未加载得到图片之前的loading图片
})

// import '@/api'; // 测试用

// 定义 引入 注册 使用
import TypeNav from '@/components/TypeNav';
import Carousel from '@/components/Carousel';
// import Pagination from '@/components/Pagination';
Vue.component('TypeNav', TypeNav); // 全局注册公共使用的TypeNav组件
Vue.component('Carousel', Carousel);
// Vue.component('Pagination', Pagination);

Vue.config.productionTip = false;

new Vue({
  beforeCreate() {
    Vue.prototype.$bus = this; // 配置全局事件总线
    Vue.prototype.$API = API; // 让所有组件对象都能用API对象
  },
  render: h => h(App), // 注册+使用+渲染App组件
  router, 
  store,
}).$mount('#app');