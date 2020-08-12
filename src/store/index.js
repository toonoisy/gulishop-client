import Vue from 'vue';
import Vuex from 'vuex';
import home from './home';
import user from './user';

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
    user
  }
});