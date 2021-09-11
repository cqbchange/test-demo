<!--
 * @Descripttion: 活动资金汇总
 * @version: 1.0
 * @Author: DuLei
 * @Date: 2021-03-27 09:32:43
 * @LastEditors: WangChuan
 * @LastEditTime: 2021-04-12 16:46:27
-->
<template>
    <div class="memberList">
        <fix-table ref="table" v-loading="loading" element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading" :data="tableData" key="memberlist" border height="80vh"
            style="width: 100%;" size="small" header-row-class-name="my-table-header" class="my-table">
            <el-table-column fixed type="index" label="序号" width="80" align="center" header-align="center" />
            <el-table-column prop="time" label="时间" align="center" />
            <el-table-column prop="integral" label="消耗积分" align="center" />
            <el-table-column prop="money" label="充值金额" align="center" />
            <el-table-column prop="jfb" label="看商品集分宝" align="center" />            
        </fix-table>
        <div class="pages">
            <el-pagination @current-change="handleCurrentChange" layout="total, prev, pager, next"
                :page-size="dataForm.size" :current-page="dataForm.p" :total="totalNum" />
        </div>
    </div>
</template>
<script>

    export default {
        name: "activityFundSummary",
        components: {},
        data() {
            return {
                status: '-1',
                // 表格数据总量
                totalNum: 0,
                // 每页显示数据数量
                loading: true,
                dataForm: {
                    p: 1,
                    size: 17,
                },
                tableData: [],
                showDialog: false,
                infoForm: {}
            };
        },
        methods: {
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
                this.getRequest("/ActivityStatistics/getList", _this.dataForm).then(resp => {
                    _this.loading = false;
                    if (resp && resp.code === 200) {
                        _this.totalNum = resp.data.total;
                        _this.tableData = resp.data.list;
                    }
                });
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
