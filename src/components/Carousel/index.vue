<template>
  <div class="swiper-container" ref="banner">
    <div class="swiper-wrapper">
      <div class="swiper-slide" v-for="banner in bannerList" :key="banner.id">
        <img :src="banner.imgUrl" />
      </div>
      <!-- <div class="swiper-slide">
        <img src="./images/banner2.jpg" />
      </div>
      <div class="swiper-slide">
        <img src="./images/banner3.jpg" />
      </div>
      <div class="swiper-slide">
        <img src="./images/banner4.jpg" />
      </div> -->
    </div>
    <div class="swiper-pagination"></div>
    <div class="swiper-button-prev"></div>
    <div class="swiper-button-next"></div>
  </div>
</template>

<script>
import Swiper from 'swiper';

export default {
  name: 'Carousel',
  props: ['bannerList'],
  watch: {
    bannerList: {
      immediate: true, // 即使数据不改变，也能让回调执行一次（虽然这里没卵用，但是轮播功能代码一致了）
      handler(newVal, oldVal) {
      /* 
        watch一旦监视到数据变化就去实例化，不给v-for时间，太快了
        最终方案：watch + nextTick
        nextTick: 等待页面最近一次更新完成，会调用它内部的回调
          dom元素还未形成，但数据想往上面更新，就用nextTick
            this.$nextTick() / Vue.nextTick() 都可
      */
        this.$nextTick(() => {
          new Swiper (this.$refs.banner, {
            // autoplay: true,
            loop: true, // 循环模式选项      
            // 如果需要分页器
            pagination: {
              el: '.swiper-pagination',
            },
            // 如果需要前进后退按钮
            navigation: {
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev',
            },
          });
        })
      },
    },
  },
}
</script>

<style lang="less" scoped>

</style>