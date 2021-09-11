<!--
 * @Descripttion: 积分商城
 * @version: 1.0
 * @Author: Dulei
 * @Date: 2021-01-15 16:52:43
 * @LastEditors: WangChuan
 * @LastEditTime: 2021-01-30 15:50:04
-->
<template>
    <div class="memberList">
        <div class="topBox">
            <el-form :inline="true" :model="dataForm" ref="dataForm" class="demo-form-inline">
                <el-form-item style="flex:1;">
                    <!-- <el-button size="medium"  icon="el-icon-search" size="mini" @click="submitForm()">查询</el-button>
                    <el-button size="medium"  icon="el-icon-delete" size="mini" @click="resetForm('dataForm')">重置</el-button> -->
                    <el-button size="medium"  type="primary" icon="el-icon-plus" class="my-blue-btn" @click="editData()">添加商品</el-button>
                </el-form-item>
                <el-form-item prop="keyword" style="width:200px;">
                    <el-input size="medium"  placeholder="搜索" v-model="dataForm.keyword" class="input-search-btn" clearable>
                        <el-button size="medium"  slot="append" icon="el-icon-search" @click="submitForm()"></el-button>
                    </el-input>
                </el-form-item>
            </el-form>
        </div>
        <fix-table
            ref="table"
            :data="tableData"
            key="memberlist"
            border v-loading="loading" element-loading-spinner="el-icon-loading"
            element-loading-text="拼命加载中" height="73.7vh" size="small"
            header-row-class-name="my-table-header" class="my-table"
        >
            <el-table-column
                fixed
                prop="id"
                label="编号"
                width="80"
                align="center"
                header-align="center"
            />
            <el-table-column prop="channel" label="渠道" align="center">
                <template slot-scope="scope">
                    <span v-if="scope.row.channel === 1">App</span>
                    <span v-else-if="scope.row.channel === 2">小程序</span>
                    <span v-else>全平台</span>
                </template>
            </el-table-column>
            <el-table-column prop="type" label="类型" align="center">
                <template slot-scope="scope">
                    <span v-if="scope.row.type === 1">实物</span>
                    <span v-else-if="scope.row.type === 2">红包</span>
                    <span v-else>虚拟</span>
                </template>
            </el-table-column>
            <el-table-column prop="start" label="商品/频道分类" width="260" align="center">
                <template slot-scope="scope">
                    <el-row type="flex" style="align-items: center;">
                            <el-image
                                style="width: 42px; height: 42px"
                                :src="scope.row.pic"
                                :preview-src-list="scope.row.pic_list"/>
                            <span style="flex: 1;text-align: left;margin-left:5px;">{{ scope.row.title}}</span>
                    </el-row>
                </template>
            </el-table-column>
            <el-table-column prop="price" label="价格" align="center"/>
            <el-table-column prop="integral" label="所需积分" width="90" align="center"/>
            <el-table-column prop="promotion_price" label="库存" align="center">
                <template slot-scope="scope">
                    <div>{{ scope.row.use_num}}/{{ scope.row.total}}</div>
                </template>
            </el-table-column>
            <el-table-column prop="order_list" label="排序" align="center" width="100" />
            <el-table-column prop="start" label="活动时间" align="center">
                <template slot-scope="scope">
                    <div>{{ scope.row.start}}-{{ scope.row.end}}</div>
                </template>
            </el-table-column>
            <el-table-column prop="stateName" label="状态" width="90" align="center"/>
            <el-table-column fixed="right" label="操作" width="180" align="center">
                <template slot-scope="scope">
                    <el-button @click="editData(scope.row)" type="text" size="small">编辑</el-button>
                </template>
            </el-table-column>
        </fix-table>
        <div class="pages">
            <el-pagination
                @current-change="handleCurrentChange"
                layout="total, prev, pager, next"
                :page-size="dataForm.size"
                :current-page="dataForm.p"
                :total="totalNum"
            />
        </div>
        <giftDetail v-if="showDialog" v-model="showDialog" :info="infoForm" @chage="loadData"/>
    </div>
</template>
<script>
    import giftDetail from "./addGift.vue";

    export default {
        name: "activityGift",
        components: {giftDetail},
        data() {
            return {
                // 表格数据总量
                totalNum: 0,
                // 每页显示数据数量
                loading: true,
                dataForm: {
                    keyword: "",
                    p: 1,
                    size: 9
                },
                tableData: [],
                showDialog: false,
                infoForm: {}
            };
        },
        methods: {
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
                this.getRequest("/gift/getList", _this.dataForm).then(resp => {
                    _this.loading = false;
                    if (resp && resp.code === 200) {
                        _this.totalNum = resp.data.total;
                        resp.data.list.map(item => {
                            item.goods_time = [item.start * 1000, item.end * 1000];
                            item.start = _this.$utils.toDateString(
                                item.start * 1000,
                                "yyyy/MM/dd"
                            );
                            item.end = _this.$utils.toDateString(
                                item.end * 1000,
                                "yyyy/MM/dd"
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
            },
            handleImgSuccess(file, fileList) {
                if (file.code !== 200) {
                    this.$message.error(file.msg);
                } else {
                    this.infoForm.pic = file.data;
                }
            },
            getGoods: function () {
                if (this.infoForm.num_iid !== undefined) {
                    this.getRequest("/gift/getGoods", this.infoForm).then(resp => {
                        if (resp && resp.code === 200) {
                            this.infoForm = Object.assign({}, resp.data);
                        } else {
                            this.$message.error(resp.msg);
                        }
                    });
                } else {
                    this.$message.error("请填写商品IID");
                }
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
  .demo-form-inline{
    display: flex;
  }
  .demo-form-inline .el-form-item:last-child{
    margin-right: 0;
  }
    .img_pic_box {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .gourl_a {
        display: contents;
    }
</style>

