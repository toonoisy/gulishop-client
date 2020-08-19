<template>
  <div class="spec-preview">
    <!-- 
      a.b.c假报错：
      数据的传递和接收都需要计算时间，刚开始可能是个空的，所以出现报错，但数据真正拿到后页码又正常渲染了
      解决：把较复杂但属性a.b先算出来
    -->
    <img :src="defaultImg.imgUrl" />
    <!-- 移动时承载事件的div -->
    <div class="event" @mousemove="move"></div> 
    <div class="big">
      <img :src="defaultImg.imgUrl" ref='bigImg'/>
    </div>
    <div class="mask" ref='mask'></div>
  </div>
</template>

<script>
  export default {
    name: "Zoom",
    props: ['imgList'],
    mounted() {
      this.$bus.$on('changeDefaultIndex', this.changeDefaultIndex);
    },
    data() {
      return {
        defaultIndex: 0, // 默认下标 带橙色边框
      }
    },
    methods: {
      changeDefaultIndex(index) {
        this.defaultIndex = index; // 为了切换缩略图对应小图
      },
      move(event) {
        let mask = this.$refs.mask;
        let bigImg = this.$refs.bigImg;
        // client 相对于视口 page 页面 offset 元素本身
        // 鼠标位置
        let mouseX = event.offsetX;
        let mouseY = event.offsetY;
        // 蒙板位置（左上）
        let maskX = mouseX - mask.offsetWidth / 2; // offsetWidth 带边框 clientWidth 不带
        let maskY = mouseY - mask.offsetHeight / 2;
        if(maskX < 0) {
          maskX = 0;
        } else if(maskX > mask.offsetWidth) {
          maskX = mask.offsetWidth;
        }
        if(maskY < 0) {
          maskY = 0;
        } else if(maskY > mask.offsetHeight) {
          maskY = mask.offsetHeight;
        }
        mask.style.left = maskX + 'px';
        mask.style.top = maskY + 'px';
        bigImg.style.left = -2 * maskX + 'px';
        bigImg.style.top = -2 * maskY + 'px';

      },
    },
    computed: {
      defaultImg() {
        return this.imgList[this.defaultIndex] || {}; // 如果拿不到，{}备胎
      }
    },
  }
</script>

<style lang="less">
  .spec-preview {
    position: relative;
    width: 400px;
    height: 400px;
    border: 1px solid #ccc;

    img {
      width: 100%;
      height: 100%;
    }

    .event {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 998;
    }

    .mask {
      width: 50%;
      height: 50%;
      background-color: rgba(0, 255, 0, 0.3);
      position: absolute;
      left: 0;
      top: 0;
      display: none;
    }

    .big {
      width: 100%;
      height: 100%;
      position: absolute;
      top: -1px;
      left: 100%;
      border: 1px solid #aaa;
      overflow: hidden;
      z-index: 998;
      display: none;
      background: white;

      img {
        width: 200%;
        max-width: 200%;
        height: 200%;
        position: absolute;
        left: 0;
        top: 0;
      }
    }

    .event:hover~.mask,
    .event:hover~.big {
      display: block;
    }
  }
</style>