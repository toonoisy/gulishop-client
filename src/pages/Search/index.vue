<template>
  <div>
    Search
    <!-- params: {{$route.params.keyword}} -->
    params: {{keyword}}
    <!-- query: {{$route.query.keyword}} -->
    query: {{keyword2}}
  </div>
</template>

<script>
export default {
  name: 'Search',
  props: ['keyword', 'keyword2'],
  
}
</script>

<style lang="less" scoped>

</style>