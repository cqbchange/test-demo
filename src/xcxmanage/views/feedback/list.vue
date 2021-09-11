<!--
 * @Descripttion: 建议反馈
 * @version: 1.0
 * @Author: LiZhi
 * @Date: 2021-01-15 16:52:43
 * @LastEditors: WangChuan
 * @LastEditTime: 2021-06-17 16:31:18
-->

<template>
    <div>
        <div class="topBox">
            <el-form :inline="true" ref="dataForm" class="form-inline-box">
                <div class="el-form-item-left">
                </div>
                <div class="el-form-item-right">
                    <el-form-item style="width:150px;">
                        <el-select placeholder="渠道" @change="changes" v-model="channel" filterable size="medium">
                            <el-option :key="index" :label="item.name" :value="item.id" v-for="(item,index) in bast" />
                        </el-select>
                    </el-form-item>
                </div>
            </el-form>
        </div>
        <fix-table v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading"
            :data="tableData" height="73.7vh" border size="small" style="width: 100%"
            header-row-class-name="my-table-header" class="my-table">
            <el-table-column fixed prop="id" label="ID" width="60" align="center" header-align="center" />
            <el-table-column prop="user_id" label="用户ID" width="80" align="center" />
            <el-table-column prop="channelName" label="渠道" width="100" align="center" />
            <el-table-column prop="typeName" label="类型" width="100" align="center" />
            <el-table-column prop="content" label="反馈内容" width="260" align="center" />
            <el-table-column prop="images" label="图片" width="80" align="center">
                <template slot-scope="scope">
                    <el-image style="width: 40px; height: 40px" :src="scope.row.pic"
                        :preview-src-list="scope.row.images" />
                </template>
            </el-table-column>
            <el-table-column prop="new_content" label="新消息" width="260" align="center" />
            <el-table-column prop="new_time" label="时间" width="160" align="center" />
            <el-table-column prop="back_content" label="回复内容" width="260" align="center" />
            <el-table-column prop="back_time" label="时间" width="160" align="center" />
            <el-table-column prop="addtime" label="添加时间" width="160" align="center" />
            <el-table-column fixed="right" label="操作" width="100" align="center">
                <template slot-scope="scope">
                    <el-button @click="huifu(scope.row)" type="text" size="medium">回复</el-button>
                </template>
            </el-table-column>
        </fix-table>
        <div class="pages">
            <el-pagination @current-change="handleCurrentChange" layout="total, prev, pager, next" :page-size="pageSize"
                :total="totalNum" />
        </div>
    </div>
</template>
<script>
    import {
        mapActions
    } from "vuex";

    export default {
        name: "feedbackList",
        data() {
            return {
                // 表格当前页
                currentPage: 1,
                // 每页显示数据数量
                pageSize: 12,
                // 表格数据总量
                totalNum: 0,
                channel: '',
                loading: true,
                tableData: [],
                info: {},
                bast: {}
            };
        },
        methods: {
            // 换页响应
            handleCurrentChange(val) {
                this.currentPage = val;
                this.loadData();
            },
            changes() {
                this.totalNum = 0;
                this.currentPage = 1;
                this.loadData();
            },
            getBast() {
                this.getRequest("/News/getBast").then(resp => {
                    if (resp && resp.code === 200) {
                        this.bast = resp.data;
                    }
                });
            },
            // 请求数据
            loadData() {
                this.loading = true;
                this.getRequest("/News/getList", {
                    p: this.currentPage,
                    cid: this.classId,
                    channel: this.channel,
                    size: this.pageSize
                }).then(resp => {
                    this.loading = false;
                    if (resp && resp.code === 200) {
                        this.totalNum = resp.data.total;
                        this.tableData = resp.data.list;
                    }
                });
            },
            huifu(row) {
                this.$prompt('回复内容', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                }).then(({
                    value
                }) => {
                    this.postRequest("/News/reply", {
                            id: row.id,
                            content: value
                        })
                        .then(resp => {
                            if (resp && resp.code === 200) {
                                this.$message({
                                    message: "回复成功",
                                    type: "success",
                                    showClose: true,
                                    duration: 1000
                                });
                                this.loadData();
                            } else {
                                this.$message({
                                    message: data.msg,
                                    type: "faild",
                                    showClose: true,
                                    duration: 1000
                                });
                            }
                        });
                })
            },
        },
        computed: {
            classId() {
                return this.$route.params.class_id == undefined ? 0 : this.$route.params.class_id;
            }
        },
        mounted() {
            this.getBast();
            this.loadData();
        }
    };

</script>

<style scoped>
    .img,
    .img img {
        display: inline-block;
        width: 60px;
    }

    .img~.img {
        margin-left: 5px;
    }

</style>
