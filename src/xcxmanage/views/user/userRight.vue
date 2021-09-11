<!--
 * @Descripttion: 账户权限管理
 * @version: 1.0
 * @Author: LiXinRui
 * @Date: 2021-06-30 17:38:00
 * @LastEditors: WangChuan
 * @LastEditTime: 2021-06-30 17:38:00
-->
<template>
    <div>
        <div class="topBox">
            <el-form style="display:flex;justify-content: space-between;" :inline="true" :model="dataForm" ref="dataForm" class="demo-form-inline">
                <el-form-item>
                    <el-button  size="medium" type="primary" class="my-blue-btn" icon="el-icon-plus" @click="addInfo()">添加账户权限</el-button>
                </el-form-item>
                <div class="el-form-item-right">
                    <el-form-item prop="keyword" style="width:200px;">
                        <el-input size="medium" :disabled="dataready" placeholder="请输入内容搜索" v-model="dataForm.keyword" @change="submitForm()" class="input-search-btn" clearable>
                            <el-button :disabled="dataready" @click="submitForm()" slot="append" icon="el-icon-search"></el-button>
                        </el-input>
                    </el-form-item>
                </div>
            </el-form>
            </div>
            <div class="table_box">
                <fix-table v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" :data="tableData.slice((dataForm.p-1)*dataForm.size,dataForm.p*dataForm.size)"
                height="70.7vh" border size="small" style="width: 100%"
                header-row-class-name="my-table-header" class="my-table">
                    <el-table-column prop="uid" label="UID" align="center" >
                        <template slot-scope="scope">
                            <span v-if="!scope.row.isEdit">{{scope.row.uid}}</span>
                            <el-input v-else v-model="scope.row.uid" size="small" style="width:170px;" autocomplete="off" placeholder="请填写UID" clearable />
                        </template>
                    </el-table-column>
                    <el-table-column prop="name" label="账户名称" align="center" >
                        <template slot-scope="scope">
                            <span v-if="!scope.row.isEdit">{{scope.row.name}}</span>
                            <el-input v-else v-model="scope.row.name" size="small" style="width:170px;" autocomplete="off" placeholder="请填写账户名称" clearable />
                        </template>
                    </el-table-column>
                    <el-table-column prop="type" label="账户类型" align="center" >
                        <template slot-scope="scope">
                            <span v-if="!scope.row.isEdit">{{scope.row.type == 0 ? '开发人员':'销售人员'}}</span>
                            <el-select v-else v-model="scope.row.type" size="small"
                                placeholder="请选择账户类型" filterable>
                                <el-option label="开发人员" :value="0" />
                                <el-option label="销售人员" :value="1" />
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column fixed="right" label="操作" align="center">
                        <template slot-scope="scope">
                            <el-button v-if="!scope.row.isEdit" @click="editData(scope.row)" type="text" size="small">编辑</el-button>
                            <el-button v-if="!scope.row.isEdit" @click="delItem(scope.row)" style="color:#f56c6c" type="text" size="small">删除</el-button>
                            <el-button v-if="scope.row.isEdit" @click="confirm(scope.row)" type="text" size="small">确定</el-button>
                            <el-button v-if="scope.row.isEdit" @click="cancel(scope.row)" style="color:#909399" type="text" size="small">取消</el-button>
                        </template>
                    </el-table-column>
                </fix-table>
            </div>
        <div class="pages">
            <el-pagination @current-change="handleCurrentChange" layout="total, prev, pager, next" :page-size="dataForm.size"
                :current-page="dataForm.p" :total="totalNum" />
        </div>
        <el-dialog title="添加/新增账户权限" :visible.sync="dialogVisible" width="42%" custom-class="my-dialog" :append-to-body="true"
            :close-on-press-escape="false">
            <div class="dialog_box">
                <el-form :model="infoForm" size="medium" :rules="rules" ref="ruleForm">
                    <el-row :gutter="20" type="flex">
                        <el-col :span="12">
                            <el-form-item label="UID：" label-width="100px" prop="uid">
                                <el-input v-model="infoForm.uid" autocomplete="off" placeholder="请填写UID" clearable />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="账户名称：" label-width="100px" prop="name">
                                <el-input v-model="infoForm.name" autocomplete="off" placeholder="请填写账号" clearable />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="账户类型：" label-width="100px">
                                <el-select v-model="infoForm.type" size="medium"
                                    placeholder="请选择账户类型" filterable>
                                    <el-option label="开发人员" :value="0" />
                                    <el-option label="销售人员" :value="1" />
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button size="mini" class="my-blue-btn" type="primary" @click="editSub('ruleForm')">确 定</el-button>
                    <el-button size="mini" @click="cancelAdd()">取 消</el-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    export default {
        name: "userFtList",
        data() {
            let validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入账户名称'));
                } else if(value.indexOf(' ') != -1){
                    callback(new Error('账户名称不能包含空格'));
                }else {
                    callback()
                }
            };
            let uidText = (rule, value, callback) => {
                if (value == '') {
                    callback(new Error('请输入UID'));
                } else {
                    if (isNaN(value) || !(/(^[1-9]\d*$)/.test(value))) {
                        callback(new Error('请输入正确的UID(非0整数)'));  
                    }else{
                        callback()
                    }
                }
            };
            return { 
                // 表格数据总量
                totalNum: 0,
                dataForm: {
                    p: 1,
                    size: 10,
                    keyword:'',
                },
                loading: true,
                tableData: [],
                useToSearch:[],
                dialogVisible: false,
                infoDef: {
                    name: '',
                    isEdit:false,
                    uid:'',
                    type:0,
                    oldName:'',
                    oldUid:'',
                    oldType:'',
                },
                infoForm: {},
                dataready:true,
                rules: {
                    uid: [
                        { validator: uidText , trigger: 'change' },
                    ],
                    name: [
                        { validator: validatePass , trigger: 'change' },
                    ],
                },
            };
        },
        watch: {

        },
        methods: {
            cancelAdd(){
                this.dialogVisible = false
                this.$refs['ruleForm'].resetFields()
            },
            // 提交表单
            submitForm: function() {
                // this.dataForm.keyword = this.dataForm.keyword.trim()
                // this.dataForm.keyword = this.dataForm.keyword.split(' ').join('')
                // this.tableData = []
                // this.dataForm.p = 1
                // this.loadData()

                let searchArr = this.useToSearch.filter((item)=>{
                    return item.name.indexOf(this.dataForm.keyword) != -1 || String(item.uid).indexOf(this.dataForm.keyword) != -1
                })
                this.tableData = JSON.parse(JSON.stringify(searchArr))
                this.totalNum = searchArr.length
                this.dataForm.p = 1
            },
            // 换页响应
            handleCurrentChange(val) {
                this.dataForm.p = val
            },
            // 请求数据
            loadData() {
                this.loading = true
                this.dataready = true
                this.getRequest('/WebSet/getExamine',{

                }).then(resp => {
                    this.loading = false
                    this.dataready = false
                    if (resp && resp.code === 200) {
                        this.totalNum = resp.data.length
                        this.tableData = JSON.parse(JSON.stringify(resp.data))
                        this.tableData.forEach((ele,index)=>{
                            ele.isEdit = false
                            ele.oldName = ele.name
                            ele.oldUid = ele.uid
                            ele.oldType = ele.type
                            ele.dataId = index + 1
                        })
                        this.useToSearch = JSON.parse(JSON.stringify(this.tableData))
                    }else{
                        this.$message.warning(resp.msg)
                    }
                }).catch((err)=>{
                    this.loading = false
                    this.dataready = false
                    // this.$message.error('请求错误')
                })
            },
            //添加按钮
            addInfo() {
                this.infoForm = Object.assign({}, this.infoDef)
                this.$nextTick(()=>{
                    this.$refs['ruleForm'].resetFields()
                })
                this.dialogVisible = true
            },
            //编辑
            editData(row) {
                row.uid = ''+row.uid
                this.tableData.map((item)=>{
                    return item.uid == row.uid && item.type == row.type ? '' : (item.isEdit = false , item.name = item.oldName , item.uid = item.oldUid , item.type = item.oldType)
                })
                row.isEdit = true
            },
            //编辑确定
            confirm(row){
                let panduanArr = this.useToSearch.filter((item)=>{
                    return item.uid == row.uid
                })
                if (panduanArr.length > 1) {
                    this.$message.warning('有UID重复')
                    return
                }

                this.useToSearch.forEach((ele,index)=>{
                    if (ele.dataId == row.dataId) {
                        ele.type = row.type
                        ele.uid = row.uid
                        ele.name = row.name
                    }
                })

                let arrText = JSON.stringify(this.useToSearch)
                this.postRequest('/WebSet/setExamine', {
                    public_set_uid:arrText,
                }).then(resp => {
                    if (resp && resp.code === 200) {
                        row.isEdit = !row.isEdit
                        this.$message({
                            message: resp.msg,
                            type: 'success',
                            showClose: true,
                            duration: 1000,
                            onClose: () => {
                                // this.loadData()
                            },
                        })
                    } else {
                        this.$message({
                            message: resp.msg,
                            type: 'warning',
                            showClose: true,
                            duration: 1000,
                        })
                    }
                })
            },
            //删除数据
            delItem(row){
                this.$confirm('此操作将删除该条数据, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.tableData.forEach((ele,index)=>{
                        if (ele.uid == row.uid) {
                            this.tableData.splice(index,1)
                        }
                    })

                    this.useToSearch.forEach((ele,index)=>{
                        if (ele.dataId == row.dataId) {
                            this.useToSearch.splice(index,1)
                        }
                    })

                    this.dataForm.keyword = ''

                    let arrText = JSON.stringify(this.useToSearch)
                    this.postRequest('/WebSet/setExamine', {
                        public_set_uid:arrText,
                    }).then(resp => {
                        if (resp && resp.code === 200) {
                            this.$message({
                                message: resp.msg,
                                type: 'success',
                                showClose: true,
                                duration: 300,
                                onClose: () => {
                                    this.tableData.slice((this.dataForm.p-1)*this.dataForm.size,this.dataForm.p*this.dataForm.size).length > 0 ? "" :this.dataForm.p -= 1
                                    this.dialogVisible = false
                                    this.loadData()
                                },
                            })
                        } else {
                            this.$message({
                                message: resp.msg,
                                type: 'warning',
                                showClose: true,
                                duration: 1000,
                            })
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });          
                });

                
            },
            //取消编辑
            cancel(row){
                row.isEdit = !row.isEdit
                row.uid = row.oldUid
                row.name = row.oldName
                row.type = row.oldType
            },
            //新增数据确定
            editSub(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let panduanArr = this.useToSearch.filter((item)=>{
                            return item.uid == this.infoForm.uid
                        })
                        if (panduanArr.length > 0) {
                            this.$message.warning('有UID重复')
                            return
                        }

                        this.dataForm.keyword = ''

                        // this.tableData.push(this.infoForm)
                        this.useToSearch.push(this.infoForm)
                        let arrText = JSON.stringify(this.useToSearch)
                        this.postRequest('/WebSet/setExamine', {
                            public_set_uid:arrText,
                        }).then(resp => {
                            if (resp && resp.code === 200) {
                                this.$message({
                                    message: resp.msg,
                                    type: 'success',
                                    showClose: true,
                                    duration: 300,
                                    onClose: () => {
                                        this.dialogVisible = false
                                        this.loadData()
                                    },
                                })
                            } else {
                                this.$message({
                                    message: resp.msg,
                                    type: 'warning',
                                    showClose: true,
                                    duration: 1000,
                                })
                            }
                        })
                    } else {
                        return false;
                    }
                });
            },
        },
        computed: {
            
        },
        mounted() {
            this.loadData()
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
    .upload-demo{
        text-align: right;
    }
    //table样式
    .table_box >>> .el-table__fixed-right-patch{
        background-color: #EFF5FF !important;
    }
    //弹窗样式
    .dialog_box {
        
    }
    .dialog_box >>> .el-input--medium .el-input__inner{
        text-align: center;
    }
    .dialog_box >>> .el-radio__input.is-checked .el-radio__inner{
        border-color: #5292FE;
        background: #5292FE;
    }
    .dialog_box >>> .el-radio__input.is-checked + .el-radio__label {
        color: #5292FE;
    }

    .el-form-item-right >>> .el-form-item__content{
        line-height: inherit;
    }


    .avatar-uploader >>> .el-upload {
        border: 1px solid #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        box-sizing: border-box;
    }
    .avatar-uploader >>> .el-upload:hover {
        border-color: #409EFF;
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 106px;
        height: 106px;
        line-height: 106px;
        text-align: center;

        // border: 1px solid #d9d9d9;
        // border-radius: 6px;
        // cursor: pointer;
        // position: relative;
        // overflow: hidden;
        // box-sizing: border-box;
    }
    .avatar {
        width: 106px;
        height: 106px;
        display: block;
    }
</style>
