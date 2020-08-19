import Home from '@/pages/Home';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Search from '@/pages/Search';
import Detail from '@/pages/Detail';
import AddCartSuccess from '@/pages/AddCartSuccess';
import ShopCart from '@/pages/ShopCart';

export default [
  // 专门配置各种路由（路径和组件之间都映射关系）
  {
    path: '/home',
    component: Home,
  },
  {
    path: '/search/:keyword?', // params参数需要接收，'?'代表params可传可不传
    component: Search,
    name: 'search',
    // props: true, // 把params当作属性传给相应的组件
    // props: {}, // 对象形式，用于额外传递静态数据，几乎不用
    // props(route) { // route 收集好参数的对象
    //   return {
    //     keyword: route.params.keyword,
    //     keyword2: route.query.keyword,
    //   }
    // }, // 把params和query一起映射为组件属性
  },
  {
    path: '/login',
    component: Login,
    meta: {
      isHide: true // 说明要隐藏footer
    },
  },
  {
    path: '/register',
    component: Register,
    meta: {
      isHide: true // 说明要隐藏footer
    },
  },
  {
    path: '/',
    redirect: '/home',
  },
  {
    path: '/detail/:skuId', // 选择一个skuId页面去跳转
    component: Detail,
  },
  {
    path: '/addcartsuccess', // 前台路由，切换组件
    component: AddCartSuccess,
  },
  {
    path: '/shopcart', // 前台路由，切换组件
    component: ShopCart,
  },

]; // 复数都是定义数组