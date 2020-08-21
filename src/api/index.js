// 所有接口请求函数的文件
// 每个接口请求功能都定义成函数，以后哪里需要直接调用函数即可
import Ajax from '@/ajax/Ajax'; // 就是二次封装后的axios
import mockAjax from '@/ajax/mockAjax';

// 请求首页三级分类
export const reqCatagoryList = () => {
  return Ajax({
    url: '/product/getBaseCategoryList',
    method: 'GET',
  });
};
// reqCatagoryList();

// 请求banner和floor mock的数据
export const reqBannerList = () => {
  return mockAjax({
    url: '/banner',
    method: 'GET', // mock的数据都是get请求
  });
};
export const reqFloorList = () => {
  return mockAjax({
    url: '/floor',
    method: 'GET', // mock的数据都是get请求
  });
};

/* 
  searchParams 搜索参数，必须要有(不传报201，参数有问题)，至少是一个没有属性的空对象，由组件传递
  - 如果是空对象：搜索请求获取的是全部数据
  - 如果有搜索条件：代表搜索条件匹配的对象
*/
export const reqGoodsListInfo = (searchParams) => {
  return Ajax({
    url: '/list',
    method: 'POST',
    // 请求体参数
    data: searchParams,
  });
}
// reqGoodsListInfo({}); // 不传参报201

export const reqGoodsDetailInfo = (skuId) => {
  return Ajax({
    url: `/item/${skuId}`,
    method: 'GET',
  });
}

// 请求添加/修改购物车 
export const reqAddOrUpdateCart = (skuId, skuNum) => {
  return Ajax({
    url: `/cart/addToCart/${ skuId }/${ skuNum }`, // 请求路径
    method: 'POST',
  })
}

// 请求购物车列表数据
export const reqShopCartList = () => {
  return Ajax({
    url: '/cart/cartList',
    method: 'GET',
  });
}
// 对象写法
// export const reqShopCartList = () => Ajax.get('/cart/cartList');

// 请求更新单个状态
export const reqUpdateIsChecked = (skuId, isChecked) => {
  return Ajax({
    url: `/cart/checkCart/${skuId}/${isChecked}`,
    method: 'GET',
  });
}

// 删除一个购物车数据
export const reqDeleteItem = (skuId) => {
  return Ajax({
    url: `/cart/deleteCart/${skuId}`,
    method: 'DELETE',
  });
}

// 请求注册
export const reqRegister = (userInfo) => {
  return Ajax({
    url: '/user/passport/register',
    method: 'POST',
    data: userInfo, // {mobile, password, code}
  });
} 

export const reqLogin = (userInfo) => {
  return Ajax({
    url: '/user/passport/login',
    method: 'POST',
    data: userInfo, // {mobile, password}
  });
}

export const reqLogout = () => {
  return Ajax({
    url: '/user/passport/logout',
    method: 'GET',
  });
}

export const reqTradeInfo = () => {
  return Ajax({
    url: '/order/auth/trade',
    method: 'GET',
  });
}

export const reqSubmitOrder = (tradeNo, tradeInfo) => {
  return Ajax({
    url: `/order/auth/submitOrder?tradeNo=${tradeNo}`, // tradeNo 交易编号
    method: 'POST',
    data: tradeInfo,
  });
}

export const reqPaymentInfo = (orderId) => {
  return Ajax({
    url: `/payment/weixin/createNative/${orderId}`,
    method: 'GET',
  });
}

export const reqOrderStatus = (orderId) => {
  return Ajax({
    url: `/payment/weixin/queryPayStatus/${orderId}`,
    method: 'GET',
  });
}