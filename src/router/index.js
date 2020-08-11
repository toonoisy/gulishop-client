import Vue from 'vue';
import VueRouter from 'vue-router';
import routes from '@/router/routes';

Vue.use(VueRouter); // 声明使用插件（vue官方/自定义插件都需要声明使用）

// 向外暴露一个路由器对象(管理多个路由)
const router = new VueRouter({
  // mode: 'history',
  routes
});

export default router;
