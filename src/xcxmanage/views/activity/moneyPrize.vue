<!--
 * @Descripttion: 现金抽奖
 * @version: 1.0
 * @Author: lizhi
 * @Date: 2021-01-15 16:52:43
 * @LastEditors: WangChuan
 * @LastEditTime: 2021-01-30 15:53:03
 name: "activityMoneyPrize",
-->
<template>
    <div>
        <!-- 头部 -->

        <div class="topBox">
            <el-form :inline="true" v-model="dataForm" ref="dataForm" class="form-inline-box">
                <div class="el-form-item-left">
                    <el-form-item>
                        <el-button @click="add" type="primary" icon="el-icon-plus" class="my-blue-btn" size="medium">
                            添加抽奖</el-button>
                    </el-form-item>
                </div>
                <div class="el-form-item-right">
                    <el-form-item style="width:150px;">
                        <el-select v-model="dataForm.status" @change="loadData()" filterable placeholder="状态"
                            size="medium">
                            <el-option :value="-1" label="全部" />
                            <el-option :value="0" label="下线" />
                            <el-option :value="1" label="在线" />
                        </el-select>
                    </el-form-item>
                </div>
            </el-form>
        </div>
        <!-- /头部 -->
        <!-- 表格 -->
        <fix-table :data="tableData" border element-loading-spinner="el-icon-loading" element-loading-text="拼命加载中"
            height="73.7vh" size="small" style="width: 100%" v-loading="loading" header-row-class-name="my-table-header"
            class="my-table">
            <el-table-column align="center" fixed header-align="center" label="ID" prop="id" width="90px">
            </el-table-column>
            <el-table-column label="标题" prop="title" width="220px">
                <template slot-scope="scope">
                    <el-row type="flex" class="item-center">
                        <img :src="scope.row.image" style="width: 40px; height:40px;border-radius: 8px;" />
                        <span>{{scope.row.title}}</span>
                    </el-row>
                </template>
            </el-table-column>
            <el-table-column align="center" label="描述" prop="description" width="180px"></el-table-column>
            <el-table-column label="排序" prop="order_list" width="130px" align="center"></el-table-column>
            <el-table-column align="center" label="参与人数" prop="participants" width="130px">
                <template slot-scope="scope">
                    {{scope.row.participants}}
                </template>
            </el-table-column>
            <el-table-column align="center" label="需要金币" prop="consume_gold" width="130px">
                <template slot-scope="scope">
                    <span>{{scope.row.consume_gold}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="奖励金额(元)" prop="money" width="130px">
                <template slot-scope="scope">
                    {{scope.row.money}}
                </template>
            </el-table-column>
            <el-table-column align="center" label="奖励数量" prop="number" width="130px">
                <template slot-scope="scope">
                    {{scope.row.number}}
                </template>
            </el-table-column>
            <el-table-column align="center" label="所属小程序" prop="number" width="130px">
                <template slot-scope="scope">
                    {{scope.row.xcx_name}}
                </template>
            </el-table-column>
            <el-table-column align="center" label="开奖时间" prop="draw_time" width="170px">
                <template slot-scope="scope">
                    {{scope.row.draw_time}}
                </template>
            </el-table-column>
            <el-table-column align="center" label="状态" prop="status" width="140px">
                <template slot-scope="scope">
                    <span v-if="scope.row.status === '0'">下线</span>
                    <span v-if="scope.row.status === '1'">在线</span>
                </template>
            </el-table-column>
            <el-table-column align="center" fixed="right" label="操作" width="180">
                <template slot-scope="scope">
                    <el-button @click="edit(scope.row)" size="medium" type="text">编辑</el-button>
                    <el-button @click="del(scope.row)" size="medium" type="text">删除</el-button>
                </template>
            </el-table-column>
        </fix-table>
        <!-- /表格 -->
        <!-- 页码 -->
        <div class="pages">
            <el-pagination :page-size="pageSize" :total="totalNum" @current-change="handleCurrentChange"
                layout="total, prev, pager, next"></el-pagination>
        </div>

        <add :dataForm="info" :xcxList="appidList" @success="loadData" v-model="showDialog"></add>
    </div>
</template>

<script>
    import add from './moneyPrize_add.vue'

    export default {
        components: {
            add
        },
        data() {
            return {
                dataForm: {
                    status: -1
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
                info: {},
                appidList:[],
            }
        },
        methods: {
            // 获取Appid列表
            getAppidList() {
                this.loading = true
                this.getRequest('/XcxCashDraw/appidList', {}).then((res) => {
                    if (res.code == 200) {
                        if (res.data) {
                            this.appidList = res.data
                            this.loadData()
                        }
                    } else {
                        this.$message.warning(res.msg)
                    }
                })
            },
            // 换页响应
            handleCurrentChange(val) {
                this.currentPage = val
                this.loadData()
            },
            loadData() {
                this.loading = true
                this.getRequest('XcxCashDraw/getList', {
                    page: this.currentPage,
                    listRows: this.pageSize,
                    status: this.dataForm.status
                }).then(resp => {
                    this.loading = false
                    if (resp && resp.code === 200) {
                        this.totalNum = resp.data.total
                        this.tableData = resp.data.list
                        if (this.appidList.length != 0) {
                            this.appidList.forEach(element => {
                                this.tableData.forEach(ele=>{
                                    if (element.appid == ele.appid) {
                                        ele.xcx_name = element.name
                                    }
                                })
                            });
                        }
                        this.tableData.map(item => {
                            item.draw_time = this.$utils.toDateString(
                                item.draw_time * 1000,
                                "yyyy-MM-dd HH:mm:ss"
                            );
                        });
                    }else{
                        this.$message.warning(res.msg)
                    }
                })
            },
            add() {
                this.info = {
                    title: '',
                    image: '',
                    consume_gold: '',
                    money: '',
                    number: '',
                    draw_time: '',
                    status: 1,
                    description: '',
                    order_list: '1000',
                    appid: ''
                }

                this.info.draw_time = this.$utils.timestamp(new Date(
                    `${this.dateFormat('YYYY-mm-dd',new Date())} 23:59:59`), 'yyyy-MM-dd HH:mm:ss')
                this.showDialog = true
            },
            edit(row) {
                let info = Object.assign({}, row)
                info.draw_time = this.$utils.timestamp(new Date(info.draw_time).getTime(), 'yyyy-MM-dd HH:mm:ss')

                info.status = Number(info.status);
                this.info = info
                this.showDialog = true
            },
            // 时间处理important
            dateFormat(fmt, date) {
                let ret
                const opt = {
                    'Y+': date.getFullYear().toString(), // 年
                    'm+': (date.getMonth() + 1).toString(), // 月
                    'd+': date.getDate().toString(), // 日
                    'H+': date.getHours().toString(), // 时
                    'M+': date.getMinutes().toString(), // 分
                    'S+': date.getSeconds().toString() // 秒
                    // 有其他格式化字符需求可以继续添加，必须转化成字符串
                }
                for (let k in opt) {
                    ret = new RegExp('(' + k + ')').exec(fmt)
                    if (ret) {
                        fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length,
                            '0')))
                    }
                }

                return fmt
            },
            del(row) {
                let that = this
                this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.loading = true;
                    this.postRequest('/XcxCashDraw/delete', {
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
            },
            copy(row) {
                this.$copyText(
                        'alipays://platformapi/startapp?appId=2021001167652345&page=pages/duobao/detail%3Fid%3D' + row
                        .id)
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
        mounted() {
            this.getAppidList()
        }
    }

</script>

<style scoped>
    .el-tag {
        margin: 0 3px;
    }

    .item-center {
        align-items: center;
    }

</style>
