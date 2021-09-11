<!--
 * @Descripttion: 广告管理
 * @version: 1.0
 * @Author: LiZhi
 * @Date: 2021-01-15 16:52:43
 * @LastEditors: WangChuan
 * @LastEditTime: 2021-01-30 15:44:56
-->
<template>
    <div id="ad">
        <el-form :inline="true" ref="dataForm" class="form-inline-box">
            <div class="el-form-item-left">
                <el-form-item style="width:150px;">
                    <el-button @click="add" type="primary" icon="el-icon-plus" class="my-blue-btn" size="medium">添加广告
                    </el-button>
                </el-form-item>
            </div>
            <div class="el-form-item-right">
                <el-form-item style="width:150px;">
                    <el-select placeholder="小程序" filterable v-if="slotId=='' || slotId==undefined || slotId==null"
                        v-model="mmid" size="medium" @change="changeXcx">
                        <el-option :key="index" :label="item" :value="index" v-for="(item,index) in xcxList" />
                    </el-select>
                </el-form-item>
            </div>
        </el-form>
        <!-- 表格 -->
        <fix-table ref="table" border v-loading="loading" element-loading-spinner="el-icon-loading"
            element-loading-text="拼命加载中" :data="tableData" key="list" height="73.7vh" size="medium"
            header-row-class-name="my-table-header" class="my-table">
            <el-table-column align="center" fixed header-align="center" label="ID" prop="id" width="100">
            </el-table-column>
            <el-table-column label="标题" prop="title" align="center" width="190"></el-table-column>
            <el-table-column label="小标题" prop="subtitle" width="190" align="center"></el-table-column>
            <el-table-column label="描述" prop="description" width="190" align="center"></el-table-column>
            <el-table-column label="广告位" width="130" align="center">
                <template slot-scope="scope">
                    <div :key="index" v-for="(category,index) in scope.row.slots" class="tag">
                        {{ category.name }}
                    </div>
                </template>
            </el-table-column>
            <el-table-column align="center" label="跳转类型" prop="type" width="130">
                <template slot-scope="scope">
                    <span v-if="scope.row.type === '1'">链接跳转</span>
                    <span v-if="scope.row.type === '2'">小程序跳转</span>
                    <span v-if="scope.row.type === '3'">跳转页面</span>
                    <span v-if="scope.row.type === '4'">插件页面</span>
                    <span v-if="scope.row.type === '5'">插件页面</span>
                    <span v-if="scope.row.type === '6'">跳转生活号</span>
                    <span v-if="scope.row.type === '7'">跳转指定页面</span>
                    <span v-if="scope.row.type === '8'">加群</span>
                    <span v-if="scope.row.type === '9'">分享</span>
                    <span v-if="scope.row.type === '10'">打卡提现弹窗</span>
                    <span v-if="scope.row.type === '11'">跳转淘宝</span>
                </template>
            </el-table-column>
            <el-table-column label="日期/小时" prop="time" width="160" align="center">
                <template slot-scope="scope">
                    <span>开始: {{scope.row.start_time_str}}</span><br>
                    <span>结束: {{scope.row.end_time_str}}</span><br>
                    <span>时间: {{scope.row.time_start_str}}-{{scope.row.time_end_str}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="今日点击次数" prop="clickCount" width="130">
                <template slot-scope="scope">
                    <span>{{ scope.row.today_click_amount }}/{{ scope.row.limit_click_amount }}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="排序" prop="list_order" width="130"></el-table-column>
            <el-table-column align="center" label="状态" prop="status" width="130">
                <template slot-scope="scope">
                    <span v-if="scope.row.status === '1'" style="color:#694BFF">已发布</span>
                    <span v-if="scope.row.status === '0'">已下架</span>
                </template>
            </el-table-column>
            <el-table-column align="center" fixed="right" width="160" label="操作">
                <template slot-scope="scope">
                    <el-button @click="report(scope.row)" size="small" type="text">查看统计</el-button>
                    <el-button @click="edit(scope.row)" size="small" type="text">编辑</el-button>
                    <el-button @click="del(scope.row)" size="small" type="text">删除</el-button>
                </template>
            </el-table-column>
        </fix-table>
        <!-- /表格 -->
        <!-- 页码 -->
        <div class="pages">
            <el-pagination :page-size="pageSize" :total="totalNum" @current-change="handleCurrentChange"
                :current-page="currentPage" layout="total, prev, pager, next"></el-pagination>
        </div>
        <!-- /页码 -->
        <addAd :dataForm="info" :mid="mid" @success="success" v-model="showDialog"></addAd>
        <Statistics :dataForm="echartData" v-model="dialogVisible" @closeDialog="closeDialog()"></Statistics>
    </div>
</template>

<script>
    // eslint-disable-next-line no-unused-vars
    import addAd from './addAd.vue'
    import Statistics from "@/components/Statistics.vue";


    export default {
        name: 'ad',
        data() {
            return {
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
                info: {},
                mList: [],
                mmid: '',
                echartData: {
                    id: '',
                    // 请求地址
                    postUrl: '/miniProgram/adReport',
                    // 折线图配置
                    options: {
                        legend: {
                            data: ['广告UV', '广告PV']
                        },
                        tooltip: {
                            trigger: 'axis',
                            axisPointer: {
                                type: 'cross',
                                label: {
                                    backgroundColor: '#6a7985'
                                }
                            }
                        },
                        grid: {
                            left: '3%',
                            right: '4%',
                            bottom: '3%',
                            containLabel: true
                        },
                        xAxis: {
                            boundaryGap: false,
                            data: ['衬衫']
                        },
                        yAxis: {},
                        series: [{
                            data: [1],
                            name: '广告UV',
                            areaStyle: {},
                            type: 'line',
                            smooth: true
                        }, {
                            data: [1],
                            name: '广告PV',
                            areaStyle: {},
                            type: 'line',
                            smooth: true
                        }]
                    },
                    //时间配置
                    timeData: [{
                        title: "近7天",
                        data: 1
                    }, {
                        title: "近30天",
                        data: 2
                    }]
                }
            }


        },
        components: {
            addAd,
            Statistics
        },
        methods: {
            closeDialog() {
                this.dialogVisible = false;
            },
            // 换页响应
            handleCurrentChange(val) {
                this.currentPage = val
                this.loadData()
                // this.currentPage++
            },
            success() {
                this.currentPage--
                this.loadData()
            },
            loadData() {
                this.loading = true
                this.getRequest('/miniProgram/adList', {
                    slotId: this.slotId,
                    page: this.currentPage,
                    mid: this.mid,
                    listRows: this.pageSize
                }).then(resp => {
                    this.loading = false
                    if (resp && resp.code === 200) {
                        this.totalNum = resp.data.total
                        this.tableData = resp.data.list
                        this.tableData.forEach(item => {
                            item.time_start_str = item.time_start_str.substring(0, 5)
                            item.time_end_str = item.time_end_str.substring(0, 5)
                        })
                    }
                })
            },
            add() {
                this.info = {
                    slot_id: '',
                    title: '',
                    subtitle: '',
                    description: '',
                    type: '1',
                    url: '',
                    appid: '',
                    path: '',
                    extra_data: '',
                    gold: '0',
                    status: '1',
                    limit_click_amount: 5000,
                    daterange: [
                        this.$utils.timestamp(new Date(), 'yyyy-MM-dd'),
                        this.$utils.timestamp(this.$utils.getWhatYear(new Date(), 1), 'yyyy-MM-dd')
                    ],
                    timerange: [
                        new Date(2020, 9, 10, 0, 0),
                        new Date(2020, 9, 10, 23, 59)
                    ]
                }
                this.showDialog = true
            },
            edit(row) {
                let info = Object.assign({}, row)

                let start = this.$utils.timestamp(info.start_time * 1000, 'yyyy-MM-dd')
                let end = this.$utils.timestamp(info.end_time * 1000, 'yyyy-MM-dd')
                info.daterange = [start, end]

                let start_time = this.$utils.timestamp(info.time_start * 1000, 'yyyy-MM-dd HH:ii:ss')
                let end_time = this.$utils.timestamp(info.time_end * 1000, 'yyyy-MM-dd HH:ii:ss')
                info.timerange = [start_time, end_time];

                info.slot_id = []
                info.slots.forEach((item) => {
                    info.slot_id.push(item.id)
                })
                this.info = info
                this.showDialog = true
            },
            del(row) {
                let that = this
                this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.postRequest('/miniProgram/adDelete', {
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
            report(row) {
                this.info = Object.assign({}, row)
                this.dialogVisible = true
                this.echartData.id = row.id
            },
            reload() {
                this.currentPage = 1
                this.loadData()
            },
            init() {
                this.currentPage = 1
                if (this.$route.query.mid) {
                    this.mmid = this.$route.query.mid
                } else {
                    this.mmid = Object.keys(this.xcxList)[0]
                }
                this.loadData();
            },
            changeXcx() {
                this.currentPage = 1
                this.loadData()
            }
        },

        watch: {
            // mid(newval) {
            //   this.currentPage = 1
            //   this.loadData()
            //   if (this.$route.query.mid) {
            //     this.loadData()
            //   }
            // }
        },
        mounted() {
            this.init()
            // if (this.$route.query.mid) {
            //   this.loadData()
            // }
            console.log(this.xcxList);

        },
        computed: {
            slotId() {
                return this.$route.params.class_id === undefined ? 0 : this.$route.params.class_id
            },
            mid() {
                return this.$route.query.mid === undefined ? this.mmid ? this.mmid : this.mmid = Object.keys(this
                    .xcxList)[0] : this.$route.query.mid
            },
            xcxList() {
                return this.$store.state.base.xcxList
            },
        }
    }

</script>

<style scoped>
    .el-select {
        display: block;
    }

</style>
