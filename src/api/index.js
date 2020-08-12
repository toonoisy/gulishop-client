// 所有接口请求函数的文件
// 每个接口请求功能都定义成函数，以后哪里需要直接调用函数即可
import Ajax from '@/ajax/Ajax';

// 请求首页三级分类
export const reqCatagoryList = () => {
  return Ajax({
    url: '/product/getBaseCategoryList',
    method: 'GET',
  });
};

// reqCatagoryList();
