<!--
 * @Descripttion: 代理提现
 * @version: 1.0
 * @Author: dulei 
 * @Date: 2021-01-22 10:27:43
 * @LastEditors: WangChuan
 * @LastEditTime: 2021-01-30 16:01:25
-->
<template>
    <div>
        <div class="topBox">
            <el-form :inline="true" :model="dataForm" ref="dataForm" class="demo-form-inline">
                <el-form-item style="flex:1;">
                    <el-button size="medium"  class="my-def-btn" icon="el-icon-check" @click="examine('all',1)">批量审核</el-button>
                    <el-button size="medium"  class="my-def-btn" icon="el-icon-close" @click="examine('all',0)">批量拒绝</el-button>
                    <!-- <el-button size="medium"  icon="el-icon-search" size="mini" @click="submitForm()">查询</el-button>
                    <el-button size="medium"  icon="el-icon-delete" size="mini" @click="resetForm('dataForm')">重置</el-button> -->
                </el-form-item>
                <el-form-item style="width:300px;">
                    <el-date-picker size="medium"
                        :disabled="loading"
                        v-model="dataForm.times"
                        value-format="timestamp"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        style="width:100%"
                        :default-time="['00:00:00', '23:59:59']"
                        :picker-options="pickerOptions"
                    />
                </el-form-item>
            </el-form>
        </div>
        <fix-table border v-loading="loading" element-loading-spinner="el-icon-loading"
            element-loading-text="拼命加载中" key="list" height="73.7vh" size="small"
            header-row-class-name="my-table-header" class="my-table"
            :data="tableData"
            @selection-change="handleSelectionChange">
            <el-table-column
                fixed
                type="selection"
                prop="id"
                label="编号"
                width="80"
                align="center"
                :selectable="checkboxInit"
                header-align="center"
            />
            <el-table-column
                fixed
                prop="id"
                label="ID"
                width="80"
                align="center"
                header-align="center"
            />
            <el-table-column prop="user_id" label="用户UID" align="center" width="120px"/>
            <el-table-column prop="money" label="金额" align="center" width="120px"/>
            <el-table-column prop="typeName" label="类型" align="center" width="120px"/>
            <el-table-column prop="alipay_num" label="支付宝交易号" width="300px" align="center"/>
            <el-table-column prop="alipay_name" label="支付宝昵称" align="center"/>
            <el-table-column prop="alipay_account" label="支付宝账号" align="center"/>
            <el-table-column prop="addtime" label="完成时间" align="center" width="200px"/>
            <el-table-column prop="descr" label="备注" align="center"/>
            <el-table-column prop="statusName" label="状态" align="center">
                <template slot-scope="scope">
                    <span v-if="scope.row.status == '-1'" style="color:#FF2323;">已拒绝</span>
                    <span v-if="scope.row.status == '0'" style="color:#aaa;">审核中</span>
                    <span v-if="scope.row.status == '1'" style="color:#5292FE;">已通过</span>
                </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="100" align="center">
                <template slot-scope="scope">
                    <el-button v-if="scope.row.status == 0" @click="examine('one', 1, scope.row.id)" type="text"
                               size="small">审核
                    </el-button>
                    <el-button v-if="scope.row.status == 0" @click="examine('one', 0, scope.row.id)" type="text"
                               size="small">拒绝
                    </el-button>
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

        <el-dialog title="转账进度" :visible.sync="showDialog" custom-class="edit" width="25%">
            <el-progress :text-inside="true" :stroke-width="20" :percentage="Math.ceil(handle.progress)"
                         status="success"/>
            <el-row :gutter="20" class="showDialog">
                <el-col :span="12">
                    <label class="label-name">处理成功</label>
                    <label class="label-data ok">{{handle.ok}}</label>
                </el-col>
                <el-col :span="12">
                    <label class="label-name">处理失败</label>
                    <label class="label-data err">{{handle.err}}</label>
                </el-col>
            </el-row>
        </el-dialog>
    </div>

</template>
<script>
    import {mapActions} from 'vuex';

    export default {
        name: "financeWithdrawal",
        data() {
            return {
                // 表格数据总量
                showDialog: false,
                totalNum: 0,
                dataForm: {
                    p: 1,
                    size: 18,
                    type: 1
                },
                handle: {
                    progress: 0,
                    all: 0,
                    wc: 0,
                    ok: 0,
                    err: 0
                },
                loading: true,
                tableData: [],
                multipleSelection: []
            };
        },
        components: {},
        watch:{
            "dataForm.times":{
            handler(val){
                if(val){
                    if(val.length){
                        this.submitForm()
                    }
                }else{
                        this.submitForm()
                }
            }
            }
        },
        methods: {
            selectChange(ret) {
                this.typeData();
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
                this.getRequest("/daniu/getWithdrawal", this.dataForm).then(
                    resp => {
                        this.loading = false;
                        if (resp && resp.code === 200) {
                            this.totalNum = resp.data.total;
                            resp.data.list.map(item => {
                                const addtime = item.addtime * 1000;
                                item.addtime = this.$utils.toDateString(
                                    addtime,
                                    "yyyy-MM-dd HH:mm:ss"
                                );
                            });
                            this.tableData = resp.data.list;
                        }
                    }
                );
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            examine(type, status, id = 0) {
                var thiss = this;
                this.handle = {
                    progress: 0,
                    all: 0,
                    wc: 0,
                    ok: 0,
                    err: 0
                };
                if (type === "one") {
                    if (id === 0) {
                        this.$message.error("数据错误,请重试！");
                        return;
                    }
                } else {
                    if (this.multipleSelection.length === 0) {
                        this.$message.error("未选中数据,请选择后添加！");
                        return;
                    }
                }
                if (status === 0) {
                    this.$prompt("", "拒绝理由", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        customClass: 'with_custom_class',
                        inputValidator: (value)=>{
                            if(!value){
                                return '请填写拒接理由'
                            }
                        },
                    }).then(({value}) => {
                        this.showDialog = true;
                        if (type === "one") {
                            this.handle.all = 1;
                            this.postData(id, -1, value);
                        } else {
                            this.handle.all = this.multipleSelection.length;
                            let timeNum = 0;
                            this.multipleSelection.forEach(element => {
                                timeNum++;
                                let time;
                                //创建定时器
                                clearTimeout(time);
                                time = setTimeout(function () {
                                    //延迟加载处理的方法
                                    thiss.postData(element.id, -1, value);
                                }, timeNum * 500);
                            });
                        }
                    }).catch(() => {
                    });
                } else if (status === 1) {
                    this.$confirm("此操作将给选中记录转账, 是否继续?", "提示", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        customClass: 'with_custom_class',
                        type: "warning"
                    })
                        .then(() => {
                            this.showDialog = true;
                            if (type === "one") {
                                this.handle.all = 1;
                                this.postData(id, 1);
                            } else {
                                this.handle.all = this.multipleSelection.length;
                                let timeNum = 0;
                                this.multipleSelection.forEach(element => {
                                    timeNum++;
                                    let time;
                                    //创建定时器
                                    clearTimeout(time);
                                    time = setTimeout(function () {
                                        //延迟加载处理的方法
                                        thiss.postData(element.id, 1);
                                    }, timeNum * 500);
                                });
                            }
                        })
                        .catch(() => {
                        });
                    // this.refuse();
                } else {
                    this.$message.error("数据错误,请重试");
                }
            },
            postData: function (id, status, descr = '') {
                this.postRequest("/daniu/manualWithdrawal", {
                    id: id,
                    status: status,
                    descr: descr
                }).then(data => {
                    this.handle.wc += 1;
                    this.handle.progress = (this.handle.wc / this.handle.all) * 100;
                    if (data.code === 200) {
                        this.handle.ok += 1;
                    } else {
                        this.handle.err += 1;
                        this.$message.error(data.msg);
                    }
                    if (this.handle.all === this.handle.wc) {
                        this.loadData();
                        setTimeout(() => {
                            this.showDialog = false
                        }, 1500);
                    }
                });
            },
            checkboxInit(row){
                return row.status === '0'
            }
        },
        computed: {
            pickerOptions() {
                return this.$store.state.base.pickerOptions;
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
    .showDialog {
        text-align: left;
        margin-top: 20px;

        label {
            display: inline-block;
        }

        .label-name {
            width: 30%;
        }

        .label-data {
            width: 50%;
            padding-left: 10px;
        }

        .ok {
            color: #0bb20c;
        }

        .err {
            color: red;
        }
    }
</style>
<style>

  .with_custom_class{
    border-radius: 10px;
    padding-bottom: 15px;
  }
  .with_custom_class .el-message-box__header{
    border-radius: 10px 10px 0 0;
    background: #EFF5FF;
    color: #111111;
  }
  .with_custom_class .el-message-box__title{
    line-height: inherit;
    font-size: 16px;
  }
  .with_custom_class .el-message-box__status+.el-message-box__message{
      padding-left: 22px;
  }
  .el-message-box__status.el-icon-warning{
      color: #409EFF;
      font-size: 18px!important;
  }
  .with_custom_class .el-message-box__btns{
      text-align: center;
      width: 180px;
      margin: 0 auto;
  }
  .with_custom_class .el-message-box__btns::after{
      clear: both;
  }
  .with_custom_class .el-message-box__btns .el-button{
      padding: 12px 26px;
      float: right;
  }
  .with_custom_class .el-message-box__btns .el-button.el-button--primary{
      background: linear-gradient(90deg, #73A7FF, #448AFF);
      float: left;
  }
  .with_custom_class .el-message-box__input{
      padding-top: 0;
  }
  .with_custom_class .el-message-box__content{
      padding: 30px 30px 20px;
  }
</style>

