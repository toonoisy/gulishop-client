import {getUserTempId} from '@/utils/userabout';
import { reqRegister, reqLogin, reqLogout } from "@/api";


const state = {
  /* 
    用户的临时身份标示userTempId
    在state里存一份,而不是直接在mounted中创建，为了方便获取，提高效率
    userTempId必须保存在一个永久保存的地方localStorage，并且尽量不要更改它
  */
  userTempId: getUserTempId(), // 存给ajax用
  userInfo: JSON.parse(localStorage.getItem('USERINFO_KEY')) || {},
};
const mutations = {
  RECEIVEUSERINFO(state, userInfo) {
   state.userInfo = userInfo;
  },
  RESETUSERINFO(state) {
    state.userInfo = {};
  }
};

const actions = {
  // 如果没有返回数据，就直接写请求的action
  async register(context, userInfo) {
    const result = await reqRegister(userInfo);
    if(result.code === 200) {
      return 'ok'
    } else {
      return Promise.reject(new Error('failed'));
    }
  },
  async login({commit}, userInfo) {
    const result = await reqLogin(userInfo);
    if(result.code === 200) {
      commit('RECEIVEUSERINFO', result.data);
      // 刷新页面后vuex中的数据就没了，要想实现自动登录，就要把登录后的信息存起来，方便vuex去取
      localStorage.setItem('USERINFO_KEY', JSON.stringify(result.data));
      return 'ok';
    } else {
      return Promise.reject(new Error('failed'));
    }
  },
  async logout({commit}) {
    const result = await reqLogout();
    if(result.code === 200) {
      localStorage.removeItem('USERINFO_KEY');
      commit('RESETUSERINFO');
      return 'ok';
    } else {
      return Promise.reject(new Error('failed'));
    }
  },
  
};
const getters = {};

export default {
  state,
  mutations,
  actions,
  getters,
};