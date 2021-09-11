<!--
 * @Descripttion: 纷推用户
 * @version: 1.0
 * @Author: WangChuan
 * @Date: 2021-01-15 16:52:43
 * @LastEditors: WangChuan
 * @LastEditTime: 2021-08-21 09:31:00
-->
<template>
    <div>
        <div class="topBox">
            <el-form style="display:flex;justify-content: space-between;" :inline="true" :model="dataForm" ref="dataForm" class="demo-form-inline">
                <el-form-item>
                    <!-- <el-button class="my-def-btn" icon="el-icon-delete" @click="resetForm('dataForm')">重置</el-button> -->
                    <el-button  size="medium" type="primary" class="my-blue-btn" icon="el-icon-plus" @click="addInfo()">添加用户</el-button>
                </el-form-item>
                <div class="el-form-item-right">
                    <el-form-item style="width:150px;">
                        <el-select
                            size="medium"
                            v-model="dataForm.invite_name"
                            placeholder="请选择归属人"
                            filterable
                            clearable
                            @change="submitForm()"
                            :disabled='isownerList'
                        >
                            <el-option label="全部归属人" value=""></el-option>
                            <el-option v-for="(val,key,i) in ownerList" :label="val" :value="val" :key="i"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="keyword" style="width:200px;">
                        <el-input size="medium" :disabled="dataready" placeholder="请输入内容搜索" v-model="dataForm.keyword" @change="submitForm()" class="input-search-btn" clearable>
                            <el-button :disabled="dataready" @click="submitForm()" slot="append" icon="el-icon-search"></el-button>
                        </el-input>
                    </el-form-item>
                </div>
            </el-form>
            </div>
            <div class="table_box">
                <fix-table v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" :data="tableData"
                height="73.7vh" border size="small" style="width: 100%" @sort-change="sortChange" 
                header-row-class-name="my-table-header" class="my-table">
                    <el-table-column prop="uid" label="UID" align="center" width="120" />
                    <el-table-column prop="user_name" label="账号" align="center" width="120">
                        <template slot-scope="scope">
                            <span @click="linkto(scope.row)" style="cursor: pointer;color: #0026ff">{{scope.row.user_name}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="money" :sort-orders="['ascending', 'descending']" sortable="custom" label="余额" align="center" />
                    <el-table-column prop="present_money" label="赠送余额" align="center" width="100" />
                    <el-table-column prop="hits" label="流量包余量" align="center" width="120" sortable="custom"/>
                    <!-- <el-table-column prop="lock_money" label="锁定金额" align="center" /> -->
                    <el-table-column prop="pidName" label="所属代理" align="center" width="140">
                        <template slot-scope="scope">
                            <span v-if="scope.row.pidName">{{scope.row.pidName}}</span>
                            <span v-if="scope.row.pidRemarks && scope.row.pidName" style="display:block">备注：{{scope.row.pidRemarks}}</span>
                        </template>
                    </el-table-column>
                    <!-- <el-table-column prop="examineName" label="审核" align="center" width="100" /> -->
                    <el-table-column prop="allrecharge" label="累计充值" align="center" width="120" sortable="custom"/>
                    <el-table-column prop="agent_status" label="代理" align="center" width="100">
                        <template slot-scope="scope">
                            <span>{{scope.row.agent_status == 0?'否':'是'}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="cpc_money" label="CPC单价" align="center" />
                    <!-- <el-table-column prop="deduction_rate" label="扣费比例" align="center" />
                    <el-table-column prop="deduction_time" label="扣费时间" align="center" width="140" /> -->
                    <el-table-column prop="invite_name" label="邀请人" align="center">
                        <template slot-scope="scope">
                            <span>{{scope.row.invite_name === ''?scope.row.pid:scope.row.invite_name}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="remarks" label="备注" align="center" />
                    <el-table-column prop="create_time" label="注册时间" align="center" width="160" />
                    <el-table-column fixed="right" label="操作" width="160" align="center">
                        <template slot-scope="scope">
                            <el-button @click="editData(scope.row)" type="text" size="small">编辑</el-button>
                            <el-button @click="addMoney(scope.row)" type="text" size="small">加款</el-button>
                            <el-button @click="flowData(scope.row)" type="text" size="small">明细</el-button>
                            <!-- <el-button @click="linkto(scope.row)" type="text" size="small">跳转</el-button> -->
                        </template>
                    </el-table-column>
                </fix-table>
            </div>
        <div class="pages">
            <el-pagination @current-change="handleCurrentChange" layout="total, prev, pager, next" :page-size="dataForm.size"
                :current-page="dataForm.p" :total="totalNum" />
        </div>
        <el-dialog title="添加/新增用户" :visible.sync="dialogVisible" width="42%" custom-class="my-dialog" :append-to-body="true"
            :close-on-press-escape="false">
            <div class="dialog_box">
                <el-form :model="infoForm" size="medium">
                    <el-row :gutter="20" type="flex">
                        <el-col :span="12">
                            <el-form-item label="账号：" label-width="100px">
                                <el-input v-model="infoForm.user_name" autocomplete="off" placeholder="请填写账号" clearable />
                            </el-form-item>
                            
                            <el-form-item label="每日预算：" label-width="100px">
                                <el-input v-model="infoForm.budget" autocomplete="off" placeholder="请填写每日预算" clearable />
                            </el-form-item>
                            
                            <el-form-item label="CPC单价：" label-width="100px">
                                <el-input v-model="infoForm.cpc_money" autocomplete="off" placeholder="请填写cpc单价" clearable />
                            </el-form-item>
                            <el-form-item label="引流单价：" label-width="100px">
                                <el-input v-model="infoForm.yunma_drainage_cpc" autocomplete="off" placeholder="请填写引流单价" clearable />
                            </el-form-item>
                            <el-form-item label="关注单价：" label-width="100px">
                                <el-input v-model="infoForm.yunma_follow_cpc" autocomplete="off" placeholder="请填写关注单价" clearable />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="密码：" label-width="100px">
                                <el-input v-model="infoForm.user_pass" autocomplete="off" placeholder="请填写密码" clearable />
                            </el-form-item>
                            <el-form-item label="扣费比列：" label-width="100px">
                                <el-input v-model="infoForm.deduction_rate" autocomplete="off" placeholder="请填写扣费比列" clearable />
                            </el-form-item>
                            <el-form-item label="邀请人：" label-width="100px">
                                <!-- <el-input v-model="infoForm.invite_name" autocomplete="off" placeholder="请填写邀请人" clearable /> -->
                                <el-select
                                    v-model="infoForm.invite_name"
                                    placeholder="请选择归属人"
                                    filterable
                                >
                                    <el-option v-for="(val,key,i) in ownerList" :label="val" :value="val" :key="i"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="备注：" label-width="100px">
                                <el-input v-model="infoForm.remarks" autocomplete="off" placeholder="请填写备注" clearable />
                            </el-form-item>
                        </el-col>
                        <el-col :span="24" style="text-align:center;margin:0 0 15px 0">
                            <el-form-item label="审核：" label-width="100px" style="display:inline-block;margin-bottom:0px">
                                <el-radio-group v-model="infoForm.examine">
                                    <el-radio style="margin:0 15px 0 0" :label="0">审核</el-radio>
                                    <el-radio style="margin:0 15px 0 0" :label="1">免审</el-radio>
                                </el-radio-group>
                            </el-form-item>
                            <el-form-item label="代理：" label-width="100px" style="display:inline-block;margin-bottom:0px">
                                <el-radio-group v-model="infoForm.agent_status">
                                    <el-radio style="margin:0 15px 0 0" :label="0">否</el-radio>
                                    <el-radio style="margin:0 15px 0 0" :label="1">是</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button size="mini" class="my-blue-btn" type="primary" @click="editSub()">确 定</el-button>
                    <el-button size="mini" @click="dialogVisible = false">取 消</el-button>
                </div>
            </div>
        </el-dialog>
        
        
        <el-dialog :title="'加款 '+(`用户:${moneyInfo.user_name}`)" :visible.sync="dialogMoneyVisible" width="42%" custom-class="my-dialog" :append-to-body="true"
            :close-on-press-escape="false">
            <div class="dialog_box">
                <el-form :model="moneyInfo" size="medium">
                    <el-row :gutter="20" type="flex">
                        <el-col :span="12">
                            <!-- <el-form-item label="用户" label-width="100px">
                                <span>{{moneyInfo.user_name}}</span>
                            </el-form-item> -->
                            <el-form-item label="金额：" label-width="100px">
                                <el-input v-model="moneyInfo.money" autocomplete="off" placeholder="请填写金额(填写后需填写交易号)" clearable />
                            </el-form-item>
                            
                            <el-form-item label="赠送比例：" label-width="100px">
                                <el-input @clear="clearateCom" :disabled="couldWrite" v-model="rateCom" autocomplete="off" placeholder="请填写比例" @blur="isFocus = false" @focus="isFocus = true"
                                    clearable />
                            </el-form-item>
                            <el-form-item label="收款方式：" label-width="100px" v-if="!couldWrite">
                                <el-select
                                    v-model="moneyInfo.pay_type"
                                    placeholder="请选择收款方式"
                                >
                                    <el-option label="支付宝" :value="1"></el-option>
                                    <el-option label="对公银行" :value="2"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="流量包：" label-width="100px">
                                <el-input v-model="moneyInfo.flowpacket" autocomplete="off" placeholder="请填写流量包" clearable />
                            </el-form-item>
                            <el-form-item  label="" label-width="100px">
                                <span style="white-space: nowrap;">减去税点实际到账：<span style="color:red" v-if="!isNaN(Number(mySubtr(moneyInfo.money,moneyInfo.point_money))+Number(this.moneyInfo.rebate_money))">{{Number(mySubtr(moneyInfo.money,moneyInfo.point_money))+Number(this.moneyInfo.rebate_money)}}</span></span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="赠送金额：" label-width="100px">
                                <el-input @clear="clearebatemoney" :disabled="couldWrite" v-model="moneyInfo.rebate_money" autocomplete="off" placeholder="请填写金额" clearable />
                            </el-form-item>
                            <el-form-item label="税点：" label-width="100px">
                                <el-input :disabled="couldWrite" @input="inputChange1" v-model="moneyInfo.point_money" autocomplete="off" placeholder="请填写税点" clearable />
                            </el-form-item>
                            <el-form-item v-if="moneyInfo.pay_type == 1 && !couldWrite" label="交易号：" label-width="100px">
                                <el-input v-model="moneyInfo.alipay_num" autocomplete="off" placeholder="请填写交易号" clearable />
                            </el-form-item>
                            <el-form-item label="备注：" label-width="100px">
                                <el-input v-model="moneyInfo.remarks" autocomplete="off" placeholder="请填写备注" clearable />
                            </el-form-item>
                            <!-- <el-form-item v-if="moneyInfo.pay_type == 2" label="凭证：" label-width="100px">
                                <div class="avatar-uploader">
                                    <el-upload
                                        name="image"
                                        :action="uploadUrl"
                                        :show-file-list="false"
                                        :on-success="handleImgSuccess"
                                        :before-upload="beforeAvatarUpload">
                                        <img v-if="moneyInfo.voucher_img" :src="moneyInfo.voucher_img" class="avatar">
                                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                    </el-upload>
                                </div>
                            </el-form-item> -->
                            <el-form-item v-if="moneyInfo.pay_type == 2" label="凭证：" label-width="100px">
                                <div style="display: flex;justify-content: space-between;">
                                    <el-input style="width:140px" clearable v-model="moneyInfo.voucher_img" autocomplete="off" />
                                    <el-upload style="display:inline-block" :before-upload="beforeAvatarUpload" class="upload-demo" name="image" :action="uploadUrl" :on-success="handleImgSuccess"
                                        :show-file-list="false">
                                        <el-button size="medium" style="background: #E4EEFF;border-radius: 10px;border:none;color:#4188FF;height:36px" type="primary">点击上传</el-button>
                                    </el-upload>
                                </div>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button size="mini" type="primary" class="my-blue-btn" @click="subMoney()">确 定</el-button>
                    <el-button size="mini" @click="dialogMoneyVisible = false">取 消</el-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    export default {
        name: "userFtList",
        data() {
            return {
                // 表格数据总量
                totalNum: 0,
                dataForm: {
                    p: 1,
                    size: 18,
                    sortType: '',
                    sortField: '',
                    invite_name:'',
                    keyword:'',
                },
                loading: true,
                tableData: [],
                dialogVisible: false,
                infoDef: {
                    user_name: '',
                    user_pass: '',
                    budget: 0,
                    deduction_rate: 100,
                    invite_name: '有惠',
                    examine: 0,
                    agent_status: 0,
                    cpc_money: 0.18,
                    yunma_drainage_cpc: 0.2,
                    yunma_follow_cpc: 0.3,
                    remarks: ''
                },
                infoForm: {},
                dialogMoneyVisible: false,
                moneyInfo: {
                    uid: 0,
                    user_name: '',
                    money: '',
                    rebate_money: '',
                    voucher_img:'',
                    remarks: '',
                    alipay_num:'',
                    pay_type:1,
                    point_money:'',
                    flowpacket:''
                },
                rate_com: '',
                isFocus: false,
                ownerList:'',//销售列表
                dataready:true,
            };
        },
        watch: {
            "infoForm.cpc_money": {
                handler: function(val) {
                    if((val+'').indexOf('.') !== -1){
                        this.infoForm.cpc_money = (val+'').substr(0,(val+'').indexOf('.')+4)
                    }
                }
            },
            "infoForm.yunma_drainage_cpc": {
                handler: function(val) {
                    if((val+'').indexOf('.') !== -1){
                        this.infoForm.yunma_drainage_cpc = (val+'').substr(0,(val+'').indexOf('.')+4)
                    }
                }
            },
            "infoForm.yunma_follow_cpc": {
                handler: function(val) {
                    if((val+'').indexOf('.') !== -1){
                        this.infoForm.yunma_follow_cpc = (val+'').substr(0,(val+'').indexOf('.')+4)
                    }
                }
            },
            "moneyInfo.money": {
                handler: function(val) {
                    //  debugger
                    if (!this.moneyInfo.money) {
                        this.moneyInfo.point_money = ''
                        return
                    }
                    this.moneyInfo.money = isNaN(Number(val))? '' : val.match(/^\d*(\.?\d{0,2})/g)[0]
                    
                    this.moneyInfo.money = this.moneyInfo.money != '-' ? this.moneyInfo.money : '-'
                    if (isNaN(this.moneyInfo.money) && this.moneyInfo.money != '-') {
                        this.moneyInfo.money = 0
                    }
                    if (this.moneyInfo.money === 0) {
                        this.rate_com = 0
                        this.moneyInfo.point_money = ''
                        // this.moneyInfo.rebate_money = 0
                    }
                    if (!isNaN(this.moneyInfo.rebate_money) && this.moneyInfo.rebate_money && this.moneyInfo.money !== 0 && !isNaN(this.moneyInfo.money)) {
                        this.rate_com = this.moneyInfo.rebate_money / this.moneyInfo.money
                    }
                    if (!isNaN(this.rate_com) && this.rate_com && !isNaN(this.moneyInfo.money)) {
                        this.moneyInfo.rebate_money = this.moneyInfo.money * this.rate_com
                    }
                    if (!isNaN(this.moneyInfo.money) && this.moneyInfo.money<0) {
                        this.moneyInfo.rebate_money = 0
                        this.rate_com = 0
                        this.moneyInfo.pay_type = 0
                        this.moneyInfo.point_money = 0
                        this.moneyInfo.alipay_num = ''
                    }else{
                        this.moneyInfo.pay_type == 0 ? this.moneyInfo.pay_type = 1 : ''
                    }
                },
            },
            "moneyInfo.rebate_money": {
                handler: function() {
                    if (!this.moneyInfo.rebate_money) {
                        this.rate_com = 0
                        return
                    }
                    this.moneyInfo.rebate_money = this.moneyInfo.rebate_money != '-' ? Math.ceil(this.moneyInfo.rebate_money) :
                        '-'
                    // console.log('rebate_money',Math.ceil(this.moneyInfo.rebate_money))
                    if (isNaN(this.moneyInfo.rebate_money) && this.moneyInfo.rebate_money != '-') {
                        this.moneyInfo.rebate_money = 0
                    }
                    if(!isNaN(this.moneyInfo.rebate_money) &&this.moneyInfo.rebate_money<0){
                        this.moneyInfo.rebate_money = 0
                    }
                    if (!isNaN(this.moneyInfo.money) && this.moneyInfo.money && this.moneyInfo.money !== 0 && !isNaN(this.moneyInfo
                        .rebate_money)) {
                        this.rate_com = this.moneyInfo.rebate_money / this.moneyInfo.money
                    }
                },
            },
            rateCom() {
                if (!this.rate_com) {
                    return
                }
                // if(this.rate_com>1){
                //   this.rate_com = 1
                // }
                if (!isNaN(this.moneyInfo.money) && this.moneyInfo.money && !isNaN(this.moneyInfo.rebate_money) && !isNaN(this.rate_com)) {
                    // console.log('rateCom',this.moneyInfo.money,this.rate_com,this.moneyInfo.money * this.rate_com)
                    this.moneyInfo.rebate_money = this.moneyInfo.money * this.rate_com
                }
            },
            "moneyInfo.pay_type":{
                handler: function(val) {
                    if (val == 2) {
                        this.moneyInfo.alipay_num == '' ? '' : this.moneyInfo.alipay_num = ''
                    }else{
                        this.moneyInfo.voucher_img == '' ? '' : this.moneyInfo.voucher_img = ''
                    }
                    // val == 0 ? (this.moneyInfo.voucher_img == '' ? '' : this.moneyInfo.voucher_img = '') : (val == 1 ? this.moneyInfo.voucher_img == '' ? '' : this.moneyInfo.voucher_img = '' : '')
                },
            },
            "moneyInfo.flowpacket":{
                handler(val,old) {
                    let oldData = old
                    if (val == undefined) {
                        return
                    }
                    if(isNaN(Number(val)) || val.indexOf('.') != -1 || val.length > 7){
                        this.moneyInfo.flowpacket = oldData
                        return
                    }
                    this.moneyInfo.flowpacket = isNaN(Number(val))? '' : typeof(val) == 'string' ? val.match(/^[1-9]\d*$/g) != null ? val.match(/^[1-9]\d*$/g)[0] : '' : String(val).match(/^[1-9]\d*$/g) != null ? String(val).match(/^[1-9]\d*$/g)[0] : ''
                }
            },
        },
        methods: {
            //价格处理
            keepTwoDecimalFull(num) {  
                let result = parseFloat(num);  
                if (isNaN(result)) {  
                    this.open3('价格处理传递参数错误，请检查！');  
                    return false;  
                }  
                result = Math.round(num * 100) / 100;  
                let s_x = result.toString(); //将数字转换为字符串
                
                let pos_decimal = s_x.indexOf('.'); //小数点的索引值
                
    
                // 当整数时，pos_decimal=-1 自动补0  
                if (pos_decimal < 0) {  
                    pos_decimal = s_x.length;  
                    s_x += '.';  
                }
    
                // 当数字的长度< 小数点索引+2时，补0  
                while (s_x.length <= pos_decimal + 2) {  
                    s_x += '0';  
                }  
                return s_x;  
            },
            //清空赠送金额
            clearebatemoney(){
                if (this.rate_com) {
                    this.rate_com = 0;
                }
            },
            //清空比例
            clearateCom(){
                if (this.moneyInfo.rebate_money) {
                    this.moneyInfo.rebate_money = '';
                }
            },
            beforeAvatarUpload(file) {
                const isJPG = (file.type === 'image/jpg' || file.type === 'image/jpeg' || file.type === 'image/png');

                if (!isJPG) {
                    this.$message.error('请上传图片文件(jpg,png)');
                }
                return isJPG;
            },
            // 获取归属人列表
            getUserList(){
                this.getRequest('/XcxTask/salesman',
                    {
                        
                    }
                ).then((res)=>{
                    if (res.code == 200) {
                        if (res.data) {
                            this.ownerList = res.data
                        }
                    }else{
                        this.open4(res.msg)
                    }
                })
            },
            handleImgSuccess(file, fileList) {
                if (file.code !== 200) {
                    this.$message.error(file.msg);
                } else {
                    this.moneyInfo.voucher_img = file.data;
                }
            },
            //跳转操作
            linkto(row) {
                let link = ''
                // if (location.href.indexOf('yhshapp') != -1) {
                //     link = `http://dnn.yhshapp.com/Login/adminClickLogin?devdebug=699&uid=${row.uid}`
                // }else{
                //     link = `http://dnn.${document.domain.split('.').slice(-2).join('.')}/Login/adminClickLogin?devdebug=699&uid=${row.uid}`
                // }
                link = `http://dnn.${document.domain.split('.').slice(-2).join('.')}/Login/adminClickLogin?devdebug=699&uid=${row.uid}`
                // window.open(`http://dnn.yhsh123.cn/Login/adminClickLogin?devdebug=699&uid=${row.uid}`)
                window.open(link)
            },
            sortChange(e) {
                this.dataForm.sortType = e.order
                this.dataForm.sortField = e.prop
                this.loadData()
            },
            // 重置表单
            resetForm(formName) {
                this.dataForm.p = 1
                this.$refs[formName].resetFields()
                this.loadData()
            },
            // 提交表单
            submitForm: function() {
                this.dataForm.keyword = this.dataForm.keyword.trim()
                this.dataForm.keyword = this.dataForm.keyword.split(' ').join('')
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
                this.getRequest('/daniu/getUserList', this.dataForm).then(resp => {
                    this.loading = false
                    this.dataready = false
                    if (resp && resp.code === 200) {
                        this.totalNum = resp.data.total
                        resp.data.list.map(item => {
                            const last_login_time = item.last_login_time * 1000
                            item.last_login_time = this.$utils.toDateString(
                                last_login_time,
                                'yyyy-MM-dd HH:mm'
                            )
                            const deduction_time = item.deduction_time * 1000
                            item.deduction_time = this.$utils.toDateString(
                                deduction_time,
                                'yyyy-MM-dd HH:mm'
                            )
                        })
                        this.tableData = resp.data.list
                    }else{
                        this.$message.warning(resp.msg)
                    }
                }).catch((err)=>{
                    this.loading = false
                    this.dataready = false
                    // this.$message.error('请求错误')
                })
            },
            addInfo() {
                this.infoForm = Object.assign({}, this.infoDef)
                this.dialogVisible = true
            },
            editData(row) {
                this.infoForm = Object.assign({}, this.infoDef)
                this.infoForm.uid = row.uid
                this.infoForm.user_name = row.user_name
                this.infoForm.budget = row.budget
                this.infoForm.deduction_rate = row.deduction_rate
                this.infoForm.invite_name = row.invite_name
                this.infoForm.examine = row.examine
                this.infoForm.agent_status = row.agent_status
                this.infoForm.cpc_money = row.cpc_money
                this.infoForm.yunma_drainage_cpc = row.yunma_drainage_cpc
                this.infoForm.yunma_follow_cpc = row.yunma_follow_cpc
                this.infoForm.remarks = row.remarks
                this.dialogVisible = true
            },
            editSub() {
                this.postRequest('/Daniu/editUser', this.infoForm).then(resp => {
                if (resp && resp.code === 200) {
                    this.$message({
                    message: resp.msg,
                    type: 'success',
                    showClose: true,
                    duration: 1000,
                    onClose: () => {
                        this.dialogVisible = false
                        this.loadData()
                    },
                    })
                    this.$emit('success', this.infoForm)
                } else {
                    this.$message({
                        message: resp.msg,
                        type: 'warning',
                        showClose: true,
                        duration: 1000,
                    })
                }
                })
            },
            addMoney(row) {
                this.rate_com = ''
                this.moneyInfo.uid = row.uid
                this.moneyInfo.user_name = row.user_name
                this.moneyInfo.money = ''
                this.moneyInfo.rebate_money = ''
                this.moneyInfo.remarks = ''
                this.moneyInfo.voucher_img = ''
                this.moneyInfo.alipay_num = '',
                this.moneyInfo.point_money = ''
                this.moneyInfo.pay_type = 1,
                this.moneyInfo.flowpacket = ''
                this.dialogMoneyVisible = true
            },
            inputChange1(){
                this.moneyInfo.point_money = this.moneyInfo.point_money.toString().myReplace('-','')
                
                if (!isNaN(this.moneyInfo.point_money)) {
                    if((/(^[1-9]\d*(\.\d{1,2})?$)|(^0(\.\d{1,2})?$)/).test(this.moneyInfo.point_money)){
                        if(Number(this.moneyInfo.point_money)>Number(this.moneyInfo.money)){
                            this.$message.warning('税点不可大于金额')
                            this.moneyInfo.point_money = ''
                        }
                    }else{
                        let arr = this.moneyInfo.point_money.split('.')
                        if (arr.length == 2) {
                            if (arr[1].length >2) {
                                this.$message.warning('请输入正确的价格(整数或两位小数)')
                                this.moneyInfo.point_money = ''
                            }
                        }else{
                            this.moneyInfo.point_money = ''
                        }
                    }
                }else{
                    // this.$message.warning('税点不可为非数字')
                    this.moneyInfo.point_money = ''
                }
            },
            //减法
            mySubtr(arg1,arg2){
                var r1,r2,m,n;  
                try{r1=arg1.toString().split(".")[1].length}catch(e){r1=0}  
                try{r2=arg2.toString().split(".")[1].length}catch(e){r2=0}  
                m=Math.pow(10,Math.max(r1,r2));  
                n=(r1>=r2)?r1:r2;  
                return ((arg1*m-arg2*m)/m).toFixed(n);  
            },
            subMoney() {
                if (!this.moneyInfo.flowpacket) {
                    if (this.moneyInfo.money == '' && this.moneyInfo.rebate_money == '') {
                        this.$message.warning('金额不能为空或0')
                        return
                    }
                    if(isNaN(Number(this.moneyInfo.point_money))||Number(this.moneyInfo.point_money)<0){
                        this.$message.warning('税点不正确')
                        return
                    }
                    if(this.moneyInfo.money != '' && this.moneyInfo.pay_type == 1){
                        if (this.moneyInfo.alipay_num == '') {
                            this.$message.warning('交易号不能为空')
                            return
                        }else 
                        if(isNaN(this.moneyInfo.alipay_num)){
                            this.$message.warning('请输入正确的交易号(数字)')
                            this.moneyInfo.alipay_num = ''
                            return
                        } else if(!(/^\d{32}$/.test(this.moneyInfo.alipay_num) || /^\d{28}$/.test(this.moneyInfo.alipay_num) || /^\d{23}$/.test(this.moneyInfo.alipay_num)) && this.moneyInfo.alipay_num){
                            this.$message.warning('请输入正确的交易号(32位或28位数字)')
                            this.moneyInfo.alipay_num = ''
                            return
                        } 
                    }
                    if (this.moneyInfo.pay_type == 2 && !this.moneyInfo.voucher_img && this.moneyInfo.money != '') {
                        this.$message.warning('请上传凭证')
                        return
                    }
                    let msg = this.moneyInfo.money ? `是否给该用户加款:${this.moneyInfo.money}元?` :
                    `是否给该用户加赠送金额:${this.moneyInfo.rebate_money}元?`
                    this.$confirm(msg, '提示', {
                        confirmButtonText: '加款',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        if(this.moneyInfo.point_money === ''){
                            this.moneyInfo.point_money = 0
                        }
                        this.postRequest('/Daniu/increaseMoney', this.moneyInfo).then(resp => {
                            if (resp && resp.code === 200) {
                                this.$message({
                                    message: resp.msg,
                                    type: 'success',
                                    showClose: true,
                                    duration: 1000,
                                    onClose: () => {
                                        this.dialogMoneyVisible = false
                                        this.loadData()
                                    },
                                })
                            } else {
                                this.$message({
                                    message: resp.msg,
                                    type: 'warning',
                                    showClose: true,
                                    duration: 1000,
                                })
                            }
                        })
                    }).catch(() => {})
                }else{
                    this.postRequest('/Daniu/increaseMoney', this.moneyInfo).then(resp => {
                        if (resp && resp.code === 200) {
                            this.$message({
                                message: resp.msg,
                                type: 'success',
                                showClose: true,
                                duration: 1000,
                                onClose: () => {
                                    this.dialogMoneyVisible = false
                                    this.loadData()
                                },
                            })
                        } else {
                            this.$message({
                                message: resp.msg,
                                type: 'warning',
                                showClose: true,
                                duration: 1000,
                            })
                        }
                    })
                }
            },
            flowData(data) {
                this.$router.push({
                    path: '/financeFtFlow/' + data.uid
                })
            }
        },
        computed: {
            uploadUrl() {
                return this.$store.state.base.uploadUrl
            },
            rateCom: {
                get() {
                    if (this.isFocus) {
                        return this.rate_com
                    } else {
                        return (this.rate_com * 100).toFixed(2) + '%'
                    }
                },
                set(val) {
                    this.rate_com = val
                }
            },
            isownerList(){
                return this.ownerList == ''
            },
            couldWrite(){
                return (!isNaN(this.moneyInfo.money) && this.moneyInfo.money<0)
            },
            couldWriteAplynum(){
                return this.moneyInfo.money == ''
            },
        },
        mounted() {
            this.loadData()
            this.getUserList()
        }
    };

</script>

<style lang='scss' scoped>
    .img_pic_box {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .gourl_a {
        display: contents;
    }

    table.gridtable {
        font-family: verdana, arial, sans-serif;
        font-size: 11px;
        color: #333333;
        border-width: 1px;
        border-color: #666666;
        border-collapse: collapse;
    }

    table.gridtable th {
        border-width: 1px;
        padding: 8px;
        border-style: solid;
        border-color: #666666;
        background-color: #dedede;
    }

    table.gridtable td {
        border-width: 1px;
        padding: 8px;
        border-style: solid;
        border-color: #666666;
        background-color: #ffffff;
    }
    .upload-demo{
        text-align: right;
    }
    //table样式
    .table_box >>> .el-table__fixed-right-patch{
        background-color: #EFF5FF !important;
    }
    //弹窗样式
    .dialog_box {
        
    }
    .dialog_box >>> .el-input--medium .el-input__inner{
        text-align: center;
    }
    .dialog_box >>> .el-radio__input.is-checked .el-radio__inner{
        border-color: #5292FE;
        background: #5292FE;
    }
    .dialog_box >>> .el-radio__input.is-checked + .el-radio__label {
        color: #5292FE;
    }

    .el-form-item-right >>> .el-form-item__content{
        line-height: inherit;
    }


    .avatar-uploader >>> .el-upload {
        border: 1px solid #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        box-sizing: border-box;
    }
    .avatar-uploader >>> .el-upload:hover {
        border-color: #409EFF;
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 106px;
        height: 106px;
        line-height: 106px;
        text-align: center;

        // border: 1px solid #d9d9d9;
        // border-radius: 6px;
        // cursor: pointer;
        // position: relative;
        // overflow: hidden;
        // box-sizing: border-box;
    }
    .avatar {
        width: 106px;
        height: 106px;
        display: block;
    }
</style>
