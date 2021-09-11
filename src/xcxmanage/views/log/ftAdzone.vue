<!--
 * @Descripttion: 纷推渠道统计
 * @version: 1.0
 * @Author: DuLei
 * @Date: 2021-05-25 17:00:00
 * @LastEditors: DuLei
 * @LastEditTime: 2021-05-25 17:00:08
-->
<template>
    <div>
        <el-form :inline="true" v-model="dataForm" ref="dataForm" class="form-inline-box">
            <div class="el-form-item-left">
            </div>
            <div class="el-form-item-right">
                <el-date-picker v-model="datequantum" type="daterange" align="right" size="medium"
                    :editable="false" :clearable="false" format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期"
                    end-placeholder="结束日期" :picker-options="pickerOptions2" style="width:300px">
                </el-date-picker>

                <el-form-item style="width:200px;margin-left:10px;">
                    <el-input placeholder="搜索" @change="search()" @clear="search" v-model="dataForm.keyword" size="medium" class="input-search-btn" clearable>
                        <el-button slot="append" icon="el-icon-search" @click="search()"></el-button>
                    </el-input>
                </el-form-item>
            </div>
        </el-form>

        <fix-table ref="table" border v-loading="loading" element-loading-spinner="el-icon-loading"
            element-loading-text="拼命加载中" :data="tableData" key="list" height="73.7vh" size="medium"
            header-row-class-name="my-table-header" class="my-table">
            <el-table-column prop="id" label="UID" align="center" />
            <el-table-column prop="name" label="渠道商名称" align="center" />
            <el-table-column prop="datetime" label="日期" align="center"/>
            <el-table-column prop="request" label="请求数" align="center"/>
            <el-table-column prop="hit" label="命中数" align="center"/>
            <!-- <el-table-column prop="hit_plan" label="命中计划数" align="center" /> -->
            <el-table-column prop="hit_rate" :label="'命中率'" align="center">
                <template slot-scope="scope">
                    <span>{{scope.row.hit_rate}}%</span>
                </template>
            </el-table-column>
            <el-table-column prop="complete_value" label="完成量" align="center" />
            <el-table-column prop="complete_rate" label="完成率" align="center">
                <template slot-scope="scope">
                    <span>{{scope.row.complete_rate}}%</span>
                </template>
            </el-table-column>
            <el-table-column prop="money" label="预估收益" align="center" />
            <el-table-column fixed="right" label="操作" align="center">
                <template slot-scope="scope">
                    <el-button @click="editZone(scope.row)" type="text" size="medium">明细</el-button>
                </template>
            </el-table-column>
        </fix-table>
        <div class="pages">
            <el-pagination @current-change="currentChange" layout="total, prev, pager, next" :page-size="dataForm.size"
                :current-page="dataForm.page" :total="dataForm.totalNum" />
        </div>
        <el-dialog title="渠道明细" :visible.sync="showDialog" custom-class="my-dialog" width="60%" :append-to-body="true"
            :close-on-press-escape="false">
            <fix-table ref="table" border v-loading="loadingDetail" element-loading-spinner="el-icon-loading"
                element-loading-text="拼命加载中" :data="tableDataDetail" key="list" height="73.7vh" size="medium"
                header-row-class-name="my-table-header" class="my-table">
                <el-table-column prop="id" label="UID" align="center" />
                <el-table-column prop="name" label="渠道名称" align="center" />
                <el-table-column prop="datetime" label="日期" align="center"/>
                <el-table-column prop="request" label="请求数" align="center"/>
                <el-table-column prop="hit" label="命中数" align="center"/>
                <!-- <el-table-column prop="hit_plan" label="命中计划数" align="center" /> -->
                <el-table-column prop="hit_rate" label="命中率" align="center">
                    <template slot-scope="scope">
                        <span>{{scope.row.hit_rate}}%</span>
                    </template>
                </el-table-column>
                <el-table-column prop="complete_value" label="完成量" align="center" />
                <el-table-column prop="complete_rate" label="完成率" align="center">
                    <template slot-scope="scope">
                        <span>{{scope.row.complete_rate}}%</span>
                    </template>
                </el-table-column>
                <el-table-column prop="money" label="预估收益" align="center" />
            </fix-table>
            <div class="pages">
                <el-pagination @current-change="currentChangeDetail" layout="total, prev, pager, next" :page-size="dataFormDetail.size"
                    :current-page="dataFormDetail.page" :total="dataFormDetail.totalNum" />
            </div>
        </el-dialog>
    </div>
</template>
<script>
    export default {
        name: "logftAdzone",
        data() {
            return { // 表格load状态
                loading: false,
                loadingDetail: false,
                user_id: '',
                datequantum:[
                    `${this.dateFormat('YYYY-mm-dd',new Date(new Date().getTime()))} 00:00:00`,`${this.dateFormat('YYYY-mm-dd',new Date(new Date().getTime()))} 23:59:59`
                ],//时间段
                // form数据
                dataForm: {
                    page: 1,
                    size: 15,
                    totalNum: 1,
                    keyword: ''
                },
                // Table数据
                tableData: [],
                dataFormDetail: {
                    page: 1,
                    size: 15,
                    totalNum: 1,
                    keyword: ''
                },
                tableDataDetail: [],
                // 编辑弹窗显示状态
                showDialog: false,
                // 编辑数据
                infoForm: {
                    id: 0,
                    mobile: '',
                    password: '',
                    xcxAdzone: '',
                    xcx_id: '',
                },
                // 复制链接弹窗显示状态
                showCopyLinkDialog: false,
                addChanneloading: false,
                // 复制链接数据
                copyList: [],
                copyData: {
                    channel: '',
                    xcx_id: '',
                    type: '0',
                    isCopy: false
                },
                pickerOptions2: {
                    onPick: ({maxDate, minDate}) => {
                        this.selectDate = minDate.getTime();
                        if (maxDate) {
                        this.selectDate = ''
                        }
                    },
                    disabledDate: (time) => {
                        if (this.selectDate !== '') {
                            const one = 30 * 24 * 3600 * 1000;
                            const minTime = this.selectDate - one;
                            const maxTime = this.selectDate + one;
                            return (time.getTime() < minTime || time.getTime() > maxTime)
                        }
                    },
                    shortcuts: [{
                        text: '最近一周',
                        onClick(picker) {
                            const end = new Date()
                            const start = new Date()
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
                            picker.$emit('pick', [start, end])
                        }
                    }, {
                        text: '最近一个月',
                        onClick(picker) {
                            const end = new Date()
                            const start = new Date()
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
                            picker.$emit('pick', [start, end])
                        }
                    }, {
                        text: '最近三个月',
                        onClick(picker) {
                            const end = new Date()
                            const start = new Date()
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
                            picker.$emit('pick', [start, end])
                        }
                    }]
                }
            };
        },
        watch: {
            datequantum:{
                handler:function (val) {
                    if(!val){
                        return
                    }
                    
                    this.dataForm.start = `${this.dateFormat('YYYY-mm-dd HH:MM:SS',new Date(Math.floor(this.$utils.getWhatDay(val[0], 0, 'first'))))}`;
                    this.dataForm.end = `${this.dateFormat('YYYY-mm-dd HH:MM:SS',new Date(Math.floor(this.$utils.getWhatDay(val[1], 0, 'last'))))}`;
                    this.dataForm.page = 1;
                    this.loading = true;
                    this.loadData();
                },
                immediate:true,

            },
        },
        methods: {
            showAllPrice(){
                this.priceData = this.priceDataAll
                this.adzone_id = 0
                this.isUpdatePrice = true
            },
            closeDia(){
                this.priceData={
                    zhiboPrice:0,
                    juhelaxin:0,
                    cpaPrice:0,
                    cpmPrice:0,
                    denghuo:0,
                    taobaoGoods:0,
                    shortsVideo:0,
                    taobaoStroll:0,
                },
                this.adzone_id = 0
                this.isUpdatePrice = false
            },
            UpdatePrice(formName){
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.postRequest("ChannelNewUser/setCpcMoney",{
                            put_type:JSON.stringify (this.priceData),
                            adzone_id:this.adzone_id,
                        }).then(resp => {
                            if (resp.code == 200) {
                                this.$message.success(resp.msg)
                                this.closeDia()
                                this.loadData();
                            }else{
                                this.$message.error(resp.msg)
                            }
                        });
                    } else {
                        return false;
                    }
                });
                
            },
            // 获取Table数据
            loadData() {
                this.loading = true;
                this.getRequest("/ChannelFenTui/getList", this.dataForm).then(resp => {
                    if (resp && resp.code === 200) {
                        this.dataForm.totalNum = resp.data.count;
                        this.tableData = resp.data.data
                        this.loading = false;
                    }else{
                        this.$message.warning(resp.msg)
                        this.loading = false;
                    }
                });
            },
            search() {
                this.dataForm.keyword = this.dataForm.keyword.trim()
                this.dataForm.keyword = this.dataForm.keyword.split(' ').join('')
                this.dataForm.page = 1
                this.loadData()
            },
            // 换页响应
            currentChange(val) {
                this.tableData = [];
                this.dataForm.page = val;
                this.loadData();
            },
            // 换页响应
            currentChangeDetail(val) {
                this.tableDataDetail = [];
                this.dataFormDetail.page = val;
                this.zoneDeatil();
            },
            // 添加/编辑
            editZone(row){
                this.showDialog = true
                this.tableDataZone = []//清空
                this.dataFormDetail.page = 1;
                this.user_id = row.id
                this.zoneDeatil(row)
            },
            zoneDeatil(row){
                console.log(row);
                this.loadingDetail = true
                this.getRequest("/ChannelFenTui/getDetail", {
                    user_id: this.user_id,
                    page:this.dataFormDetail.page,
                    size:this.dataFormDetail.size,
                    start: row.datetime+' 00:00:00',
                    end: row.datetime+' 23:59:59',
                }).then(resp => {
                    if(resp.code == 200){
                        this.dataFormDetail.totalNum = resp.data.count;
                        this.tableDataDetail = resp.data.data
                    }else{
                        this.$message.warning(resp.msg)
                    }
                    
                    this.loadingDetail = false
                });
            },
            //时间处理important
            dateFormat(fmt, date) {
                let ret
                const opt = {
                    'Y+': date.getFullYear().toString(), // 年
                    'm+': (date.getMonth() + 1).toString(), // 月
                    'd+': date.getDate().toString(), // 日
                    'H+': date.getHours().toString(), // 时
                    'M+': date.getMinutes().toString(), // 分
                    'S+': date.getSeconds().toString() // 秒
                    // 有其他格式化字符需求可以继续添加，必须转化成字符串
                }
                for (let k in opt) {
                    ret = new RegExp('(' + k + ')').exec(fmt)
                    if (ret) {
                        fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length,
                            '0')))
                    }
                }

                return fmt
            },
        },
        computed: {
            xcxList() {
                return this.$store.state.base.xcxList
            }
        },
        mounted() {
            // this.loadData();
        }
    };

</script>

<style lang='scss' scoped>
    .iscopy {
        background: #45DDB5;
        border-color: #45DDB5;
    }

</style>
