<!--
 * @Descripttion: 主播黑名单
 * @version: 1.0
 * @Author: WangChuan
 * @Date: 2021-01-19 15:54:20
 * @LastEditors: LiXinRui
 * @LastEditTime: 2021-01-20 15:30:17
-->
<template>
    <div>
        <div class="topBox">
            <el-form :inline="true" :model="dataForm" ref="dataForm" class="demo-form-inline" style="display:flex;justify-content: space-between;align-items: center;">
                <div class="el-form-item-left">
                    <el-form-item>
                        <el-button size="medium" @click="addInfo()" type="primary" icon="el-icon-plus" class="my-blue-btn">新增主播</el-button>
                    </el-form-item>
                </div>
                <div class="el-form-item-right">
                    <el-form-item style="width:150px;">
                        <el-input size="medium" @paste.native="discernFun" placeholder="请输入内容搜索" v-model="dataForm.keyword" @change="submitForm()" class="input-search-btn" clearable>
                            <el-button @click="submitForm()" slot="append" icon="el-icon-search"></el-button>
                        </el-input>
                    </el-form-item>
                    <!-- <el-form-item prop="keyword">
                        <el-input
                            @paste.native="discernFun"
                            v-model="discern"
                            autocomplete="off"
                            placeholder="粘贴直播间地址搜索对应主播"
                            clearable
                        />
                    </el-form-item> -->
                    <el-form-item>
                        <!-- <el-button class="my-def-btn" icon="el-icon-delete" @click="resetForm('dataForm')">重置</el-button> -->
                    </el-form-item>
                </div>
            </el-form>
        </div>
        <div class="table_box">
            <fix-table
                class="my-table"
                header-row-class-name="my-table-header"
                v-loading="loading"
                element-loading-text="拼命加载中"
                element-loading-spinner="el-icon-loading"
                :data="tableData"
                key="list"
                height="70vh"
                border
                size="small"
                style="width: 100%"
                @sort-change="sortChange"
                :default-sort="{prop: 'create_time', order: 'descending'}"
            >
                <el-table-column prop="id" label="ID" align="center" width="120"/>
                <el-table-column prop="anchor_name" label="直播间名称" align="center"/>
                <el-table-column prop="anchor_id" label="直播间Id" align="center" width=""/>
                <el-table-column prop="create_time" label="添加时间" align="center"/>
                <el-table-column fixed="right" label="操作" width="150" align="center">
                    <template slot-scope="scope">
                        <el-button @click="editData(scope.row)" type="text" size="small">编辑</el-button>
                        <el-button @click="delData(scope.row)" type="text" size="small">删除</el-button>
                        </template>
                </el-table-column>
            </fix-table>
        </div>
        <div class="pages">
            <el-pagination
                @current-change="handleCurrentChange"
                layout="total, prev, pager, next"
                :page-size="dataForm.size"
                :current-page="dataForm.p"
                :total="totalNum"
            />
        </div>
        <el-dialog title="新增/编辑" :visible.sync="dialogVisible" width="400px" custom-class="my-dialog" :append-to-body="true"
            :close-on-press-escape="false">
            <el-form :model="infoForm" size="medium">
                <el-row :gutter="20" type="flex">
                <el-col :span="24">
                    <el-form-item label="直播间名称" label-width="100px">
                    <el-input
                        v-model="infoForm.anchor_name"
                        autocomplete="off"
                        placeholder="请填写直播间名称"
                        clearable
                    />
                    </el-form-item>
                    <el-form-item label="直播间Id" label-width="100px">
                    <el-input
                        @paste.native="paste"
                        v-model="infoForm.anchor_id"
                        autocomplete="off"
                        placeholder="请填写直播间Id或复制链接"
                        clearable
                    />
                    </el-form-item>
                </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editSub()">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    export default {
        name: "taskLiveBlackList",
        data() {
            return {
                // 表格数据总量
                totalNum: 0,
                dataForm: {
                p: 1,
                size: 18,
                sortType: "",
                sortField: "",
                },
                loading: true,
                tableData: [],
                dialogVisible: false,
                infoDef: {
                id: '',
                anchor_name: '',
                anchor_id: '',
                // status: 1,
                },
                infoForm: {},
                dialogMoneyVisible: false,
                moneyInfo: {
                uid: 0,
                user_name: '',
                money: '',
                remarks: ''
                },
                discern: ''
            };
        },
        methods: {
            sortChange(e) {
                this.dataForm.sortType = e.order;
                this.dataForm.sortField = e.prop;
                this.loadData();
            },
            // 重置表单
            resetForm(formName) {
                this.dataForm.p = 1;
                this.$refs[formName].resetFields();
                this.loadData()
            },
            // 提交表单
            submitForm: function () {
                this.tableData = [];
                this.dataForm.p = 1;
                this.loadData()
            },
            // 换页响应
            handleCurrentChange(val) {
                this.tableData = [];
                this.dataForm.p = val;
                this.loadData()
            },
            // 请求数据
            loadData() {
                this.loading = true;
                this.getRequest('/BlackAnchor/getList', this.dataForm).then(resp => {
                    this.loading = false;
                    if (resp && resp.code === 200) {
                        this.totalNum = resp.data.total
                        resp.data.list.map(item => {
                            const create_time = item.create_time * 1000
                            item.create_time = this.$utils.toDateString(
                                create_time,
                                'yyyy-MM-dd HH:mm'
                            )
                            const deduction_time = item.deduction_time * 1000
                            item.deduction_time = this.$utils.toDateString(
                                deduction_time,
                                'yyyy-MM-dd HH:mm'
                            )
                        })
                        this.tableData = resp.data.list
                    }
                })
            },
            //添加主播
            addInfo() {
                this.infoForm = Object.assign({}, this.infoDef);
                this.dialogVisible = true;
            },
            //修改主播
            editData(row) {
                this.infoForm = Object.assign({}, this.infoDef);
                this.infoForm.id = row.id;
                this.infoForm.anchor_name = row.anchor_name;
                this.infoForm.anchor_id = row.anchor_id;
                // this.infoForm.status = row.status;
                this.dialogVisible = true;
            },
            //修改或添加执行
            editSub() {
                if(!this.infoForm.anchor_name){
                    this.$message.warning("请输入直播间名称")
                    return
                }
                if(!this.infoForm.anchor_id){
                    this.$message.warning("请输入直播间ID")
                    return
                }
                this.dialogVisible = false;
                this.postRequest('/BlackAnchor/postAdd', this.infoForm).then(resp => {
                    if (resp && resp.code === 200) {
                        this.$message({
                            message: resp.msg,
                            type: 'success',
                            showClose: true,
                            duration: 1000,
                            onClose: () => {
                                this.dialogVisible = false;
                                // this.loadData();
                            },
                        })
                        this.loadData();
                        this.$emit('success', this.infoForm)
                    } else {
                        this.dialogVisible = true;
                        this.$message({
                            message: resp.msg,
                            type: 'warning',
                            showClose: true,
                            duration: 1000,
                        })
                    }
                })
            },
            //删除
            delData(row) {
                this.$confirm('确认删除这条数据？').then(_ => {
                    this.postRequest('/BlackAnchor/delete', {id:row.id}).then(resp => {
                        if (resp && resp.code === 200) {
                            this.$message({
                                message: resp.msg,
                                type: 'success',
                                showClose: true,
                                duration: 1000,
                                onClose: () => {
                                    // this.loadData();
                                },
                            })
                            this.loadData();
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
                }).catch(_ => {});
            },
            //复制粘贴链接时自动获取id
            paste(e) {
                let str = e.clipboardData.getData('text').trim()
                e.preventDefault()
                e.stopPropagation();
                if(str.indexOf('userId%25253D') !== -1){
                    str = decodeURIComponent(decodeURIComponent(decodeURIComponent(str)))
                }else if(str.indexOf('userId%253D') !== -1){
                    str = decodeURIComponent(decodeURIComponent(str))
                }else if(str.indexOf('userId%3D') !== -1){
                    str = decodeURIComponent(str)
                }
                if(str.indexOf('userId=') !== -1){
                    let num = 0
                    for (let i = str.indexOf('userId=') + 7; i < str.length; i++) {
                        if(!isNaN(str.charAt(i))){
                            num = i
                        }else{
                            break;
                        }
                        
                    }
                    str = str.substring(str.indexOf('userId=') + 7,num+1)
                }else{
                    this.$message('无法自动识别直播间ID')
                }
                this.$set(this.infoForm, 'anchor_id', str)
            },
            discernFun(e){
                let str = e.clipboardData.getData('text').trim()
                let couldChange = false;
                e.preventDefault()
                e.stopPropagation();
                if(str.indexOf('userId%25253D') !== -1){
                    str = decodeURIComponent(decodeURIComponent(decodeURIComponent(str)))
                }else if(str.indexOf('userId%253D') !== -1){
                    str = decodeURIComponent(decodeURIComponent(str))
                }else if(str.indexOf('userId%3D') !== -1){
                    str = decodeURIComponent(str)
                }
                if(str.indexOf('userId=') !== -1){
                    let num = 0
                    for (let i = str.indexOf('userId=') + 7; i < str.length; i++) {
                        if(!isNaN(str.charAt(i))){
                            num = i
                        }else{
                            break;
                        }
                        
                    }
                    str = str.substring(str.indexOf('userId=') + 7,num+1)
                    couldChange = true;
                }else{
                    couldChange = true;
                    // this.$message('无法自动识别直播间ID')
                }
                // this.discern = str
                couldChange == true ? (this.$set(this.dataForm, 'keyword', str)) && (couldChange = false) : '';
            }
        },
        computed: {},
        mounted() {
            this.loadData()
            let breadCrumb = [{
                name: '纷推投放管理',
                path: '/taskFtList',
            }];
            this.$store.commit("setBreadCrumb", breadCrumb);
        },
        destroyed() {
            this.$store.commit("setBreadCrumb", []);
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
    .table_box >>> .el-table__fixed-right-patch{
        background-color: #EFF5FF !important;
    }
    .el-form-item-right >>> .el-form-item__content{
        line-height: inherit;
    }
    .el-form--inline .el-form-item{
        margin-right: 0px;
    }
</style>
