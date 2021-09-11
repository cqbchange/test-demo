<!--
 * @Descripttion: 抽个奖
 * @version: 1.0
 * @Author: WangChuan
 * @Date: 2021-01-15 16:52:43
 * @LastEditors: LiXinRui
 * @LastEditTime: 2021-01-26 13:27:24
-->
<template>
  <div>
    <!-- 头部 -->
    <div class="topBox">
      <el-form style="width:100%;display:flex;justify-content: space-between;" :inline="true" :model="dataForm" class="demo-form-inline" ref="dataForm">
        <el-form-item>
            <el-button size="medium"  type="primary" class="my-blue-btn" @click="add" icon="el-icon-plus">添加夺宝</el-button>
        </el-form-item>
        <el-form-item label prop="cid" style="width:150px;">
          <el-select size="medium" @change="chooseStatus()" placeholder="状态" v-model="dataForm.status">
            <el-option :value="-1" label="全部"/>
            <el-option :value="0" label="未开奖"/>
            <el-option :value="1" label="已开奖"/>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <!-- /头部 -->
    <!-- 表格 -->
    <div class="table_box">
        <fix-table :data="tableData" border element-loading-spinner="el-icon-loading" element-loading-text="拼命加载中"
                height="73.7vh" size="small" style="width: 100%" v-loading="loading" header-row-class-name="my-table-header" class="my-table">
        <el-table-column align="center" fixed header-align="center" label="期号" prop="id" width="90px"></el-table-column>
        

        <el-table-column label="商品标题" prop="title" width="250px">
            <template slot-scope="scope">
            <el-row type="flex">
                <el-col :span="6" class="img_pic_box">
                <img :src="scope.row.goods_pic" style="width: 40px; height: 40px;border: 1px solid #eee"/>
                </el-col>
                <el-col :span="18" style="height: 45px;overflow: hidden;">
                <span style="overflow: hidden;text-overflow: ellipsis;line-height: 40px">{{ scope.row.goods_title}}</span>
                </el-col>
            </el-row>
            </template>
        </el-table-column>

        <el-table-column align="center" label="商品原价" prop="goods_price"></el-table-column>
        <el-table-column align="center" label="需要幸运豆" prop="lucky_count" width="120px"></el-table-column>

        <el-table-column align="center" label="中奖人数/开奖人数" prop="min_start_numer" width="140px">
            <template slot-scope="scope">
            {{scope.row.winning_number}}/{{scope.row.min_start_number}}
            </template>
        </el-table-column>

        <el-table-column align="center" label="开始/开奖时间" prop="start_time_val" width="210px">
            <template slot-scope="scope">
            <span>开始：{{scope.row.create_times}}</span><br>
            <span>结束：{{scope.row.lottery_times}}</span>
            </template>
        </el-table-column>
        <el-table-column align="center" label="排序" prop="list_order"></el-table-column>
        <el-table-column align="center" label="参与人数/参与次数" prop="start_time_val" width="160px">
            <template slot-scope="scope">
            {{scope.row.participants}}/{{scope.row.participations}}
            </template>
        </el-table-column>
        <el-table-column align="center" label="状态" prop="status" width="80px">
            <template slot-scope="scope">
            <span style="color: #ff0000" v-if="scope.row.status === '0'">未开奖</span>
            <span style="color: #00ff00" v-if="scope.row.status === '1'">已开奖</span>
            </template>
        </el-table-column>
        <el-table-column align="center" fixed="right" label="操作" width="210">
            <template slot-scope="scope">
            <el-button @click="edit(scope.row)" size="small" type="text">编辑</el-button>
            <el-button @click="del(scope.row)" size="small" type="text">删除</el-button>
            </template>
        </el-table-column>
        </fix-table>
    </div>
    <!-- /表格 -->
    <!-- 页码 -->
    <div class="pages">
      <el-pagination :page-size="pageSize" :total="totalNum" @current-change="handleCurrentChange" :currentPage="currentPage"
            layout="total, prev, pager, next"></el-pagination>
    </div>
    <!-- /页码 -->
    <add :dataForm="info" @success="loadData" v-model="showDialog"></add>
  </div>
</template>
<script>
    import add from './_addDraw.vue'

    export default {
        name: "activityLuckDraw",
        data() {
            return {
                dataForm: {
                    status: 0
                },
                dialogVisible: false,
                // 表格当前页
                currentPage: 1,
                // 每页显示数据数量
                pageSize: 12,
                // 表格数据总量
                totalNum: 0,
                // 每页显示数据数量
                loading: true,
                tableData: [],
                showDialog: false,
                info: {}
            };
        },
        components: {
            add
        },
        methods: {
            chooseStatus(){
                this.currentPage = 1;
                this.loadData()
            },
            // 换页响应
            handleCurrentChange (val) {
                this.currentPage = val
                this.loadData()
            },
            loadData () {
                this.loading = true
                this.getRequest('/XcxLuckyDraw/getList', {
                    page: this.currentPage,
                    listRows: this.pageSize,
                    status: this.dataForm.status
                }).then(resp => {
                    this.loading = false
                    if (resp && resp.code === 200) {
                    this.totalNum = resp.data.total
                    resp.data.list.map(item => {
                        item.lottery_times = this.$utils.toDateString(
                        item.lottery_time * 1000,
                        "yyyy-MM-dd HH:mm:ss"
                        );
                    });
                    resp.data.list.map(item => {
                        item.create_times = this.$utils.toDateString(
                        item.open_prize_time * 1000,
                        "yyyy-MM-dd HH:mm:ss"
                        );
                    });
                    this.tableData = resp.data.list
                    }
                })
            },
            add () {
                this.info = {
                    button_text: '',
                    complete_text: '',

                    goods_ad_title: '',
                    goods_ad_pic: '',
                    goods_ad_url: '',

                    goods_description: [],
                    goods_pic: '',
                    goods_price: '',
                    goods_slide: [],
                    goods_title: '',
                    list_order: '1000',
                    lottery_time: '',
                    lucky_count: '',
                    min_start_number: '',
                    participant_count: '',
                    status: '0',
                    subscript: '',
                    winning_number: '',
                    goods_slide2: [],
                    goods_slide3: []
                }
                this.info.lottery_time = this.$utils.timestamp(new Date(), 'yyyy-MM-dd HH:mm:ss')
                this.showDialog = true
            },
            edit (row) {
                let info = Object.assign({}, row)
                // info.start_time = this.$utils.timestamp(info.start_time * 1000, 'yyyy-MM-dd HH:mm:ss')
                info.lottery_time = this.$utils.timestamp(info.lottery_time * 1000, 'yyyy-MM-dd HH:mm:ss')
                info.open_prize_time = this.$utils.timestamp(info.open_prize_time * 1000, 'yyyy-MM-dd HH:mm:ss')
                info.goods_slide2 = []
                if (info.goods_slide !== undefined) {
                    info.goods_slide.map(item => {
                    info.goods_slide2.push({name: item, url: item})
                    })
                }
                info.goods_slide3 = []
                if (info.goods_description !== undefined) {
                    info.goods_description.map(item => {
                    info.goods_slide3.push({name: item, url: item})
                    })
                }
                this.info = info
                this.showDialog = true
            },
            del (row) {
                let that = this
                this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.postRequest('/XcxLuckyDraw/delete', {
                        id: row.id
                    }).then(resp => {
                    if (resp && resp.code === 200) {
                        this.$message({
                            message: '删除成功',
                            type: 'success',
                            showClose: true,
                            duration: 1000,
                            onClose: function () {
                                that.loadData()
                            }
                        })
                    }
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消删除'
                        })
                    })
                })
            },
            report (row) {
                this.info = Object.assign({}, row)
                this.dialogVisible = true
            },
            copy (row) {
                this.$copyText('alipays://platformapi/startapp?appId=2021001167652345&page=pages/duobao/detail%3Fid%3D' + row.id)
                .then((e) => {
                    this.$message({
                        message: '复制成功',
                        type: 'success',
                        showClose: true,
                        duration: 1000
                    })
                }, (e) => {
                    this.$message({
                        message: '复制失败',
                        type: 'faild',
                        showClose: true,
                        duration: 1000
                    })
                })
            }
        },
        computed: {},
        mounted() {
            this.loadData()
        }
    };

</script>

<style lang='scss' scoped>
    .el-tag {
        margin: 0 3px;
    }
    .table_box >>> .el-table__fixed-right-patch{
        background-color: #EFF5FF !important;
    }
</style>
