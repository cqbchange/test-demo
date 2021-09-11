<!--
 * @Descripttion: 小程序用户
 * @version: 1.0
 * @Author: Lizhi
 * @Date: 2021-01-15 16:52:43
 * @LastEditors: WangChuan
 * @LastEditTime: 2021-05-10 14:28:06
-->
<template>
    <div>
        
        <el-form :inline="true" v-model="dataForm" ref="dataForm" class="form-inline-box">
            <div class="el-form-item-left">
                <el-form-item style="flex:1;">
                    <!-- v-if="Object.keys(tableData).length == 1" -->
                <div v-if="showDetail" >
                    <span>集分宝：{{jfb}}</span>
                    <el-divider direction="vertical"></el-divider>
                    <span>金币：{{integral}}</span>
                    <el-divider direction="vertical"></el-divider>
                    <span>兑换：{{exchange}}</span>
                    <el-divider direction="vertical"></el-divider>
                    <span>提现：{{Withdrawal}}</span>
                </div>
            </el-form-item>
            </div>
            <div class="el-form-item-right">
                <el-form-item style="width:180px;">
                    <el-select v-model="dataForm.miniType" filterable placeholder="小程序" @change="changeXcx" size="medium">
                        <el-option value="" label="全部小程序"/>
                        <el-option v-for="(item,index) in xcxList" :value="index" :label="item" :key="index" />
                    </el-select>
                </el-form-item>
                <el-form-item style="width:180px;">
                   <el-select v-model="dataForm.logType" filterable placeholder="类型" size="medium">
                        <el-option value="" label="全部类型"/>
                        <el-option v-for="(item,index) in typeList" :value="item.id" :label="item.typeName" :key="index" />
                    </el-select>
                </el-form-item>
                <el-form-item style="width:300px;">
                        <el-date-picker size="medium"  v-model="times"
                            value-format="timestamp" type="daterange" range-separator="至" start-placeholder="开始日期" :clearable='false'
                            end-placeholder="结束日期" style="width:100%" :default-time="['00:00:00', '23:59:59']" :picker-options="pickerOptions" 
                            />
                    </el-form-item>
                <el-form-item style="width:180px;">
                    <el-input placeholder="搜索" v-model="dataForm.keyword" @clear="search()" class="input-search-btn" clearable size="medium" @keyup.enter.native='search()'>
                        <el-button  slot="append"  icon="el-icon-search" @click="search()" ></el-button>
                    </el-input>
                </el-form-item>
            </div>
        </el-form>

        <fix-table ref="table" border v-loading="loading" element-loading-spinner="el-icon-loading"
            element-loading-text="拼命加载中" :data="tableData" key="list" height="73.7vh" size="medium"
            header-row-class-name="my-table-header" class="my-table">
            <el-table-column prop="id" label="编号" align="center" />
            <el-table-column prop="user_id" label="UID" align="center" />
            <el-table-column prop="addtime" label="时间" align="center" />
            <el-table-column prop="miniName" label="小程序" align="center" />
            <el-table-column prop="numName" label="金额" align="center" />
            <el-table-column prop="typeName" label="类型" align="center" />
            <el-table-column prop="alipay_num" label="支付宝交易号" align="center" />
        </fix-table>

        <div class="pages">
            <el-pagination @current-change="currentChange" layout="total, prev, pager, next" :page-size="dataForm.size"
                :current-page="dataForm.p" :total="totalNum" />
        </div>
        <el-dialog :title="dilogTitle" :visible.sync="showDialog" custom-class="my-dialog" width="35%"
            :append-to-body="true" :close-on-press-escape="false">
            <el-form size="medium" v-loading="loading" element-loading-spinner="el-icon-loading">
                <el-row :gutter="20" type="flex">
                    <el-col :span="22">
                        <el-form-item label-width="100px" label="用户ID:" class="formItem">
                            <el-input autocomplete="off" v-model="user_id" clearable></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" class="my-blue-btn" @click="subBtn" size="medium">确 定</el-button>
                <el-button @click="showDialog = false" size="medium">取 消</el-button>
            </div>
        </el-dialog>

    </div>
</template>
<script>
    export default {
        name: "userAppletUser",
        data() {
            return {
                // 表格load状态
                loading: false,
                // form数据
                totalNum: 0,//总数
                dataForm: {
                    p: 1,//当前页
                    keyword: '',//搜索
                    timeStart:'',//开始时间
                    endStart:'',//结束时间
                    miniType:'',//小程序
                    logType:'',//类型
                    size:15,
                },
                // Table数据
                tableData: [],
                typeList:[],//类型列表
                showDialog: false,
                user_id:'',//添加白名单ID
                jfb:0,
                integral:0,
                exchange:0,
                Withdrawal:0,
                showDetail:false,
                times:[
                    new Date(`${this.dateFormat('YYYY-mm-dd',new Date())} 00:00:00`).getTime() - 86400000*31,new Date(`${this.dateFormat('YYYY-mm-dd',new Date())} 23:59:59`).getTime()
                ],
                //时间默认在一月以内
                pickerOptions: {
                    onPick: ({maxDate, minDate}) => {
                        this.selectDate= minDate.getTime();
                        if (maxDate) {
                        this.selectDate= ''
                        }
                    }, disabledDate: (time) => {
                        if (this.selectDate!== '') {
                        const one = 30 * 24 * 3600 * 1000;
                        const minTime = this.selectDate- one;
                        const maxTime = this.selectDate+ one;
                        return time.getTime() < minTime || time.getTime() > maxTime
                        }
                    }
                }
            };
        },
        methods: {
             //时间处理important
            dateFormat (fmt, date) {
                let ret
                const opt = {
                'Y+': date.getFullYear().toString(),        // 年
                'm+': (date.getMonth() + 1).toString(),     // 月
                'd+': date.getDate().toString(),            // 日
                'H+': date.getHours().toString(),           // 时
                'M+': date.getMinutes().toString(),         // 分
                'S+': date.getSeconds().toString()          // 秒
                // 有其他格式化字符需求可以继续添加，必须转化成字符串
                }
                for (let k in opt) {
                ret = new RegExp('(' + k + ')').exec(fmt)
                if (ret) {
                    fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, '0')))
                }
                }

                return fmt
            },
            // 获取Table数据
            loadData() {
                this.showDetail=false
                this.loading = true;
                this.dataForm.timeStart = this.times[0]/1000;
                this.dataForm.endStart = this.times[1]/1000;  
                this.postRequest("AppletsUser/getList", this.dataForm).then(resp => {
                    this.loading = false;
                    if (resp && resp.code === 200) {
                        this.totalNum = resp.data.total;
                        resp.data.list.map(item => {
                            const addtime = item.addtime * 1000
                            item.addtime = this.$utils.toDateString(
                                addtime,
                                'yyyy-MM-dd HH:mm:ss'
                            )
                            var reg = new RegExp("[\\u4E00-\\u9FFF]+","g");
                            if(!reg.test(item.numName)){
                                item.numName=item.numName.substring(0,item.numName.indexOf(".")+3)
                            }
                        })
                        this.tableData = resp.data.list;
                        if(this.dataForm.keyword){
                            this.showDetail=true
                            if(resp.data.jfbNum===null){
                                this.jfb=0
                            }else{
                                this.jfb = resp.data.jfbNum
                            }                            
                            this.integral = resp.data.icon
                            this.exchange = resp.data.dh
                            this.Withdrawal = resp.data.withdrawal
                        }  
                       
                    }
                });
            },
            //获取类型下拉列表数据
            loadtTypelist(){
                this.getRequest("AppletsUser/typeName").then(resp=>{
                    if (resp && resp.code === 200) {
                        this.typeList = resp.data
                    }
                })
            },
            search() {
                this.dataForm.keyword = this.dataForm.keyword.trim()
                this.dataForm.keyword = this.dataForm.keyword.split(' ').join('')
                this.dataForm.p = 1
                this.loadData()
            },
            // 换页响应
            currentChange(val) {
                this.tableData = [];
                this.dataForm.p = val;
                this.loadData();
            },
            // 添加
            edit() {
                this.user_id=''
                this.showDialog = true;
            },
            // 添加确认事件
            subBtn() {
                let url = 'XcxTask/advertisers'
                if (!this.user_id) {
                    this.$message.warning('请输入用户ID')
                    return
                }
                this.postRequest(url, this.user_id).then(resp => {
                    if (resp && resp.code === 200) {
                        this.$message({
                            message: resp.msg,
                            type: 'success',
                            showClose: true,
                            duration: 1000
                        })
                        this.showDialog = false
                        this.loadData()
                    } else {
                        this.$message({
                            message: resp.msg,
                            type: 'error',
                            showClose: true,
                            duration: 1000
                        })
                    }
                })
            },
            changeXcx(){
                this.dataForm.p = 1
                this.loadData()
            },
        },
        watch:{
            "dataForm.logType": {
                handler(val, old) {
                    this.tableData = []
                    this.dataForm.p = 1
                    this.loadData();
                }
            },
            times:{
                handler(val){
                    if(val){
                        this.tableData = []
                        this.dataForm.p = 1
                        this.loadData()
                    }else{
                        this.dataForm.p = 1
                        this.loadData()
                    }
                }
            }
        },
        computed: {
            // 上传地址
            uploadUrl() {
                return this.$store.state.base.uploadUrl
            },
            dilogTitle() {
                return '添加白名单'
            },
            xcxList() {
                return this.$store.state.base.xcxList
            },
        },
        created() {
            this.loadData();
            this.loadtTypelist()
        },
        
    }

</script>

<style lang='scss' scoped>
div >>> .el-form-item:last-child{
    transform: translateY(2px);
}
div >>> .el-dialog__body{
    padding: 40px 17px 10px;
}
    .avatar-uploader {

        width: 96px;
        position: relative;

        .avatar-uploader-icon {
            font-size: 28px;
            color: #8c939d;
            width: 96px;
            height: 96px;
            line-height: 96px;
            text-align: center;
            border: 1px dashed #d9d9d9;
            border-radius: 6px;
        }

        .avatar-uploader-icon:hover {
            border-color: #409EFF;
        }

        .avatar {
            width: 96px;
            height: 96px;
            display: block;
        }
    }

    .el-icon-error {
        position: absolute;
        top: -4px;
        right: -5px;
    }

</style>
