import {reqCatagoryList, reqBannerList, reqFloorList,} from '@/api';

const state = {
  catagoryList: [],
  bannerList: [],
  floorList: [],
};
const mutations = {
  RECEIVECATAGORYLIST(state, catagoryList) {
    state.catagoryList = catagoryList;
  },
  RECEIVEBANNERLIST(state, bannerList) {
    state.bannerList = bannerList;
  },
  RECEIVEFLOORRLIST(state, floorList) {
    state.floorList = floorList;
  },
};
const actions = {
  getCatagoryList({commit}) {
    reqCatagoryList().then((result) => {
      commit('RECEIVECATAGORYLIST', result.data);
    });
  },
  async getBannerList({commit}) {
    const result = await reqBannerList();
    if (result.code === 200) {
      commit('RECEIVEBANNERLIST', result.data);
    }
  },
  async getFloorList({commit}) {
    const result = await reqFloorList();
    if (result.code === 200) {
      commit('RECEIVEFLOORRLIST', result.data);
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