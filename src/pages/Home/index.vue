<template>
  <div>
    <TypeNav></TypeNav>
    <ListContainer></ListContainer>
    <Recommend></Recommend>
    <Rank></Rank>
    <Like></Like>
    <!-- floor有两个楼层，请求放在home发更合适 -->
    <Floor v-for="floor in floorList" :key="floor.id" :floor='floor'></Floor>
    <!-- <Floor></Floor> -->
    <Brand></Brand>
  </div>
</template>

<script>
import ListContainer from './ListContainer';
import Recommend from './Recommend';
import Rank from './Rank';
import Like from './Like';
import Floor from './Floor';
import Brand from './Brand';
import { mapState } from 'vuex';
import Swiper from 'swiper';

export default {
  name: 'Home',
  mounted() {
    this.$store.dispatch('getFloorList');
  },
  computed: {
    ...mapState({
      floorList: state => state.home.floorList,
    }),
  },
  components: {
    ListContainer,
    Recommend,
    Rank,
    Like,
    Floor,
    Brand,
  }
}
</script>

<style lang="less" scoped>

</style>