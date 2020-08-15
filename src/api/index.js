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