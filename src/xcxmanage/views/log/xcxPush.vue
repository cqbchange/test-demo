<!--
 * @Descripttion: 小程序推送统计
 * @version: 1.0
 * @Author: WangChuan
 * @Date: 2021-01-15 16:52:43
 * @LastEditors: LiXinRui
 * @LastEditTime: 2021-01-29 11:15:37
-->
<template>
    <div>
        <div class="topBox">
            <div></div>
            <div>
                <el-select size="medium" placeholder="类型" style="width:150px;margin-right:20px;" clearable @change="changes" v-model="channel">
                    <el-option :key="index" :label="item.name" :value="item.id" v-for="(item,index) in bast"/>
                </el-select>
                <el-button size="medium" icon="el-icon-refresh" @click="refresh">刷新</el-button>
            </div>
        </div>
        <div class="table_box">
            <fix-table v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" :data="list" height="73.7vh" border style="width: 100%" header-row-class-name="my-table-header" class="my-table">
                <el-table-column fixed prop="id" label="id" width="80" align="center" header-align="center"></el-table-column>
                <el-table-column align="center" prop="title" label="标题"></el-table-column>
                <el-table-column label="类型" align="center">
                    <template slot-scope="scope">
                        <span v-if="scope.row.type === '4'">开心签到</span>
                        <span v-else-if="scope.row.type === '1'">天天夺宝</span>
                        <span v-else-if="scope.row.type === '2'">全民抽奖</span>
                        <span v-else-if="scope.row.type === '3'">走路钱多多</span>
                        <span v-else-if="scope.row.type === '5'">天天直播</span>
                        <span v-else>--</span>
                    </template>
                </el-table-column>
                <el-table-column prop="status" align="center" label="推送状态">
                    <template slot-scope="scope">
                        <span v-if="scope.row.status == 0">待推送</span>
                        <span v-if="scope.row.status == 1">推送中</span>
                        <span v-if="scope.row.status == 2">已推送</span>
                    </template>
                </el-table-column>
                <el-table-column prop="start_time" label="开始时间" width="180" align="center"></el-table-column>
                <el-table-column prop="end_time" label="结束时间" width="180" align="center"></el-table-column>
                <el-table-column prop="elapsed_time" label="耗时" width="80" align="center"></el-table-column>
                <el-table-column prop="success" label="成功"  width="100" align="center"></el-table-column>
                <el-table-column prop="failed" label="失败"  width="100" align="center"></el-table-column>
                <el-table-column prop="no_form_id" label="无表单" width="100" align="center"></el-table-column>
                <el-table-column align="center" fixed="right" label="操作" width="80px">
                    <template slot-scope="scope">
                        <el-button v-if="scope.row.status == 0" @click="del(scope.row)" size="small" type="text">删除</el-button>
                    </template>
                </el-table-column>
            </fix-table>
        </div>
        <div class="pages">
            <el-pagination @current-change="handleCurrentChange" layout="total, prev, pager, next" :page-size="pageSize" :current-page="currentPage" :total="totalNum"/>
        </div>
    </div>
</template>
<script>
    export default {
        name: "logXcxPush",
        data() {
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
            };
        },
        methods: {
            changes() {
                this.totalNum = 0;
                this.currentPage = 1;
                this.loadData();
            },
            getBast() {
                this.getRequest("/XcxTemplatePush/getBast").then(resp => {
                    if (resp && resp.code === 200) {
                        this.bast = resp.data;
                    }
                });
            },
            // 获取数据
            loadData () {
            this.loading = true
            this.getRequest('/XcxTemplatePush/getLog', {
                page: this.currentPage,
                limit: this.pageSize,
                type: this.channel
            }).then(resp => {
                this.loading = false
                if (resp && resp.code === 200) {
                    this.totalNum = resp.data.total
                    resp.data.list.map(item => {
                        item.start_time = this.$utils.toDateString(
                        item.start_time * 1000,
                        'yyyy-MM-dd HH:mm:ss'
                        )
                        item.end_time = this.$utils.toDateString(
                        item.end_time * 1000,
                        'yyyy-MM-dd HH:mm:ss'
                        )
                    })
                    this.list = resp.data.list
                }
            })
            },
            // 换页响应
            handleCurrentChange (val) {
                this.list = []
                this.currentPage = val
                this.loadData()
            },
            // 刷新
            refresh () {
                this.currentPage = 1
                this.loadData()
            },
            // 删除推送
            del (data) {
                this.$confirm('此操作将永久删除该项, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.postRequest('/XcxTemplatePush/sendDelete', data).then(data => {
                        if (data.code == 200) {
                            this.$message.success(data.msg)
                            this.loadData()
                        } else {
                            this.$message.error(data.msg)
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });          
                });
            }
        },
        computed: {},
        mounted() {
            this.getBast();
            this.loadData()
        }
    };

</script>

<style lang='scss' scoped>
    .topBox{
        display: flex;
        justify-content: space-between;
        margin-bottom: 24px;
    }
    //table样式
    .table_box >>> .el-table__fixed-right-patch{
        background-color: #EFF5FF !important;
    }
</style>
