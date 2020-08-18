import {reqGoodsListInfo, } from '@/api';

const state = {
  goodsListInfo: {},
};
const mutations = {
  RECEIVEGOODSLISTINFO(state, goodsListInfo) {
    state.goodsListInfo = goodsListInfo;
  }
};
const actions = {
  async getGoodsListInfo({commit}, searchParams) {
    // 通过dispatch去调用的函数，第一个参数是context对象
    // 从第二个参数起，传递多个参数时要保存在对象中传递，只一个参数不需要
    const result = await reqGoodsListInfo(searchParams);
    if (result.code === 200) {
      commit('RECEIVEGOODSLISTINFO', result.data);
    }
  }
};
// 防止a.b.c出现假报错
const getters = {
  attrsList(state) {
    return state.goodsListInfo.attrsList || [];
  },
  goodsList(state) {
    return state.goodsListInfo.goodsList || [];
  },
  trademarkList(state) {
    return state.goodsListInfo.trademarkList || [];
  },
};

export default {
  state,
  mutations,
  actions,
  getters,
};