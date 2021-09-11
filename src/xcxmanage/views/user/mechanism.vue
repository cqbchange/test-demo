<!--
 * @Descripttion: 机构管理
 * @version: 1.0
 * @Author: Dulei
 * @Date: 2021-01-19 10:42:43
 * @LastEditors: WangChuan
 * @LastEditTime: 2021-08-18 17:03:23
-->
<template>
    <div class="wrap">
        <div class="topBox">
            <el-form :inline="true" :model="dataForm" ref="dataForm" class="demo-form-inline">
                <el-form-item style="flex:1;">
                    <el-button size="medium" v-if="auth !== 1" type="primary" icon="el-icon-plus" class="my-blue-btn"
                        @click="addInfo()">添加机构</el-button>
                    <!-- <el-button size="medium"  v-if="auth !== 0&&companyAddcompanysaleauth" class="my-def-btn" @click="$router.push('/financeSummary')">销售实销</el-button> -->
                </el-form-item>
                <el-form-item prop="seller_id" style="width:150px;">
                    <el-form-item>
                        <el-select size="medium" filterable placeholder="请选择归属人" v-model="dataForm.seller_id" clearable
                            style="width:100%" @change="submitForm()" :disabled="loading">
                            <el-option label="全部归属人" value=""></el-option>
                            <el-option v-for="(item, i) in userList" :label="item.name" :value="item.id" :key="i">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form-item>
                <el-form-item prop="keyword" style="width:200px;">
                    <el-input size="medium" @change="submitForm()" @clear="submitForm()" placeholder="搜索"
                        v-model="dataForm.keyword" class="input-search-btn" clearable>
                        <el-button size="medium" slot="append" icon="el-icon-search" @click="submitForm()"></el-button>
                    </el-input>
                </el-form-item>
            </el-form>
        </div>
        <fix-table border v-loading="loading" element-loading-spinner="el-icon-loading" element-loading-text="拼命加载中"
            :data="tableData" key="list" height="73.7vh" size="small" header-row-class-name="my-table-header"
            class="my-table" @sort-change="sortChange">
            <el-table-column fixed prop="id" label="ID" align="center" width="120" />
            <el-table-column prop="sname" label="归属人" align="center" />
            <el-table-column prop="name" label="机构名" align="center" />
            <el-table-column prop="cpc_money" label="单价(元)" align="center" sortable="custom" />
            <el-table-column prop="prepaid_money" label="预存款(元)" align="center" sortable="custom" />
            <el-table-column prop="actual_money" label="实际支出(元)" align="center" sortable="custom" />
            <el-table-column prop="money" label="金额(元)" align="center" sortable="custom" />
            <el-table-column fixed="right" label="操作" width="160" align="center">
                <template slot-scope="scope">
                    <el-button v-if="auth !== 1" @click="addMoney(scope.row)" type="text" size="small">加款</el-button>
                    <el-button v-if="auth !== 1" @click="editData(scope.row)" type="text" size="small">修改</el-button>
                    <el-button @click="flowData(scope.row)" type="text" size="small">明细</el-button>
                </template>
            </el-table-column>
        </fix-table>
        <!-- 页码 -->
        <div class="pages">
            <el-pagination :page-size="dataForm.size" :total="totalNum" @current-change="handleCurrentChange"
                layout="total, prev, pager, next" :current-page="dataForm.p"></el-pagination>
        </div>
        <el-dialog custom-class="my-dialog" :title="infoForm.id?'编辑机构':'新增机构'" :visible.sync="dialogVisible"
            width="920px" :close-on-press-escape="false" :close-on-click-modal="false">
            <el-form :model="infoForm" size="medium">
                <el-row :gutter="20" type="flex">
                    <el-col :span="12">
                        <el-form-item label="机构名" label-width="100px">
                            <el-input size="medium" v-model="infoForm.name" autocomplete="off" placeholder="请填写机构名"
                                clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="单价" label-width="100px">
                            <el-input size="medium" v-model="infoForm.cpc_money" autocomplete="off" placeholder="请填写单价"
                                clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" v-if="infoForm.id">
                        <el-form-item label="预存款" label-width="100px">
                            <el-input size="medium" v-model="infoForm.prepaid_money" autocomplete="off"
                                placeholder="请填写预存款" :disabled="Boolean(infoForm.id)" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="归属人" label-width="100px">
                            <el-select size="medium" placeholder="归属人" v-model="infoForm.seller_id" clearable
                                style="width:100%" :disabled="auth === 0&&companyAddcompanysaleauth">
                                <el-option v-for="(item, i) in userList" :label="item.name" :value="item.id" :key="i">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="medium" type="primary" @click="editSub()" class="my-blue-btn" :loading="editLoading">确
                    定</el-button>
                <el-button size="medium" @click="dialogVisible = false">取 消</el-button>
            </div>
        </el-dialog>

        <el-dialog custom-class="my-dialog" title="用户加款" :visible.sync="dialogMoneyVisible" width="686px"
            :close-on-press-escape="false" :close-on-click-modal="false">
            <el-form :model="moneyInfo" size="medium">
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item :label="'打款金额'" label-width="80px">
                            <el-input size="medium" @input="inputChange3" v-model="moneyInfo.prepaid_money"
                                autocomplete="off" placeholder="请填写金额" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label-width="80px" label="打款时间">
                            <el-date-picker size="medium" style="width:100%;" v-model="myTime" type="datetime"
                                value-format="timestamp" placeholder="选择日期时间" @change="pickerOptionsFun"
                                :picker-options="pickerOptions">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="'税'+'\xa0\xa0\xa0\xa0\xa0\xa0\xa0'+'点'" label-width="80px">
                            <el-input size="medium" @input="inputChange1" v-model="moneyInfo.point_money"
                                autocomplete="off" placeholder="请填写税点" clearable />
                            <span style="white-space: nowrap;">减去税点实际到账广告费用：<span style="color:red"
                                    v-if="!isNaN(mySubtr(moneyInfo.prepaid_money,moneyInfo.point_money))">{{mySubtr(moneyInfo.prepaid_money,moneyInfo.point_money)}}</span></span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" class="upload-img-box">
                        <el-form-item label-width="80px" label="收款方式">

                            <el-select size="medium" placeholder="请选择类型" v-model="moneyInfo.pay_type"
                                @change="typeChange">
                                <el-option value="1" label="支付宝"></el-option>
                                <el-option value="2" label="对公银行"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12"></el-col>
                    <el-col :span="12" v-if="moneyInfo.pay_type === '1'">
                        <el-form-item label-width="80px" label="交易号">
                            <el-input size="medium" v-model="moneyInfo.alipay_num" autocomplete="off" clearable>
                            </el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :span="12" class="upload-img-box" v-if="moneyInfo.pay_type === '2'">
                        <el-form-item label-width="80px" label="凭证">
                            <el-col :span="14" style="padding: 0;">
                                <el-input size="medium" autocomplete="off" readonly v-model="moneyInfo.images"
                                    clearable></el-input>
                            </el-col>
                            <el-col :span="10" style="padding-right: 0;text-align:right">
                                <el-upload :action="uploadUrl" :before-upload="beforeUpload"
                                    :on-success="handleImgSuccess" :show-file-list="false" class="upload-img"
                                    name="image">
                                    <el-button size="small" type="primary">上传凭证</el-button>
                                </el-upload>
                            </el-col>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="medium" type="primary" @click="subMoney()" class="my-blue-btn"
                    :disabled="subMoneyLoading">确 定</el-button>
                <el-button size="medium" @click="dialogMoneyVisible = false">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import {
        mapActions
    } from 'vuex'

    export default {
        name: 'daniuUserList',
        data() {
            return {
                // 表格数据总量
                totalNum: 0,
                gotopage: '', //跳转页数
                allpages: '', //全部页数
                dataForm: {
                    p: 1,
                    size: 10,
                    sortType: '',
                    sortField: '',
                    keyword: '',
                    seller_id: ''
                },
                loading: true,
                tableData: [],
                dialogVisible: false,
                infoDef: {
                    seller_id: '',
                    name: '',
                    cpc_money: '',
                    prepaid_money: ''
                },
                infoForm: {},
                dialogMoneyVisible: false,
                moneyInfo: {
                    id: 0,
                    prepaid_money: '',
                    point_money: '',
                    images: '',
                    pay_time: '',
                    pay_type: '1',
                    alipay_num: ''
                },
                rate_com: '',
                isFocus: false,
                detailVisible: false,
                userList: [],

                totalDetailNum: 0,
                gotopageDetail: '', //跳转页数
                allDetailpages: '', //全部页数
                tableDetailData: [],
                detailLoad: false,
                deatilForm: {
                    id: '',
                    p: 1,
                    size: 10,
                    start: '',
                    end: '',
                    type: '',
                    // seller_id: '',
                },
                daterange: [],
                detailTypeList: [{
                    id: 1000,
                    name: '消耗'
                }, {
                    id: 1002,
                    name: '加款'
                }],
                expenditure: 0,
                recharge: 0,
                auth: '',
                editLoading: false,
                subMoneyLoading: false,
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() > Date.now()
                    },
                    // selectableRange: `00:00:00 - ${this.$utils.toDateString(new Date(), 'HH:mm:ss')}`
                },
                myTime: '',
                changeTime: '',
                changeDetailVisible: false,
                changeDetailInfo: {
                    id: 0,
                    money: '',
                    pay_time: '',
                    images: '',
                    company_id: ''
                },
                tempRow: '',
                subDetailLoading: false
            }
        },
        computed: {
            uploadUrl() {
                return this.$store.state.base.uploadUrl
            },
            companyAddcompanysaleauth() {
                return this.$store.state.base.user.permissions.indexOf('company_addcompanysaleauth') === -1 //true不是运营
            },
            permissions() {
                return this.$store.state.base.user.permissions
            }
        },
        watch: {
            "moneyInfo.prepaid_money": {
                handler(val) {
                    this.moneyInfo.prepaid_money = isNaN(Number(val)) ? '' : val.match(/^\d*(\.?\d{0,2})/g)[0]
                }
            },
            "moneyInfo.point_money": {
                handler(val) {
                    this.moneyInfo.point_money = isNaN(Number(val)) ? '' : val.match(/^\d*(\.?\d{0,2})/g)[0]
                }
            },
        },
        components: {},
        methods: {
            // 重置表单
            resetForm(formName) {
                this.dataForm.p = 1
                this.$refs[formName].resetFields()
                this.loadData()
            },
            // 提交表单
            submitForm: function () {
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
            // 机构列表数据
            loadData() {
                this.loading = true
                this.getRequest('/Company/getList', this.dataForm).then(resp => {
                    this.loading = false
                    if (resp && resp.code === 200) {
                        this.totalNum = resp.data.list.total
                        this.tableData = resp.data.list.list
                        this.allpages = Math.ceil(resp.data.list.total / this.dataForm.size)
                        this.gotopage = this.dataForm.p
                        this.auth = resp.data.auth
                    }
                })
            },
            addInfo() {
                if (this.auth === 0 || !this.companyAddcompanysaleauth) {
                    this.infoDef.seller_id = this.$store.state.base.user.uid
                }
                if (this.permissions.length === 1 && this.permissions[0] === '') {
                    this.infoDef.seller_id = '29' //默认选有惠
                }
                this.infoForm = Object.assign({}, this.infoDef)
                this.dialogVisible = true
            },
            editData(row) {
                this.infoForm = Object.assign({}, this.infoDef)
                this.infoForm.id = row.id
                this.infoForm.seller_id = row.seller_id
                this.infoForm.name = row.name
                this.infoForm.cpc_money = row.cpc_money
                this.infoForm.prepaid_money = row.prepaid_money
                this.dialogVisible = true
            },
            editSub() {
                if (this.infoForm.seller_id == '') {
                    this.$message.warning('归属人不能为空')
                    return
                }
                if (this.infoForm.name == '') {
                    this.$message.warning('机构名不能为空')
                    return
                }
                if (this.infoForm.cpc_money == '') {
                    this.$message.warning('单价不能为空')
                    return
                }
                if (isNaN(this.infoForm.cpc_money)) {
                    this.$message.warning('单价不正确')
                    return
                } else {
                    if (this.infoForm.cpc_money < 0) {
                        this.$message.warning('单价不正确')
                        return
                    }
                }
                if (this.infoForm.prepaid_money !== '' && isNaN(this.infoForm.prepaid_money)) {
                    this.$message.warning('预存款不正确')
                    return
                }
                if (this.infoForm.id) {
                    delete this.infoForm.prepaid_money
                }
                this.editLoading = true
                this.postRequest('/Company/setAdd', this.infoForm).then(resp => {
                    if (resp && resp.code === 200) {
                        this.$message({
                            message: resp.msg,
                            type: 'success',
                            showClose: true,
                            duration: 1000,
                        })
                        this.dialogVisible = false
                        this.loadData()
                        this.$emit('success', this.infoForm)
                    } else {
                        this.$message({
                            message: resp.msg,
                            type: 'warning',
                            showClose: true,
                            duration: 1000,
                        })
                    }
                    setTimeout(() => {
                        this.editLoading = false
                    }, 500);
                })
            },
            addMoney(row) {
                this.rate_com = ''
                this.moneyInfo.id = row.id
                this.moneyInfo.prepaid_money = ''
                this.moneyInfo.point_money = ''
                this.moneyInfo.images = ''
                this.moneyInfo.pay_time = ''
                this.moneyInfo.pay_type = '1'
                this.moneyInfo.alipay_num = ''
                this.myTime = ''
                this.dialogMoneyVisible = true
            },
            typeChange(val) {
                if (val === '2') {
                    this.moneyInfo.alipay_num = ''
                }
            },
            subMoney() {
                if (this.moneyInfo.prepaid_money === '') {
                    this.$message.warning('金额不能为空')
                    return
                }
                if (this.moneyInfo.prepaid_money <= 0) {

                    this.$message.warning('金额必须为正整数')
                    return
                }
                if (String(this.moneyInfo.prepaid_money).substr(-1) === '.' || this.moneyInfo.prepaid_money === '0' ||
                    this.moneyInfo.prepaid_money === '-0') {
                    this.$message.warning('金额不正确')
                    return
                }
                if (isNaN(Number(this.moneyInfo.point_money)) || Number(this.moneyInfo.point_money) < 0) {
                    this.$message.warning('税点不正确')
                    return
                }
                if (!this.myTime) {
                    this.$message.warning('打款时间不能为空')
                    return
                }
                if (this.moneyInfo.alipay_num === '0') {
                    this.moneyInfo.alipay_num = ''
                    this.$message.warning('交易号不能为0')
                    return
                }
                if (this.moneyInfo.pay_type === '1' && this.moneyInfo.alipay_num === '') {
                    this.$message.warning('交易号不能为空')
                    return
                }
                if (this.moneyInfo.pay_type === '2' && this.moneyInfo.images === '') {
                    this.$message.warning('凭证不能为空')
                    return
                }
                if (this.moneyInfo.pay_type === '2') {
                    this.moneyInfo.alipay_num = ''
                }
                this.$confirm('是否给该机构加款', '提示', {
                    confirmButtonText: '加款',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    if (this.moneyInfo.point_money === '') {
                        this.moneyInfo.point_money = 0
                    }
                    this.subMoneyLoading = true
                    this.moneyInfo.pay_time = Math.floor(this.myTime / 1000)
                    this.postRequest('/Company/setMoney', this.moneyInfo).then(resp => {
                        if (resp && resp.code === 200) {
                            this.$message({
                                message: resp.msg,
                                type: 'success',
                                showClose: true,
                                duration: 1000,
                            })

                            this.dialogMoneyVisible = false
                            this.loadData()
                        } else {
                            this.$message({
                                message: resp.msg,
                                type: 'warning',
                                showClose: true,
                                duration: 1000,
                            })
                        }
                        setTimeout(() => {
                            this.subMoneyLoading = false
                        }, 500);
                    })
                }).catch(() => {})
            },
            pickerOptionsFun: function () {
                let startAt = new Date(this.myTime) * 1000 / 1000;
                if (startAt > Date.now()) {
                    this.$message.info('打款时间不能大于当前时间')
                    this.myTime = new Date();
                }
            },
            pickerOptionsFun2: function () {
                let startAt = new Date(this.changeTime) * 1000 / 1000;
                if (startAt > Date.now()) {
                    this.$message.info('打款时间不能大于当前时间')
                    this.changeTime = new Date();
                }
            },
            flowData(row) {
                this.$store.commit("setThisMenu", {
                    "name": "机构明细",
                    "type": "",
                    "data": ""
                });
                this.$router.push({
                    name: 'userMechanismDetail',
                    params: row
                })
            },
            // 获取归属人列表
            getUserList() {
                this.getRequest('/xcxTask/salesman', {}).then((res) => {
                    if (res.code == 200) {
                        if (res.data) {
                            this.userList = []
                            for (let key in res.data) {
                                let obj = {
                                    key: '',
                                    value: ''
                                }
                                obj.id = key
                                obj.name = res.data[key]
                                this.userList.push(obj)
                            }
                        }
                    } else {

                    }
                })
            },

            beforeUpload(file) {
                console.log(file)
                const isJPG = (file.type === 'image/jpg' || file.type === 'image/jpeg' || file.type === 'image/png' ||
                    file.type === 'image/webp' || file.type === 'image/gif' ||
                    file.type === 'image/bmp' || file.type === 'image/tif' || file.type === 'image/pcx' || file
                    .type === 'image/tga' || file.type === 'image/exif' ||
                    file.type === 'image/fpx' || file.type === 'image/svg' || file.type === 'image/psd' || file
                    .type === 'image/cdr' || file.type === 'image/pcd' ||
                    file.type === 'image/dxf' || file.type === 'image/ufo' || file.type === 'image/eps' || file
                    .type === 'image/ai' || file.type === 'image/raw' ||
                    file.type === 'image/WMF');

                if (!isJPG) {
                    this.$message.error('请上传图片文件');
                }
                return isJPG;
            },
            // 上传图片
            handleImgSuccess(file, fileList) {
                if (file.code !== 200) {
                    this.$message.error(file.message)
                } else {
                    this.$set(this.moneyInfo, 'images', file.data)
                }

            },
            inputChange1() {
                this.moneyInfo.point_money = this.moneyInfo.point_money.toString().myReplace('-', '')
                if (Number(this.moneyInfo.point_money) > Number(this.moneyInfo.prepaid_money)) {
                    this.moneyInfo.point_money = 0
                }
            },
            inputChange3() {
                this.moneyInfo.prepaid_money = this.moneyInfo.prepaid_money.toString().myReplace('-', '')
                if (Number(this.moneyInfo.point_money) > Number(this.moneyInfo.prepaid_money)) {
                    this.moneyInfo.point_money = 0
                }
            },
            //减法
            mySubtr(arg1, arg2) {
                var r1, r2, m, n;
                try {
                    r1 = arg1.toString().split(".")[1].length
                } catch (e) {
                    r1 = 0
                }
                try {
                    r2 = arg2.toString().split(".")[1].length
                } catch (e) {
                    r2 = 0
                }
                m = Math.pow(10, Math.max(r1, r2));
                n = (r1 >= r2) ? r1 : r2;
                return ((arg1 * m - arg2 * m) / m).toFixed(n);
            },
            sortChange(e) {
                this.dataForm.sortType = e.order
                this.dataForm.sortField = e.prop
                this.loadData()
            },

        },
        mounted() {
            this.getUserList()
            this.loadData()
            console.log(this.$store.state);
        }
    }

</script>

<style scoped>
    .demo-form-inline {
        display: flex;
    }

    .demo-form-inline .el-form-item:last-child {
        margin-right: 0;
    }

    .wrap {
        background: #FFF;
    }

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

    /* 分页样式 */
    .pagination {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 20px;
    }

    /*设置当前页码的样式，及鼠标移上其他页码时的样式,以及左右箭头鼠标移上的样式*/
    .pagination_box>>>.btn-prev {
        border: 1px solid #d6d6d6 !important;
        border-radius: 4px !important;
        padding: 0px 17px 0px 18px !important;
        display: inline-block !important;
        background-color: #fff !important;
    }

    .pagination_box>>>.btn-next {
        border: 1px solid #d6d6d6 !important;
        border-radius: 4px !important;
        padding: 0px 17px 0px 18px !important;
        display: inline-block !important;
        background-color: #fff !important;
    }

    .pagination_box>>>.el-pagination.is-background .el-pager li:not(.disabled).active {
        background-color: #409EFF !important;
    }

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


    .detail_dialog>>>.el-dialog__body {
        padding: 0 30px 20px;
    }

    .is-dot-item>>>.is-dot {
        right: 3px;
        top: -3px;
    }

</style>
