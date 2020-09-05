<template>
  <div>
   <el-pagination
      background
      layout="prev, pager, next, jumper"
      :total="50">
    </el-pagination>
  </div>
</template>
<script>
export default {
  data () {
    return {

    }
  }
}
</script>
<style scoped lang="scss">
.pageing {
  text-align: right;
  margin-top: 20px;
}
</style>
