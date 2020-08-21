<template>
  <div class="cart">
    <h4>全部商品</h4>
    <div class="cart-main">
      <div class="cart-th">
        <div class="cart-th1">全部</div>
        <div class="cart-th2">商品</div>
        <div class="cart-th3">单价（元）</div>
        <div class="cart-th4">数量</div>
        <div class="cart-th5">小计（元）</div>
        <div class="cart-th6">操作</div>
      </div>
      <div class="cart-body">
        <ul class="cart-list" v-for="item in shopCartList" :key="item.id">
          <li class="cart-list-con1">
          <!-- 
            处理checkbox交互两种方案：
              - v-model
              - :checked + @click
          -->
            <input type="checkbox" name="chk_list" :checked="item.isChecked === 1" @click="updateOne(item)">
          </li>
          <li class="cart-list-con2">
            <img :src="item.imgUrl">
            <div class="item-msg">{{item.skuName}}</div>
          </li>
          <!-- <li class="cart-list-con3">
            <div class="item-txt">语音升级款</div>
          </li> -->
          <li class="cart-list-con4">
            <span class="price">{{item.cartPrice}}</span>
          </li>
          <li class="cart-list-con5">
            <a href="javascript:void(0)" class="mins" @click="updateItemNum(item, -1)">-</a>
            <!-- change: 一定要有数据改变才触发，blur: 一旦失去焦点就触发 -->
            <!-- event.target.value本身是个字符串 -->
            <input autocomplete="off" type="text" :value="item.skuNum" minnum="1" class="itxt" @change="updateItemNum(item, +$event.target.value)">
            <a href="javascript:void(0)" class="plus" @click="updateItemNum(item, 1)">+</a>
          </li>
          <li class="cart-list-con6">
            <span class="sum">{{item.cartPrice * item.skuNum}}</span>
          </li>
          <li class="cart-list-con7">
            <a href="javascript:;" class="sindelet" @click="deleteOne(item)">删除</a>
            <br>
            <a href="#none">移到收藏</a>
          </li>
        </ul>
      </div>
    </div>
    <div class="cart-tool">
      <div class="select-all">
        <input class="chooseAll" type="checkbox" v-model="isCheckAll">
        <span>全选</span>
      </div>
      <div class="option">
        <a href="javascript:;" @click="deleteAllChecked">删除选中的商品</a>
        <a href="#none">移到我的关注</a>
        <a href="#none">清除下柜商品</a>
      </div>
      <div class="money-box">
        <div class="chosed">已选择
          <span>{{checkedNum}} </span>件商品</div>
        <div class="sumprice">
          <em>总价（不含运费） ：</em>
          <i class="summoney">{{totalAmount}}</i>
        </div>
        <div class="sumbtn">
          <router-link to="/trade" class="sum-btn" >结算</router-link>
          <!-- <a class="sum-btn" href="###" target="_blank">结算</a> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapState} from 'vuex';
  export default {
    name: 'ShopCart',
    mounted() {
      this.getShopCartList();
    },
    methods: {
      getShopCartList() {
        this.$store.dispatch('getShopCartList');
      },
      // 更新商品数量
      async updateItemNum(item, modNum) {
        if (item.skuNum + modNum < 1) {
          modNum = 1 - item.skuNum; // modNum和原数量相加至少得是1，如果小于1要修正modNum
        };
        // 要根据结果去做处理，所以用async...await + try...catch
        try {
          // 发请求去处理数量，返回成功后重新请求数据
          await this.$store.dispatch('addOrUpdateCart', {skuId:item.skuId, skuNum:modNum});
          this.getShopCartList();
        } catch (error) {
          alert(error.message);
        }
      },
      // 切换单个选中状态
      async updateOne(item) {
        try {
          await this.$store.dispatch('updateIsChecked', {skuId:item.skuId, isChecked: +!item.isChecked}); // 注意isChecked要传的值是数字0/1，取反会变成布尔，要再用一元+转成数字
          this.getShopCartList();
        } catch (error) {
          alert(error.message);
        }
      },
      async deleteOne(item) {
        try {
          await this.$store.dispatch('deleteItem', item.skuId)
          this.getShopCartList();
        } catch (error) {
          alert(error.message);
        }
      },
      async deleteAllChecked() {
        try {
          await this.$store.dispatch('deleteAllChecked');
          this.getShopCartList();
        } catch (error) {
          alert(error.message);
        }
      }

    },
    computed: {
      ...mapState({
        shopCartList: state => state.shopcart.shopCartList,
      }),
      isCheckAll: {
        get() {
          return this.shopCartList.every(item => item.isChecked === 1) && this.shopCartList.length > 0; // 所有商品都被选中且列表长度不能为0，返回true
        },
        async set(val) {
          // 一旦状态有变，要让所有选项都修改成最新的val状态（true or false）
          try {
            // checkbox默认传true/false，我们要和1/0对应
            const result = await this.$store.dispatch('updateAllIsChecked', val ? 1: 0);
            console.log(result);
            this.getShopCartList();
          } catch (error) {
            alert(error.message);
          }
        },
      },
      // 统计选中商品的数量
      // 统计用reduce (回调，初始值)
      checkedNum() {
        return this.shopCartList.reduce((acc, cur, index) => {
          if (cur.isChecked === 1) {
            acc += cur.skuNum;
          }
          return acc;
        }, 0)
      },
      totalAmount() {
        return this.shopCartList.reduce((acc, cur, index) => {
          if (cur.isChecked === 1) {
            acc += cur.skuNum * cur.skuPrice;
          }
          return acc;
        }, 0)
      }
    },
  }
</script>

<style lang="less" scoped>
  .cart {
    width: 1200px;
    margin: 0 auto;

    h4 {
      margin: 9px 0;
      font-size: 14px;
      line-height: 21px;
    }

    .cart-main {
      .cart-th {
        background: #f5f5f5;
        border: 1px solid #ddd;
        padding: 10px;
        overflow: hidden;

        &>div {
          float: left;
        }

        .cart-th1 {
          width: 25%;

          input {
            vertical-align: middle;
          }

          span {
            vertical-align: middle;
          }
        }

        .cart-th2 {
          width: 25%;
        }

        .cart-th3,
        .cart-th4,
        .cart-th5,
        .cart-th6 {
          width: 12.5%;

        }
      }

      .cart-body {
        margin: 15px 0;
        border: 1px solid #ddd;

        .cart-list {
          padding: 10px;
          border-bottom: 1px solid #ddd;
          overflow: hidden;

          &>li {
            float: left;
          }

          .cart-list-con1 {
            width: 15%;
          }

          .cart-list-con2 {
            width: 35%;

            img {
              width: 82px;
              height: 82px;
              float: left;
            }

            .item-msg {
              float: left;
              width: 150px;
              margin: 0 10px;
              line-height: 18px;
            }
          }

          // .cart-list-con3 {
          //   width: 20.8333%;

          //   .item-txt {
          //     text-align: center;
          //   }
          // }

          .cart-list-con4 {
            width: 10%;

          }

          .cart-list-con5 {
            width: 17%;

            .mins {
              border: 1px solid #ddd;
              border-right: 0;
              float: left;
              color: #666;
              width: 6px;
              text-align: center;
              padding: 8px;
            }

            input {
              border: 1px solid #ddd;
              width: 40px;
              height: 33px;
              float: left;
              text-align: center;
              font-size: 14px;
            }

            .plus {
              border: 1px solid #ddd;
              border-left: 0;
              float: left;
              color: #666;
              width: 6px;
              text-align: center;
              padding: 8px;
            }
          }

          .cart-list-con6 {
            width: 10%;

            .sum {
              font-size: 16px;
            }
          }

          .cart-list-con7 {
            width: 13%;

            a {
              color: #666;
            }
          }
        }
      }
    }

    .cart-tool {
      overflow: hidden;
      border: 1px solid #ddd;

      .select-all {
        padding: 10px;
        overflow: hidden;
        float: left;

        span {
          vertical-align: middle;
        }

        input {
          vertical-align: middle;
        }
      }

      .option {
        padding: 10px;
        overflow: hidden;
        float: left;

        a {
          float: left;
          padding: 0 10px;
          color: #666;
        }
      }

      .money-box {
        float: right;

        .chosed {
          line-height: 26px;
          float: left;
          padding: 0 10px;
        }

        .sumprice {
          width: 200px;
          line-height: 22px;
          float: left;
          padding: 0 10px;

          .summoney {
            color: #c81623;
            font-size: 16px;
          }
        }

        .sumbtn {
          float: right;

          a {
            display: block;
            position: relative;
            width: 96px;
            height: 52px;
            line-height: 52px;
            color: #fff;
            text-align: center;
            font-size: 18px;
            font-family: "Microsoft YaHei";
            background: #e1251b;
            overflow: hidden;
          }
        }
      }
    }
  }
</style>