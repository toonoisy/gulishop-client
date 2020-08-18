import {reqGoodsDetailInfo} from '@/api';

const state = {
  goodsDetailInfo: {},
};
const mutations = {
  RECEIVEGOODSDETAILINFO(state, goodsDetailInfo) {
    state.goodsDetailInfo = goodsDetailInfo;
  }
};
const actions = {
  async getGoodsDetailInfo({commit}, skuId) {
    const result = await reqGoodsDetailInfo(skuId);
    if (result.code === 200) {
      commit('RECEIVEGOODSDETAILINFO', result.data);
    }
  }
};
// 把内部复杂数据先计算出来
const getters = {
  categoryView(state) {
    return state.goodsDetailInfo.categoryView || {};
  },
  skuInfo(state) {
    return state.goodsDetailInfo.skuInfo || {};
  },
  spuSaleAttrList(state) {
    return state.goodsDetailInfo.spuSaleAttrList || [];
  },
};

export default {
  state,
  mutations,
  actions,
  getters,
};