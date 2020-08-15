import mock from 'mockjs';
import banner from './banner'; // 把数据当作模块导入，不再是字符串，而是定义成什么就是什么
import floor from './floor';

// 用来模拟接口的方法 (模拟的接口路径，返回的数据)
mock.mock('/mock/banner', {code: 200, data: banner}); 
mock.mock('/mock/floor', {code: 200, data: floor}); 