<template>
  <div>
    <TypeNav />
    <div class="main">
      <div class="py-container">
        <!--bread-->
        <div class="bread">
          <ul class="fl sui-breadcrumb">
            <li>
              <a href="#">全部结果</a>
            </li>
          </ul>
          <ul class="fl sui-tag">
            <li class="with-x" v-show="searchParams.categoryName">
              {{searchParams.categoryName}}
              <i @click="removeCategoryName">×</i>
            </li>
            <li class="with-x" v-show="searchParams.keyword">
              {{searchParams.keyword}}
              <i @click="removeKeyword">×</i>
            </li>
            <!-- 用v-show时，如果trademark不存在，就设置为空串，否则是undefined会报错；v-if不会有这种情况 -->
            <li class="with-x" v-show="searchParams.trademark">
              {{(searchParams.trademark ? searchParams.trademark : '').split(':')[1]}} 
              <i @click="removeTrademark">×</i>
            </li>
            <li class="with-x" v-for="(prop, index) in searchParams.props" :key="index">
              {{prop.split(':')[1]}} 
              <i @click="removeProp(index)">×</i>
            </li>

          </ul>
        </div>

        <!--selector-->
        <SearchSelector @searchForTrademark='searchForTrademark' @searchForAttrValue='searchForAttrValue' />

        <!--details-->
        <div class="details clearfix">
          <div class="sui-navbar">
            <div class="navbar-inner filter">
              <ul class="sui-nav">
                <!-- 
                  1. 背景色谁有（加active类）
                  2. 图标的处理
                    - 用什么            iconfont在线 
                    - 在哪里显示         和背景色一样
                    - 什么时候切换上下
                  3. 点击切换排序规则
                -->
                <li :class="{active: orderFlag === '1'}" @click="changeOrder('1')">
                  <a href="#">
                    综合
                    <!-- 用对象绑定类使用最多 -->
                    <i class="iconfont" :class="{iconup: orderType === 'asc', icondown: orderType === 'desc'}" v-if="orderFlag === '1'"></i>
                  </a>
                </li>
                <li>
                  <a href="#">销量</a>
                </li>
                <li>
                  <a href="#">新品</a>
                </li>
                <li>
                  <a href="#">评价</a>
                </li>
                <li :class="{active: orderFlag === '2'}" @click="changeOrder('2')">
                  <a href="#">
                    价格
                    <i class="iconfont" :class="{iconup: orderType === 'asc', icondown: orderType === 'desc'}" v-if="orderFlag === '2'"></i>
                  </a>
                </li>
                <!-- <li>
                  <a href="#">价格⬇</a>
                </li> -->
              </ul>
            </div>
          </div>
          <div class="goods-list">
            <ul class="yui3-g">
              <li class="yui3-u-1-5" v-for="goods in goodsList" :key="goods.id">
                <div class="list-wrap">
                  <div class="p-img">
                    <router-link :to="`/detail/${goods.id}`">
                      <img v-lazy="goods.defaultImg" />
                    </router-link>
                    <!-- <a href="item.html" target="_blank"></a> -->
                  </div>
                  <div class="price">
                    <strong>
                      <em>¥</em>
                      <i>{{goods.price}}</i>
                    </strong>
                  </div>
                  <div class="attr">
                    <router-link :to="`/detail/${goods.id}`">
                      {{goods.title}}
                    </router-link>
                    <!-- <a target="_blank" href="item.html" title="促销信息，下单即赠送三个月CIBN视频会员卡！【小米电视新品4A 58 火爆预约中】">{{goods.title}}</a> -->
                  </div>
                  <div class="commit">
                    <i class="command">已有<span>2000</span>人评价</i>
                  </div>
                  <div class="operate">
                    <a href="success-cart.html" target="_blank" class="sui-btn btn-bordered btn-danger">加入购物车</a>
                    <a href="javascript:void(0);" class="sui-btn btn-bordered">收藏</a>
                  </div>
                </div>
              </li>

            </ul>
          </div>
          <MyPagination 
          :currentPageNum='searchParams.pageNo' 
          :total='goodsListInfo.total'
          :pageSize='searchParams.pageSize'
          :continueSize='5'
          @changePageNum='changePageNum'></MyPagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import SearchSelector from './SearchSelector/SearchSelector'
  import { mapGetters, mapState } from 'vuex';
  export default {
    name: 'Search',
    data() {
      return {
        // 初始化参数：用户所有可能搜索的条件
        searchParams: {
          category1Id: '',
          category2Id: '',
          category3Id: "",
          categoryName: "",
          keyword: "",
          order: "1:desc",
          // 初始页码
          pageNo: 1,
          pageSize: 2,
          props: [],
          trademark: "",
        }
      }
    },
    beforeMount() {
      this.handleSearchParams();
      // let {keyword} = this.$route.params;
      // let {categoryName, category1Id, category2Id, category3Id} = this.$route.query;
      // let searchParams = {
      //   ...searchParams,
      //   keyword,
      //   categoryName,
      //   category1Id,
      //   category2Id,
      //   category3Id,
      // };
      // // 如果某个参数是空串，就删掉这个属性
      // Object.keys(searchParams).forEach(item => {
      //   // 形参不能. 只能[]
      //   if (searchParams[item] === '') {
      //     delete searchParams[item];
      //   }
      // });
      // this.searchParams = searchParams;
    },
    mounted() {
      this.getGoodsListInfo();
    },
    methods: {
      getGoodsListInfo() {
        this.$store.dispatch('getGoodsListInfo', this.searchParams);
      },
      // 处理请求参数
      handleSearchParams() {
        let {keyword} = this.$route.params;
        let {categoryName, category1Id, category2Id, category3Id} = this.$route.query;
        let searchParams = {
          ...this.searchParams,
          keyword,
          categoryName,
          category1Id,
          category2Id,
          category3Id,
        };
        // 如果某个参数是空串，就删掉这个属性
        Object.keys(searchParams).forEach(item => {
          // 形参不能. 只能[]
          if (searchParams[item] === '') {
            delete searchParams[item];
          }
        });
        this.searchParams = searchParams;
      },
      removeCategoryName() {
        this.searchParams.pageNo = 1;
        this.searchParams.categoryName = '';
        // this.$router.push({name: 'search', params: this.$route.params});
        this.$router.replace({name: 'search', params: this.$route.params});
      },
      removeKeyword() {
        this.searchParams.pageNo = 1;
        this.$bus.$emit('clearKeyword'); // 通知header组件清空关键字（触发header在mounted中绑定的自定义事件）
        this.searchParams.keyword = '';
        // this.$router.push({name: 'search', query: this.$route.query});
        this.$router.replace({name: 'search', query: this.$route.query});
      },
      searchForTrademark(trademark) {
        this.searchParams.trademark = `${trademark.tmId}:${trademark.tmName}`;
        this.getGoodsListInfo();
      },
      removeTrademark() {
        this.searchParams.pageNo = 1;
        this.searchParams.trademark = '';
        this.getGoodsListInfo();
      },
      // 使用自定义事件组件通信（子向父），达到根据属性值搜索
      searchForAttrValue(attr, attrValue) {
        // 要先去判断props当中是否已经存在这个点击的属性值条件，如果有了就不需要再去发请求
        let num = this.searchParams.props.indexOf(`${attr.attrId}:${attrValue}:${attr.attrName}`)
        if(num !== -1) return 
        // let isTrue = this.searchParams.props.some(item => item === `${attr.attrId}:${attrValue}:${attr.attrName}`);
        // if (isTrue) return;
        // console.log(this.searchParams.props);
        this.searchParams.pageNo = 1;
        this.searchParams.props.push(`${attr.attrId}:${attrValue}:${attr.attrName}`); // ["属性ID:属性值:属性名"]
        this.getGoodsListInfo();
      },
      removeProp(index) {
        this.searchParams.pageNo = 1;
        this.searchParams.props.splice(index, 1);
        this.getGoodsListInfo();
      },
      //综合和价格排序切换规则
      changeOrder(orderFlag) {
        // 原始排序标志
        // let originOrderFlag = this.searchParams.order.split(':')[0];
        let originOrderFlag = this.orderFlag;
        // 原始排序类型
        // let originOrderType = this.searchParams.order.split(':')[1];
        let originOrderType = this.orderType;
        let newOrder = '';
        // 点的是同一个标志，只要改变排序类型就好
        if (orderFlag === originOrderFlag) {
          newOrder = `${originOrderFlag}:${originOrderType === 'desc' ? 'asc' : 'desc'}`;
        // 点的不是同一个标志，要改变排序标志，排序类型默认就好
        } else {
          newOrder = `${orderFlag}:desc`;
        };
        // 把新的排序规则给搜索参数
        this.searchParams.order = newOrder;
        this.getGoodsListInfo();
        this.searchParams.pageNo = 1;
      },
      changePageNum(page) {
        this.searchParams.pageNo = page;
        this.getGoodsListInfo();
      },
    },
    computed: {
      ...mapState({
        goodsListInfo: state => state.search.goodsListInfo,
      }),
      ...mapGetters(['goodsList']),
      // 为了优化代码可读性
      orderFlag() {
        return this.searchParams.order.split(':')[0];
      },
      orderType() {
        return this.searchParams.order.split(':')[1];
      },
    },
    watch: {
      $route() {
        this.handleSearchParams();
        this.getGoodsListInfo();
      }
    },
    components: {
      SearchSelector
    }
  }
</script>

<style lang="less" scoped>
  .main {
    margin: 10px 0;

    .py-container {
      width: 1200px;
      margin: 0 auto;

      .bread {
        margin-bottom: 5px;
        overflow: hidden;

        .sui-breadcrumb {
          padding: 3px 15px;
          margin: 0;
          font-weight: 400;
          border-radius: 3px;
          float: left;

          li {
            display: inline-block;
            line-height: 18px;

            a {
              color: #666;
              text-decoration: none;

              &:hover {
                color: #4cb9fc;
              }
            }
          }
        }

        .sui-tag {
          margin-top: -5px;
          list-style: none;
          font-size: 0;
          line-height: 0;
          padding: 5px 0 0;
          margin-bottom: 18px;
          float: left;

          .with-x {
            font-size: 12px;
            margin: 0 5px 5px 0;
            display: inline-block;
            overflow: hidden;
            color: #000;
            background: #f7f7f7;
            padding: 0 7px;
            height: 20px;
            line-height: 20px;
            border: 1px solid #dedede;
            white-space: nowrap;
            transition: color 400ms;
            cursor: pointer;

            i {
              margin-left: 10px;
              cursor: pointer;
              font: 400 14px tahoma;
              display: inline-block;
              height: 100%;
              vertical-align: middle;
            }

            &:hover {
              color: #28a3ef;
            }
          }
        }
      }

      .details {
        margin-bottom: 5px;

        .sui-navbar {
          overflow: visible;
          margin-bottom: 0;

          .filter {
            min-height: 40px;
            padding-right: 20px;
            background: #fbfbfb;
            border: 1px solid #e2e2e2;
            padding-left: 0;
            border-radius: 0;
            box-shadow: 0 1px 4px rgba(0, 0, 0, 0.065);

            .sui-nav {
              position: relative;
              left: 0;
              display: block;
              float: left;
              margin: 0 10px 0 0;

              li {
                float: left;
                line-height: 18px;

                a {
                  display: block;
                  cursor: pointer;
                  padding: 11px 15px;
                  color: #777;
                  text-decoration: none;
                }

                &.active {
                  a {
                    background: #e1251b;
                    color: #fff;
                  }
                }
              }
            }
          }
        }

        .goods-list {
          margin: 20px 0;

          ul {
            display: flex;
            flex-wrap: wrap;

            li {
              height: 100%;
              width: 20%;
              margin-top: 10px;
              line-height: 28px;

              .list-wrap {
                .p-img {
                  padding-left: 15px;
                  width: 215px;
                  height: 255px;

                  a {
                    color: #666;

                    img {
                      max-width: 100%;
                      height: auto;
                      vertical-align: middle;
                    }
                  }
                }

                .price {
                  padding-left: 15px;
                  font-size: 18px;
                  color: #c81623;

                  strong {
                    font-weight: 700;

                    i {
                      margin-left: -5px;
                    }
                  }
                }

                .attr {
                  padding-left: 15px;
                  width: 85%;
                  overflow: hidden;
                  margin-bottom: 8px;
                  min-height: 38px;
                  cursor: pointer;
                  line-height: 1.8;
                  display: -webkit-box;
                  -webkit-box-orient: vertical;
                  -webkit-line-clamp: 2;

                  a {
                    color: #333;
                    text-decoration: none;
                  }
                }

                .commit {
                  padding-left: 15px;
                  height: 22px;
                  font-size: 13px;
                  color: #a7a7a7;

                  span {
                    font-weight: 700;
                    color: #646fb0;
                  }
                }

                .operate {
                  padding: 12px 15px;

                  .sui-btn {
                    display: inline-block;
                    padding: 2px 14px;
                    box-sizing: border-box;
                    margin-bottom: 0;
                    font-size: 12px;
                    line-height: 18px;
                    text-align: center;
                    vertical-align: middle;
                    cursor: pointer;
                    border-radius: 0;
                    background-color: transparent;
                    margin-right: 15px;
                  }

                  .btn-bordered {
                    min-width: 85px;
                    background-color: transparent;
                    border: 1px solid #8c8c8c;
                    color: #8c8c8c;

                    &:hover {
                      border: 1px solid #666;
                      color: #fff !important;
                      background-color: #666;
                      text-decoration: none;
                    }
                  }

                  .btn-danger {
                    border: 1px solid #e1251b;
                    color: #e1251b;

                    &:hover {
                      border: 1px solid #e1251b;
                      background-color: #e1251b;
                      color: white !important;
                      text-decoration: none;
                    }
                  }
                }
              }
            }
          }
        }

        .page {
          width: 733px;
          height: 66px;
          overflow: hidden;
          float: right;

          .sui-pagination {
            margin: 18px 0;

            ul {
              margin-left: 0;
              margin-bottom: 0;
              vertical-align: middle;
              width: 490px;
              float: left;

              li {
                line-height: 18px;
                display: inline-block;

                a {
                  position: relative;
                  float: left;
                  line-height: 18px;
                  text-decoration: none;
                  background-color: #fff;
                  border: 1px solid #e0e9ee;
                  margin-left: -1px;
                  font-size: 14px;
                  padding: 9px 18px;
                  color: #333;
                }

                &.active {
                  a {
                    background-color: #fff;
                    color: #e1251b;
                    border-color: #fff;
                    cursor: default;
                  }
                }

                &.prev {
                  a {
                    background-color: #fafafa;
                  }
                }

                &.disabled {
                  a {
                    color: #999;
                    cursor: default;
                  }
                }

                &.dotted {
                  span {
                    margin-left: -1px;
                    position: relative;
                    float: left;
                    line-height: 18px;
                    text-decoration: none;
                    background-color: #fff;
                    font-size: 14px;
                    border: 0;
                    padding: 9px 18px;
                    color: #333;
                  }
                }

                &.next {
                  a {
                    background-color: #fafafa;
                  }
                }
              }
            }

            div {
              color: #333;
              font-size: 14px;
              float: right;
              width: 241px;
            }
          }
        }
      }
    }
  }
</style>