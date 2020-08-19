import Vue from 'vue';
import VueRouter from 'vue-router';
import routes from '@/router/routes';

Vue.use(VueRouter); // 声明使用插件（vue官方/自定义插件都需要声明使用）

const originPush = VueRouter.prototype.push; // 保存原始push函数，后面用的时候还能找到
const originReplace = VueRouter.prototype.replace;

VueRouter.prototype.push = function(location, onResolved, onRejected) {
  // 没有处理promise回调
  if (onResolved === undefined && onRejected === undefined) {
    return originPush.call(this, location).catch(() => {});
  };
  // 处理了
  return originPush.call(this, location, onResolved, onRejected);
}; // 只要出现{}，就是一个新的对象

VueRouter.prototype.replace = function(location, onResolved, onRejected) {
  if (!onResolved && !onRejected) {
    return originReplace.call(this, location).catch(() => {});
  };
  return originReplace.call(this, location, onResolved, onRejected);
};

// 向外暴露一个路由器对象(管理多个路由)
const router = new VueRouter({
  // mode: 'history',
  routes,
  scrollBehavior (to, from, savedPosition) {
    return { x: 0, y: 0 }
  },
});

export default router;
