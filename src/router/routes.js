const Home = () => import('@/pages/Home'); // home是函数（具有特定功能的代码块），访问组件时才会调用
const Login = () => import('@/pages/Login'); 
const Register = () => import('@/pages/Register'); 
const Search = () => import('@/pages/Search'); 
const Detail = () => import('@/pages/Detail'); 
const AddCartSuccess = () => import('@/pages/AddCartSuccess'); 
const ShopCart = () => import('@/pages/ShopCart'); 
const Trade = () => import('@/pages/Trade'); 
const Pay = () => import('@/pages/Pay'); 
const PaySuccess = () => import('@/pages/PaySuccess'); 
const Center = () => import('@/pages/Center'); 
const MyOrder = () => import('@/pages/Center/MyOrder'); 
const GroupOrder = () => import('@/pages/Center/GroupOrder'); 
import store from '@/store';


// import Home from '@/pages/Home'; // home是对象（无序的键值对集合），写上直接加载
// import Login from '@/pages/Login';
// import Register from '@/pages/Register';
// import Search from '@/pages/Search';
// import Detail from '@/pages/Detail';
// import AddCartSuccess from '@/pages/AddCartSuccess';
// import ShopCart from '@/pages/ShopCart';
// import Trade from '@/pages/Trade';
// import Pay from '@/pages/Pay';
// import PaySuccess from '@/pages/PaySuccess';
// import Center from '@/pages/Center';
// import MyOrder from '@/pages/Center/MyOrder';
// import GroupOrder from '@/pages/Center/GroupOrder';

export default [
  // 专门配置各种路由（路径和组件之间都映射关系）
  {
    path: '/home',
    component: Home,
  },
  {
    path: '/search/:keyword?', // params参数需要:xxx接收，'?'代表params可传可不传
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
    // 路由独享守卫
    beforeEnter: (to, from, next) => {
      if (!store.state.user.userInfo.name) {
        next();
      } else {
        // 登录过了，登录页不让去
        next(false);
      }
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
    path: '/detail/:skuId', // 选择一个skuId页面去跳转 // params是路径的一部分，需要:xxx接收
    component: Detail,
  },
  {
    path: '/addcartsuccess', // 前台路由，切换组件
    component: AddCartSuccess,
    // 只有携带了skuNum和sessionStorage内部有skuInfo数据，才能看到添加购物车成功的界面
    beforeEnter: (to, from, next) => {
      let skuInfo = sessionStorage.getItem('SKUINFO_KEY');
      if (to.query.skuNum && skuInfo) {
        next();
      } else {
        next(false);
      }
    },
  },
  {
    path: '/shopcart', // 前台路由，切换组件
    component: ShopCart,
  },
  {
    path: '/trade', 
    component: Trade,
    beforeEnter: (to, from, next) => {
      if (from.path === '/shopcart') {
        next();
      } else {
        next(false);
      }
    },
  },
  {
    path: '/pay', 
    component: Pay,
    beforeEnter: (to, from, next) => {
      if (from.path === '/trade') {
        next();
      } else {
        next(false);
      }
    },
  },
  {
    path: '/paysuccess', 
    component: PaySuccess,
    beforeEnter: (to, from, next) => {
      if (from.path === '/pay') {
        next();
      } else {
        next(false);
      }
    },
  },
  {
    path: '/center', 
    component: Center,
    children: [
      {
        path: 'myorder',
        component: MyOrder,
      },
      {
        path: 'grouporder',
        component: GroupOrder,
      },
      {
        path: '',
        redirect: 'myorder',
      },
    ]
  },

  {
    path: '/communication',
    component: () => import('@/pages/Communication/Communication'),
    children: [
      {
        path: 'event',
        component: () => import('@/pages/Communication/EventTest/EventTest'),
        meta: {
          isHideFooter: true
        },
      },
      {
        path: 'model',
        component: () => import('@/pages/Communication/ModelTest/ModelTest'),
        meta: {
          isHideFooter: true
        },
      },
      {
        path: 'sync',
        component: () => import('@/pages/Communication/SyncTest/SyncTest'),
        meta: {
          isHideFooter: true
        },
      },
      {
        path: 'attrs-listeners',
        component: () => import('@/pages/Communication/AttrsListenersTest/AttrsListenersTest'),
        meta: {
          isHideFooter: true
        },
      },
      {
        path: 'children-parent',
        component: () => import('@/pages/Communication/ChildrenParentTest/ChildrenParentTest'),
        meta: {
          isHideFooter: true
        },
      },
      {
        path: 'scope-slot',
        component: () => import('@/pages/Communication/ScopeSlotTest/ScopeSlotTest'),
        meta: {
          isHideFooter: true
        },
      }
    ],
  },

]; // 复数都是定义数组