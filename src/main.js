import Vue from 'vue'; // 默认不带解析器的版本 esm
import App from '@/App';

new Vue({
  render: h => h(App) // 注册+使用+渲染App组件
}).$mount('#app');