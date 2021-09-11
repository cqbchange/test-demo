<!--
 * @Descripttion: 财务汇总
 * @version: 1.0
 * @Author: WangChuan
 * @Date: 2021-01-15 16:52:43
 * @LastEditors: WangChuan
 * @LastEditTime: 2021-02-02 18:15:44
-->
<template> 
    <div class="detail_content">
        <!-- <div class="show_wait_update">
            <div class="uploadData" @click="uploadData">
                下载报表
            </div>
        </div> -->
        <div class="table_top_select_input">
            <span>待更新(条)：{{topWaitUpdate}}</span>
            <div class="search_input">
                <div class="table_select">
                    <el-select
                        size="medium"
                        v-model="type"
                        style="width:150px;"
                        placeholder="请选择任务源"
                    >
                        <el-option label="后台任务" value="1"></el-option>
                        <el-option label="粉推投放" value="2"></el-option>
                    </el-select>
                    <el-select
                        size="medium"
                        v-model="status"
                        style="width:150px;margin-left:20px;"
                        placeholder="请选择状态"
                        clearable
                        :disabled='chooseUser'
                        v-if="!showChooseUser"
                    >
                        <el-option label="全部状态" value=""></el-option>
                        <el-option v-for="(item,index) in statusList" :label="item.val" :value="item.status" :key="index"></el-option>
                    </el-select>
                    
                    <el-select
                        size="medium"
                        v-if="!isShowOwner"
                        v-model="owner"
                        style="width:150px;margin-left:20px;"
                        placeholder="请选择归属人"
                        clearable
                        filterable
                    >
                        <el-option label="全部归属人" value=""/>
                        <el-option v-for="(val,key,i) in ownerList" :label="val" :value="val" :key="i"></el-option>
                    </el-select>
                    <el-select
                        size="medium"
                        v-model="mechanism"
                        style="width:150px;margin-left:20px;"
                        placeholder="请选择机构"
                        clearable
                        :disabled="choosemechan"
                        @change="changemechanism()"
                        filterable
                        v-if="!showChooseUser"
                    >
                        <el-option label="全部机构" value=""/>
                        <el-option v-for="(val,key,i) in mechanismList" :label="val" :value="key" :key="i"></el-option>
                    </el-select>
                    <el-select
                        size="medium"
                        v-model="user"
                        style="width:150px;margin-left:20px;"
                        placeholder="请选择用户"
                        clearable
                        filterable
                        @change="changeuser()"
                        v-if="showChooseUser"
                        :disabled="couldUser"
                    >
                        <el-option label="全部用户" value=""/>
                        <el-option v-for="(val,key,i) in userList" :label="val" :value="key" :key="i"></el-option>
                    </el-select>
                    <div class="select_time">
                        <el-date-picker
                            size="medium"
                            style="width:300px;margin-left:20px;"
                            v-model="datequantum"
                            type="daterange"
                            :editable="false"
                            :clearable="false"
                            unlink-panels
                            format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            :default-time="['00:00:00', '23:59:59']"
                            :picker-options="pickerOptions2">
                        </el-date-picker>
                    </div>
                </div>
              <el-input size="medium" :clearable="true" class="input-search-btn" placeholder="输入内容搜索" style="width:250px;" v-model="search_input">
                <el-button 
                    @click="searchBtn" 
                    slot="append"
                    icon="el-icon-search">
                </el-button>
                <!-- style="background: #ECECEC;border-radius: 0px 4px 4px 0px;position:relative;top:-1px;" -->
              </el-input>
            </div>
        </div>
        <fix-table
            v-loading="tableloading"
            element-loading-text="拼命加载中"
            :data="tableData"
            border
            style="width: 100%"
            header-row-class-name="my-table-header"
            class="my-table"
        >
        <!-- size="small" -->
        <!-- element-loading-spinner="el-icon-loading" -->
        <!-- height="84vh" -->
        <!-- @sort-change="sortChange" -->
        <!-- :default-sort="{prop: 'create_time', order: 'descending'}" -->
            <el-table-column prop="bucket" label="日期" align="center"/>
            <el-table-column prop="name" label="机构" align="center"/>
            <el-table-column prop="user_name" label="用户" align="center"/>
            <el-table-column prop="anchor_name" label="主播/任务备注" align="center">
                <template slot-scope="scope">
                    <span>{{scope.row.anchor_name != '' ? scope.row.anchor_name : scope.row.task_remark != '' ? scope.row.task_remark : ''}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="data" label="任务ID" align="center"/>
            <el-table-column prop="anchor_id" label="主播ID" align="center"/>
            <el-table-column prop="click" label="有效点击" align="center"/>
            <el-table-column prop="gift_click" label="赠送点击" align="center"/>
            <el-table-column prop="cpc_money" label="单价" align="center">
                <template slot-scope="scope">
                    <!-- <span v-if="scope.row.ischange == false">{{scope.row.cpc_money}}</span> -->
                    <span>{{scope.row.cpc_money}}</span>
                    <!-- <el-input v-if="scope.row.ischange == true" :clearable="true" placeholder="请输入单价" size="mini" v-model="scope.row.cpc_money"/> -->
                </template>
            </el-table-column>
            <el-table-column prop="check_click" label="点击核算" align="center">
                <template slot-scope="scope">
                    <span v-if="scope.row.ischange == false">{{scope.row.check_click}}</span>
                    <el-input @input="moneyinput(scope.row.check_click,scope.row)" v-if="scope.row.ischange == true" :clearable="true" placeholder="请输入点击核算" size="mini" v-model="scope.row.check_click"/>
                </template>
            </el-table-column>
            <el-table-column prop="money" label="实际支出" align="center">
                <template slot-scope="scope">
                    <span v-if="scope.row.ischange == false">{{scope.row.money}}</span>
                    <el-input v-if="scope.row.ischange == true" :clearable="true" placeholder="请输入实际支出" size="mini" v-model="scope.row.money"/>
                </template>
            </el-table-column>
            <el-table-column prop="remark" label="备注" align="center" min-width="90px">
                <template slot-scope="scope">
                    <span v-if="scope.row.ischange == false">{{scope.row.remark}}</span>
                    <el-input v-if="scope.row.ischange == true" :clearable="true" placeholder="请输入备注" size="mini" v-model="scope.row.remark"/>
                </template>
            </el-table-column>
            <el-table-column prop="status" label="状态" align="center">
                <template slot-scope="scope">
                    <span v-if="scope.row.status == 0 && scope.row.user_name == ''" style="color:#f00">待更新</span>
                    <span v-if="scope.row.status == 1 && scope.row.user_name == ''" style="color:#409EFF">已更新</span>
                    <span v-if="scope.row.user_name != ''" style="color:#409EFF">/</span>
                </template>
            </el-table-column>
            <el-table-column v-if="!isfinancail" fixed="right" label="操作" align="center">
                <template slot-scope="scope">
                    <el-button v-if="scope.row.status == 0 && scope.row.ischange == false && scope.row.user_name == ''" @click="editData(scope.row)" type="text" size="small">更新</el-button>
                    <el-button v-if="scope.row.status == 1 && scope.row.ischange == false && scope.row.user_name == ''" @click="editData(scope.row)" type="text" size="small">修改</el-button>
                    <el-button v-if="scope.row.ischange == true" @click="confirm(scope.row)" type="text" size="small">确定</el-button>
                    <el-button v-if="scope.row.ischange == true" @click="cancel(scope.row)" type="text" size="small">取消</el-button>
                </template>
            </el-table-column>
        </fix-table>
        <div class="show_this_page_num">
            <!-- 本页共{{thispagenum}}条数据， -->
            纷推支出：{{isShowGiveDaniuExpend ? `${ftall}（赠送：${giveDaniuExpend}）`:`${ftall}`}}，后台支出：{{adminpay}}，支出总额：{{thispageall}}
            <!-- {{isShowGiveDaniuExpend ? (`纷推赠送金额支出：${giveDaniuExpend}，`):''}} -->
        </div>
        <div class="pagination">
            <div class="show_datanum_allpage">
              <span>共{{total}}条数据，共{{allpages}}页</span>
            </div>
            <!-- <div class="pagination_box">
                @size-change="handleSizeChange"
              <el-pagination
                @current-change="handleCurrentChange"
                :current-page="currentPage1"
                :page-sizes="[5, 10, 15, 20]"
                :page-size="size"
                layout="prev,pager,next"
                :total="total"
                
                :background="true"
              />
              class="pagination_content" prev-text="上一页"
                next-text="下一页"
            </div> -->
            <div class="pages">
                <el-pagination @current-change="handleCurrentChange" layout="prev, pager, next" :page-size="size"
                    :current-page="currentPage1" :total="total" />
            </div>
            <!-- <div class="to_that_page">
              <span class="togo_that_page">跳转</span>
              <el-input v-model="gotopage" size="mini" style="width:60px" placeholder></el-input>
              <el-button
                size="mini"
                style="background: #0046F4;
                  border-radius: 3px;
                  font-size: 12px;
                  font-family: PingFang SC;
                  font-weight: 500;
                  color: #FFFFFF;
                  margin-left:10px"
                @click="togothatpage()"
              >确定
              </el-button>
            </div> -->
        </div>
    </div>
</template>
<script>
    import axios from 'axios'
    export default {
        name: "financeSummary",
        data() {
            return {
                tableData:[],
                loading:false,
                tableloading:true,//表格loading
                topWaitUpdate:0,//待更新条数
                statusList:[
                    {
                        val:'待更新',
                        status:1,
                    },
                    {
                        val:'已更新',
                        status:2,
                    },
                ],//状态列表
                status:1,//状态
                type:'1',//任务源
                ownerList:{},//归属人列表
                selectownerList:[],//select归属人列表
                owner:'',//归属人
                mechanismList:{},//机构列表
                mechanism:'',//机构
                couldchoose:true,
                userList:[],//用户列表
                user:'',//用户
                datequantum:[
                    `${this.dateFormat('YYYY-mm-dd',new Date(new Date().getTime() - 86400000))} 00:00:00`,`${this.dateFormat('YYYY-mm-dd',new Date(new Date().getTime() - 86400000))} 23:59:59`
                ],//时间段
                startime:'',//开始时间
                endtime:'',//结束时间
                pickerOptions2: {
                    disabledDate:(time)=>{
                        return time.getTime() > new Date(`${this.dateFormat('YYYY-mm-dd',new Date(new Date().getTime()-86400000))} 23:59:59`).getTime();
                    },
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
                    }]
                },//时间段快捷选项
                search_input:'',//搜索字段
                thispagenum:5,//当前页数据条数
                thispageall:0,//当前页数据支出总额
                ftall:0,//纷推支出
                adminpay:0,//后台支出
                giveDaniuExpend:0,//纷推赠送金额支出
                total:0,//数据总数
                allpages:0,//总页数
                currentPage1:1,//页码
                size:10,//每页条数
                gotopage:1,//跳转页码
                couldUser:true,//用户select是否禁用
                isShowOwner:true,//是否是主账号(否)
                isfinancail:false,//是否是财务(否)
                chooseMe:false,//清空参数时机
                ownerMe:true,//
                selcowList:true,//用于判断机构选择后回显归属人的数据是否已取得
                source:null,//请求中断
                couldLink:true,
                showGiveDaniuExpend:true,//用于判断是否显示——————纷推赠送金额支出
            };
        },
        created() {
            this.getownerList()
            this.getUserList();
            this.getmechanismList()
            this.getowner()
        },
        watch:{
            owner:{
                handler:function (val) {
                    this.couldchoose = true;
                    this.couldUser = true;
                    this.tableloading = true;

                    this.user != '' ? this.user = '' : '';
                    
                    if (val != '') {
                        if (!this.chooseMe) {
                            this.mechanism != '' ? this.mechanism = '' : '';
                            this.chooseMe = false;
                            this.ownerMe = false;
                            this.getUserList();
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
                    
                    
                    this.getUserList();
                    this.getmechanismList()
                    this.currentPage1 = 1;
                    this.getabledata();
                },
            },
            status:{
                handler:function (val) {
                    this.tableloading = true;
                    this.currentPage1 = 1;
                    this.getabledata()
                },
            },
            type:{
                handler:function (val) {
                    if (val == 1) {
                        this.user = '';
                    }else{
                        this.status = '';
                        this.mechanism = '';
                    }
                    this.tableloading = true;
                    this.currentPage1 = 1;
                    this.getabledata()
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
            // mechanism:{
            //     handler:function (val) {
            //         this.$nextTick(()=>{
            //             if(this.chooseMe){
            //                 this.owner == '' ? '':this.owner = '';
            //             }
            //         })
                    
            //     }, 
            // },
            // user:{
            //     handler:function (val) {
            //         this.tableloading = true;
            //         this.currentPage1 = 1;
            //         this.getabledata()
            //     },
            // },
            search_input:{
                handler:function (val) {
                    if (val == '') {
                        this.tableloading = true;
                        this.currentPage1 = 1;
                        this.showGiveDaniuExpend = true
                        this.getabledata()
                    }
                },
            },
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
                this.user == "" ? '' : this.user = '';
                // this.owner == "" ? "" : this.owner = '';
                this.selectownerList.forEach(ele => {
                    ele.company.forEach(element=>{
                        if (element.id == this.mechanism) {
                            this.owner = ele.user_name
                            this.ownerMe == true ?  this.chooseMe = true : '' ;
                        }
                    })
                });
                this.tableloading = true;
                this.currentPage1 = 1;
                this.getabledata()
            },
            //选择用户
            changeuser(val){
                this.mechanism == "" ? '' : this.mechanism = '';
                this.tableloading = true;
                this.currentPage1 = 1;
                this.getabledata()
            },
            //下载数据
            uploadData(){
                // if (this.couldLink == false) {
                //     return;
                // }
                let url = '/XcxSalesmanLog/salesStatisticsExport';

                let arr = {
                    owner:this.owner,
                    status:this.status,
                    user_id:this.user,
                    company_id:this.mechanism,
                    keyword:this.search_input,
                    start:this.startime,
                    end:this.endtime,
                };

                function filter(str) { // 特殊字符转义
                    str += ''; // 隐式转换
                    str = str.replace(/%/g, '%25');
                    str = str.replace(/\+/g, '%2B');
                    str = str.replace(/ /g, '%20');
                    str = str.replace(/\//g, '%2F');
                    str = str.replace(/\?/g, '%3F');
                    str = str.replace(/&/g, '%26');
                    str = str.replace(/\=/g, '%3D');
                    str = str.replace(/#/g, '%23');
                    return str;
                }

                function formateObjToParamStr(paramObj) {
                    const sdata = [];
                    for (let attr in paramObj) {
                    sdata.push(`${attr}=${filter(paramObj[attr])}`);
                    }
                    return sdata.join('&');
                };
                window.open(url+'?'+formateObjToParamStr(arr))
                // this.couldLink = false;
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
                this.tableloading = true
                if (row.money != '') {
                    if(!/(^[1-9]\d*(\.\d{1,2})?$)|(^0(\.\d{1,2})?$)/.test(row.money)){
                        this.open3('请输入正确的实际支出(整数或两位小数)')
                        this.tableloading = false
                        return
                    }else{}
                }else{
                    this.open3('实际支出不能为空')
                    this.tableloading = false
                    return
                }
                if (row.check_click != '') {
                    if(!/^[0-9]\d*$/.test(row.check_click)){
                        this.open3('请输入正确的点击核算(整数)')
                        this.tableloading = false
                        return
                    }
                }else{
                    this.open3('点击核算不能为空')
                    this.tableloading = false
                    return
                }
                this.postRequest('/Company/updateSalesmanNew',{
                    task_id:row.data,
                    check_click:row.check_click,
                    money:row.money,
                    cpc_money:row.cpc_money,
                    time:new Date(`${row.bucket} 00:00:00`).getTime()/1000,
                    company_id:row.company_id,
                    anchor_id:row.anchor_id,
                    owner:row.owner,
                    remark:row.remark,
                    id:row.id,
                }).then((res)=>{
                    if (res.code == 200) {
                        this.open2(res.msg)
                        
                        this.getabledata()
                    }else{
                        this.open3(res.msg)
                        this.tableloading = false
                    }
                })
            },
            //取消
            cancel(row){
                row.ischange = false;
                row.cpc_money = row.old_cpc;
                row.check_click = row.old_check_click;
                row.money = row.old_money;
                row.remark = row.old_remark;
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
                this.getRequest('/XcxTask/getCompanyList',{
                    name:this.owner,
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
            //获取用户列表
            getUserList(){
                this.getRequest('/XcxTask/getDaniuUser',{
                    owner:this.owner,
                }).then((res)=>{
                    if (res.code == 200) {
                        this.userList = res.data;
                        this.couldUser = false;
                    }else{
                        this.open4(res.msg)
                    }
                })
            },
            cancelRequest(str) {
                if (str == 'source') {
                    if (typeof this.source === 'function') {
                        this.source('请求中断1')
                    }
                }
                
            },
            //获取列表数据
            getabledata(){
                const _this = this;
                this.cancelRequest('source'); 
                // XcxSalesmanLog   XcxTask
                this.getRequest('/XcxSalesmanLog/salesStatistics',{
                    owner:this.owner,
                    status:this.status,
                    user_id:this.user,
                    company_id:this.mechanism,
                    p:this.currentPage1,
                    size:this.size,
                    keyword:this.search_input,
                    start:this.startime,
                    end:this.endtime,
                    type:this.type,
                },
                new axios.CancelToken((c) => {
                    _this.source = c
                })
                ).then((res)=>{
                    if (axios.isCancel(res)) {
                        this.open2('未加载请求已被中断')
                        this.source = null
                        this.tableloading = false;
                        return
                    }
                    if (res.code == 200) {
                        this.tableData = [];
                        this.topWaitUpdate = res.data.count;
                        res.data.data.forEach((ele,index)=>{
                            let item = {
                                anchor_name:ele.anchor_name == null ? '' : ele.anchor_name,
                                anchor_id:ele.anchor_id,
                                ischange:false,
                                bucket:isNaN(ele.bucket) ? ele.bucket.substr(0,10) : this.dateFormat("YYYY-mm-dd",new Date(ele.bucket)),
                                check_click:ele.check_click,
                                old_check_click:ele.check_click,
                                click:ele.click,
                                cpc_money:ele.cpc_money,
                                old_cpc:ele.cpc_money,
                                data:ele.data,
                                money:ele.money,
                                old_money:ele.money,
                                name:ele.name,
                                status:ele.status,
                                user_name:ele.user_name,
                                company_id:ele.company_id,
                                owner:ele.owner,
                                task_remark:ele.task_remark,
                                remark:ele.remark,
                                old_remark:ele.remark,
                                gift_click:ele.gift_click,
                                id:ele.id,
                            }
                            this.tableData.push(item);
                        })
                        // this.thispagenum = res.data.data.length
                        // this.thispageall = 0
                        // res.data.data.forEach((element,index) => {
                        //     this.thispageall += Number(element.money)
                        // });
                        // this.thispageall = this.keepTwoDecimalFull(this.thispageall)
                        this.total = res.data.total
                        this.allpages = Math.ceil(res.data.total / this.size)
                        
                        this.thispageall = res.data.totalExpend
                        this.adminpay = res.data.adminExpend
                        this.giveDaniuExpend = res.data.giveDaniuExpend
                        this.ftall = res.data.daniuExpend
                        this.tableloading = false;
                    }else{
                        this.tableloading = false;
                        this.open4(res.msg)
                    }
                }).catch((err)=>{
                    this.tableloading = false;
                    if (axios.isCancel(err)) {
                        console.log('Rquest canceled', err.message); 
                        //请求如果被取消，这里是返回取消的message
                    } else {
                        console.log(err);
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
            searchBtn(){
                this.tableloading = true
                this.currentPage1 = 1;

                this.search_input == '' ? this.showGiveDaniuExpend = true : this.showGiveDaniuExpend = false
                this.getabledata()
            },
            handleCurrentChange(val){
                this.tableloading = true
                this.currentPage1 = val
                this.getabledata()
            },
            togothatpage(){
                if (this.allpages < this.gotopage) {
                    this.gotopage = this.currentPage1
                } else if (this.allpages >= this.gotopage && this.gotopage > 0 && this.gotopage != this.currentPage1 && /^[0-9]+$/.test(this.gotopage)) {
                    this.tableloading = true;
                    this.currentPage1 = Number(this.gotopage);
                    this.getabledata();
                } else if (this.gotopage == this.currentPage1) {
                    this.open3('已是当前页');
                } else if (this.gotopage <= 0) {
                    // this.open3('请输入正确页数');
                    this.gotopage = this.currentPage1;
                } else {
                    // this.open3('请输入正确页数');
                    this.gotopage = this.currentPage1;
                }
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
            download(){
                this.uploadData();
            }
        },
        computed: {
            choosemechan(){
                return !(!this.couldchoose && !this.selcowList)
            },
            chooseUser(){
                this.user != '' ? this.status = '' : '';
                return this.user != ''
            },
            isShowGiveDaniuExpend(){
                return this.mechanism == '' && this.showGiveDaniuExpend
            },
            showChooseUser(){
                return this.type == 2
            },
        },
        mounted() {
            this.$store.commit("setBreadCrumb", [{
                name: '销售统计',
                path: '/logSale',
            }]);
        },
        destroyed() {
            this.$store.commit("setBreadCrumb", []);
        }
    };

</script>

<style lang='scss' scoped>
    .detail_content{
        // padding: 20px;
        box-sizing: border-box;
        background: #fff;
        border-radius: 4px;
        // box-shadow: 1px 1px 10px 2px rgba(0, 183, 255, 0.1);
    }
    .show_wait_update{
        margin-bottom: 20px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        
        font-size: 18px;
        font-family: PingFang SC;
        font-weight: 500;
        color: #333333;
        .uploadData{
            font-size: 12px;
            font-family: PingFang SC;
            font-weight: 500;
            color: #666666;
            border: 1px solid #ececec;
            border-radius: 4px;
            padding: 8px 15px;
            cursor: pointer;
            transition: all 0.3s;
        }
        .uploadData:hover {
            color: #0046f4;
            border-color: #0046f4;
        }
    }
    .table_top_select_input{
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;

        font-size: 18px;
        font-family: PingFang SC;
        font-weight: 500;
        color: #333333;
        .search_input{
            display: flex;
            align-items: center;
        }
        .table_select{
            display: flex;
            align-items: center;
            margin-right: 20px;
        }
    }

    // .table_select >>> .el-input__icon {
    //     width: 34px;
    // }

    // .table_select >>> .el-input__suffix {
    //     right: 0;
    //     background-color: #ececec;
    //     border-radius: 0 4px 4px 0;
    //     height: 26px;
    //     top: 1px;
    //     right: 0.75px;
    // }
    .show_this_page_num{
        text-align: right;
        font-size: 14px;
        font-family: PingFang SC;
        font-weight: 500;
        color: #333333;
        margin-bottom: 20px;
        margin-top: 15px;
    }
    /* 分页样式 */
    .pagination {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 20px;
    }

    /*设置当前页码的样式，及鼠标移上其他页码时的样式,以及左右箭头鼠标移上的样式*/
    // .pagination_box >>> .btn-prev {
    //     border: 1px solid #d6d6d6 !important;
    //     border-radius: 4px !important;
    //     padding: 0px 17px 0px 18px !important;
    //     display: inline-block !important;
    //     background-color: #fff !important;
    // }

    // .pagination_box >>> .btn-next {
    //     border: 1px solid #d6d6d6 !important;
    //     border-radius: 4px !important;
    //     padding: 0px 17px 0px 18px !important;
    //     display: inline-block !important;
    //     background-color: #fff !important;
    // }

    // .pagination_box
    // >>> .el-pagination.is-background
    // .el-pager
    // li:not(.disabled).active {
    //     background-color: #0046f4 !important;
    // }

    .togo_that_page {
        font-size: 14px;
        font-family: PingFang SC;
        font-weight: 500;
        color: #666666;
        margin-right: 10px;
    }

    .show_datanum_allpage span {
        font-size: 14px;
        font-family: PingFang SC;
        font-weight: 500;
        color: #666666;
    }
</style>
