import Vue from 'vue';
import Vuex from 'vuex';
import home from './home';
import user from './user';
import search from './search';
import detail from './detail';
import shopcart from './shopcart';
import trade from './trade';

Vue.use(Vuex);

const state = {};
const mutations = {};
const actions = {};
const getters = {};

export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters,
  // 将小的store合并进总的store
  modules: {
    home,
    user,
    search,
    detail,
    shopcart,
    trade
  }
});
