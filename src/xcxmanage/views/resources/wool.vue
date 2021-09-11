<!--
 * @Descripttion: 纷推广告图
 * @version: 1.0
 * @Author: Lizhi
 * @Date: 2021-01-15 16:52:43
 * @LastEditors: WangChuan
 * @LastEditTime: 2021-03-31 15:30:25
-->
<template>
    <div>
        <div class="topBox">

            <el-form :inline="true" ref="dataForm" class="form-inline-box">
                <div class="el-form-item-left">
                    <el-form-item>
                        <el-button @click="addlist" type="primary" icon="el-icon-plus" class="my-blue-btn"
                            size="medium">添加小程序</el-button>
                    </el-form-item>
                </div>
                <div class="el-form-item-right"></div>
            </el-form>
        </div>

        <fix-table :data="tableData" ref="table" border element-loading-spinner="el-icon-loading"
            header-row-class-name="my-table-header" class="my-table" element-loading-text="拼命加载中" height="73.7vh"
            size="small" style="width: 100%" v-loading="loading" key="list">
            <el-table-column align="center" fixed header-align="center" label="ID" prop="id" width="120px"/>
            <el-table-column align="center" fixed="right" label="小程序名称" prop="name"/>
            <el-table-column align="center" fixed="right" label="Logo">
                <template slot-scope="scope">
                    <img :src="scope.row.icon" alt="" width="32">
                </template>
            </el-table-column>
            <el-table-column align="center" fixed="right" label="AppId" prop="appid"/>
            <el-table-column align="center" fixed="right" label="跳转地址" prop="path"/>           
            <el-table-column align="center" fixed="right" label="操作" width="230">
                <template slot-scope="scope">
                    <el-button @click="edit(scope.row)" size="medium" type="text">编辑</el-button>
                    <el-button @click="del(scope.row)" size="medium" type="text">删除</el-button>
                </template>
            </el-table-column>
        </fix-table>
        <div class="pages">
            <el-pagination :current-page.sync="currentPage" :page-size="pageSize" :total="totalNum"
                @current-change="handleCurrentChange" layout="total, prev, pager, next" />
        </div>
        
        <el-dialog title="添加/编辑" :visible.sync="showDialog" custom-class="my-dialog" width="730px" :append-to-body="true" :close-on-press-escape="false">
             <el-form :model="infoForm">
                <el-row :gutter="20" type="flex">
                    <el-col :span="22">
                        <el-form-item label="名字：" label-width="140px">
                            <el-input v-model="infoForm.name" autocomplete="off" placeholder="请填写名字" clearable
                                size="medium" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20" type="flex">
                    <el-col :span="22">
                        <el-form-item label="AppId：" label-width="140px">
                            <el-input v-model="infoForm.appid" autocomplete="off" placeholder="请填AppId" clearable
                                size="medium" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20" type="flex">
                    <el-col :span="22">
                        <el-form-item label="跳转地址：" label-width="140px">
                            <el-input v-model="infoForm.path" autocomplete="off" placeholder="请填写跳转地址" clearable
                                size="medium" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20" type="flex">
                    <el-col :span="22">
                        <el-form-item label="Logo：" label-width="140px">
                            <el-upload class="avatar-uploader" :action="uploadUrl" :on-success="uploadImgSuccess"
                                :show-file-list="false" name="image" :before-upload="beforeUpload">
                                <img v-if="infoForm.icon" :src="infoForm.icon" class="avatar">
                                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                <i v-if="infoForm.icon" class="el-icon-error" style="font-size:18px"
                                    @click.stop="infoForm.icon=''"></i>
                            </el-upload>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="subBtn" size="medium">确定</el-button>
                <el-button @click="showDialog=false" size="medium">取消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>

    export default {
        name: "resourcesWool",
        data() {
            return {
                // 表格当前页
                currentPage: 1,
                // 每页显示数据数量
                pageSize: 11,
                // 表格数据总量
                totalNum: 0,
                // 每页显示数据数量
                loading: true,
                // 列表数据
                tableData: [],
                // 当前数据
                infoForm: {},
                // 是否显示模态
                showDialog: false,
            }
        },
        components: {
        },
        methods: {
            // 换页响应
            handleCurrentChange(val) {
                this.currentPage = val
                this.loadData()
            },
            // 请求数据
            loadData() {
                this.loading = true
                this.getRequest('/WoolManage/getList', {
                    p: this.currentPage,
                    size: this.pageSize
                }).then(resp => {
                    this.loading = false
                    if (resp && resp.code === 200) {
                        this.totalNum = resp.data.total
                        this.tableData = resp.data.list
                    }
                })
            },
            // 添加数据
            addlist() {
                this.infoForm = {
                    name: '',
                    appid: '',
                    path: '',
                    icon: '',
                }
                this.showDialog = true
            },
            // 编辑数据
            edit(row) {
                this.infoForm = Object.assign({}, row)
                this.showDialog = true
            },
            // 删除数据
            del(row) {
                let that = this
                this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.postRequest('/WoolManage/delWoolMini', {id:row.id}).then(resp => {
                        if (resp && resp.code === 200) {
                            this.$message({
                                message: '删除成功',
                                type: 'success',
                                showClose: true,
                                duration: 1000,
                                onClose: function () {
                                    that.loadData()
                                }
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
            // 图片上传成功回调
            uploadImgSuccess(file, fileList) {
                if (file.code !== 200) {
                    this.$message.error(file.msg);
                } else {
                    this.infoForm.icon = file.data
                }
            },
            // 编辑/添加确认事件
            subBtn() {
                console.log(this.infoForm)
                 this.postRequest('/WoolManage/addWoolMini', this.infoForm).then(resp => {
                    if (resp && resp.code === 200) {
                        this.$message({
                            message: resp.msg,
                            type: 'success',
                            showClose: true,
                            duration: 1000
                        })
                        this.showDialog = false
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
            }
        },
        mounted() {
            this.loadData()
        },
        watch: {
        },
        computed: {
            // 上传地址
            uploadUrl() {
                return this.$store.state.base.uploadUrl
            },
            dilogTitle() {
                return this.calssDataForm.id > 0 ? '编辑数据' : '增加数据'
            }
        }
    }

</script>

<style scoped>

</style>
