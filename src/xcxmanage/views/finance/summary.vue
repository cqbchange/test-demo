<!--
 * @Descripttion: 销售实销(财务汇总)
 * @version: 1.0
 * @Author: Dulei
 * @Date: 2021-01-15 16:52:43
 * @LastEditors: WangChuan
 * @LastEditTime: 2021-01-30 16:04:02
-->
<template>
    <div class="detail_content">
        <el-form :inline="true" class="demo-form-inline">
            <el-form-item style="flex:1;">
                <div>
                    <span>消耗：{{expenditure}}</span>
                    <el-divider direction="vertical"></el-divider>
                    <span>加款：{{recharge}}</span>
                    <el-divider direction="vertical"></el-divider>
                    <span>核销：{{writeOff}}</span>
                </div>
            </el-form-item>
            <el-form-item>
                <el-select size="medium"  filterable
                    v-if="!isShowOwner"
                    v-model="owner"
                    style="width:150px;margin-right:20px;"
                    placeholder="请选择归属人"
                    clearable
                    :disabled="choosemechan"
                >
                    <el-option label="全部归属人" value=""/>
                    <el-option v-for="(val,key,i) in ownerList" :label="val" :value="key" :key="i"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-select size="medium" 
                    v-model="mechanism"
                    style="width:150px;margin-right:20px;"
                    placeholder="请选择机构"
                    clearable
                    :disabled="choosemechan"
                    @change="changemechanism()"
                    filterable
                >
                    <el-option label="全部机构" value=""/>
                    <el-option v-for="(val,key,i) in mechanismList" :label="val" :value="key" :key="i"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-select size="medium" 
                    v-model="status"
                    style="width:150px;margin-right:20px;"
                    placeholder="请选择状态"
                    clearable
                    :disabled="statusDisable"
                    @change="changeStatus()"
                    filterable
                >
                    <el-option label="全部状态" value="-1"/>
                    <el-option label="未核销" value="0"/>
                    <el-option label="已核销" value="1"/>
                </el-select>
            </el-form-item>
            <el-form-item>
                <div class="select_time">
                    <el-date-picker size="medium"
                        style="width:300px;"
                        v-model="datequantum"
                        type="daterange"
                        format="yyyy-MM-dd"
                        value-format="timestamp"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        :default-time="['00:00:00', '23:59:59']"
                        :picker-options="pickerOptions2">>
                    </el-date-picker>
                    <!-- value-format="yyyy-MM-dd HH:mm:ss" -->
                </div>
            </el-form-item>
        </el-form>
        <fix-table border v-loading="tableloading" element-loading-spinner="el-icon-loading"
            element-loading-text="拼命加载中" key="list" height="73.7vh" size="small"
            header-row-class-name="my-table-header" class="my-table"
            :data="tableData">
            <el-table-column fixed prop="times" label="添加时间"  align="center"/>
            <el-table-column prop="admin_name" label="归属人"  align="center"/>
            <el-table-column prop="company_name" label="机构"  align="center"/>
            <el-table-column prop="moneys" label="打款金额(元)"  align="center">
                <template slot-scope="scope">
                    {{myAccAdd(Number(scope.row.moneys),Number(scope.row.point_money))}}
                </template>
            </el-table-column>
            <el-table-column prop="moneys" label="广告费"  align="center"/>
            <el-table-column prop="point_money" label="税点"  align="center"/>
            <el-table-column prop="typeName" label="类型"  align="center"/>
            <el-table-column prop="pay_time" width="170"  label="打款时间"  align="center"/>
            <el-table-column prop="pay_type" width="120"  label="收款方式"  align="center">
                <template slot-scope="scope">
                    <span>{{scope.row.pay_type == 999 ? '--' : scope.row.pay_type == 1 ? '支付宝' : '对公银行'}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="alipay_num" width="230"  label="交易号"  align="center" >
                <template slot-scope="scope">
                    <span>{{scope.row.alipay_num == 0 ? '--' : scope.row.alipay_num}}</span>
                </template>
            </el-table-column>

            <el-table-column prop="images" label="凭证"  align="center">
                <template slot-scope="scope">
                    <el-image v-if="scope.row.images&&scope.row.images !== '0'" style="width: 55px; height: 55px" :src="scope.row.images" :preview-src-list="[scope.row.images]"/>
                    <span v-else></span>
                </template>
            </el-table-column>
            <el-table-column prop="status" label="状态"  align="center">
                <template slot-scope="scope">
                    <span v-if="scope.row.status === '1'" style="color:#666666;">已核销</span>
                    <span v-else-if="scope.row.status === '0'" style="color:#694BFF;">未核销</span>
                    <span v-else>——</span>
                </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="120" align="center" v-if="couldUseBtn">
                <template slot-scope="scope">
                    <span v-if="scope.row.status !== '0'"></span>
                    <el-button v-else @click="writeOffsec(scope.row)" type="text" size="small">核销</el-button>
                </template>
            </el-table-column>
        </fix-table>
        <div class="pages">
            <el-pagination
                @current-change="handleCurrentChange"
                layout="total, prev, pager, next"
                :page-size="size"
                :current-page="currentPage1"
                :total="total"
            />
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            tableData:[],
            loading:false,
            tableloading:true,//表格loading
            ownerList:{},//归属人列表
            selectownerList:[],//select归属人列表
            owner:'',//归属人
            mechanismList:{},//机构列表
            mechanism:'',//机构
            status: '-1',
            couldchoose:true,
            datequantum:[
                // `${this.dateFormat('YYYY-mm-dd',new Date(new Date().getTime() - 86400000))} 00:00:00`,`${this.dateFormat('YYYY-mm-dd',new Date(new Date().getTime() - 86400000))} 23:59:59`
                new Date(`${this.dateFormat('YYYY-mm-dd',new Date())} 00:00:00`).getTime() - 86400000,new Date(`${this.dateFormat('YYYY-mm-dd',new Date())} 23:59:59`).getTime() - 86400000
            ],//时间段
            startime:'',//开始时间
            endtime:'',//结束时间
            pickerOptions2: {
                shortcuts: [{
                    text: '最近一周',
                    onClick (picker) {
                    const end = new Date()
                    const start = new Date()
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
                    picker.$emit('pick', [start, end])
                    }
                }, {
                    text: '最近一个月',
                    onClick (picker) {
                    const end = new Date()
                    const start = new Date()
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
                    picker.$emit('pick', [start, end])
                    }
                }, {
                    text: '最近三个月',
                    onClick (picker) {
                    const end = new Date()
                    const start = new Date()
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
                    picker.$emit('pick', [start, end])
                    }
                }],
                disabledDate:(time)=>{
                    return time.getTime() > new Date(`${this.dateFormat('YYYY-mm-dd',new Date())} 23:59:59`).getTime()-86400000;
                },
            },//时间段快捷选项
            total:0,//数据总数
            allpages:0,//总页数
            currentPage1:1,//页码
            size:15,//每页条数
            gotopage:1,//跳转页码
            isShowOwner:true,//是否是主账号(否)
            isfinancail:false,//是否是财务(否)
            isMain:false,//是否是后台(否)
            chooseMe:false,//清空参数时机
            ownerMe:true,//
            selcowList:true,//用于判断机构选择后回显归属人的数据是否已取得
            expenditure:0,
            recharge:0,
            writeOff:0,
            statusDisable: false
        }
    },
    created() {
        this.getownerList()
        this.getmechanismList()
        this.getowner()
    },
    watch:{
        owner:{
            handler:function (val) {
                this.couldchoose = true;
                this.tableloading = true;
                
                if (val != '') {
                    if (!this.chooseMe) {
                        this.mechanism != '' ? this.mechanism = '' : '';
                        this.chooseMe = false;
                        this.ownerMe = false;
                        this.getmechanismList()
                        this.currentPage1 = 1;
                        this.getabledata();
                        return;
                    }else{
                        this.chooseMe = false;
                        this.ownerMe = false;
                    }
                }else{
                    this.ownerMe = true;
                    this.chooseMe = false;
                    this.mechanism != '' ? this.mechanism = '' : '';
                }
                
                this.getmechanismList()
                this.currentPage1 = 1;
                this.getabledata();
            },
        },
        datequantum:{
            handler:function (val) {
                this.startime = val[0];
                this.endtime = val[1];
                this.currentPage1 = 1;
                this.tableloading = true;
                this.getabledata();
            },
            immediate: true,
        },
    },
    computed:{
        choosemechan(){
            return !(!this.couldchoose && !this.selcowList)
        },
        couldUseBtn(){
            return this.isfinancail || this.isMain;
        }
    },
    methods: {
        //输入正确的点击核算后自动算出实际支出
        moneyinput(val,row){
            if (!isNaN(val)) {
                if (!/^[0-9]\d*$/.test(val)) {
                    row.money = row.old_money
                }else if(val<=0){
                    row.money = row.old_money
                }else{
                    row.money = this.keepTwoDecimalFull(Number(val)*Number(row.cpc_money));
                }
            }else{
                row.money = row.old_money
            }
        },
        //选择机构后获取归属人
        getowner(){
            this.getRequest('/XcxTask/getCompanyListNews',{
                
            }).then((res)=>{
                if (res.code == 200) {
                    res.data.forEach(ele=>{
                        ele.company.forEach(element=>{
                            element.par = ele;
                        })
                    })
                    this.selectownerList = res.data
                    this.selcowList = false;
                }else{
                    this.open3(res.msg)
                }
            })
        },
        //选择机构
        changemechanism(val){
            this.selectownerList.forEach(ele => {
                ele.company.forEach(element=>{
                    if (element.id == this.mechanism) {
                        this.owner = ele.uid
                        this.ownerMe == true ?  this.chooseMe = true : '' ;
                    }
                })
            });
            this.tableloading = true;
            this.currentPage1 = 1;
            this.getabledata()
        },
        changeStatus(){
            this.tableloading = true;
            this.currentPage1 = 1;
            this.getabledata()
        },
        //更新、修改
        editData(row){
            row.ischange = JSON.parse(JSON.stringify(true));
        },
        //确定修改、更新
        confirm(row){
            // if (row.cpc_money != '') {
            //     if(!/(^[1-9]\d*(\.\d{1,2})?$)|(^0(\.\d{1,2})?$)/.test(row.cpc_money)){
            //         this.open3('请输入正确的单价(整数或两位小数)')
            //         return
            //     }else{
                    
            //     }
            // }else{
            //     this.open3('单价不能为空')
            //     return
            // }
            if (row.money != '') {
                if(!/(^[1-9]\d*(\.\d{1,2})?$)|(^0(\.\d{1,2})?$)/.test(row.money)){
                    this.open3('请输入正确的实际支出(整数或两位小数)')
                    return
                }else{
                    
                }
            }else{
                this.open3('实际支出不能为空')
                return
            }
            if (row.check_click != '') {
                if(!/^[0-9]\d*$/.test(row.check_click)){
                    this.open3('请输入正确的点击核算(整数)')
                    return
                }
            }else{
                this.open3('点击核算不能为空')
                return
            }
            this.postRequest('/Company/updateSalesman',{
                task_id:row.data,
                check_click:row.check_click,
                money:row.money,
                cpc_money:row.cpc_money,
                time:new Date(`${row.bucket} 00:00:00`).getTime()/1000,
                company_id:row.company_id,
                anchor_id:row.anchor_id,
                owner:row.owner,
            }).then((res)=>{
                if (res.code == 200) {
                    this.open2(res.msg)
                    this.tableloading = true
                    this.getabledata()
                }else{
                    this.open3(res.msg)
                }
            })
        },
        //取消
        cancel(row){
            row.ischange = false;
            row.cpc_money = row.old_cpc;
            row.check_click = row.old_check_click;
            row.money = row.old_money;
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
                        this.isShowOwner = res.data.auth
                        this.isfinancail = res.data.authNews
                    }
                }else{
                    this.open4(res.msg)
                    // this.loading = false
                }
            })
        },
        getmechanismList(){
            let name = '';
            this.selectownerList.forEach(element => {
                if (element.uid == this.owner) {
                    name = element.user_name;
                }
            });

            this.getRequest('/XcxTask/getCompanyList',{
                name:name,
            }).then((res)=>{
                if (res.code == 200) {
                    if (res.data) {
                        this.mechanismList = res.data
                        this.couldchoose = false;
                    }
                }else{
                    this.open4(res.msg)
                }
            })
        },
        //获取列表数据
        getabledata(){
            this.statusDisable = true
            this.getRequest('/Company/getLog',{
                seller_id:this.owner,
                status:this.status,
                id:this.mechanism,
                p:this.currentPage1,
                size:this.size,
                start:this.startime/1000,
                end:this.endtime/1000,
            }).then((res)=>{
                this.statusDisable = false
                if (res.code == 200) {
                    this.tableData = res.data.list.list;
                    this.tableData.forEach(element => {
                        element.pay_time = this.$utils.toDateString(element.pay_time*1000)
                    });
                    this.total = res.data.list.total
                    this.allpages = Math.ceil(res.data.list.total / this.size)
                    this.recharge = res.data.list.Recharge
                    this.expenditure = res.data.list.expenditure
                    this.writeOff = res.data.list.writeOff
                    this.isMain = res.data.auth != 0 ? true : false ;
                    this.gotopage = this.currentPage1;
                    this.tableloading = false;
                }else{
                    this.tableloading = false;
                    this.open4(res.msg)
                }
            })
        },
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
        handleCurrentChange(val){
            this.tableloading = true
            this.currentPage1 = val
            this.getabledata()
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
         //核销
        writeOffsec(data){
            this.$confirm('是否核销？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                customClass: 'summary_custom_class',
                type: 'warning'
            }).then(() => {
                this.postRequest('/Company/writeOff', {id: data.id}).then(res => {
                    if (res && res.code === 200) {
                        this.$message({
                            message: res.msg,
                            type: 'success',
                            showClose: true,
                            duration: 1000,
                        })
                        this.tableloading = true;
                        this.getabledata()
                    } else {
                        this.$message({
                            message: res.msg,
                            type: 'warning',
                            showClose: true,
                            duration: 1000,
                        })
                    }
                })
            }).catch(() => {

            })
        },
        //加法
        myAccAdd(arg1,arg2){   
            var r1,r2,m;   
            try{r1=arg1.toString().split(".")[1].length}catch(e){r1=0}   
            try{r2=arg2.toString().split(".")[1].length}catch(e){r2=0}   
            m=Math.pow(10,Math.max(r1,r2))   
            return (arg1*m+arg2*m)/m   
        },
    },
}
</script>
<style scoped lang="scss">

.demo-form-inline{
display: flex;
}
.demo-form-inline .el-form-item:last-child{
margin-right: 0;
}
.detail_content{
    // padding: 20px;
    box-sizing: border-box;
    background: #fff;
    border-radius: 4px;
    // box-shadow: 1px 1px 10px 2px rgba(0, 183, 255, 0.1);
}
</style>
<style>

  .summary_custom_class{
    border-radius: 10px;
  }
  .summary_custom_class .el-message-box__header{
    border-radius: 10px 10px 0 0;
    background: #EFF5FF;
    color: #111111;
  }
  .summary_custom_class .el-message-box__title{
    line-height: inherit;
    font-size: 16px;
  }
  .summary_custom_class .el-message-box__status+.el-message-box__message{
      padding-left: 22px;
  }
  .el-message-box__status.el-icon-warning{
      color: #409EFF;
      font-size: 18px!important;
  }
  .summary_custom_class .el-message-box__btns{
      text-align: center;
      width: 180px;
      margin: 0 auto;
  }
  .summary_custom_class .el-message-box__btns .el-button{
      padding: 12px 26px;
      float: right;
  }
  .summary_custom_class .el-message-box__btns .el-button.el-button--primary{
      background: linear-gradient(90deg, #73A7FF, #448AFF);
      float: left;
  }
  .summary_custom_class .el-message-box__input{
      padding-top: 0;
  }
  .summary_custom_class .el-message-box__content{
      padding: 20px 30px;
  }
</style>