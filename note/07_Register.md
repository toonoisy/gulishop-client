#### 1. 登录和注册静态组件渲染及icons图片的共用

把icons图片挪到 `public/images` 下，再修改使用过该图片的路径

#### 2. 注册的简单逻辑

```js
// 请求注册
export const reqRegister = (userInfo) => {
  return Ajax({
    url: '/user/passport/register',
    method: 'POST',
    data: userInfo, // {mobile, password, code}
  });
} 
```

```js
const state = {
  userTempId: getUserTempId(), // 存给ajax用
  userInfo: JSON.parse(localStorage.getItem('USERINFO_KEY')) || {},
};
const mutations = {
  RECEIVEUSERINFO(state, userInfo) {
   state.userInfo = userInfo;
  },
};

const actions = {
	...
  // 如果没有返回数据，就直接写请求的action
  async register(context, userInfo) {
    const result = await reqRegister(userInfo);
    if(result.code === 200) {
      return 'ok'
    } else {
      return Promise.reject(new Error('failed'));
    }
  },
	...
};
...
```

```vue
<script>
  export default {
    name: 'Register',
    data() {
      return {
        mobile: '',
        code: '',
        password: '',
        password2: '',
      }
    },
    methods: {
      async register() {
        let {mobile, code, password, password2} = this;
        if (mobile && code && password && password2 && password === password2) { // 初步验证
          try {
            await this.$store.dispatch('register', {mobile, code, password});
            alert('注册成功，即将跳转');
            this.$router.push('/login');
          } catch (error) {
            alert(error.message);
          }
        }
      },
			...
    }
  }
</script>

```

#### 3. 注册验证码的处理

```html
<!-- 依赖src天然解决了跨域，但是后台不认可 -->
<!-- <img ref="code" src="http://182.92.128.115/api/user/passport/code" alt="code"> -->
<!-- 跨域了，但是我们配置了proxy解决，后台认可 -->
<img ref="code" src="/api/user/passport/code" alt="code" @click="resetCode">
```

```js
// 更新验证码
resetCode() {
  // 重新设置一次同样的src就会重新发请求了
  this.$refs.code.src ='/api/user/passport/code';
}
```

