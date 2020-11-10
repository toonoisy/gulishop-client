#### 1. 登录逻辑

```js
export const reqLogin = (userInfo) => {
  return Ajax({
    url: '/user/passport/login',
    method: 'POST',
    data: userInfo, // {mobile, password}
  });
}
```

```js
import {getUserTempId} from '@/utils/userabout';
import { reqRegister, reqLogin, reqLogout } from "@/api";


const state = {
  userTempId: getUserTempId(), // 存给ajax用
  userInfo: JSON.parse(localStorage.getItem('USERINFO_KEY')) || {},
};
const mutations = {
  RECEIVEUSERINFO(state, userInfo) {
   state.userInfo = userInfo;
  },
	...
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
```

- 只要碰到表单，一定要v-model收集数据
- 如果btn放在form中又没指定type，就默认是一个submit，注意prevent默认行为

```html
<form action="##">
  <div class="input-text clearFix">
    <span></span>
    <input type="text" placeholder="邮箱/用户名/手机号" v-model="mobile">
  </div>
  <div class="input-text clearFix">
    <span class="pwd"></span>
    <input type="text" placeholder="请输入密码" v-model="password">
  </div>
  <div class="setting clearFix">
    <label class="checkbox inline">
      <input name="m1" type="checkbox" value="2" checked="">
      自动登录
    </label>
    <span class="forget">忘记密码？</span>
  </div>
  <!-- 如果btn放在form中又没指定type，就默认是一个submit -->
  <button class="btn" @click.prevent="login">登&nbsp;&nbsp;录</button>
</form>
```

- 登录后跳转home页

```vue
<script>
  export default {
    name: 'Login',
    data() {
      return {
        mobile: '',
        password: '',
      }
    },
    methods: {
      async login() {
        // 收集数据参数，形成参数对象
        let {mobile, password} = this;
        if (mobile && password) {
          try {
            await this.$store.dispatch('login', {mobile, password});
            alert('登录成功，即将跳转');
            this.$router.push('/');
          } catch (error) {
            alert(error.message);
          }
        }
      }
    }
  }
</script>
```

- 登录成功后返回的数据要在 `Header` 上展示

```html
<!-- 登录和没登录两个结构 -->
<p v-if="$store.state.user.userInfo.name">
  <a href="javascript:;">{{$store.state.user.userInfo.name}}</a>
  <a href="javascript:;" class="register" @click="logout">退出登录</a>
</p>
<p v-else>
  <span>请</span>
  <router-link to='/login'>登录</router-link>
  <router-link to='/register' class="register">免费注册</router-link>
</p>
```

#### 2. 自动登录（状态保持，localstorage的存储）

- 刷新页面后vuex中的数据就没了，要想实现自动登录，就要把登录后的信息存起来，方便vuex去取

```js
const mutations = {
  RECEIVEUSERINFO(state, userInfo) {
   state.userInfo = userInfo;
  },
	...
};
```

```js
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
```

#### 3. 退出登录

```js
export const reqLogout = () => {
  return Ajax({
    url: '/user/passport/logout',
    method: 'GET',
  });
}
```

```js
RESETUSERINFO(state) {
  state.userInfo = {};
}
```

```js
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
```

#### 4. 登录后携带token去进行后续操作

- `userTempId`  未登录状态下的用户身份识别标识

- `token`  登录状态下的用户身份识别标识 

- 两个都存在的话，后台会合并临时id对应的信息到token对应的信息上

```js
instance.interceptors.request.use(config => {
  // 处理config(请求报文)，添加额外功能
  NProgress.start();
  // 把userTempId添加到每次请求的请求头中
  let userTempId = store.state.user.userTempId;
  config.headers.userTempId = userTempId;
  // 把登录后的token也添加到请求头
  let token = store.state.user.userInfo.token;
  if (token) {
    config.headers.token = token;
  }
  return config; // 返回这个config再继续请求，发送对报文信息就是新的config对象
});
```

