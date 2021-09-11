<template>
  <div class="pages">
    <el-pagination
      @current-change="handleCurrentChange"
      layout="total, prev, pager, next"
      :page-size="pageSize"
      :total="totalNum"
    ></el-pagination>
  </div>
</template>

<script>
export default {
  name: "Pages",
  watch: {
    setData(newval, oldval) {}
  }
};
</script>

<style scoped>
.pages {
  text-align: right;
  background: #fff;
  border: 1px solid #ebeef5;
  border-top: none;
  height: 6vh;
  line-height: 6vh;
}
</style>