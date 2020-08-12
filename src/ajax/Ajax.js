// 发送ajax请求模块，目的是对axios进行二次封装
import axios from 'axios';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

// 配置基础路径和超时限制
const instance = axios.create({
  baseURL: '/api', // 请求基础路径
  timeout: 20000, // 超时时间
});

instance.interceptors.request.use(config => {
  NProgress.start();
  // 处理config：请求报文/添加额外功能（进度条）
  return config; // 返回这个config再继续请求，发送对报文信息就是新的config对象
}); // 内部不涉及this直接用箭头

instance.interceptors.response.use(
  // 返回的响应不再需要从data属性当中拿数据，而是响应就是我们要的数据
  response => {
    NProgress.done();
    return response.data // 设置成默认返回响应报文信息 response.data
  }, 
  // 统一处理请求错误, 具体请求也可以选择处理或不处理
  error => {
    alert('发送请求失败' + error.message || '未知错误'); // 统一处理请求错误
    // return Promise.reject(new Error('请求失败')); // 如果要进一步处理，就返回一个失败的promise // ew Error() 自定义错误信息
    return new Promise(() => {}); // 如果不需要，就返回一个pending的promise终止promise链
  }
);

// 将axios工具暴露出去，后面发请求用
export default instance;
