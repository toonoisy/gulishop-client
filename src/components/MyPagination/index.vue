<template>
  <div class="pagination">
    <button :disabled="currentPageNum === 1" @click="$emit('changePageNum', currentPageNum - 1)">上一页</button>
    <!-- 这里和总页码active可以不加，因为已经修正过了 -->
    <button v-if="startEnd.start > 1" :class="{active: currentPageNum === 1}" @click="$emit('changePageNum', 1)">1</button>
    <button v-if="startEnd.start > 2">···</button>
    <!-- 连续页 -->
    <!-- v-for遍历数字，从1拿起，所以加个v-if条件 -->
    <button
      v-for="page in startEnd.end"
      :key="page"
      v-if="page >= startEnd.start"
      :class="{active: currentPageNum === page}"
      @click="$emit('changePageNum', page)"
    >{{page}}</button>
    <!-- <button>4</button>
    <button>5</button>
    <button>6</button>
    <button>7</button>-->
    <button v-if="startEnd.end < totalPageNum - 1">···</button>
    <!-- 这里active可以不加 -->
    <button
      v-if="startEnd.end < totalPageNum"
      @click="$emit('changePageNum', totalPageNum)"
    >{{totalPageNum}}</button>
    <button :disabled="currentPageNum === totalPageNum" @click="$emit('changePageNum', currentPageNum + 1)">下一页</button>
    <button style="margin-left: 30px">共 {{total}} 条</button>
  </div>
</template>

<script>
export default {
  name: "MyPagination",
  props: {
    currentPageNum: {
      type: Number,
      default: 1, //default和required有一个就好
      // // 自定义验证规则
      // validator:
    },
    total: Number,
    pageSize: {
      type: Number,
      default: 5,
    },
    continueSize: Number,
  },
  computed: {
    // 计算总页码
    totalPageNum() {
      return Math.ceil(this.total / this.pageSize);
    },
    // 连续页起始结束页码
    startEnd() {
      // disNum 要修正的页数
      let start, end, disNum;
      let { currentPageNum, continueSize, totalPageNum } = this;
      if (continueSize >= totalPageNum) {
        start = 1;
        end = totalPageNum;
      } else {
        start = currentPageNum - Math.floor(continueSize / 2);
        end = currentPageNum + Math.floor(continueSize / 2);
        // 修正左边出现的小于1的页码
        if (start <= 1) {
          disNum = 1 - start;
          start += disNum;
          end += disNum;
        }
        // 修正右边出现的大于总页码的情况
        if (end >= totalPageNum) {
          disNum = end - totalPageNum;
          start -= disNum;
          end -= disNum;
        }
      }
      // 返回超过一个值，放数组或者对象
      return { start, end };
    },
  },
};
</script>

<style lang="less" scoped>
.pagination {
  button {
    margin: 0 5px;
    background-color: #f4f4f5;
    color: #606266;
    outline: none;
    border-radius: 2px;
    padding: 0 4px;
    vertical-align: top;
    display: inline-block;
    font-size: 13px;
    min-width: 35.5px;
    height: 28px;
    line-height: 28px;
    cursor: pointer;
    box-sizing: border-box;
    text-align: center;
    border: 0;

    &[disabled] {
      color: #c0c4cc;
      cursor: not-allowed;
    }

    &.active {
      cursor: not-allowed;
      background-color: #409eff;
      color: #fff;
    }
  }
}
</style>