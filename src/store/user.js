import {getUserTempId} from '@/utils/userabout';

const state = {
  /* 
    用户的临时身份标示userTempId
    在state里存一份,而不是直接在mounted中创建，为了方便获取，提高效率
    userTempId必须保存在一个永久保存的地方localStorage，并且尽量不要更改它
  */
 userTempId: getUserTempId(), // 存给ajax用
};
const mutations = {};
const actions = {};
const getters = {};

export default {
  state,
  mutations,
  actions,
  getters,
};