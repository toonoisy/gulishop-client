import {reqCatagoryList} from '@/api';

const state = {
  catagoryList: [],
};
const mutations = {
  GETCATAGORYLIST(state, catagoryList) {
    state.catagoryList = catagoryList;
  }
};
const actions = {
  getCatagoryList({commit}) {
    reqCatagoryList().then((result) => {
      commit('GETCATAGORYLIST', result.data);
    });
  }
};
const getters = {};

export default {
  state,
  mutations,
  actions,
  getters,
};