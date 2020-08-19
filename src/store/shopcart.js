import { reqAddOrUpdateCart, reqShopCartList } from "@/api";

const state = {
  shopCartList: [],
};
const mutations = {
  RECEIVESHOPCARTLIST(state, shopCartList) {
    state.shopCartList = shopCartList;
  }
};

// 写一个异步请求的action
const actions = {
  // context 占位的
  // async返回的一定是一个promise，它的状态由async的return值决定
  async addOrUpdateCart(context, {skuId, skuNum}) {
    const result = await reqAddOrUpdateCart(skuId, skuNum);
    if(result.code === 200) {
      return 'ok';
    } else {
      // 不能返回一个正常值
      return Promise.reject(new Error('failed'));
      // throw Error('failed');
    }
  },
  async getShopCartList({commit}) {
    const result = await reqShopCartList();
    if(result.code === 200) {
      commit('RECEIVESHOPCARTLIST', result.data);
    }
  }
};
const getters = {};

export default {
  state,
  mutations,
  actions,
  getters,
};