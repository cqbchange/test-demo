<!--
 * @Descripttion: 纷推渠道结算
 * @version: 1.0
 * @Author: WangChuan
 * @Date: 2021-01-15 16:52:43
 * @LastEditors: WangChuan
 * @LastEditTime: 2021-05-07 13:57:46
-->
<template>
    <div>
        <div class="topBox">
            <div class="el-form-item-left">
                <span>已支付：{{payMoney}} </span>
                <span>待支付：{{noPayMoney}}</span>
            </div>
            <div class="el-form-item-right">
                <el-form :inline="true" :model="dataForm" ref="dataForm" class="demo-form-inline">
                    <el-form-item style="width:300px;">
                        <el-date-picker :disabled="dataready" v-model="dataForm.times" value-format="timestamp"
                            type="monthrange" align="right" unlink-panels range-separator="至" start-placeholder="开始月份"
                            end-placeholder="结束月份" :picker-options="pickerOptions">
                        </el-date-picker>
                    </el-form-item>
                </el-form>
            </div>
        </div>
        <div class="table_box">
            <fix-table v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading"
                :data="tableData" height="73.7vh" border size="small" style="width: 100%"
                header-row-class-name="my-table-header" class="my-table">
                <el-table-column fixed prop="name" label="渠道名称" align="center" header-align="center" />
                <el-table-column fixed prop="serial_number" label="结算流水号" align="center" header-align="center" />
                <el-table-column prop="range_time" label="结算范围" align="center" />
                <el-table-column prop="settlement_amount" label="结算金额" align="center" />
                <el-table-column prop="statusName" label="状态" align="center" />
                <el-table-column prop="kp" label="KP号" align="center" />
                <el-table-column fixed="right" label="操作" align="center" width="160px">
                    <template slot-scope="scope">
                        <template v-if="scope.row.status ==0">
                            <el-button @click="editMoney(scope.row)" type="text" size="medium">
                                修改结算金额</el-button>
                        </template>
                        <template v-else-if="scope.row.status ==1 || scope.row.status ==3">
                            <el-button @click="editKp(scope.row,scope.row.status ==3?4:1)" type="text" size="medium">
                                发票确认</el-button>
                            <el-button @click="editKp(scope.row,2)" type="text" size="medium">
                                发票异常</el-button>
                        </template>
                        <template v-else-if="scope.row.status ==2">
                            <el-button @click="editKp(scope.row,3)" type="text" size="medium">确认支付</el-button>
                        </template>
                        <template v-else>
                            --
                        </template>
                    </template>
                </el-table-column>
            </fix-table>
        </div>
        <div class="pages">
            <el-pagination @current-change="handleCurrentChange" layout="total, prev, pager, next"
                :page-size="dataForm.size" :current-page="dataForm.p" :total="totalNum" />
        </div>
    </div>
</template>
<script>
    import {
        mapActions
    } from 'vuex'

    export default {
        name: 'chEarning',
        data() {
            return {
                dataready: true,
                // 表格数据总量
                totalNum: 0,
                dataForm: {
                    p: 1,
                    size: 18,
                    keyword: '',
                },
                loading: true,
                tableData: [],
                payMoney: 0,
                noPayMoney: 0,
                pickerOptions: {
                    shortcuts: [{
                        text: '本月',
                        onClick(picker) {
                            picker.$emit('pick', [new Date(), new Date()]);
                        }
                    }, {
                        text: '今年至今',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date(new Date().getFullYear(), 0);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近六个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setMonth(start.getMonth() - 6);
                            picker.$emit('pick', [start, end]);
                        }
                    }]
                },

            }
        },
        components: {},
        watch: {
            "dataForm.times": {
                handler(val) {
                    if (val) {
                        if (val.length) {
                            this.submitForm()
                        }
                    } else if (val == null) {
                        this.submitForm()
                    }
                }
            }
        },
        methods: {
            // 重置表单
            resetForm(formName) {
                this.dataForm.p = 1
                this.$refs[formName].resetFields()
                this.loadData()
            },
            // 提交表单
            submitForm: function () {
                this.tableData = []
                this.dataForm.p = 1
                this.loadData()
            },
            // 换页响应
            handleCurrentChange(val) {
                this.tableData = []
                this.dataForm.p = val
                this.loadData()
            },
            // 请求数据
            loadData() {
                this.loading = true
                this.dataready = true
                this.$nextTick(() => {
                    if (this.userId !== 0 && this.dataForm.keyword === '') {
                        this.dataForm.keyword = this.userId
                    }
                })
                this.getRequest('/FinancialSettlement/list', this.dataForm).then(
                    resp => {
                        this.loading = false
                        if (resp && resp.code === 200) {
                            this.payMoney = resp.data.paid
                            this.noPayMoney = resp.data.toBePaid
                            this.totalNum = resp.data.total
                            resp.data.list.map(item => {
                                const addtime = item.addtime * 1000
                                item.addtime = this.$utils.toDateString(
                                    addtime,
                                    'yyyy-MM-dd HH:mm:ss'
                                )
                            })
                            this.tableData = resp.data.list
                            this.dataready = false;
                        } else {
                            this.$message.warning(resp.msg)
                            this.dataready = false;
                        }
                    }
                ).catch((err) => {
                    this.loading = false
                    this.dataready = false;
                    // this.$message.error('请求错误')
                })
            },
            editKp(row, state) {
                if (state == 3) {
                    this.$confirm('此操作将确认已支付发票数据, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        customClass: 'with_custom_class',
                        type: 'warning'
                    }).then(() => {
                        this.postRequest('/FinancialSettlement/paySuccess', {
                            id: row.id
                        }).then(resp => {
                            if (resp && resp.code === 200) {
                                this.$message({
                                    message: '确认成功',
                                    type: 'success',
                                    showClose: true,
                                    duration: 1000,
                                })
                                this.loadData()
                            } else {
                                this.$message({
                                    type: 'error',
                                    message: '已取消处理'
                                })
                            }
                        }).catch(() => {
                            this.$message({
                                type: 'info',
                                message: '已取消确认'
                            })
                        })
                    });
                }else if (state == 4) {
                    this.$confirm('此操作将确认已支付发票数据, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        customClass: 'with_custom_class',
                        type: 'warning'
                    }).then(() => {
                        this.postRequest('/FinancialSettlement/invoiceRefuseAgain', {
                            id: row.id
                        }).then(resp => {
                            if (resp && resp.code === 200) {
                                this.$message({
                                    message: '确认成功',
                                    type: 'success',
                                    showClose: true,
                                    duration: 1000,
                                })
                                this.loadData()
                            } else {
                                this.$message({
                                    type: 'error',
                                    message: '已取消处理'
                                })
                            }
                        }).catch(() => {
                            this.$message({
                                type: 'info',
                                message: '已取消确认'
                            })
                        })
                    });
                }else if (state == 2) {
                    this.$prompt('请输入异常理由', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消'
                    }).then(({
                        value
                    }) => {
                        if (value !== null) {
                            this.postRequest('/FinancialSettlement/invoiceRefuse', {
                                id: row.id,
                                refuse: value
                            }).then(resp => {
                                if (resp && resp.code === 200) {
                                    this.$message({
                                        message: '处理成功',
                                        type: 'success',
                                        showClose: true,
                                        duration: 1000,
                                    })
                                    this.loadData()
                                } else {
                                    this.$message({
                                        type: 'error',
                                        message: '已取消处理'
                                    })
                                }
                            }).catch(() => {
                                this.$message({
                                    type: 'info',
                                    message: '已取消处理'
                                })
                            })
                        } else {
                            this.$message({
                                type: 'info',
                                message: '请输入正确的异常理由'
                            });
                        }
                    }).catch(() => {});
                } else {
                    this.$confirm('此操作将确认发票数据, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        customClass: 'with_custom_class',
                        type: 'warning'
                    }).then(() => {
                        this.postRequest('/FinancialSettlement/invoiceConfirm', {
                            id: row.id
                        }).then(resp => {
                            if (resp && resp.code === 200) {
                                this.$message({
                                    message: '确认成功',
                                    type: 'success',
                                    showClose: true,
                                    duration: 1000,
                                })
                                this.loadData()
                            } else {
                                this.$message({
                                    type: 'error',
                                    message: '已取消处理'
                                })
                            }
                        }).catch(() => {
                            this.$message({
                                type: 'info',
                                message: '已取消确认'
                            })
                        })
                    });
                }
            },
            editMoney(row) {
                this.$prompt('请输入更正金额', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消'
                }).then(({
                    value
                }) => {
                    if (value !== null) {
                        this.postRequest('/FinancialSettlement/editMoney', {
                            id: row.id,
                            settlement_amount: value
                        }).then(resp => {
                            if (resp && resp.code === 200) {
                                this.$message({
                                    message: '修改成功',
                                    type: 'success',
                                    showClose: true,
                                    duration: 1000,
                                })
                                this.loadData()
                            }
                        }).catch(() => {
                            this.$message({
                                type: 'info',
                                message: '已取消修改'
                            })
                        })
                    } else {
                        this.$message({
                            type: 'info',
                            message: '请输入正确的金额'
                        });
                    }
                }).catch(() => {});

                // this.$confirm('此操作将, 是否继续?', '提示', {
                //     confirmButtonText: '确定',
                //     cancelButtonText: '取消',
                //     customClass: 'with_custom_class',
                //     type: 'warning'
                // }).then(() => {
                //     this.postRequest('/Company/postDelLog', {
                //         id: row.id
                //     }).then(resp => {
                //         if (resp && resp.code === 200) {
                //             this.$message({
                //                 message: '删除成功',
                //                 type: 'success',
                //                 showClose: true,
                //                 duration: 1000,
                //             })
                //             this.loadDetailData()
                //         }
                //     }).catch(() => {
                //         this.$message({
                //             type: 'info',
                //             message: '已取消删除'
                //         })
                //     })
                // })
            },
            open1(msg) {
                this.$message({
                    showClose: true,
                    message: msg,
                })
            },
            open2(msg) {
                this.$message({
                    showClose: true,
                    message: msg,
                    type: 'success',
                })
            },
            open3(msg) {
                this.$message({
                    showClose: true,
                    message: msg,
                    type: 'warning',
                })
            },
            open4(msg) {
                this.$message({
                    showClose: true,
                    message: msg,
                    type: 'error',
                })
            },
        },
        computed: {
            userId() {
                return this.$route.params.user_id === undefined ? 0 : this.useParams == true ? this.$route.params
                    .user_id : ''
            },
        },
        mounted() {
            this.loadData()
        }
    }

</script>

<style lang="scss" scoped>
    //table样式
    .table_box>>>.el-table__fixed-right-patch {
        background-color: #EFF5FF !important;
    }

    .el-form-item-right>>>.el-form-item__content {
        line-height: inherit;
    }

    .topBox {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .show_this_page_num {
        text-align: right;
        font-size: 14px;
        font-family: PingFang SC;
        font-weight: 500;
        color: #333333;
        margin-top: 10px;
        padding: 0 40px 0 0;
    }

</style>
