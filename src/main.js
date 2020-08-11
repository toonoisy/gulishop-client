import Vue from 'vue'; // 默认不带解析器的版本 esm
import App from '@/App';
import router from '@/router';

Vue.config.productionTip = false;

new Vue({
  router, // 
  render: h => h(App) // 注册+使用+渲染App组件
}).$mount('#app');