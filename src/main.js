import Vue from 'vue'; // 默认不带解析器的版本 esm
import App from '@/App';
import router from '@/router';
import store from '@/store';
import '@/mock/mockServer';
import 'swiper/css/swiper.css'; // 公共css样式放main
// import '@/api'; // 测试用

import TypeNav from '@/components/TypeNav';
import Carousel from '@/components/Carousel';
Vue.component('TypeNav', TypeNav); // 全局注册公共使用的TypeNav组件
Vue.component('Carousel', Carousel);

Vue.config.productionTip = false;

new Vue({
  render: h => h(App), // 注册+使用+渲染App组件
  router, 
  store,
}).$mount('#app');