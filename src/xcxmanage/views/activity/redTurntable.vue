<!--
 * @Descripttion: 红包转盘
 * @version: 1.0
 * @Author: LiZhi
 * @Date: 2021-01-15 16:52:43
 * @LastEditors: WangChuan
 * @LastEditTime: 2021-01-30 15:52:24
-->
<template>
    <div>
        <div class="topBox">
            <el-form :inline="true" :model="formData" ref="dataForm" class="form-inline-box">
                <div class="el-form-item-left">
                    <el-form-item>
                        <el-button type="primary" icon="el-icon-plus" @click="add" class="my-blue-btn" size="medium">增加广告</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button class="my-def-btn" @click="red" size="medium">红包配置</el-button>
                    </el-form-item>
                </div>
                <div class="el-form-item-right">
                    <el-form-item style="width:150px;">
                        <el-select v-model="type" @change="submitForm()" size="medium" filterable>
                            <el-option value="0" label="全部类型" />
                            <el-option value="1" label="砸金蛋" />
                            <el-option value="2" label="水果机" />
                        </el-select>
                    </el-form-item>
                    <el-form-item style="width:150px;">
                        <el-select v-model="status" @change="submitForm()" size="medium" filterable>
                            <el-option value="-1" label="全部状态" />
                            <el-option value="1" label="投放中" />
                            <el-option value="0" label="已停止" />
                        </el-select>
                    </el-form-item>
                </div>
            </el-form>
        </div>
        <fix-table v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading"
            :data="tableData" height="73.7vh" border style="width: 100%" size="small"
            header-row-class-name="my-table-header" class="my-table">
            <el-table-column fixed prop="id" label="id" width="80" align="center" header-align="center">
            </el-table-column>
            <el-table-column prop="title" label="广告标题" align="center"></el-table-column>
            <el-table-column align="center" label="显示/上限" prop="clickCount" width="240">
                <template slot-scope="scope">
                    <span>{{scope.row.today_click_amount}}/{{scope.row.limit_click_amount}}</span><br>
                    <span>{{scope.row.sum_click_amount}}/{{scope.row.sum_limit_click_amount}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="type" label="类型" align="center" width="120">
                <template slot-scope="scope">
                    <span v-if="scope.row.type === '1'">砸金蛋</span>
                    <span v-if="scope.row.type === '2'">水果机</span>
                </template>
            </el-table-column>
            <el-table-column prop="status" label="状态" align="center" width="120">
                <template slot-scope="scope">
                    <span v-if="scope.row.status === '1'">投放中</span>
                    <span v-if="scope.row.status === '0'">已停止</span>
                </template>
            </el-table-column>
            <el-table-column prop="is_first" label="首次中奖" align="center" width="120">
                <template slot-scope="scope">
                    <span v-if="scope.row.is_first === '1'">是</span>
                    <span v-if="scope.row.is_first === '0'">否</span>
                </template>
            </el-table-column>

            <el-table-column fixed="right" label="操作" width="180" align="center">
                <template slot-scope="scope">
                    <el-button @click="report(scope.row)" type="text" size="small">统计</el-button>
                    <el-button @click="edit(scope.row)" type="text" size="small">编辑</el-button>
                    <el-button @click="del(scope.row)" type="text" size="small">删除</el-button>
                </template>
            </el-table-column>
        </fix-table>
        <div class="pages">
            <el-pagination @current-change="handleCurrentChange" layout="total, prev, pager, next" :page-size="pageSize"
                :current-page="currentPage" :total="totalNum"></el-pagination>
        </div>
        <!-- 弹出层 -->
        <el-dialog :close-on-click-modal="false" :title="dilogTitle" :visible.sync="showaddtype" width="1120px"
            custom-class="my-dialog" :append-to-body="true" :close-on-press-escape="false">
            <el-form :model="formData" label-width="100px">
                <el-row :gutter="20" type="flex">
                    <el-col :span="11">
                        <el-form-item label="标题：" label-width="140px">
                            <el-input v-model="formData.title" autocomplete="off" size="medium"></el-input>
                        </el-form-item>
                        <el-form-item label="中奖上限(天)：" label-width="140px">
                            <el-input v-model="formData.limit_click_amount" autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="跳转类型：" label-width="140px">
                            <el-select placeholder="类型" v-model="formData.jump_type" size="medium">
                                <el-option label="小程序中打开网页" value="1"></el-option>
                                <el-option label="支付宝内部打开网页" value="2"></el-option>
                                <el-option label="跳转小程序内指定页面" value="3"></el-option>
                                <el-option label="跳转插件页面" value="4"></el-option>
                                <el-option label="跳转指定小程序" value="5"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="广告地址：" label-width="140px">
                            <el-input v-model="formData.url" autocomplete="off" size="medium"></el-input>
                        </el-form-item>
                        <el-form-item label="首次中奖：" label-width="140px">
                            <el-radio-group v-model="formData.is_first">
                                <el-radio label="1">是</el-radio>
                                <el-radio label="0">否</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="完成金蛋图片：" label-width="140px" class="img-div">

                            <el-row :gutter="0">
                                <!-- <el-col :span="8">
                                    <div class="imgdiv" :style="formData.smashed? '':'border:1px dotted #ccc;'">
                                        <img v-if="formData.smashed" :src="formData.smashed" alt="" width="96" height="96" style="border-radius: 16px ;" >
                                    </div>

                                </el-col> -->
                                <el-col :span="8">
                                    <el-upload class="avatar-uploader" name="image" :action="uploadUrl"
                                        :on-success="handleImgSuccess2" :show-file-list="false">
                                        <img v-if="formData.smashed" :src="formData.smashed" alt="" width="96"
                                            height="96" style="border-radius: 16px ;">
                                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                    </el-upload>
                                </el-col>
                            </el-row>
                        </el-form-item>
                    </el-col>

                    <el-col :span="11">
                        <el-form-item label="描述：" label-width="140px">
                            <el-input v-model="formData.description" autocomplete="off" size="medium"></el-input>
                        </el-form-item>
                        <el-form-item label="中奖上限(总)：" label-width="140px">
                            <el-input v-model="formData.sum_limit_click_amount" autocomplete="off" size="medium"></el-input>
                        </el-form-item>
                        <el-form-item label="类型：" label-width="140px">
                            <el-select v-model="formData.type" size="medium" filterable>
                                <el-option value="1" label="砸金蛋" />
                                <el-option value="2" label="水果机" />
                            </el-select>
                        </el-form-item>
                        <el-row>
                            <el-col :span="24">
                                <div style="height:40px;margin-bottom: 22px;"></div>
                            </el-col>
                        </el-row>
                        <el-form-item label="状态：" label-width="140px">
                            <el-radio-group v-model="formData.status">
                                <el-radio label="1">投放中</el-radio>
                                <el-radio label="0">已停止</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="图片：" label-width="140px" class="img-div">
                            <el-row :gutter="0">
                                <!-- <el-col :span="8">
                                    <div class="imgdiv" :style="formData.image? '':'border:1px dotted #ccc;'">
                                        <img v-if="formData.image" :src="formData.image" alt="" width="96" height="96" style="border-radius: 16px ;" >
                                    </div>
                                </el-col> -->
                                <el-col :span="8">
                                    <el-upload class="avatar-uploader" name="image" :action="uploadUrl"
                                        :on-success="handleImgSuccess" :show-file-list="false">
                                        <img v-if="formData.image" :src="formData.image" alt="" width="96" height="96"
                                            style="border-radius: 16px ;">
                                        <i class="el-icon-plus avatar-uploader-icon"></i>
                                    </el-upload>
                                </el-col>
                            </el-row>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="post" size="medium">确 定</el-button>
                <el-button @click="showaddtype = false" size="medium">取 消</el-button>
            </div>
        </el-dialog>

        <el-dialog :close-on-click-modal="false" title="红包设置" :visible.sync="showaddtypes" width="600px"
            custom-class="my-dialog" :append-to-body="true" :close-on-press-escape="false">
            <el-form :model="formData" label-width="80px">
                <el-row :gutter="10" type="flex">
                    <el-col :span="20">
                        <el-form-item label="最小红包金额：" label-width="180px">
                            <el-input v-model="formData.min" autocomplete="off" size="medium"></el-input>
                        </el-form-item>
                        <el-form-item label="最大红包金额：" label-width="180px">
                            <el-input v-model="formData.max" autocomplete="off" size="medium"></el-input>
                        </el-form-item>
                        <el-form-item label="水果机抽次数：" label-width="180px">
                            <el-input v-model="formData.fruitSlotsCount" autocomplete="off" size="medium"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="redSet" size="medium">确 定</el-button>
                <el-button @click="showaddtypes = false" size="medium">取 消</el-button>

            </div>
        </el-dialog>

        <Statistics TipsTitle="广告点击统计" TipsWidth="800px" :dataForm="echartData" v-model="showTips"
            @closeDialog="closeDialog()" />
    </div>
</template>
<script>
    import Statistics from "@/components/Statistics.vue";

    export default {
        name: 'activityRedTurntable',
        data() {
            return {
                type: '0',
                status: '-1',
                dialogVisible: false,
                // 表格当前页
                currentPage: 1,
                // 每页显示数据数量
                pageSize: 12,
                // 表格数据总量
                totalNum: 0,
                // 每页显示数据数量
                loading: true,
                // 表格数据
                tableData: [],
                // 显示添加模态
                showaddtype: false,
                // 红包
                showaddtypes: false,
                // 表单数据
                formData: {
                    'title': '',
                    'image': '',
                    'url': '',
                    'status': '-1',
                    'smashed':''
                },
                addSchoolShow: false,
                info: {},
                categoryList: [],
                showTips: false,
                echartData: {
                    // ID
                    id: '',
                    // 请求地址
                    postUrl: '/XcxHitEggs/statistics',
                    // 折线图配置
                    options: {
                        legend: {
                            data: ['中奖次数', '点击UV', '点击PV']
                        },
                        tooltip: {
                            trigger: 'axis',
                            axisPointer: {
                                type: 'cross',
                                label: {
                                    backgroundColor: '#6a7985'
                                }
                            }
                        },
                        grid: {
                            left: '3%',
                            right: '4%',
                            bottom: '3%',
                            containLabel: true
                        },
                        xAxis: {
                            boundaryGap: false,
                            data: ['衬衫']
                        },
                        yAxis: {},
                        series: [{
                                data: [1],
                                name: '中奖次数',
                                areaStyle: {},
                                type: 'line',
                                smooth: true
                            },
                            {
                                data: [1],
                                name: '点击UV',
                                areaStyle: {},
                                type: 'line',
                                smooth: true
                            }, {
                                data: [1],
                                name: '点击PV',
                                areaStyle: {},
                                type: 'line',
                                smooth: true
                            }
                        ]
                    },
                    //时间配置
                    timeData: [{
                        title: "近24时",
                        data: 24
                    }, {
                        title: "近7天",
                        data: 1
                    }, {
                        title: "近30天",
                        data: 2
                    }]
                },
            }
        },
        components: {
            Statistics
        },
        methods: {
            closeDialog() {
                this.showTips = false;
            },
            submitForm() {
                this.currentPage = 1
                this.loadData()
            },
            // 获取数据
            loadData() {
                this.loading = true
                this.getRequest('/XcxHitEggs/getList', {
                    page: this.currentPage,
                    type: this.type,
                    limit: this.pageSize,
                    status: this.status
                }).then(resp => {
                    this.loading = false
                    if (resp && resp.code === 200) {
                        this.totalNum = resp.data.total
                        this.tableData = resp.data.list
                    }
                })
            },
            // 红包设置
            red() {
                this.getRequest('/XcxHitEggs/getRed', {}).then(data => {
                    if (data.code === 200) {
                        this.formData = {
                            'min': data.data.min,
                            'max': data.data.max,
                            'fruitSlotsCount': data.data.fruitSlotsCount
                        }
                        this.showaddtypes = true
                    } else {
                        this.$message.error(data.msg)
                    }
                })
            },
            // redSet
            redSet() {
                this.postRequest('/XcxHitEggs/setRed', {
                    min: this.formData.min,
                    max: this.formData.max,
                    fruitSlotsCount: this.formData.fruitSlotsCount
                }).then(data => {
                    if (data.code === 200) {
                        this.$message({
                            message: data.msg,
                            type: 'success',
                            showClose: true,
                            duration: 1000,
                            onClose: () => {
                                this.showaddtypes = false
                            }
                        })
                    } else {
                        this.$message.error(data.msg)
                    }
                })
            },
            // 添加数据
            add() {
                this.formData = {
                    'title': '',
                    'image': '',
                    'url': '',
                    'status': '1',
                    'is_first': '1',
                    'jump_type': '1',
                    'is_first': '1',
                    'smashed':''
                }
                this.showaddtype = true
            },
            // 编辑数据
            edit(data) {
                this.formData = Object.assign({}, data)
                console.log(JSON.stringify(this.formData))
                this.showaddtype = true
            },
            // 删除
            del(data) {
                var thiss = this
                this.$confirm('是否删除分类及其数据？', '确认操作', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let url = '/XcxHitEggs/delete'
                    this.postRequest(url, {
                        id: data.id
                    }).then(data => {
                        if (data.code === 200) {
                            this.$message({
                                message: data.msg,
                                type: 'success',
                                showClose: true,
                                duration: 1000,
                                onClose: function () {
                                    thiss.loadData()
                                }
                            })
                        } else {
                            this.$message.error(data.msg)
                        }
                    })
                })
            },
            report(row) {
                this.info = Object.assign({}, row)
                this.dialogVisible = true
                this.echartData.id = row.id
                this.showTips = true
            },
            // 提交数据
            post() {
                let url = '/XcxHitEggs/addPost'
                if (this.formData.id > -1) {
                    url = '/XcxHitEggs/editPost'
                }
                let option = Object.assign({}, this.formData)
                this.postRequest(url, option).then(data => {
                    if (data.code === 200) {
                        this.$message.success(data.msg)
                        this.showaddtype = false
                        this.loadData()
                    } else {
                        this.$message.error(data.msg)
                    }
                })
            },

            // 换页响应
            handleCurrentChange(val) {
                this.currentPage = val
                this.loadData()
            },
            // 刷新
            refresh() {
                this.currentPage = 1
                this.loadData()
            },
            // 处理上传图片
            handleImgSuccess(file, fileList) {
                if (file.code !== 200) {
                    this.$message.error(file.msg)
                } else {
                    this.formData.image = file.data
                }
            },
            handleImgSuccess2(file, fileList) {
                if (file.code !== 200) {
                    this.$message.error(file.msg)
                } else {
                    this.formData.smashed = file.data
                    console.log(this.formData.smashed);
                }
            },

            // 联动选择器
            categoryChanged(value) {
                this.formData.label_id = this.category[value].children[0].id
            },
            // 获取分类
            getCategory() {
                this.getRequest('/school/getCategory', {}).then(resp => {
                    if (resp && resp.code === 200) {
                        this.category = resp.data
                    }
                })
            }
        },
        computed: {
            dilogTitle() {
                return this.formData.id > 0 ? '编辑广告' : '增加广告'
            },
            uploadUrl() {
                return this.$store.state.base.uploadUrl
            }
        },
        mounted() {
            this.loadData()
            this.getCategory()
        }
    }

</script>

<style scoped>
    .img-div>>>.avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }

    div>>>.avatar-uploader .el-upload {
        width: 96px;
        height: 96px;
        /* display: table; */
        border-radius: 16px;
        border: 1px dashed #c0ccda;
        overflow: hidden;
    }

    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 96px;
        height: 96px;
        line-height: 96px;
        text-align: center;
    }

    .avatar {
        /* position: absolute; */
        width: 96px;
        height: 96px;
        display: block
    }

    .imgdiv {
        /* display: inline; */
        width: 96px;
        height: 96px;
        border-radius: 16px;
        overflow: hidden;

    }

</style>
