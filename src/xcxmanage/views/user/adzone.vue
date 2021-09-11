<!--
 * @Descripttion: 渠道管理
 * @version: 1.0
 * @Author: Lizhi
 * @Date: 2021-01-15 16:52:43
 * @LastEditors: WangChuan
 * @LastEditTime: 2021-08-26 14:55:17
-->
<template>
    <div>
        <el-form :inline="true" v-model="dataForm" ref="dataForm" class="form-inline-box">
            <div class="el-form-item-left">
                <el-form-item>
                    <el-button type="primary" icon="el-icon-plus" class="my-blue-btn" @click="edit()" size="medium">
                        添加渠道商
                    </el-button>
                    <el-button type="primary" class="my-blue-btn" @click="showAllPrice()" size="medium">
                        单价模板
                    </el-button>
                </el-form-item>
            </div>
            <div class="el-form-item-right">
                <el-form-item style="width:200px;">
                    <el-input placeholder="搜索" @change="search()" @clear="search()" v-model="dataForm.keyword" class="input-search-btn" clearable>
                        <el-button slot="append" icon="el-icon-search" @click="search()"></el-button>
                    </el-input>
                </el-form-item>
            </div>
        </el-form>

        <fix-table ref="table" border v-loading="loading" element-loading-spinner="el-icon-loading"
            element-loading-text="拼命加载中" :data="tableData" key="list" height="73.7vh" size="medium"
            header-row-class-name="my-table-header" class="my-table">
            <el-table-column prop="aid" label="ID" align="center" />
            <el-table-column prop="id" label="渠道位ID" align="center" />
            <el-table-column prop="username" label="渠道名称" align="center" />
            <el-table-column prop="mobile" label="手机号" align="center">
                <template slot-scope="scope">
                    <span @click="linkto(scope.row)" style="cursor: pointer;color: #0026ff">{{scope.row.mobile}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="cpc_money" label="单价" align="center">
                <template slot-scope="scope">
                    <span>{{scope.row.cpc_money}}</span>
                    <i style="margin-left:2px;cursor:pointer;" @click="editRate(scope.row)" class="el-icon-edit"></i>
                </template>
                
            </el-table-column>
            <el-table-column prop="xcx_id" label="小程序" align="center">
                <template slot-scope="scope">
                    <template v-for="(item,key) in scope.row.xcx_id">
                        <span :key="key">{{xcxList[item]}}</span>
                        <span :key="key+item" v-if="scope.row.xcx_id.length > (key+1)">，</span>
                    </template>
                </template>
            </el-table-column>
            <el-table-column prop="last_login_time" label="最后登录时间" align="center" />
            <el-table-column fixed="right" label="操作" align="center">
                <template slot-scope="scope">
                    <el-button @click="edit(scope.row)" type="text" size="medium">编辑</el-button>
                    <el-button @click="del(scope.row)" type="text" size="medium">删除</el-button>
                    <el-button @click="copy(scope.row)" type="text" size="medium">复制链接</el-button>
                </template>
            </el-table-column>
        </fix-table>
        <div class="pages">
            <el-pagination @current-change="currentChange" layout="total, prev, pager, next" :page-size="dataForm.size"
                :current-page="dataForm.p" :total="dataForm.totalNum" />
        </div>
        <el-dialog title="添加渠道商" :visible.sync="showDialog" custom-class="my-dialog" width="42%" :append-to-body="true"
            :close-on-press-escape="false">
            <el-form :model="infoForm">
                <el-row :gutter="20" type="flex">
                    <el-col :span="12">
                        <el-form-item label="手机号：" label-width="100px">
                            <el-input maxlength="11" v-model="infoForm.mobile" autocomplete="off" placeholder="请填写手机号" clearable
                                size="medium" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="登录密码：" label-width="100px">
                            <el-input maxlength="14" v-model="infoForm.password" autocomplete="off" placeholder="请输入6-14位不含空格密码"
                                clearable size="medium" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20" type="flex">
                    <el-col :span="12">
                        <el-form-item label="渠道名称：" label-width="100px">
                            <el-input v-model="infoForm.username" autocomplete="off" placeholder="请填写渠道名称" clearable
                                size="medium" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="小程序：" label-width="100px">
                            <el-select v-model="infoForm.xcx_id" multiple filterable placeholder="请选择小程序" size="medium">
                                <el-option v-for="(item,key) in xcxList" :key="key" :label="item" :value="key">
                                </el-option>
                            </el-select>
                        </el-form-item>                        
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label-width="100px" label="是否中转：">
                            <el-radio-group v-model="infoForm.is_transfer">
                                <el-radio :label="'1'">是</el-radio>
                                <el-radio :label="'0'">否</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label-width="100px" label="落地小程序：" v-if="infoForm.is_transfer == 1">                    
                             <el-select v-model="infoForm.transfer_xcxid" filterable placeholder="请选择落地小程序" size="medium">
                                <el-option v-for="(item,key) in xcxList" :key="key" :label="item" :value="key">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label-width="100px" label="是否展示：">
                            <el-radio-group v-model="infoForm.is_show">
                                <el-radio :label="'1'">是</el-radio>
                                <el-radio :label="'0'">否</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button :loading='addChanneloading' type="primary" class="my-blue-btn" @click="subBtn" size="medium">确 定</el-button>
                <el-button @click="showDialog = false" size="medium">取 消</el-button>
            </div>
        </el-dialog>

        <el-dialog title="复制链接" :visible.sync="showCopyLinkDialog" custom-class="my-dialog" width="30%"
            :append-to-body="true" :close-on-press-escape="false" @closed='copyClose()'>
            <el-form>
                <el-row :gutter="20" type="flex">
                    <el-col :span="24">
                        <el-form-item label="小程序：" label-width="100px">
                            <el-select v-model="copyData.xcx_id" filterable placeholder="请选择小程序" size="medium">
                                <el-option v-for="(item,key) in copyList" :key="key" :label="item" :value="key">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="羊毛中转：" label-width="100px">
                            <el-radio v-model="copyData.type" label="0">否</el-radio>
                            <el-radio v-model="copyData.type" label="1">是</el-radio>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" class="my-blue-btn" :class="{'iscopy':copyData.isCopy}" @click="copylink()"
                    size="medium">
                    {{copyData.isCopy?'复制成功':'复制链接'}}</el-button>
                <el-button @click="showCopyLinkDialog = false" size="medium">取 消</el-button>
            </div>
        </el-dialog>

        <!-- 修改单价弹窗 -->
        <el-dialog title="修改单价" :visible.sync="isUpdatePrice" custom-class="my-dialog" width="42%" :append-to-body="true"
            :close-on-press-escape="false" @closed="closeDia">
            <el-form :model="priceData" :rules="rules" ref="ruleForm">
                <el-row :gutter="20" type="flex">
                    <el-col :span="12">
                        <el-form-item label="直播间：" label-width="100px" prop="zhiboPrice">
                            <el-input v-model="priceData.zhiboPrice" autocomplete="off" placeholder="请填写单价" clearable
                                size="medium" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="聚合拉新：" label-width="100px" prop="juhelaxin">
                            <el-input v-model="priceData.juhelaxin" autocomplete="off" placeholder="请填写单价"
                                clearable size="medium" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20" type="flex">
                    <el-col :span="12">
                        <el-form-item label="CPA：" label-width="100px" prop="cpaPrice">
                            <el-input v-model="priceData.cpaPrice" autocomplete="off" placeholder="请填写单价" clearable
                                size="medium" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="CPM：" label-width="100px" prop="cpmPrice">
                            <el-input v-model="priceData.cpmPrice" autocomplete="off" placeholder="请填写单价"
                                clearable size="medium" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20" type="flex">
                    <el-col :span="12">
                        <el-form-item label="灯火：" label-width="100px" prop="denghuo">
                            <el-input v-model="priceData.denghuo" autocomplete="off" placeholder="请填写单价" clearable
                                size="medium" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="淘宝商品：" label-width="100px" prop="taobaoGoods">
                            <el-input v-model="priceData.taobaoGoods" autocomplete="off" placeholder="请填写单价" clearable
                                size="medium" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20" type="flex">
                    <el-col :span="12">
                        <el-form-item label="短视频：" label-width="100px" prop="shortsVideo">
                            <el-input v-model="priceData.shortsVideo" autocomplete="off" placeholder="请填写单价" clearable
                                size="medium" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="淘宝逛逛：" label-width="100px" prop="taobaoStroll">
                            <el-input v-model="priceData.taobaoStroll" autocomplete="off" placeholder="请填写单价" clearable
                                size="medium" />
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" class="my-blue-btn" @click="UpdatePrice('ruleForm')" size="medium">确 定</el-button>
                <el-button @click="closeDia" size="medium">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    export default {
        name: "userAdzone",
        data() {
            let validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入单价'));
                } else {
                    if (!(/(^[1-9]\d*(\.\d{1,3})?$)|(^0(\.\d{1,3})?$)/).test(value)) {
                        callback(new Error('请输入正确的单价(整数或三位小数)'));  
                    }else if(value<=0 || value >=1){
                        callback(new Error('请输入大于0小于1的单价'))
                    }else{
                        callback()
                    }
                }
            };
            return { // 表格load状态
                loading: false,
                // form数据
                dataForm: {
                    p: 1,
                    size: 12,
                    totalNum: 1,
                    keyword: ''
                },
                // Table数据
                tableData: [],
                // 编辑弹窗显示状态
                showDialog: false,
                // 编辑数据
                infoForm: {
                    id: 0,
                    mobile: '',
                    password: '',
                    xcxAdzone: '',
                    xcx_id: '',
                    is_show: 1 ,
                },
                // 复制链接弹窗显示状态
                showCopyLinkDialog: false,
                // 复制链接数据
                copyList: [],
                copyData: {
                    channel: '',
                    xcx_id: '',
                    type: '0',
                    isCopy: false
                },
                isUpdatePrice:false,//修改单价弹窗显示
                priceData:{
                    zhiboPrice:0,
                    juhelaxin:0,
                    cpaPrice:0,
                    cpmPrice:0,
                    denghuo:0,
                    taobaoGoods:0,
                    shortsVideo:0,
                    taobaoStroll:0,
                },//修改单价的数据
                priceDataAll:{
                    zhiboPrice:0.23,
                    juhelaxin:0,
                    cpaPrice:0,
                    cpmPrice:0,
                    denghuo:0,
                    taobaoGoods:0,
                    shortsVideo:0,
                    taobaoStroll:0,
                },//修改单价的默认数据 测试
                adzone_id:0,//修改哪一个
                rules: {
                    zhiboPrice: [
                        { validator: validatePass, trigger: 'blur' },
                    ],
                    juhelaxin: [
                        { validator: validatePass, trigger: 'blur' },
                    ],
                    cpaPrice: [
                        { validator: validatePass, trigger: 'blur' },
                    ],
                    cpmPrice: [
                        { validator: validatePass, trigger: 'blur' },
                    ],
                    denghuo: [
                        { validator: validatePass, trigger: 'blur' },
                    ],
                    taobaoGoods: [
                        { validator: validatePass, trigger: 'blur' },
                    ],
                    shortsVideo: [
                        { validator: validatePass, trigger: 'blur' },
                    ],
                    taobaoStroll: [
                        { validator: validatePass, trigger: 'blur' },
                    ],
                },
                addChanneloading:false,
            };
        },
        methods: {
            //复制链接关闭弹窗结束
            copyClose(){
                this.copyData = {
                    channel: '',
                    xcx_id: '',
                    type: '0',
                    isCopy: false
                }
            },
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
            editRate(row){
                if(row.cpc_data != null){
                    row.cpc_data.zhiboPrice == undefined ? '':this.priceData.zhiboPrice = row.cpc_data.zhiboPrice
                    row.cpc_data.juhelaxin == undefined ? '':this.priceData.juhelaxin = row.cpc_data.juhelaxin
                    row.cpc_data.cpaPrice == undefined ? '':this.priceData.cpaPrice = row.cpc_data.cpaPrice
                    row.cpc_data.cpmPrice == undefined ? '':this.priceData.cpmPrice = row.cpc_data.cpmPrice
                    row.cpc_data.denghuo == undefined ? '':this.priceData.denghuo = row.cpc_data.denghuo
                    row.cpc_data.taobaoGoods == undefined ? '':this.priceData.taobaoGoods = row.cpc_data.taobaoGoods
                    row.cpc_data.shortsVideo == undefined ? '':this.priceData.shortsVideo = row.cpc_data.shortsVideo
                    row.cpc_data.taobaoStroll == undefined ? '':this.priceData.taobaoStroll = row.cpc_data.taobaoStroll
                    
                    if(row.cpc_data.zhiboPrice == undefined&&row.cpc_data.juhelaxin == undefined&&row.cpc_data.cpaPrice == undefined&&row.cpc_data.cpmPrice == undefined&&row.cpc_data.denghuo == undefined&&row.cpc_data.taobaoGoods == undefined&&row.cpc_data.shortsVideo == undefined&&row.cpc_data.taobaoStroll == undefined){
                        this.priceData = this.priceDataAll
                    }

                }
                this.adzone_id = row.aid
                this.isUpdatePrice = true
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
                this.getRequest("ChannelNewUser/getListNew", this.dataForm).then(resp => {
                    if (resp && resp.code === 200) {
                        this.dataForm.totalNum = resp.data.total;
                        resp.data.template == undefined ? '':this.priceDataAll = resp.data.template
                        resp.data.list.map(item => {
                            const last_login_time = item.last_login_time * 1000
                            item.last_login_time = this.$utils.toDateString(last_login_time,
                                'yyyy-MM-dd HH:mm:ss')
                        })
                        this.tableData = resp.data.list
                        this.tableData.forEach(item => {
                            if (item.xcx_id) {
                                item.xcx_id = item.xcx_id.split(',')
                            }
                        })
                        this.loading = false;
                    }
                });
            },
            search() {
                this.dataForm.p = 1
                this.dataForm.keyword = this.dataForm.keyword.trim()
                this.dataForm.keyword = this.dataForm.keyword.split(' ').join('')
                this.loadData()
            },
            // 换页响应
            currentChange(val) {
                this.tableData = [];
                this.dataForm.p = val;
                this.loadData();
            },
            // 添加/编辑
            edit(row) {
                if (row !== undefined) {
                    this.infoForm = Object.assign({}, row);
                } else {
                    this.infoForm = {
                        username:'',
                        mobile:'',
                        xcx_id:[],
                        password:'',
                        is_show: '1'
                    }
                }
                this.showDialog = true;
            },
            // 删除
            del(row) {
                this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.postRequest('ChannelNewUser/deleteNew', {
                        id: row.id,
                        aid:row.aid,
                    }).then(resp => {
                        if (resp && resp.code === 200) {
                            this.$message({
                                message: '删除成功',
                                type: 'success',
                                showClose: true,
                                duration: 1000,
                                onClose: function () {}
                            })
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
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    })
                })
            },
            // 编辑/添加确认事件
            subBtn() {
                console.log(this.infoForm);
                // if (!this.infoForm.mobile) {
                //     this.$message.warning('请输入手机号')
                //     return
                // }
                this.infoForm.username = this.infoForm.username ? this.infoForm.username.trim() : ''
                this.infoForm.password = this.infoForm.password ? this.infoForm.password.trim() : ''
                this.infoForm.mobile = this.infoForm.mobile ? this.infoForm.mobile.trim() : ''

                if (this.infoForm.mobile) {
                    if(!/^[1][3,4,5,6,7,8,9][0-9]{9}$/.test(this.infoForm.mobile)){
                        this.$message.warning('请正确格式的手机号')
                        return
                    }
                    if (this.infoForm.id == 0 || this.infoForm.id == undefined || this.infoForm.id == '') {
                        url = 'ChannelNewUser/addPostNew'
                        if (!this.infoForm.password) {
                            this.$message.warning('请输入密码')
                            return
                        }
                    }
                    if (this.infoForm.password) {
                        if(!/^(\d{6,14})$/.test(this.infoForm.password)){
                            this.$message.warning('请输入正确格式的密码(6-14位不包含空格和非数字字符)')
                            return
                        }
                    }
                    if (this.infoForm.password.indexOf(' ') != -1) {
                        this.$message.warning('密码包含空格')
                        return
                    }
                }else{
                    this.$message.warning('请输入手机号')
                    return
                }
                if (!this.infoForm.username) {
                    this.$message.warning('请填写渠道名称')
                    return
                }
                if (this.infoForm.username.indexOf(' ') != -1) {
                    this.$message.warning('渠道名称包含空格')
                    return
                }
                // if(!(/(^[1-9]\d*$)/.test(this.info.channel_id))){
                //   this.$message.warning('渠道ID应为正整数')
                //   return
                // }
                if (this.infoForm.xcx_id === undefined || this.infoForm.xcx_id.length == 0) {
                    this.$message.warning('请选择小程序')
                    return
                }
                this.addChanneloading = true
                let url = '';
                let xcxId = ''
                xcxId = String(this.infoForm.xcx_id)
                if (this.infoForm.id !== undefined) {
                    url = 'ChannelNewUser/editPostNew'
                } else {
                    this.infoForm.xcxAdzone = this.infoForm.username
                    url = 'ChannelNewUser/addPostNew'
                }
                this.postRequest(url, this.infoForm).then(resp => {
                    if (resp && resp.code === 200) {
                        this.addChanneloading = false
                        this.$message({
                            message: resp.msg,
                            type: 'success',
                            showClose: true,
                            duration: 1000
                        })
                        this.showDialog = false
                        this.loadData()
                    } else {
                        this.addChanneloading = false
                        this.$message({
                            message: resp.msg,
                            type: 'error',
                            showClose: true,
                            duration: 1000
                        })
                    }
                })
            },
            // 复制链接
            copy(item) {
                let obj = {}
                if (item.xcx_id) {
                    Object.keys(this.xcxList).forEach(element => {
                        item.xcx_id.forEach(e => {
                            if (element === e) {
                                obj[element] = this.xcxList[element]
                            }
                        });
                    });
                    this.copyList = obj
                } else {
                    this.copyList = this.xcxList
                }
                this.copyData.xcx_id = this.get_object_first_attribute(this.copyList)
                this.showCopyLinkDialog = true
                this.copyData.channel = item.id == undefined || null ? item.aid : item.id
            },
            get_object_first_attribute(data){
                for (var key in data)
                    return key;
            },
            // 复制链接
            copylink() {
                if (this.copyData.xcx_id == '' || this.copyData.channel == '') {
                    this.$message({
                        message: '请选择推广的小程序',
                        type: 'warning'
                    });
                    return 0
                }
                let text = '';
                let query = 'adzoneId%3d' + this.copyData.channel + '%26filter%3d1';

                if (this.copyData.type == '0') {
                    let page = 'pages%2findex%2findex'
                    if (this.copyData.xcx_id == 2021001167680229 || this.copyData.xcx_id == 2021002128612909 || this.copyData.xcx_id == 2021002133640088) {
                        page = 'pages%2fwalk%2fwalk'
                    }
                    text = 'alipays://platformapi/startApp?appId=' + this.copyData.xcx_id + '&page=' + page + '&query=' + query
                } else {
                    let path = 'appid%3d' + this.copyData.xcx_id + '%26path%3dpages%252findex%252findex';
                    if (this.copyData.xcx_id == 2021001167680229 || this.copyData.xcx_id == 2021002128612909 || this.copyData.xcx_id == 2021002133640088) {
                        path = 'appid%3d' + this.copyData.xcx_id + '%26path%3dpages%2fwalk%2fwalk';
                    }
                    let page = 'pages%2findex%2findex%3f' + path + '%26extra_data%3dadzoneId%253d' + this.copyData.channel + '%2526filter%253d1'
                    text = 'alipays://platformapi/startApp?appId=2021002129615691&page=' + page
                }
                if (text.indexOf('-') !== -1) {
                    let arr = text.split('-');
                    text = arr[0] + arr[1];
                }
                var textArea = document.createElement("textarea");
                textArea.style.position = 'fixed';
                textArea.style.top = '0';
                textArea.style.left = '0';
                textArea.style.width = '2em';
                textArea.style.height = '2em';
                textArea.style.padding = '0';
                textArea.style.border = 'none';
                textArea.style.outline = 'none';
                textArea.style.boxShadow = 'none';
                textArea.style.background = 'transparent';
                textArea.value = text;
                document.body.appendChild(textArea);
                textArea.select();
                try {
                    var successful = document.execCommand('copy');
                    this.copyData.isCopy = true;
                    setTimeout(() => {
                        this.copyData.isCopy = false;
                    }, 1500)
                } catch (err) {
                    alert('该浏览器不支持点击复制到剪贴板');
                }
                document.body.removeChild(textArea);

            },
            //跳转操作
            linkto(row) {
                let link =
                    `http://ftchannel.${document.domain.split('.').slice(-2).join('.')}/Login/adminClickLogin?devdebug=699&uid=${row.aid}`
                window.open(link)
            },
        },
        computed: {
            xcxList() {
                return this.$store.state.base.xcxList
            }
        },
        mounted() {
            this.loadData();
        }
    };

</script>

<style lang='scss' scoped>
    .iscopy {
        background: #45DDB5;
        border-color: #45DDB5;
    }

</style>
