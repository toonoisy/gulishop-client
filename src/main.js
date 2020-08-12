import Vue from 'vue'; // 默认不带解析器的版本 esm
import App from '@/App';
import router from '@/router';
import store from '@/store';
// import '@/api'; // 测试用

import TypeNav from '@/components/TypeNav';
Vue.component('TypeNav', TypeNav); // 全局注册公共使用的TypeNav组件

Vue.config.productionTip = false;

new Vue({
  render: h => h(App), // 注册+使用+渲染App组件
  router, 
  store,
}).$mount('#app');