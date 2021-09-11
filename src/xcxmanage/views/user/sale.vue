<!--
 * @Descripttion: 销售管理
 * @version: 1.0
 * @Author: Lizhi
 * @Date: 2021-01-15 16:52:43
 * @LastEditors: WangChuan
 * @LastEditTime: 2021-06-18 18:03:57
-->
<template>
    <div>
        <el-form :inline="true" v-model="dataForm" ref="dataForm" class="form-inline-box">
            <div class="el-form-item-left">
                <el-form-item>
                    <el-button type="primary" icon="el-icon-plus" class="my-blue-btn" @click="edit()" size="medium">添加销售
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
            <el-table-column prop="uid" label="ID" align="center" />
            <el-table-column prop="user_name" label="名字" align="center" />
            <el-table-column prop="initials" label="名字缩写" align="center" />
            <el-table-column prop="mobile" label="电话号" align="center" />
            <el-table-column prop="mobile_message" label="接收短信手机号" align="center" />
            <el-table-column prop="is_company_resource" label="公司资源" align="center">
                <template slot-scope="scope">
                    <div>{{scope.row.is_company_resource==1?'开启':'关闭'}}</div>
                </template>
            </el-table-column>
            <el-table-column prop="wx_account" label="微信号" align="center" />
            <el-table-column prop="dd_account" label="钉钉号" align="center" />
            <el-table-column label="二维码" align="center">
                <template slot-scope="scope">
                    <div class="img_list" style="display:flex;justify-content: center;">
                        <div class="code_item" v-if="scope.row.qr_code" style="display:flex;flex-direction:column;align-items:center">
                            <el-image :src="scope.row.qr_code" style="width: 55px; height: 55px ; margin-right:5px;"
                                :preview-src-list="[scope.row.qr_code]">
                                <div slot="error" class="image-slot">
                                    <i class="el-icon-picture-outline" style="line-height: 55px;font-size:30px"></i>
                                </div>
                            </el-image>
                            <span>微信</span>
                        </div>
                        <div class="code_item" v-if="scope.row.dd_qr_code" style="display:flex;flex-direction:column;align-items:center">
                            <el-image :src="scope.row.dd_qr_code" style="width: 55px; height: 55px"
                                :preview-src-list="[scope.row.dd_qr_code]">
                                <div slot="error" class="image-slot">
                                    <i class="el-icon-picture-outline" style="line-height: 55px;font-size:30px"></i>
                                </div>
                            </el-image>
                            <span>钉钉</span>
                        </div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" align="center">
                <template slot-scope="scope">
                    <el-button @click="edit(scope.row)" type="text" size="medium">编辑</el-button>
                    <el-button @click="del(scope.row)" type="text" size="medium">删除</el-button>
                </template>
            </el-table-column>
        </fix-table>
        <div class="pages">
            <el-pagination @current-change="currentChange" layout="total, prev, pager, next" :page-size="dataForm.size"
                :current-page="dataForm.p" :total="dataForm.totalNum" />
        </div>
        <el-dialog :title="dilogTitle" :visible.sync="showDialog" custom-class="my-dialog" width="42%"
            :append-to-body="true" :close-on-press-escape="false">
            <el-form :model="infoForm">
                <el-row :gutter="20" type="flex">
                    <el-col :span="22">
                        <el-form-item label="名字：" label-width="140px">
                            <el-input v-model="infoForm.user_name" autocomplete="off" placeholder="请填写名字" clearable
                                size="medium" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20" type="flex">
                    <el-col :span="22">
                        <el-form-item label="名字缩写：" label-width="140px">
                            <el-input v-model="infoForm.initials" autocomplete="off" placeholder="请填名字缩写" clearable
                                size="medium" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20" type="flex">
                    <el-col :span="22">
                        <el-form-item label="电话号：" label-width="140px">
                            <el-input v-model="infoForm.mobile" autocomplete="off" placeholder="请填写电话" clearable
                                size="medium" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20" type="flex">
                    <el-col :span="22">
                        <el-form-item label="接收短信手机号：" label-width="140px">
                            <el-input v-model="infoForm.mobile_message" autocomplete="off" placeholder="请填接收短信手机号"
                                clearable size="medium" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20" type="flex">
                    <el-col :span="22">
                        <el-form-item label="微信号：" label-width="140px">
                            <el-input v-model="infoForm.wx_account" autocomplete="off" placeholder="请填写微信号"
                                clearable size="medium" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20" type="flex">
                    <el-col :span="22">
                        <el-form-item label="钉钉号：" label-width="140px">
                            <el-input v-model="infoForm.dd_account" autocomplete="off" placeholder="请填写钉钉号"
                                clearable size="medium" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20" type="flex">
                    <el-col :span="22">
                        <el-form-item label="公司资源：" label-width="140px">
                            <el-radio-group v-model="infoForm.is_company_resource">
                                <el-radio style="margin:0 15px 0 0" :label="'0'">关闭</el-radio>
                                <el-radio style="margin:0 15px 0 0" :label="'1'">开启</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20" type="flex">
                    <el-col :span="22">
                        <el-form-item label="二维码：" label-width="140px">
                            <div class="code_list" style="display:flex;">
                                <div class="upload_item" style="margin:0 10px 0 0;display:flex;flex-direction: column;align-items:center">
                                    <el-upload class="avatar-uploader" :action="uploadUrl" :on-success="uploadImgSuccess"
                                        :show-file-list="false" name="image" :before-upload="beforeUpload">
                                        <img v-if="infoForm.qr_code" :src="infoForm.qr_code" class="avatar">
                                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                        <i v-if="infoForm.qr_code" class="el-icon-error" style="font-size:18px"
                                            @click.stop="infoForm.qr_code=''"></i>
                                    </el-upload>
                                    <div class="upload_info">
                                        微信
                                    </div>
                                </div>
                                <div class="upload_item" style="margin:0 10px 0 0;display:flex;flex-direction: column;align-items:center">
                                    <el-upload class="avatar-uploader" :action="uploadUrl" :on-success="uploadImgSuccessDD"
                                        :show-file-list="false" name="image" :before-upload="beforeUpload">
                                        <img v-if="infoForm.dd_qr_code" :src="infoForm.dd_qr_code" class="avatar">
                                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                        <i v-if="infoForm.dd_qr_code" class="el-icon-error" style="font-size:18px"
                                            @click.stop="infoForm.dd_qr_code=''"></i>
                                    </el-upload>
                                    <div class="upload_info">
                                        钉钉
                                    </div>
                                </div>
                            </div>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" class="my-blue-btn" @click="subBtn" size="medium">确 定</el-button>
                <el-button @click="showDialog = false" size="medium">取 消</el-button>
            </div>
        </el-dialog>

    </div>
</template>
<script>
    export default {
        name: "userSale",
        data() {
            return {
                // 表格load状态
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
                // 弹窗显示状态
                showDialog: false,
                // 编辑数据
                infoForm: {
                    uid: 0,
                    user_name: '',
                    mobile: '',
                    qr_code: ''
                },
            };
        },
        methods: {
            // 获取Table数据
            loadData() {
                this.loading = true;
                this.getRequest("/Sale/list", this.dataForm).then(resp => {
                    this.loading = false;
                    if (resp && resp.code === 200) {
                        this.dataForm.totalNum = resp.data.total;
                        this.tableData = resp.data.data;
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
            // // 图片上传前事件回调
            // beforeAvatarUpload() {
            //     if (this.infoForm.qr_code == '') {
            //         this.infoForm.qr_code =
            //             'https://coubei.oss-cn-hangzhou.aliyuncs.com/new/2020/07/15/10/5e91815b83c9e853da3bdcf61e6bf0a0.gif';
            //     } else {
            //         this.infoForm.qr_code =
            //             'https://coubei.oss-cn-hangzhou.aliyuncs.com/new/2020/10/29/15/14d27159f1639ce7f544d2e1a9d060d4.gif'
            //     }
            // },
            beforeUpload(file) {
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
                    this.infoForm.qr_code = file.data
                }
            },
            uploadImgSuccessDD(file, fileList) {
                if (file.code !== 200) {
                    this.$message.error(file.msg);
                } else {
                    this.infoForm.dd_qr_code = file.data
                }
            },
            // 添加/编辑
            edit(row) {
                if (row !== undefined) {
                    this.infoForm = Object.assign({}, row);
                } else {
                    this.infoForm = {
                        uid: 0,
                        user_name: '',
                        mobile: '',
                        qr_code: '',
                        wx_account:'',
                        dd_account:'',
                        mobile_message:'',
                        initials:'',
                        dd_qr_code:'',
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
                    this.postRequest('/Sale/delSale', {
                        uid: row.uid
                    }).then(resp => {
                        if (resp && resp.code == 200) {
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
                let reg = /^1\d{10}$/;
                if (!reg.test(this.infoForm.mobile)) {
                    this.$message.warning('输入正确电话号')
                    return
                }
                if (!reg.test(this.infoForm.mobile_message)) {
                    this.$message.warning('输入正确的短信接收手机号')
                    return
                }
                this.showDialog = true;
                let url = '/Sale/operationSale'
                this.postRequest(url, this.infoForm).then(resp => {
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
            },
        },
        computed: {
            // 上传地址
            uploadUrl() {
                return this.$store.state.base.uploadUrl
            },
            dilogTitle() {
                return this.infoForm.uid ? '编辑销售' : '添加销售'
            }
        },
        mounted() {
            this.loadData();
        }
    };

</script>

<style lang='scss' scoped>
    .avatar-uploader {

        width: 96px;
        position: relative;

        .avatar-uploader-icon {
            font-size: 28px;
            color: #8c939d;
            width: 96px;
            height: 96px;
            line-height: 96px;
            text-align: center;
            border: 1px dashed #d9d9d9;
            border-radius: 6px;
        }

        .avatar-uploader-icon:hover {
            border-color: #409EFF;
        }

        .avatar {
            width: 96px;
            height: 96px;
            display: block;
        }
    }

    .el-icon-error {
        position: absolute;
        top: -4px;
        right: -5px;
    }

</style>
