<!--
 * @Descripttion: 订单列表
 * @version: 1.0
 * @Author: Dulei
 * @Date: 2021-01-23
 * @LastEditors: WangChuan
 * @LastEditTime: 2021-01-30 15:51:58
-->
<template>
    <div>
        <div class="topBox">
            <el-form :inline="true" :model="dataForm" ref="dataForm" class="demo-form-inline">
                <el-form-item style="flex:1">
                </el-form-item>
                <el-form-item prop="cid" style="width:150px;">
                    <el-select size="medium" filterable v-model="dataForm.status" placeholder="状态"
                        @change="selectChange">
                        <el-option value="" label="全部状态" />
                        <el-option value="0" label="待支付" />
                        <el-option value="1" label="已支付" />
                        <el-option value="2" label="已发货" />
                        <el-option value="3" label="已收货" />
                        <el-option value="4" label="已退款" />
                        <el-option value="-1" label="失效" />
                    </el-select>
                </el-form-item>
                <el-form-item style="width:320px;">
                    <el-date-picker size="medium" v-model="daterange" value-format="timestamp" type="datetimerange"
                        range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" style="width:100%"
                        prefix-icon="el-icon-date" :default-time="['00:00:00', '23:59:59']"
                        :picker-options="pickerOptions" />
                </el-form-item>
                <el-form-item label prop="keyword" style="width:200px;">
                    <el-input size="medium" placeholder="搜索" v-model="dataForm.keyword" class="input-search-btn"
                        clearable>
                        <el-button size="medium" slot="append" icon="el-icon-search" @click="submitForm()"></el-button>
                    </el-input>
                </el-form-item>
            </el-form>
        </div>
        <fix-table ref="table" :data="tableData" key="memberlist" border v-loading="loading"
            element-loading-spinner="el-icon-loading" element-loading-text="拼命加载中" height="73.7vh" size="small"
            header-row-class-name="my-table-header" class="my-table">
            <el-table-column fixed prop="id" label="订单号" align="center" />
            <el-table-column prop="addtime" label="创建时间" align="center" />
            <el-table-column prop="user_id" label="用户" align="center" />
            <el-table-column prop="title" label="商品标题" align="center" />
            <el-table-column prop="money" label="在售价" align="center" width="100" />
            <el-table-column prop="integral" label="兑换积分" width="100" />
            <el-table-column prop="statusName" label="订单状态" align="center" width="80" />
            <el-table-column fixed="right" label="操作" width="120" align="center">
                <template slot-scope="scope">
                    <el-button v-if="scope.row.status>=1" @click="reimburse(scope.row)" type="text" size="small">退款
                    </el-button>
                    <el-button @click="selectData(scope.row)" type="text" size="small">查看</el-button>
                </template>
            </el-table-column>
        </fix-table>
        <div class="pages">
            <el-pagination @current-change="handleCurrentChange" layout="total, prev, pager, next"
                :page-size="dataForm.size" :current-page="dataForm.p" :total="totalNum" />
        </div>

        <el-dialog title="订单详情" :visible.sync="showDialog" custom-class="my-dialog" width="60%">
            <el-form ref="form" label-position="left" :model="infoForm" label-width="100px">
                <el-row :gutter="20">
                    <el-col :span="8">
                        <el-form-item label="订单号：">
                            <span>{{infoForm.id}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="购买人：">
                            <span>{{infoForm.user_id}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="商品名：">
                            <span>{{infoForm.title}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="兑换积分：">
                            <span>{{infoForm.integral}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="创建时间：">
                            <span>{{infoForm.addtime}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="付款时间：">
                            <span>{{infoForm.pay_time}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="发货时间：">
                            <span>{{infoForm.send_time}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="收货时间：">
                            <span>{{infoForm.collect_time}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="状态：">
                            <span>{{infoForm.statusName}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="运单号：">
                            <span>{{infoForm.sendTypeName}}:{{infoForm.send_code}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="收件人：">
                            <span>{{infoForm.name}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="电话：">
                            <span>{{infoForm.mobile}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="16">
                        <el-form-item label="地址：">
                            <span>{{infoForm.address}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="medium" type="primary" class="my-blue-btn" @click="showDialog=false">确 定</el-button>
                <el-button size="medium" type="success" v-if="infoForm.status==1" @click="send(infoForm)">发 货
                </el-button>
            </div>
        </el-dialog>
        <el-dialog title="发货" :visible.sync="showSendDialog" custom-class="my-dialog" width="30%">
            <el-form ref="form" label-position="left" :model="sendForm" label-width="80px">
                <el-form-item label="订单：">
                    <span>{{sendForm.id}}</span>
                </el-form-item>
                <el-form-item label="运单号：">
                    <el-row :gutter="20">
                        <el-col :span="8">
                            <el-select size="medium" filterable v-model="sendForm.send_type" placeholder="快递公司">
                                <el-option v-for="item in sendType" :key="item.id" :label="item.name"
                                    :value="item.id" />
                            </el-select>
                        </el-col>
                        <el-col :span="14">
                            <el-input size="medium" v-model="sendForm.send_code" clearable />
                        </el-col>
                    </el-row>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="medium" type="primary" class="my-blue-btn" @click="submitSend">确 定</el-button>
                <el-button size="medium" @click="showSendDialog = false">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import {
        mapActions
    } from "vuex";

    export default {
        name: "orderactivityGiftList",
        data() {
            return {
                // 表格数据总量
                showDialog: false,
                showSendDialog: false,
                totalNum: 0,
                dataForm: {
                    status: '',
                    p: 1,
                    size: 20
                },
                loading: true,
                tableData: [],
                infoForm: {},
                sendForm: {},
                daterange: [],
            };
        },
        components: {},
        methods: {
            selectChange(ret) {
                // this.typeData();
            },
            // 重置表单
            resetForm(formName) {
                this.dataForm.p = 1;
                this.$refs[formName].resetFields();
                this.loadData();
            },
            // 提交表单
            submitForm: function () {
                this.tableData = [];
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
            loadData() {
                this.loading = true;
                this.getRequest("/gift/getOrder", this.dataForm).then(resp => {
                    this.loading = false;
                    if (resp && resp.code === 200) {
                        this.totalNum = resp.data.total;
                        resp.data.list.map(item => {
                            const addtime = item.addtime * 1000;
                            item.addtime = this.$utils.toDateString(
                                addtime,
                                "yyyy-MM-dd HH:mm:ss"
                            );
                            const pay_time = item.pay_time * 1000;
                            item.pay_time = this.$utils.toDateString(
                                pay_time,
                                "yyyy-MM-dd HH:mm:ss"
                            );
                            const send_time = item.send_time * 1000;
                            item.send_time = this.$utils.toDateString(
                                send_time,
                                "yyyy-MM-dd HH:mm:ss"
                            );
                            const collect_time = item.collect_time * 1000;
                            item.collect_time = this.$utils.toDateString(
                                collect_time,
                                "yyyy-MM-dd HH:mm:ss"
                            );
                            const earning_time = item.earning_time * 1000;
                            item.earning_time = this.$utils.toDateString(
                                earning_time,
                                "yyyy-MM-dd HH:mm:ss"
                            );
                        });
                        this.tableData = resp.data.list;
                    }
                });
            },
            selectData: function (row) {
                if (row !== 'undefined') {
                    this.infoForm = Object.assign({}, row);
                }
                this.showDialog = true;
            },
            send(row) {
                this.sendForm = Object.assign({}, row);
                this.showSendDialog = true;
            },
            submitSend() {
                this.postRequest("/gift/setSend", this.sendForm).then(data => {
                    this.loading = false;
                    if (data.code === 200) {
                        this.infoForm.status = 2;
                        this.infoForm.statusName = "已发货";
                        this.infoForm.send_code = this.sendForm.send_code;
                        this.$message.success(data.msg);
                        this.showSendDialog = false;
                        this.loadData();
                    } else {
                        this.$message.error(data.msg);
                    }
                });
            },
            reimburse(row) {
                this.$prompt('请输入退款备注', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    customClass: 'with_custom_class',
                }).then(({
                    value
                }) => {
                    if (value == null) {
                        this.$message.error('请输入退款备注');
                        return 1
                    }
                    this.$confirm('是否对该订单进行退款操作？', '确认操作', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.postRequest('/gift/reimburse', {
                            id: row.id,
                            userId: row.user_id,
                            msg: value
                        }).then(resp => {
                            if (resp && resp.code === 200) {
                                this.$message.success(resp.msg);
                                this.loadData()
                            } else {
                                this.$message.error(resp.msg);
                            }
                        })
                    })
                }).catch(() => {})
            },
        },
        computed: {
            sendType() {
                return this.$store.state.base.sendType;
            },
            pickerOptions() {
                return this.$store.state.base.pickerOptions;
            }
        },
        watch: {
            "dataForm.status": {
                handler(val) {
                    this.loadData()
                }
            },
            daterange(val) {
                if (val) {
                    if (val.length) {
                        if (val[0] === val[1]) {
                            val[1] = this.$utils.getWhatDay(val[0], 0, 'last')
                        } else {
                            val[1] = this.$utils.getWhatDay(val[1], 0, 'last')
                        }
                        this.dataForm.times = [Math.floor(val[0] / 1000), Math.floor(val[1] / 1000)]
                    }
                } else {
                    this.dataForm.times = null
                }
                this.loadData()
            },
        },
        mounted() {
            this.$store.commit("setBreadCrumb", [{
                name: '积分商城',
                path: '/activityGift',
            }]);

            // this.daterange = [
            //     this.$utils.getWhatMonth(new Date(),0,'first'),
            //     this.$utils.getWhatDay(new Date(),0,'last'),
            // ]
            this.daterange = null
        },
        destroyed() {
            this.$store.commit("setBreadCrumb", []);
        }
    };

</script>

<style scoped>
    .demo-form-inline {
        display: flex;
    }

    .demo-form-inline .el-form-item:last-child {
        margin-right: 0;
    }

    .gourl_a {
        display: contents;
    }

</style>

<style>
    .with_custom_class {
        border-radius: 10px;
        padding-bottom: 15px;
    }

    .with_custom_class .el-message-box__header {
        border-radius: 10px 10px 0 0;
        background: #EFF5FF;
        color: #111111;
    }

    .with_custom_class .el-message-box__title {
        line-height: inherit;
        font-size: 16px;
    }

    .with_custom_class .el-message-box__status+.el-message-box__message {
        padding-left: 22px;
    }

    .el-message-box__status.el-icon-warning {
        color: #409EFF;
        font-size: 18px !important;
    }

    .with_custom_class .el-message-box__btns {
        text-align: center;
        width: 180px;
        margin: 0 auto;
    }

    .with_custom_class .el-message-box__btns::after {
        clear: both;
    }

    .with_custom_class .el-message-box__btns .el-button {
        padding: 12px 26px;
        float: right;
    }

    .with_custom_class .el-message-box__btns .el-button.el-button--primary {
        background: linear-gradient(90deg, #73A7FF, #448AFF);
        float: left;
    }

    .with_custom_class .el-message-box__input {
        padding-top: 0;
    }

    /* .with_custom_class .el-message-box__content{
      padding: 30px 30px 20px;
  } */

</style>
