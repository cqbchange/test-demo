<!--
 * @Descripttion: 开心庄园
 * @version: 1.0
 * @Author: lizhi
 * @Date: 2021-01-15 16:52:43
 * @LastEditors: lizhi
 * @LastEditTime: 2021-01-30 15:50:04
-->
<template>
    <div class="memberList">
        <div class="topBox">
            <el-form :inline="true" :model="dataForm" ref="dataForm" class="demo-form-inline">
                <el-form-item style="flex:1;">
                    <!-- <el-button size="medium"  type="primary" class="my-blue-btn" @click="editData()">添加好礼</el-button> -->
                </el-form-item>
                <div class="el-form-item-right">
                    <el-form-item style="width:150px;">
                        <el-select v-model="dataForm.status" @change="loadData()" filterable placeholder="状态"
                            size="medium">
                            <el-option :value="''" label="全部订单" />
                            <el-option :value="2" label="已发货" />
                            <el-option :value="1" label="未发货" />
                        </el-select>
                    </el-form-item>
                    <el-form-item style="width:300px;">
                        <el-date-picker size="medium"  v-model="times"
                            value-format="timestamp" type="daterange" range-separator="至" start-placeholder="开始日期" :clearable='false'
                            end-placeholder="结束日期" style="width:100%" :default-time="['00:00:00', '23:59:59']" :picker-options="pickerOptions" 
                            />
                    </el-form-item>
                    <el-form-item style="width:180px;margin-top:2px">
                        <el-input placeholder="搜索" v-model="dataForm.keyword" @clear="search()" class="input-search-btn" clearable size="medium" @keyup.enter.native='search()'>
                            <el-button  slot="append"  icon="el-icon-search" @click="search()" ></el-button>
                        </el-input>
                    </el-form-item>
                </div>
            </el-form>
        </div>
        <fix-table
            @selection-change="handleSelectionChange"
            ref="table"
            :data="tableData"
            key="memberlist"
            border v-loading="loading" element-loading-spinner="el-icon-loading"
            element-loading-text="拼命加载中" height="73.7vh" size="small"
            header-row-class-name="my-table-header" class="my-table"
        >
            <el-table-column fixed type="selection"  align="center" header-align="center"/>
            <el-table-column  fixed prop="id" label="兑换ID" align="center" header-align="center"/>
            <el-table-column  prop="uid" label="用户ID" align="center"></el-table-column>
            <el-table-column  prop="goodName" label="商品名称" align="center"></el-table-column>
            <el-table-column   prop="consignee_name" label="收货人" align="center"></el-table-column>
            <el-table-column   prop="mobile" label="手机号" align="center"/>
            <el-table-column   prop="consignee_address" label="收货地区"  align="center"/>
            <el-table-column   prop="detailed_address" label="详细地址" align="center"></el-table-column>
            <el-table-column   prop="exchange_time" label="兑换时间" align="center"></el-table-column>
            <el-table-column   prop="delivery_status" label="状态"  align="center" >
                <template slot-scope="scope">
                    <span v-if="scope.row.delivery_status == 1">未发货</span>
                    <span v-if="scope.row.delivery_status == 2">已发货</span>
                </template>
            </el-table-column>
            <el-table-column   prop="tracking_number" label="物流单号" align="center" width="100" />
            <el-table-column   prop="delivery_time" label="发货时间" align="center" width="100" />
            <el-table-column   fixed="right" label="操作"  align="center">
                <template slot-scope="scope">
                    <el-button v-if="scope.row.delivery_status == 1" @click="editData(scope.row)" type="text" size="small">发货</el-button>
                    <el-button v-if="scope.row.delivery_status == 2" @click="editData(scope.row)" type="text" size="small">修改</el-button>
                </template>
            </el-table-column>
        </fix-table>
        <div class="btn">
            <el-button icon="el-icon-printer" size="medium" class="my-def-btn" @click="batchDialogFun()">批量导出</el-button>
        </div>
        
        <div class="pages">
            <el-pagination
                @current-change="handleCurrentChange"
                layout="total, prev, pager, next"
                :page-size="dataForm.size"
                :current-page="dataForm.pageNum"
                :total="totalNum"
            />
        </div>

        <el-dialog custom-class="my-dialog" width="500px" center :title="title" :visible.sync="dialogFormVisible">
            <el-form label-width="100px">
                <el-form-item label="物流单号：">
                    <el-input v-model="tracking_number" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="editOk()">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    export default {
        name: "exchangeOrder",
        data() {
            return {
                // 表格数据总量
                totalNum: 0,
                // 每页显示数据数量
                loading: true,
                dataForm: {
                    keyword: "",
                    pageNum: 1,
                    pageSize:10,
                    status:'',
                    startTime:'',
                    endTime:'',
                    application_json:true
                },
                tableData: [],
                showDialog: false,
                infoForm: {},
                multipleSelection:[],
                times:[
                     new Date(`${this.dateFormat('YYYY-mm-dd',new Date())} 00:00:00`).getTime(),new Date(`${this.dateFormat('YYYY-mm-dd',new Date())} 23:59:59`).getTime()
                ],
                pickerOptions: {},
                title:'',
                dialogFormVisible:false,
                tracking_number:'',
                exchangeId:'',
            };
        },
        methods: {
            // 换页响应
            handleCurrentChange(val) {
                this.tableData = [];
                this.dataForm.pageNum = val;
                this.loadData();
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
                
            },
            search(){
                this.dataForm.pageNum = 1;
                this.loadData();
            },
            // 请求数据
            loadData: function () {
                const _this = this;
                this.loading = true;
                this.dataForm.startTime = this.dateFormat('YYYY-mm-dd HH:MM:SS',new Date(this.times[0]))
                this.dataForm.endTime = this.dateFormat('YYYY-mm-dd HH:MM:SS',new Date(this.times[1]))
                this.postRequest("/collaregg/physicalExchangeOrder/list", _this.dataForm).then(resp => {
                     _this.loading = false;
                    if (resp && resp.code === 200) {
                        _this.totalNum = resp.data.total;
                        _this.tableData = resp.data.list;
                    }
                });
            },
            batchDialogFun() {
                if (!this.$refs.table.selection.length) {
                    this.$message.warning('请选择一条数据')
                    return
                }
                let selectId = []
                this.$refs.table.selection.forEach((item,i )=> {
                    selectId.push(item.id)
                });
                let url = `/collaregg/physicalExchangeOrder/exportExcel?ids=${selectId.toString()}`
                window.open(url)
                
            },
            editData: function (row) {
                this.exchangeId = ''
                this.tracking_number = ''
                if(row.delivery_status == 1){
                    this.title = row.id+'-商品发货'
                }else{
                    this.title = row.id+'-发货信息修改'
                }
                this.tracking_number = row.tracking_number
                this.exchangeId = row.id
                this.dialogFormVisible = true;
            },
            editOk(){
                this.postRequest("/collaregg/physicalExchangeOrder/tracking_number", {
                    id:this.exchangeId,
                    tracking_number:this.tracking_number
                }).then(resp => {
                        if (resp && resp.code === 200) {
                            this.$message.success(resp.msg)
                            this.dialogFormVisible = false;
                            this.loadData()
                        } else {
                            this.$message.error(resp.msg)
                        }
                    });
            },
            handleImgSuccess(file, fileList) {
                if (file.code !== 200) {
                    this.$message.error(file.msg);
                } else {
                    this.infoForm.pic = file.data;
                }
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
        },
        watch:{
            times:{
                handler(val){
                    if(val){
                        this.tableData = []
                        this.dataForm.pageNum = 1
                        this.loadData()
                    }else{
                        this.dataForm.pageNum = 1
                        this.loadData()
                    }
                }
            }
        },
        computed: {
            catList() {
                return this.$store.state.base.catList;
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
    .img_pic_box {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .gourl_a {
        display: contents;
    }
.btn{
    padding-top: 30px;
}
.el-form-item__content{
    line-height: 35px;
}
</style>

