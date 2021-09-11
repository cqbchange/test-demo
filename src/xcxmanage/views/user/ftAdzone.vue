<!--
 * @Descripttion: 纷推渠道
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
                <el-form-item>
                    <el-button type="primary" icon="el-icon-plus" class="my-blue-btn" @click="edit()" size="medium">
                        添加渠道商
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
            <el-table-column prop="id" label="UID" align="center" />
            <el-table-column prop="name" label="渠道商名" align="center" />
            <el-table-column prop="mobile" label="登录电话" align="center">
                <template slot-scope="scope">
                    <span @click="linkto(scope.row)" style="cursor: pointer;color: #0026ff">{{scope.row.mobile}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="count" label="渠道数" align="center" />
            <el-table-column prop="cpc_money" label="单价" align="center">
                <template slot-scope="scope">
                    <span>{{scope.row.cpc_money}}</span>
                    <!-- <i style="margin-left:2px;cursor:pointer;" @click="editRate(scope.row)" class="el-icon-edit"></i> -->
                </template>
                
            </el-table-column>
            <el-table-column prop="last_login_time" label="最后登录时间" align="center" />
            <el-table-column fixed="right" label="操作" align="center">
                <template slot-scope="scope">
                    <el-button @click="edit(scope.row)" type="text" size="medium">编辑</el-button>
                    <el-button @click="editZone(scope.row)" type="text" size="medium">编辑渠道</el-button>
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
                        <el-form-item label="渠道商名：" label-width="100px">
                            <el-input maxlength="12" v-model="infoForm.name" autocomplete="off" placeholder="请填写渠道商名" clearable
                                size="medium" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="接入方式：" label-width="100px">
                            <el-checkbox @change="dataTypeChoose()" v-model="infoForm.plug_access" :true-label="'1'" :false-label="'0'">插件接入</el-checkbox>
                            <el-checkbox @change="dataTypeChoose()" v-model="infoForm.api_access" :true-label="'1'" :false-label="'0'">API接入</el-checkbox>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20" type="flex">
                    <el-col :span="12">
                        <el-form-item label="手机号：" label-width="100px">
                            <el-input maxlength="11" v-model="infoForm.mobile" autocomplete="off" placeholder="请填写手机号" clearable
                                size="medium" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="登录密码：" label-width="100px">
                            <el-input type="password" maxlength="14" v-model="infoForm.password" autocomplete="off" placeholder="请输入6-14位不含空格密码"
                                clearable size="medium" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20" type="flex">
                    <el-col :span="12" v-if="infoForm.api_access == 1">
                        <el-form-item label="单价：" label-width="100px">
                            <el-input maxlength="14" v-model="infoForm.cpc_money" autocomplete="off" placeholder="请输入单价"
                                clearable size="medium" />
                        </el-form-item>
                    </el-col>
                    <!-- <el-col :span="12" v-if="infoForm.api_access == 1">
                        <el-form-item label="API奖励：" label-width="100px">
                            <el-radio v-model="infoForm.reward_type_api" label="0">关</el-radio>
                            <el-radio v-model="infoForm.reward_type_api" label="4">集分宝</el-radio>
                        </el-form-item>
                    </el-col> -->
                    <el-col :span="12" v-if="infoForm.plug_access == 1">
                        <el-form-item label="插件奖励：" label-width="100px">
                            <el-radio v-model="infoForm.reward_type" label="0">关</el-radio>
                            <!-- <el-radio v-model="infoForm.reward_type" label="4">集分宝</el-radio> -->
                            <el-radio v-model="infoForm.reward_type" label="1">开</el-radio>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" v-if="infoForm.plug_access == 1">
                        <el-form-item label="小程序跳转单价：" label-width="140px">
                            <el-input maxlength="14" v-model="infoForm.reward_type_json.xcx" autocomplete="off" placeholder="请输入单价"
                                clearable size="medium" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" v-if="infoForm.plug_access == 1">
                        <el-form-item label="云码单价：" label-width="100px">
                            <el-input maxlength="14" v-model="infoForm.reward_type_json.yunma_task_id" autocomplete="off" placeholder="请输入单价"
                                clearable size="medium" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" v-if="infoForm.plug_access == 1">
                        <el-form-item label="直播单价：" label-width="100px">
                            <el-input maxlength="14" v-model="infoForm.reward_type_json.anchor_id" autocomplete="off" placeholder="请输入单价"
                                clearable size="medium" />
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button :loading='addChanneloading' type="primary" class="my-blue-btn" @click="subBtn" size="medium">确 定</el-button>
                <el-button @click="showDialog = false" size="medium">取 消</el-button>
            </div>
        </el-dialog>
        <el-dialog :title="zoneName" :visible.sync="showZoneDialog" custom-class="my-dialog" width="60%" :append-to-body="true"
            :close-on-press-escape="false">
            <el-button size="small" style="margin:0 0 17px 0" type="primary" @click="addZoneList()">添加渠道</el-button>
            <fix-table ref="table1" border v-loading="loadingZone" element-loading-spinner="el-icon-loading"
                element-loading-text="拼命加载中" :data="tableDataZone" key="list" max-height="350px" size="medium"
                header-row-class-name="my-table-header" class="my-table my-table1">
                <el-table-column prop="name" label="渠道商名" align="center">
                    <template slot-scope="scope">
                        <span v-if="scope.row.showInput">{{ scope.row.name }}</span>
                        <el-input maxlength="8" v-else size="small" style="width:150px" v-model="scope.row.name"  autocomplete="off" placeholder="请输入渠道商名" :clearable="true"/>
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="APPID" align="center">
                    <template slot-scope="scope">
                        <span v-if="scope.row.showInput">{{ scope.row.appid }}</span>
                        <el-input maxlength="16" v-else size="small" style="width:150px" v-model="scope.row.appid"  autocomplete="off" placeholder="请输入APPID" :clearable="true"/>
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="回调地址" align="center">
                    <template slot-scope="scope">
                        <span v-if="scope.row.showInput">{{ scope.row.callback_url }}</span>
                        <el-input v-else size="small" style="width:150px" v-model="scope.row.callback_url"  autocomplete="off" placeholder="请输入回调地址" :clearable="true"/>
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="接入方式" align="center" v-if="item_type_list.length > 1">
                    <template slot-scope="scope">
                        <span v-if="scope.row.showInput">{{ scope.row.access_type_text }}</span>
                        <el-select v-else size="small" v-model="scope.row.access_type" placeholder="请选择接入方式">
                            <el-option
                                v-for="(item,index) in item_type_list"
                                :key="index"
                                :label="item.name"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column prop="reward_type" label="奖励类型" align="center" v-if="openPrice == 1">
                    <template slot-scope="scope">
                        <span v-if="scope.row.showInput">{{ scope.row.reward_type == 0 ? '集分宝' : '现金' }}</span>
                        <el-select v-else size="small" v-model="scope.row.reward_type" placeholder="请选择奖励类型">
                            <el-option
                                label="集分宝"
                                :value="'0'">
                            </el-option>
                            <el-option
                                label="现金"
                                :value="'1'">
                            </el-option>
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column prop="secret" label="密钥" align="center"></el-table-column>
                <el-table-column fixed="right" label="操作" align="center">
                    <template slot-scope="scope">
                        <div v-if="scope.row.showInput">
                            <el-button @click="editZoneDetil(scope.row)" type="text" size="medium">编辑</el-button>
                            <el-button @click="deleteZone(scope.row)" type="text" size="medium">删除</el-button>
                        </div>
                        <div v-else>
                            <el-button style="margin:0 0 0 0px" type="text" @click="confirm(scope.row)">确定</el-button>
                            <el-button style="margin:0 0 0 10px;color:#888" type="text" @click="cancel(scope.row)">取消</el-button>
                        </div>
                    </template>
                </el-table-column>
            </fix-table>
        </el-dialog>
    </div>
</template>
<script>
    export default { 
        name: "userAdzone",
        data() {
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
                showZoneDialog: false,
                // 编辑数据
                infoForm: {
                    name: '',
                    mobile: '',
                    password: '',
                    cpc_money: '',
                    reward_type_json:{
                        xcx:'',
                        yunma_task_id:'',
                        anchor_id:'',
                    },
                    plug_access:'0',
                    api_access:'0',
                },
                isUpdatePrice:false,//修改单价弹窗显示
                adzone_id:0,//修改哪一个
                addChanneloading:false,
                loadingZone: false,
                tableDataZone: [],
                zoneName: '渠道名称',
                userId: '',
                data_type:'1',//接入方式
                item_type_list:[],//渠道商的接入方式列表
                openPrice:'',//渠道商是否开启了奖励
            };
        },
        methods: {
            //接入方式选择
            dataTypeChoose(){
                
            },
            // 获取Table数据
            loadData() {
                this.loading = true;
                this.getRequest("ChannelUserFenTui/getList", this.dataForm).then(resp => {
                    if (resp && resp.code === 200) {
                        this.dataForm.totalNum = resp.data.total;
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
            // 添加/编辑
            edit(row) {
                if (row !== undefined) {
                    this.infoForm = Object.assign({}, row);
                    this.infoForm.reward_type_json == '' ? this.infoForm.reward_type_json = {
                        xcx:'',
                        yunma_task_id:'',
                        anchor_id:'',
                    } : this.infoForm.reward_type_json = JSON.parse(this.infoForm.reward_type_json)
                    this.infoForm.reward_type_json.xcx == 0 ? this.infoForm.reward_type_json.xcx = '' :''
                    this.infoForm.reward_type_json.yunma_task_id == 0 ? this.infoForm.reward_type_json.yunma_task_id = '' :''
                    this.infoForm.reward_type_json.anchor_id == 0 ? this.infoForm.reward_type_json.anchor_id = '' :''
                    this.infoForm.cpc_money == 0 ? this.infoForm.cpc_money = '' :''
                } else {
                    this.infoForm = {
                        name: '',
                        mobile: '',
                        password: '',
                        cpc_money: '',
                        reward_type_json:{
                            xcx:'',
                            yunma_task_id:'',
                            anchor_id:'',
                        },
                        plug_access:'1',
                        api_access:'0',
                        reward_type:'1',
                        // reward_type_api:'0',
                    }
                }
                this.showDialog = true;
            },

            editZone(row){
                this.showZoneDialog = true
                this.userId = row.id
                this.zoneName = row.name
                this.tableDataZone = []//清空
                this.openPrice = row.reward_type
                this.loadingZone = true
                this.getDataType(row.id)
            },
            getDataType(uid){
                this.getRequest("ChannelUserFenTui/getAccessType", {uid: uid}).then(res => {
                    if(res.code == 200){
                        this.item_type_list = res.data
                        this.zoneDeatil()
                    }else{
                        this.loadingZone = false
                        this.$message.error(res.msg)
                    }
                });
            },
            zoneDeatil(){
                
                this.getRequest("ChannelUserFenTui/getChannel", {userId: this.userId}).then(res => {
                    if(res.code == 200){
                        res.data.forEach((ele,index) => {
                            ele.showInput = true;
                            ele.oldname = ele.name;
                            ele.oldappid = ele.appid;
                            ele.oldcallback_url = ele.callback_url
                            ele.oldaccess_type = ele.access_type
                            ele.oldreward_type = ele.reward_type
                            ele.access_type_text = ele.access_type == 0 ? '设置接入方式(老数据)' : '重新设置接入方式(渠道商接入方式已更改)'

                            this.item_type_list.forEach((item,inx)=>{
                                if (item.id == ele.access_type) {
                                    ele.access_type_text = item.name
                                }
                            })
                        });
                        
                        this.tableDataZone = res.data
                    }else{
                        this.$message.warning(res.msg)
                    }
                    
                    this.loadingZone = false
                });
            },
            // 编辑/添加确认事件
            subBtn() {
                // let urlData = Object.assign({}, this.infoForm)
                let urlData = JSON.parse(JSON.stringify(this.infoForm))
                urlData.name = urlData.name ? urlData.name.trim() : ''
                urlData.password = urlData.password ? urlData.password.trim() : ''
                urlData.mobile = urlData.mobile ? urlData.mobile.trim() : ''
                urlData.cpc_money = urlData.cpc_money ? urlData.cpc_money.trim() : ''
                urlData.reward_type_json.xcx = urlData.reward_type_json.xcx ? urlData.reward_type_json.xcx.trim() : ''
                urlData.reward_type_json.yunma_task_id = urlData.reward_type_json.yunma_task_id ? urlData.reward_type_json.yunma_task_id.trim() : ''
                urlData.reward_type_json.anchor_id = urlData.reward_type_json.anchor_id ? urlData.reward_type_json.anchor_id.trim() : ''

                if (!urlData.name) {
                    this.$message.warning('请填写渠道商名称')
                    return
                }
                if (urlData.name.indexOf(' ') != -1) {
                    this.$message.warning('渠道商名称包含空格')
                    return
                }
                if (!urlData.cpc_money && this.infoForm.api_access == 1) {
                    this.$message.warning('请填写单价')
                    return
                }
                if((isNaN(urlData.cpc_money) && urlData.api_access == 1) || (Number(urlData.cpc_money)<=0 && urlData.api_access == 1)){
                  this.$message.warning('单价不正确')
                  return
                }
                // this.infoForm.plug_access == 0 ? this.infoForm.cpc_money = 0 : ''
                if (urlData.mobile) {
                    if(!/^[1][3,4,5,6,7,8,9][0-9]{9}$/.test(urlData.mobile)){
                        this.$message.warning('请正确格式的手机号')
                        return
                    }
                    if (urlData.id == 0 || urlData.id == undefined || urlData.id == '') {
                        url = 'ChannelNewUser/addPostNew'
                        if (!urlData.password) {
                            this.$message.warning('请输入密码')
                            return
                        }
                    }
                    if (urlData.password) {
                        if(!/^(\d{6,14})$/.test(urlData.password)){
                            this.$message.warning('请输入正确格式的密码(6-14位不包含空格和非数字字符)')
                            return
                        }
                    }
                    if (urlData.password.indexOf(' ') != -1) {
                        this.$message.warning('密码包含空格')
                        return
                    }
                }else{
                    this.$message.warning('请输入手机号')
                    return
                }
                

                //API单价为空转为0
                if(urlData.plug_access == 0){
                    // urlData.reward_type_json.xcx = 0 
                    // urlData.reward_type_json.yunma_task_id = 0
                    // urlData.reward_type_json.anchor_id = 0
                    urlData.reward_type == 0 ? '' : urlData.reward_type = 0
                }else{
                    if(urlData.reward_type_json.xcx == '' || urlData.reward_type_json.yunma_task_id == '' || urlData.reward_type_json.anchor_id == ''){
                        this.$message.warning('插件引入相关单价不可为空')
                        return
                    }else if(urlData.reward_type_json.xcx == 0 || urlData.reward_type_json.yunma_task_id == 0 || urlData.reward_type_json.anchor_id == 0){
                        this.$message.warning('插件引入相关单价不可为0')
                        return
                    }
                }
                if(urlData.api_access == 0){
                    urlData.cpc_money = 0
                    // urlData.reward_type_api == 0 ? '' : urlData.reward_type_api = 0
                }else{
                    urlData.cpc_money == '' ? urlData.cpc_money = 0 : ''
                }
                urlData.reward_type_json = JSON.stringify(urlData.reward_type_json)
                this.addChanneloading = true
                let url = '';
                if (urlData.id !== undefined) {
                    url = 'ChannelUserFenTui/editPostNew'
                } else {
                    urlData.xcxAdzone = urlData.name
                    url = 'ChannelUserFenTui/addPostNew'
                }
                this.postRequest(url, urlData).then(resp => {
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
            //跳转操作
            linkto(row) {
                let link =
                    `http://channelfentui.${document.domain.split('.').slice(-2).join('.')}/Login/adminClickLogin?devdebug=699&uid=${row.id}`
                window.open(link)
            },
            addZoneList(){
                if(this.tableDataZone.some(element => {
                    return element.showInput == false
                })){
                    return
                }
                let item = {
                    name:'',
                    appid: '',
                    callback_url:'',
                    access_type:this.item_type_list.length > 1 ? '' : this.item_type_list[0].id,
                    reward_type:'0',
                }
                let item2 = item
                item2.showInput = false
                item2.id = ''
                item2.isnew = true
                this.tableDataZone.push(item2)
                this.$nextTick(() => {
                    let container = this.$refs.table1.$el.children[2];
                    container.scrollTop = container.scrollHeight;
                })

            },
            // 删除
            deleteZone(row) {
                this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.postRequest('ChannelUserFenTui/deleteChannel', {
                        id: row.id,
                    }).then(resp => {
                        if (resp && resp.code === 200) {
                            this.$message({
                                message: resp.msg,
                                type: 'success',
                                showClose: true,
                                duration: 1000,
                                onClose: function () {}
                            })
                            this.loadingZone = true
                            this.getDataType(this.userId)
                            // this.zoneDeatil()
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
            editZoneDetil(row){
                if(this.tableDataZone.some(element => {
                    return element.id == '' && element.showInput == false
                })){
                    this.tableDataZone.splice(this.tableDataZone.length-1,1)
                }
                this.tableDataZone.map(element => {
                    element.showInput = true
                    element.name = element.oldname
                    element.appid = element.oldappid;
                    element.callback_url = element.oldcallback_url;
                    element.access_type = element.oldaccess_type;
                    element.reward_type = element.oldreward_type
                })
                row.showInput = false
            },
            confirm(row){
                if (!row.name) {
                    this.$message.warning('请填写渠道名')
                    return
                }
                if(!(/(^[1-9]\d*$)/.test(row.appid))){
                  this.$message.warning('appid应为正整数')
                  return
                }
                if (!row.callback_url) {
                    this.$message.warning('请填写回调地址')
                    return
                }
                let typeArr = this.item_type_list.filter((item)=>{
                    return item.id == row.access_type
                })
                if (typeArr.length == 0) {
                    this.$message.warning('请重新选择接入方式')
                    return
                }
                if(row.isnew){
                    this.postRequest('ChannelUserFenTui/addChannel',{
                        owner_id: this.userId,
                        name: row.name,
                        appid: row.appid,
                        callback_url: row.callback_url,
                        access_type:row.access_type,
                        reward_type:row.reward_type,
                    }).then((res)=>{
                        if(res.code == 200){
                            // this.loading = false
                            this.$message.success(res.msg)
                            row.showInput = true
                            delete row.isnew
                            row.oldname = row.name
                            row.oldappid = row.appid;
                            row.oldcallback_url = row.callback_url;
                            row.oldaccess_type = row.access_type;
                            row.oldreward_type = row.reward_type

                            this.loadingZone = true

                            this.getDataType(this.userId)

                            // this.zoneDeatil()
                            this.loadData()
                        }else{
                            this.$message.warning(res.msg)
                        }
                    })
                }else{
                    this.postRequest('ChannelUserFenTui/editChannel',{
                        name:row.name,
                        owner_id: this.userId,
                        appid:row.appid,
                        callback_url: row.callback_url,
                        id:row.id,
                        reward_type:row.reward_type,
                        access_type:row.access_type
                    }).then((res)=>{
                        if(res.code == 200){
                            this.$message.success(res.msg)
                            row.showInput = true
                            row.oldname = row.name
                            row.oldappid = row.appid;
                            row.oldcallback_url = row.callback_url;
                            row.oldaccess_type = row.access_type;
                            row.oldreward_type = row.reward_type

                            this.zoneDeatil()
                            this.loadData()
                        }else{
                            this.$message.warning(res.msg)
                        }
                    })
                }
            },
            cancel(row){
                row.showInput = true
                if(row.isnew){
                    if(this.tableDataZone.some(element => {
                        return element.id == ''
                    })){
                        this.tableDataZone.splice(this.tableDataZone.length-1,1)
                    }
                }else{
                    row.name = row.oldname
                    row.appid = row.oldappid;
                    row.callback_url = row.oldcallback_url;
                    row.access_type = row.oldaccess_type;
                    row.reward_type = row.oldreward_type
                }
            },
        },
        computed: {
            xcxList() {
                return this.$store.state.base.xcxList
            }
        },
        mounted() {
            this.loadData();
        },
        watch:{
            "infoForm.password":{
                handler(val) {
                    this.infoForm.password = this.infoForm.password ? this.infoForm.password.myReplace(' ', '') : ''
                }
            },
            "infoForm.cpc_money":{
                handler(val) {
                    this.infoForm.cpc_money = isNaN(Number(val))? '' : val.match(/^\d*(\.?\d{0,3})/g)[0]
                }
            },
            "infoForm.plug_access":{
                handler(val) {
                    if (val == 0) {
                        // this.infoForm.api_access == 0 ? (this.$message.warning('接入方式至少选择一个')) && (this.infoForm.plug_access = '1') : this.infoForm.reward_type_json = {
                        //     xcx:'',
                        //     yunma_task_id:'',
                        //     anchor_id:'',
                        // }
                         this.infoForm.api_access == 0 ? (this.$message.warning('接入方式至少选择一个')) && (this.infoForm.plug_access = '1') : ''
                    }
                }
            },
            "infoForm.api_access":{
                handler(val) {
                    if (val == 0) {
                        // this.infoForm.plug_access == 0 ? (this.$message.warning('接入方式至少选择一个')) && (this.infoForm.api_access = '1') : this.infoForm.cpc_money = ''
                        this.infoForm.plug_access == 0 ? (this.$message.warning('接入方式至少选择一个')) && (this.infoForm.api_access = '1') : ''
                    }
                }
            },
            "infoForm.reward_type_json.xcx":{
                handler(val) {
                    if (val == undefined) {
                        return
                    }
                    this.infoForm.reward_type_json.xcx = isNaN(Number(val))? '' : typeof(val) == 'string' ? val.match(/^\d*(\.?\d{0,3})/g)[0] : String(val).match(/^\d*(\.?\d{0,3})/g)[0]
                }
            },
            "infoForm.reward_type_json.yunma_task_id":{
                handler(val) {
                    if (val == undefined) {
                        return
                    }
                    this.infoForm.reward_type_json.yunma_task_id = isNaN(Number(val))? '' : typeof(val) == 'string' ? val.match(/^\d*(\.?\d{0,3})/g)[0] : String(val).match(/^\d*(\.?\d{0,3})/g)[0]
                }
            },
            "infoForm.reward_type_json.anchor_id":{
                handler(val) {
                    if (val == undefined) {
                        return
                    }
                    this.infoForm.reward_type_json.anchor_id = isNaN(Number(val))? '' : typeof(val) == 'string' ? val.match(/^\d*(\.?\d{0,3})/g)[0] : String(val).match(/^\d*(\.?\d{0,3})/g)[0]
                }
            },
        }
    };

</script>

<style lang='scss' scoped>
    .iscopy {
        background: #45DDB5;
        border-color: #45DDB5;
    }
    .delete{
        position: absolute;
        top: 10px;
        right: -30px;
    }
</style>
