<!--
 * @Descripttion: 订阅推送
 * @version: 1.0
 * @Author: WangChuan
 * @Date: 2021-01-15 16:52:43
 * @LastEditors: WangChuan
 * @LastEditTime: 2021-03-06 16:56:04
-->
<template>
  <div>
    <!-- <div class="topBox">
        <el-form :inline="true" ref="dataForm" class="demo-form-inline">
            <el-form-item style="flex:1;">
                <el-button size="medium"  @click="refresh" type="primary" class="my-blue-btn" icon="el-icon-refresh">刷新</el-button>
            </el-form-item>
            <el-select  size="medium" filterable placeholder="类型" style="width:150px;" @change="changes" v-model="channel">
                <el-option :key="index" :label="item.name" :value="item.appid" v-for="(item,index) in bast"/>
            </el-select>
        </el-form>
    </div> -->

    <fix-table :data="list" border v-loading="loading" element-loading-spinner="el-icon-loading"
            element-loading-text="拼命加载中" key="list" height="73.7vh" size="small"
            header-row-class-name="my-table-header" class="my-table">
      <el-table-column align="center" fixed header-align="center" label="id" prop="id" width="80"></el-table-column>
      <el-table-column label="标题" prop="title"></el-table-column>
      <el-table-column prop="name" label="小程序"></el-table-column>
      <el-table-column label="内容" prop="content">
        <template slot-scope="scope">
          <pre>{{ scope.row.content }}</pre>
        </template>
      </el-table-column>
      <el-table-column label="跳转地址" prop="page"></el-table-column>
      <el-table-column label="模板ID" prop="template_id" width="420"></el-table-column>
      <el-table-column align="center" fixed="right" label="操作" width="180">
        <template slot-scope="scope">
          <el-button @click="edit(scope.row)" size="small" type="text">编辑</el-button>
          <el-button @click="send(scope.row)" size="small" type="text">推送</el-button>
        </template>
      </el-table-column>
    </fix-table>
    <div class="pages">
      <el-pagination :current-page="currentPage" :page-size="pageSize" :total="totalNum"  @current-change="handleCurrentChange" layout="total, prev, pager, next"/>
    </div>

    <el-dialog custom-class="my-dialog" :visible.sync="showaddtype" title="编辑推送" width="800px">
      <el-form :model="formData" label-width="80px" size="small">
        <el-form-item label="标题" label-width="100px">
          <el-input size="medium"  autocomplete="off" v-model="formData.title" clearable/>
        </el-form-item>
        <el-form-item label="内容" label-width="100px">
          <el-input size="medium"  :rows="6" autocomplete="off" placeholder="推送关键词" type="textarea" clearable v-model="formData.content"/>
          <span>每行一个关键词。最后一行不需要换行，否则会推送失败。</span>
        </el-form-item>
        <el-form-item label="跳转链接" label-width="100px">
          <el-input size="medium"  autocomplete="off" v-model="formData.page" clearable/>
        </el-form-item>
      </el-form>
      <div class="dialog-footer" slot="footer">
        <el-button size="medium"  @click="editPost" type="primary" class="my-blue-btn">确 定</el-button>
        <el-button size="medium"  @click="showaddtype = false">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog custom-class="my-dialog" :visible.sync="showSend" title="推送" width="500px">
      <el-form :model="formData2" label-width="80px" size="small">
        <el-form-item label="推送时间" label-width="100px">
          <el-date-picker size="medium" placeholder="请选择推送日期时间" type="datetime" v-model="formData2.sendTime"
                          value-format="timestamp"></el-date-picker>
        </el-form-item>
      </el-form>
      <div class="dialog-footer" slot="footer">
        <el-button size="medium" @click="sendPost" class="my-blue-btn" type="primary">确 定</el-button>
        <el-button size="medium" @click="showSend = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 表格当前页
      currentPage: 1,
      // 每页显示数据数量
      pageSize: 12,
      // 表格数据总量
      totalNum: 0,
      // 每页显示数据数量
      loading: true,
      // 表格数据
      list: [],
      // 小程序
      miniprogram: [],

      // 显示添加模态
      showaddtype: false,
      // 表单数据
      formData: {},
      formData2: {},
      showSend: false,
      category: [],
      addSchoolShow: false,
      categoryList: [],
      enter: 'content',
      testbox: false,
      testformData: {
        id: 0,
        userId: ''
      },
      channel: '',
      bast: {}
    }
  },
  methods: {
    changes() {
      this.totalNum = 0;
      this.currentPage = 1;
      this.loadData();
    },
    getBast() {
      this.getRequest("/XcxSubscribePush/getBast").then(resp => {
        if (resp && resp.code === 200) {
          this.bast = resp.data;
        }
      });
    },

    // 获取数据
    loadData () {
      this.loading = true
      this.getRequest('/XcxSubscribePush/getList', {
        page: this.currentPage,
        limit: this.pageSize,
        type: this.channel
      }).then(resp => {
        this.loading = false
        if (resp && resp.code === 200) {
          this.totalNum = resp.data.total
          // resp.data.list.map(item => {
          //   item.send_time = item.send_time * 1000
          //   item.send_time_str = this.$utils.toDateString(
          //     item.send_time,
          //     'yyyy-MM-dd HH:mm:ss'
          //   )
          // })
          this.list = resp.data.data
          this.bast = resp.data.msgTpl
        }
      })
    },
    edit (data) {
      this.formData = Object.assign({}, data)
      this.showaddtype = true
    },
    editPost () {
      let option = {}
      option.id = this.formData.id
      option.title = this.formData.title
      option.content = this.formData.content
      option.page = this.formData.page
      this.postRequest('/XcxSubscribePush/editPost', option).then(data => {
        // eslint-disable-next-line eqeqeq
        if (data.code == 200) {
          this.$message.success(data.msg)
          this.showaddtype = false
          this.loadData()
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    send (data) {
      data.sendTime = (new Date()).valueOf()
      this.formData2 = Object.assign({}, data)
      this.showSend = true
    },
    sendPost () {
      this.postRequest('/XcxSubscribePush/sendPost', this.formData2).then(data => {
        if (data.code === 200) {
          this.$message.success(data.msg)
          this.showSend = false
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    // 换页响应
    handleCurrentChange (val) {
      this.currentPage = val
      this.loadData()
    },
    // 刷新
    refresh () {
      this.currentPage = 1
      this.loadData()
    }
  },
  mounted () {
    // this.getBast();
    this.loadData()
  }
}
</script>

<style scoped>
  .demo-form-inline{
    display: flex;
  }
  .demo-form-inline .el-form-item:last-child{
    margin-right: 0;
  }
pre {
  margin: 0;
}
</style>
