<template>
  <el-pagination
    background
    layout="prev, pager, next"
    :total="total"
    :current-page="currentPage"
    :page-size="pageSize"
    hide-on-single-page
    class="app-pagination"
    @current-change="$emit('current-change', $event)"
  />
</template>

<script>
export default {
  name: 'AppPagination',

  props: {
    total: {
      type: Number,
    },
    currentPage: {
      type: Number,
    },
    pageSize: {
      type: Number,
    },
  },
};
</script>

<style lang="scss" scoped>
.app-pagination {
  display: flex;
  justify-content: center;
  margin: 20px auto 5px;
}
</style>
