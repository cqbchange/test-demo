<!--
 * @Descripttion: 红包秒杀
 * @version: 1.0
 * @Author: Lizhi
 * @Date: 2021-01-15 16:52:43
 * @LastEditors: WangChuan
 * @LastEditTime: 2021-01-30 15:52:45
-->
<template>
    <div class="memberList">
        <div class="topBox">
            <el-form :inline="true" v-model="dataForm" ref="dataForm" class="form-inline-box">
                <div class="el-form-item-left">
                    <el-form-item>
                        <el-button type="primary" icon="el-icon-plus" class="my-blue-btn" @click="editData()"
                            size="medium">添加红包</el-button>
                    </el-form-item>
                </div>
                <div class="el-form-item-right">
                    <el-form-item style="width:150px;">
                        <el-select v-model="status" @change="submitForm()" size="medium">
                            <el-option value="-1" label="全部状态" />
                            <el-option value="0" label="在线" />
                            <el-option value="1" label="下线" />
                        </el-select>
                    </el-form-item>
                </div>
            </el-form>
        </div>
        <fix-table ref="table" v-loading="loading" element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading" :data="tableData" key="memberlist" border height="73.7vh"
            style="width: 100%;" size="small" header-row-class-name="my-table-header" class="my-table">
            <el-table-column fixed prop="id" label="编号" width="80" align="center" header-align="center" />
            <el-table-column prop="title" label="标题" align="center" />
            <el-table-column prop="type" label="类型" align="center">
                <template slot-scope="scope">
                    <span v-if="scope.row.type === 1">随机金额</span>
                    <span v-else>固定金额</span>
                </template>
            </el-table-column>
            <el-table-column prop="hour" label="场次(小时)" align="center" />
            <el-table-column prop="money" label="金额" align="center" />
            <el-table-column prop="integral" label="所需积分" width="90" align="center" />
            <el-table-column prop="sort" label="排序" width="90" align="center" />
            <el-table-column prop="promotion_price" label="库存" align="center">
                <template slot-scope="scope">
                    <div>总量：{{ scope.row.total_num}}</div>
                    <div>已换：{{ scope.row.use_num}}/{{ scope.row.this_use_num}}</div>
                </template>
            </el-table-column>
            <el-table-column prop="status" label="状态" width="90" align="center">
                <template slot-scope="scope">
                    <span v-if="scope.row.status === 1">下架</span>
                    <span v-else>在线</span>
                </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="180" align="center">
                <template slot-scope="scope">
                    <el-button @click="editData(scope.row)" type="text" size="medium">编辑</el-button>
                </template>
            </el-table-column>
        </fix-table>
        <div class="pages">
            <el-pagination @current-change="handleCurrentChange" layout="total, prev, pager, next"
                :page-size="dataForm.size" :current-page="dataForm.p" :total="totalNum" />
        </div>
        <detail v-if="showDialog" v-model="showDialog" :info="infoForm" @chage="loadData" @updateData='upData' />
    </div>
</template>
<script>
    import detail from "./redSeckilldetail";

    export default {
        name: "activityRedSeckill",
        components: {
            detail
        },
        data() {
            return {
                status: '-1',
                // 表格数据总量
                totalNum: 0,
                // 每页显示数据数量
                loading: true,
                dataForm: {
                    p: 1,
                    size: 15,
                    status: '-1'
                },
                tableData: [],
                showDialog: false,
                infoForm: {}
            };
        },
        methods: {
            upData(val) {
                if (val) {
                    this.loadData()
                }
            },
            // 重置表单
            resetForm(formName) {
                this.dataForm.p = 1;
                this.$refs[formName].resetFields();
                this.loadData();
            },
            // 提交表单
            submitForm: function () {
                this.dataForm.p = 1;
                this.loadData();
            },
            // 换页响应
            handleCurrentChange(val) {
                this.tableData = [];
                this.dataForm.p = val;
                this.loadData();
            },
            // 请求数据
            loadData: function () {
                const _this = this;
                this.loading = true;
                this.dataForm.status = this.status
                this.getRequest("/red/getList", _this.dataForm).then(resp => {
                    _this.loading = false;
                    if (resp && resp.code === 200) {
                        _this.totalNum = resp.data.total;
                        resp.data.list.map(item => {
                            item.addtime = _this.$utils.toDateString(
                                item.addtime * 1000,
                                "yyyy-MM-dd"
                            );
                        });
                        _this.tableData = resp.data.list;
                    }
                });
            },
            editData: function (row) {
                if (row !== 'undefined') {
                    this.infoForm = Object.assign({}, row);
                }
                this.showDialog = true;
            }
        },
        computed: {
            catList() {
                return this.$store.state.base.catList;
            }
        },
        mounted() {
            this.loadData();
        }
    };

</script>
<style lang="scss" scoped>
    .img_pic_box {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .gourl_a {
        display: contents;
    }

</style>
