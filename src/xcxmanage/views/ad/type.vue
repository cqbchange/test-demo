<!--
 * @Descripttion: 广告位管理
 * @version: 1.0
 * @Author: LiZhi
 * @Date: 2021-01-15 16:52:43
 * @LastEditors: WangChuan
 * @LastEditTime: 2021-01-30 15:44:42
-->
<template>
    <div id="adSlot">
        <!-- 头部 -->
        <el-form :inline="true" ref="dataForm" class="form-inline-box">
            <div class="el-form-item-left">
                <el-form-item style="width:150px;">
                    <el-button @click="add" type="primary" icon="el-icon-plus" class="my-blue-btn" size="medium">添加广告位
                    </el-button>
                </el-form-item>
            </div>
            <div class="el-form-item-right">
                <el-form-item style="width:150px;">
                    <el-select v-model="mid" filterable placeholder="小程序" @change="changeXcx" size="medium">
                        <el-option v-for="(item,index) in xcxList" :value="index" :label="item" :key="index" />
                    </el-select>
                </el-form-item>
            </div>
        </el-form>
        <!-- 表格 -->
        <fix-table ref="table" border v-loading="loading" element-loading-spinner="el-icon-loading"
            element-loading-text="拼命加载中" :data="tableData" key="list" height="73.7vh" size="small"
            header-row-class-name="my-table-header" class="my-table">
            <el-table-column align="center" fixed header-align="center" label="ID" prop="id" width="160">
            </el-table-column>
            <el-table-column label="标题" prop="name" align="center"></el-table-column>
            <el-table-column label="标识" prop="tag" align="center"></el-table-column>
            <el-table-column fixed="right" label="操作" align="center" width="300px">
                <template slot-scope="scope">
                    <el-button @click="view(scope.row)" size="medium" type="text">查看</el-button>
                    <el-button @click="edit(scope.row)" size="medium" type="text">编辑</el-button>
                    <el-button @click="del(scope.row)" size="medium" type="text">删除</el-button>
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
        <addAdSlot :dataForm="info" :mid="mid" @success="success" v-model="showDialog"></addAdSlot>
    </div>
</template>

<script>
    // eslint-disable-next-line no-unused-vars
    import addAdSlot from './addAdSlot.vue'
    // eslint-disable-next-line no-unused-vars
    export default {
        name: 'adSlot',
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
                tableData: [],
                showDialog: false,
                info: {},
                // mList: [],
                mid: ''
            }
        },
        components: {
            addAdSlot
        },
        methods: {
            // 换页响应
            handleCurrentChange(val) {
                this.currentPage = val
                this.loadData()

            },
            success() {
                this.currentPage--;
                this.loadData();
            },
            loadData() {
                this.loading = true
                this.getRequest('/miniProgram/adSlot', {
                    page: this.currentPage,
                    listRows: this.pageSize,
                    mid: this.mid
                }).then(resp => {
                    this.loading = false
                    if (resp && resp.code === 200) {
                        this.totalNum = resp.data.total
                        this.tableData = resp.data.list
                    }
                })
            },
            add() {
                if (!this.mid) {
                    this.$message.warning("请选择小程序");
                    return
                }
                this.info = {
                    name: '',
                    tag: ''
                }
                this.showDialog = true
            },
            edit(row) {
                this.info = Object.assign({}, row)
                this.showDialog = true
            },
            view(row) {
                this.$router.push({
                    path: '/adList/' + row.id,
                    query: {
                        mid: this.mid
                    }
                })
            },
            del(row) {
                let that = this
                this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.postRequest('/miniProgram/asSlotDelete', {
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
            init() {
                this.currentPage = 1;
                if (this.mid == '') {
                    this.mid = Object.keys(this.xcxList)[0]
                }
                this.loadData();
            },
            changeXcx() {
                this.currentPage = 1;
                this.loadData();
            }
        },
        mounted() {
            this.init()
        },
        watch: {
            // mid(newval){
            //   this.currentPage = 1;
            //   this.loadData();
            // }
        },
        computed: {
            xcxList() {
                return this.$store.state.base.xcxList
            },
        }
    }

</script>

<style scoped>

</style>
