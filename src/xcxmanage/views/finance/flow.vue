<!--
 * @Descripttion: 纷推用户资金明细
 * @version: 1.0
 * @Author: WangChuan
 * @Date: 2021-01-15 16:52:43
 * @LastEditors: LiXinRui
 * @LastEditTime: 2021-02-19 14:08:03
-->
<template>
    <div>
        <div class="topBox">
            <div></div>
            <div class="el-form-item-right">
                <el-form :inline="true" :model="dataForm" ref="dataForm" class="demo-form-inline">
                    <el-form-item prop="cid" style="width:150px;">
                        <el-select
                            size="medium"
                            v-model="dataForm.dev"
                            placeholder="请选择数据来源"
                        >
                            <el-option label="正式" :value="0"></el-option>
                            <el-option label="测试" :value="1"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="cid" style="width:150px;">
                        <el-select
                            size="medium"
                            v-model="dataForm.owner"
                            placeholder="全部归属人"
                            clearable
                            filterable
                            :disabled="dataready"
                            @change="chooseOwner"

                        >
                            <el-option label="全部归属人" value=""></el-option>
                            <el-option v-for="(val,key,i) in ownerList" :label="val" :value="val" :key="i"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="cid" style="width:150px;">
                        <el-select
                            size="medium"
                            v-model="dataForm.user_id"
                            placeholder="全部用户"
                            clearable
                            filterable
                            :disabled="showUser"
                            @change="chooseUser"
                        >
                            <el-option label="全部用户" value=""></el-option>
                            <el-option v-for="(val,key,i) in userList" :label="val" :value="key" :key="i"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="cid" style="width:150px;">
                        <el-select size="medium" :disabled="dataready" filterable clearable v-model="dataForm.type"
                            placeholder="类型" @clear="clearType()" @change="datagetlistdig">
                            <el-option :value="-2" label="全部类型" />
                            <!-- <el-option :value="-1" label="广告扣费" />
                            <el-option :value="1" label="提现" />
                            <el-option :value="2" label="充值" />
                            <el-option :value="3" label="广告支出" />
                            <el-option :value="4" label="后台加款" />
                            <el-option :value="5" label="代理人加款" />
                            <el-option :value="6" label="代理人充值" />
                            <el-option :value="7" label="代理人提现" />
                            <el-option :value="8" label="代理加款" />
                            <el-option :value="9" label="邀请用户奖励" />
                            <el-option :value="10" label="新人体验金" />
                            <el-option :value="11" label="代理收益" />
                            <el-option :value="12" label="套餐退款" />
                            <el-option :value="13" label="购买套餐" />
                            <el-option :value="14" label="套餐扣款" />
                            <el-option :value="15" label="后台扣款" />
                            <el-option :value="16" label="购买流量包" /> -->
                            <!-- <el-option :value="17" label="流量包消耗" /> -->
                            <el-option v-for="(key,val,index) in typeList" :key="index" :value="val" :label="key" />
                        </el-select>
                    </el-form-item>
                    <el-form-item style="width:300px;">
                        <el-date-picker size="medium" :disabled="dataready" v-model="dataForm.times"
                            value-format="timestamp" type="daterange" range-separator="至" start-placeholder="开始日期"
                            end-placeholder="结束日期" style="width:100%" :default-time="['00:00:00', '23:59:59']" />
                    </el-form-item>
                    
                    <el-form-item style="width:150px;">
                        <el-input @change="loadData()" placeholder="搜索" :disabled="dataready" v-model="dataForm.keyword" class="input-search-btn" clearable
                            size="medium" @clear='clearKeyword()'>
                            <el-button slot="append" icon="el-icon-search"></el-button>
                        </el-input>
                    </el-form-item>
                </el-form>
            </div>
        </div>
        <div class="table_box">
            <fix-table v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading"
                :data="tableData" height="73.7vh" border size="small" style="width: 100%"
                header-row-class-name="my-table-header" class="my-table">
                <el-table-column fixed prop="id" label="编号" width="80" align="center" header-align="center" />
                <el-table-column prop="user_id" label="用户UID" align="center" width="120px" />
                <el-table-column prop="user_name" label="手机号" align="center" width="120px" />
                <el-table-column prop="remarks" label="用户备注" align="center" width="120px" />
                <el-table-column align="center" prop="pay_type" label="支付/收款方式" width="120px" >
                    <template slot-scope="scope">
                        <span>{{scope.row.pay_type == 0 ? "--":scope.row.pay_type == 1 ? '支付宝' : '对公银行'}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center"  prop="alipay_num" label="交易号/凭证" width="290px" >
                    <template slot-scope="scope">
                        <el-image v-if="scope.row.voucher_img != '' && scope.row.voucher_img != undefined && scope.row.pay_type == 2"
                            style="width: 40px; height: 40px" :src="scope.row.voucher_img"
                            :preview-src-list="[scope.row.voucher_img]" />
                        <span v-else>{{scope.row.alipay_num}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="typeName" label="类型" align="center" width="120px" />
                <el-table-column prop="money" label="金额/流量包消耗" align="center" width="150px" />
                <el-table-column prop="rebate_money" label="赠送金额" align="center" width="120px" />
                <!-- <el-table-column prop="voucher_img" label="凭证" align="center" width="120px">
                    <template slot-scope="scope">
                        <el-image v-if="scope.row.voucher_img != '' && scope.row.voucher_img != undefined "
                            style="width: 40px; height: 40px" :src="scope.row.voucher_img"
                            :preview-src-list="[scope.row.voucher_img]" />
                        <span v-else>--</span>
                    </template>
                </el-table-column> -->
                <el-table-column prop="point_money" label="税点" align="center" />
                <el-table-column prop="descr" label="交易备注" width="170px"/>
                <el-table-column prop="addtime" label="添加时间" align="center" width="200px" />
            </fix-table>
        </div>
        <div class="show_this_page_num">
            <!-- 本页共{{thispagenum}}条数据， -->
            支出总额：{{expend_money}}，赠送：{{rebate_money}}，代理收益：{{agency_money}}
            <!-- {{isShowGiveDaniuExpend ? (`纷推赠送金额支出：${giveDaniuExpend}，`):''}} -->
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
        name: 'financeFtFlow',
        data() {
            return {
                // 表格数据总量
                totalNum: 0,
                dataForm: {
                    p: 1,
                    size: 18,
                    keyword: '',
                    type: -2,
                    owner:'',
                    user_id:'',
                    dev:0
                },
                owner:'',
                user:'',
                loading: true,
                tableData: [],
                typeList: {
                    
                },//类型列表
                dataready: true,
                useParams:true,
                userList:{},//用户列表
                ownerList:{},//归属人列表
                isshowUserChoose:true,//用户选择是否禁用（是）
                expend_money:0,
                rebate_money:0,
                agency_money:0,
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
            },
            "dataForm.type": {
                handler(val, old) {
                    this.tableData = []
                    this.dataForm.p = 1
                    this.loadData();
                }
            },
            "dataForm.dev": {
                handler(val, old) {
                    this.tableData = []
                    this.dataForm.p = 1
                    this.loadData();
                    this.getUserList()
                }
            },
            // owner:{
            //     handler(val, old) {
            //         this.user != '' ? this.user = '' :''
            //         this.tableData = []
            //         this.dataForm.p = 1
            //         this.loadData();
            //     }
            // },
            // user:{
            //     handler(val, old) {
            //         this.tableData = []
            //         this.dataForm.p = 1
            //         this.loadData();
            //     }
            // },
        },
        methods: {
            getType(){
                this.getRequest('Daniu/getFlowType',{
                    
                }).then((res)=>{
                    console.log(res)
                    if(res.code == 200){
                        this.typeList = res.data
                        console.log(this.typeList)
                    }else{
                        this.$message.error(res.msg)
                    }
                })
            },
            chooseOwner(){
                this.dataForm.user_id != '' ? this.dataForm.user_id = '' :''
                this.getUserList()
                this.tableData = []
                this.dataForm.p = 1
                this.loadData();
            },
            chooseUser(){
                this.tableData = []
                this.dataForm.p = 1
                this.loadData();
            },
            //获取归属人列表
            getownerList(){
                this.getRequest('/XcxCtTwo/salesman',
                    {
                        
                    }
                ).then((res)=>{
                    if (res.code == 200) {
                        if (res.data) {
                            this.ownerList = res.data.list;
                        }
                    }else{
                        this.open4(res.msg)
                        // this.loading = false
                    }
                })
            },
            //获取用户列表
            getUserList(){
                this.isshowUserChoose = true
                this.getRequest('/XcxTask/getDaniuUser',{
                    owner:this.dataForm.owner,
                    dev:this.dataForm.dev
                }).then((res)=>{
                    if (res.code == 200) {
                        this.userList = res.data;
                    }else{
                        this.open4(res.msg)
                    }
                    this.isshowUserChoose = false
                })
            },
            cancelRequest(str) {
                if (str == 'source') {
                    if (typeof this.source === 'function') {
                        this.source('请求中断1')
                    }
                }
                
            },
            clearKeyword(){
                this.useParams = false;
            },
            clearType() {
                this.dataForm.type = -2;
            },
            selectChange(ret) {
                this.typeData()
            },
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
            datagetlistdig() {
                // this.tableData = []
                // this.dataForm.p = 1
                // this.loadData();
            },
            // 请求数据
            loadData() {
                this.loading = true
                this.dataready = true
                this.$nextTick(()=>{
                    if (this.userId !== 0 && this.dataForm.keyword === '') {
                        this.dataForm.keyword = this.userId
                    }
                })
                this.getRequest('/Daniu/getFlowList', this.dataForm).then(
                    resp => {
                        this.loading = false
                        if (resp && resp.code === 200) {
                            this.totalNum = resp.data.total
                            resp.data.list.map(item => {
                                const addtime = item.addtime * 1000
                                item.addtime = this.$utils.toDateString(
                                    addtime,
                                    'yyyy-MM-dd HH:mm:ss'
                                )
                            })
                            this.tableData = resp.data.list
                            this.tableData.map(item => {
                                item.rebate_money = Number(item.rebate_money).toFixed(2)
                            })
                            this.expend_money = resp.data.expend_money
                            this.rebate_money = resp.data.rebate_money
                            this.agency_money = resp.data.agency_money
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
            open1 (msg) {
                this.$message({
                showClose: true,
                message: msg,
                })
            },
            open2 (msg) {
                this.$message({
                showClose: true,
                message: msg,
                type: 'success',
                })
            },
            open3 (msg) {
                this.$message({
                showClose: true,
                message: msg,
                type: 'warning',
                })
            },
            open4 (msg) {
                this.$message({
                showClose: true,
                message: msg,
                type: 'error',
                })
            },
        },
        computed: {
            userId() {
                return this.$route.params.user_id === undefined ? 0 : this.useParams == true ? this.$route.params.user_id : ''
            },
            showUser(){
                return !(!this.dataready && !this.isshowUserChoose);
            },
        },
        mounted() {
            this.loadData()
            this.getownerList()
            this.getUserList()
            this.getType()
        }
    }

</script>

<style lang="scss" scoped>
    //table样式
    .table_box>>>.el-table__fixed-right-patch {
        background-color: #EFF5FF !important;
    }
    .el-form-item-right >>> .el-form-item__content{
        line-height: inherit;
    }
    .topBox{
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .show_this_page_num{
        text-align: right;
        font-size: 14px;
        font-family: PingFang SC;
        font-weight: 500;
        color: #333333;
        margin-top: 10px;
        padding: 0 40px 0 0 ;
    }
</style>
