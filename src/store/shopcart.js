import { reqAddOrUpdateCart, reqShopCartList, reqUpdateIsChecked, reqDeleteItem } from "@/api";

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
  // 请求添加购物车或更新数量
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

  // 请求获取购物车列表
  async getShopCartList({commit}) {
    const result = await reqShopCartList();
    if(result.code === 200) {
      commit('RECEIVESHOPCARTLIST', result.data);
    }
  },

  // 请求更新单个选中状态
  async updateIsChecked(context, {skuId, isChecked}) {
    const result = await reqUpdateIsChecked(skuId, isChecked);
    if(result.code === 200) {
      return 'ok';
    } else {
      return Promise.reject(new Error('failed'));
    }
  },

  // 请求更新全部选中状态（全选全不选）
  // 只有更新单个状态的接口，所以只能逐个地发请求处理
  // 在请求更新全部状态的action里逐个dispatch请求更新单个的action，这样setter中只要dispatch当前这个action就好了（曲线救国）
  // dispatch不一定是用在组件里，也可以在一个action中dispatch另一个action
  async updateAllIsChecked({state, dispatch}, isChecked) { 
    let promises = [];
    state.shopCartList.forEach(item => {
      // 本身选中状态跟传过来要修改的一样，就不发请求
      if (item.isChecked === isChecked) return;
      // 如果有不一样的，就需要发请求，而且每一个请求都成功，才算成功 
      let promise = dispatch('updateIsChecked', {skuId:item.skuId, isChecked});
      promises.push(promise);
    });
    /* 
      处理多个promise的数组，如果都成功那么返回的promise才成功，结果是每个成功的结果数组,
      如果失败，返回第一个失败的promise的reason
    */
    return Promise.all(promises);
  },

  // 请求删除单个商品
  async deleteItem({commit}, skuId) {
    const result = await reqDeleteItem(skuId);
    if (result.code === 200) {
      return 'ok';
    } else {
      return Promise.reject(new Error('failed'));
    }

  },

  // 请求删除全部商品
  async deleteAllChecked({state, dispatch}) {
    // 遍历每一个选项，如果未被选中就不做更改，选中则触发deleteItem将其删掉
    let promises = [];
    state.shopCartList.forEach(item => {
      if (item.isChecked === 0) return;
      let promise = dispatch('deleteItem', item.skuId);
      promises.push(promise);
    })
    return Promise.all(promises);
  }
};
const getters = {};

export default {
  state,
  mutations,
  actions,
  getters,
};