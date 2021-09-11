<!--
 * @Descripttion: 小程序资金
 * @version: 1.0
 * @Author: Lizhi
 * @Date: 2021-01-15 16:52:43
 * @LastEditors: Lizhi
 * @LastEditTime: 2021-01-30 15:48:36
-->
<template>
    <div>
        <el-form :inline="true" v-model="dataForm" ref="dataForm" class="form-inline-box">
            <div class="el-form-item-left">
                <el-form-item style="flex:1;">
                <div >
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
                <el-form-item style="width:300px;">
                    <el-date-picker size="medium"  v-model="times"
                        value-format="timestamp" type="daterange" range-separator="至" start-placeholder="开始日期" :clearable='false'
                        end-placeholder="结束日期" style="width:100%" :default-time="['00:00:00', '23:59:59']" :picker-options="pickerOptions" />
                </el-form-item>
            </div>
        </el-form>

        <fix-table ref="table" border v-loading="loading" element-loading-spinner="el-icon-loading"
            element-loading-text="拼命加载中" :data="tableData" key="list" height="73.7vh" size="medium"
            header-row-class-name="my-table-header" class="my-table">
            <el-table-column prop="time" label="时间" align="center" />
            <el-table-column prop="miniName" label="小程序" align="center" />
            <el-table-column prop="jfb" label="集分宝" align="center" />
            <el-table-column prop="coin" label="金币" align="center" />
            <el-table-column prop="exchangeNum" label="兑换总额" align="center" />
            <el-table-column label="提现总额" align="center" >
                <template slot-scope="scope">
                    <span>{{scope.row.allBalance.allMoney}}</span> <br>
                    <span>{{scope.row.allBalance.jfbMoney}}/{{scope.row.allBalance.balance}}</span>
                </template>
            </el-table-column>
        </fix-table>

        <div class="pages">
            <el-pagination @current-change="currentChange" layout="total, prev, pager, next" :page-size="dataForm.size"
                :current-page="dataForm.p" :total="totalNum" />
        </div>
    </div>
</template>
<script>
    export default {
        name: "financeAppletMoney",
        data() {
            return {
                // 表格load状态
                loading: false,
                // form数据
                totalNum: 0,//总数
                dataForm: {
                    p: 1,//当前页
                    timeStart:'',//开始时间
                    endStart:'',//结束时间
                    miniType:'',//小程序
                },
                // Table数据
                tableData: [],
                showDialog: false,
                jfb:0,
                integral:0,
                exchange:0,
                Withdrawal:0,
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
                this.loading = true;
                this.dataForm.timeStart = this.times[0]/1000;
                this.dataForm.endStart = this.times[1]/1000;  
                this.postRequest("/AppletsUser/getListCapital ", this.dataForm).then(resp => {
                    this.loading = false;
                    if (resp && resp.code === 200) {
                        this.totalNum = resp.data.total;
                        resp.data.list.forEach(item => {
                            item.allBalance.balance = String(item.allBalance.balance).substring(0,String(item.allBalance.balance).indexOf(".")+3)
                            item.allBalance.allMoney = String(item.allBalance.allMoney).substring(0,String(item.allBalance.allMoney).indexOf(".")+3)
                            item.allBalance.jfbMoney = String(item.allBalance.jfbMoney).substring(0,String(item.allBalance.jfbMoney).indexOf(".")+3)
                        });
                        this.tableData = resp.data.list;
                        this.jfb=resp.data.summary.jfb
                        this.integral=resp.data.summary.coin
                        this.exchange=resp.data.summary.exchangeNum
                        this.Withdrawal=String(resp.data.summary.money)
                        this.Withdrawal=this.Withdrawal.substring(0,this.Withdrawal.indexOf(".")+3)
                    }
                });
            },
            // 换页响应
            currentChange(val) {
                this.tableData = [];
                this.dataForm.p = val;
                this.loadData();
            },
            changeXcx(){
                this.dataForm.p = 1
                this.loadData()
            },
        },
        watch:{
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
            xcxList() {
                return this.$store.state.base.xcxList
            },
        },
        mounted() {
            this.loadData();
        },
        
    };

</script>

<style lang='scss' scoped>

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
