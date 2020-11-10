#### 1. 基本配置

- 搬静态组件
- 配路由
- 接口请求函数

```js
// 请求获取支付页面的支付信息
export const reqPaymentInfo = (orderId) => {
  return Ajax({
    url: `/payment/weixin/createNative/${orderId}`,
    method: 'GET',
  });
}

// 请求获取订单支付状态
export const reqPaymentStatus = (orderId) => {
  return Ajax({
    url: `/payment/weixin/queryPayStatus/${orderId}`,
    method: 'GET',
  });
}
```

- 组件内发请求
  - 这里我们依旧不存vuex，直接在data中定义数据

```js
    data() {
      return {
        paymentInfo: {},
        status: '', // 订单支付状态
      }
    },
    mounted() {
      this.getPaymentInfo();
    },
    methods: {
      async getPaymentInfo() {
        const result = await this.$API.reqPaymentInfo(this.$route.query.orderId);
        if (result.code === 200) {
          this.paymentInfo = result.data;
        }
      },
      ...
    },
```

#### 2. 数据展示（不包括消息框）

- 订单号 ---> orderId（route中取）
- 应付金额 ---> paymentInfo.totalFee

#### 3. 使用qrcode生成二维码图片

- 完整安装使用可参考<a href='https://github.com/soldair/node-qrcode'>官网</a>

```shell
npm install --save qrcode
```

```js
import QRCode from "qrcode";
```

#### 4. 使用element-ui做消息框

- 安装

```shell
npm i element-ui -S
```

- 安装插件并修改babel.config.js配置以支持部分引入，可参考<a href='https://element.eleme.cn/#/zh-CN/component/quickstart'>官方指南</a>
  - 记得重启项目使其生效

```shell
npm install babel-plugin-component -D
```

```js
{
	...
	"plugins": [
    [
      "component",
      {
        "libraryName": "element-ui",
        "styleLibraryName": "theme-chalk"
      }
    ]
  ]
}
```

- 在 `main.js` 中引入本次使用的 element-ui 组件

```js
//部分引入element-ui当中的 MessageBox, Message
import { MessageBox, Message } from 'element-ui';
Vue.prototype.$msgbox = MessageBox; // 消息框
Vue.prototype.$alert = MessageBox.alert; // 弹出消息框
Vue.prototype.$message = Message; // 消息提示

```

#### 5. 支付跳转的整个流程

1. 根据 paymentInfo 中的 codeUrl，使用qrcode生成要显示的微信二维码url

2. 使用element-ui的 `this.$alert` 弹出消息框显示二维码图片，使用需要显示html的消息框，弹出框更多配置可参考<a href='https://element.eleme.cn/#/zh-CN/component/message-box'>文档</a>

3. 弹出消息框后，循环定时器去查询支付状态

4. 如果支付成功，那么把支付成功的状态码保存在data当中，并且清除定时器，自动跳转到支付成功页面

   （需要放在messageBox的beforeClose回调当中去）

5. 如果点击我已成功支付，那么需要判断状态码是不是成功，成功就手动关闭提示框，不成功就消息提示不关闭
   （需要放在messageBox的beforeClose回调当中去）

6. 如果点击支付失败，那么需要有提示信息，同时要清除定时器，手动关闭提示框

7. 我们在测试时可以把支付功能简化，直接点击确认就能跳

```js
async pay() {
  //先生成二维码图片的路径
  // With promises
  try {
    //1\使用qrcode生成二维码
    const imgUrl = await QRCode.toDataURL(this.payInfo.codeUrl);
    console.log(imgUrl);

    //2\弹出一个消息框去展示二维码图片  
    this.$alert(`<img src="${imgUrl}" />`, "请使用微信扫码支付", {
      dangerouslyUseHTMLString: true,
      showClose: false,
      showCancelButton: true,
      cancelButtonText: "支付遇到问题",
      confirmButtonText: "我已成功支付",
      center: true,
      //4\点击按钮之后的处理及和第三步产生联系
      beforeClose: (action, instance, done) => {
        //关闭之前回调
        //如果不写这个回调，那么无论点击什么按钮，消息盒子都会强制关闭
        //如果写了这个回调，那么消息盒子的关闭由我们自己控制
        if (action === "confirm") {
          //真实的环境
          // if(this.status !== 200){
          //   this.$message.warning('请确认是否支付成功')
          // }

          //测试环境
          clearInterval(this.timer); // 只是停止给定编号的定时器（任意种类），并没有清空存储编号的变量
          this.timer = null; // 这样才真正清除了定时器
          done();
          //跳转过去之后手动关闭我们的弹出消息框
          this.$router.push("/paysuccess");
        } else if (action === "cancel") {
          this.$message.warning("请联系客服处理");
          clearInterval(this.timer); 
          this.timer = null;
          done(); // 手动关闭消息盒子，和this.$msgbox.close()效果一样
        }
      },
    }).then(() => {}).catch(() => {}); // this.$alert返回值也是promise，要处理；回调什么都不用写，（不能在这里写，因为无论点哪个按钮都会强制关闭消息框；要去beforeClose回调中写）

    //3\弹出消息同时循环的给后台发请求，获取该订单的支付状态数据
    //根据返回来的支付状态数据去决定要不要跳转到支付成功页面
    if (!this.timer) { // 为了保证只有一个定时器在生效
      this.timer = setInterval(async () => { // 把timer放在组件对象身上，哪里都能看到
        //每2秒发一次请求获取支付状态信息
        const result = await this.$API.reqOrderStatus(this.payInfo.orderId);
        if (result.code === 200) {
          //支付成功：
          //停止定时器  跳转到支付成功页面  把当前的状态保存起来 以便用户点击我已成功支付的时候去判定
          this.status = 200; // 把if判断跟上面的消息框建立关系
          clearInterval(this.timer); //clearInterval清除定时器，停止给定编号的定时器，并没有清空存储编号的变量
          this.timer = null;
          //跳转过去之后手动关闭我们的弹出消息框
          this.$msgbox.close();
          this.$router.push("/paysuccess");
        }
      }, 2000);
    }

  } catch (error) {
    this.$message.error("生成二维码失败" + error.message);
  }
},
```

