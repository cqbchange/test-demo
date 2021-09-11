<!--
 * @Descripttion: 首页
 * @version: 1.0
 * @Author: WangChuan
 * @Date: 2021-01-15 16:52:43
 * @LastEditors: WangChuan
 * @LastEditTime: 2021-01-29 15:28:28
-->
<template>
    <div>
        <el-form :inline="true" v-model="dataForm" ref="dataForm" class="form-inline-box">
            <div class="el-form-item-left">
                <el-form-item>
                    <el-button class="my-def-btn" @click="showDialog = true" size="medium">基础弹窗</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-plus" class="my-blue-btn" @click="showTips = true"
                        size="medium">测试统计
                    </el-button>
                </el-form-item>
            </div>
            <div class="el-form-item-right">
                <el-form-item>
                    <el-select v-model="infoForm.xl1" filterable placeholder="请选择" size="medium">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-input placeholder="搜索" v-model="dataForm.keyword" class="input-search-btn" clearable
                        size="medium">
                        <el-button slot="append" icon="el-icon-search"></el-button>
                    </el-input>
                </el-form-item>
            </div>
        </el-form>

        <fix-table ref="table" border v-loading="loading" element-loading-spinner="el-icon-loading"
            element-loading-text="拼命加载中" :data="tableData" key="list" height="73.7vh" size="small"
            header-row-class-name="my-table-header" class="my-table">
            <el-table-column fixed prop="id" label="编号" width="80" align="center" header-align="center" />
            <el-table-column prop="num_iid" label="商品IID" />
            <el-table-column prop="commission" label="佣金比例" width="90" align="center">
                <template slot-scope="scope">{{ scope.row.commission}}%</template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="180" align="center">
                <template slot-scope="scope">
                    <el-button v-model="scope.row.id" type="text" size="small">编辑</el-button>
                </template>
            </el-table-column>
        </fix-table>

        <div class="pages">
            <el-pagination @current-change="currentChange" layout="total, prev, pager, next" :page-size="dataForm.size"
                :current-page="dataForm.p" :total="dataForm.totalNum" />
        </div>


        <el-dialog title="弹窗样式" :visible.sync="showDialog" custom-class="my-dialog" width="42%" :append-to-body="true"
            :close-on-press-escape="false">
            <el-form :model="infoForm" size="medium">
                <el-row :gutter="20" type="flex">
                    <el-col :span="24">
                        <el-form-item label="">
                            <el-checkbox-group v-model="infoForm.checkList">
                                <el-checkbox label="一键上架"></el-checkbox>
                                <el-checkbox label="一键下架"></el-checkbox>
                                <el-checkbox label="复制任务"></el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20" type="flex">
                    <el-col :span="24">
                        <el-form-item label="id" label-width="100px">
                            <el-input v-model="infoForm.id" autocomplete="off" placeholder="请填写id" clearable />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20" type="flex">
                    <el-col :span="12">
                        <el-form-item label="id" label-width="100px">
                            <el-input v-model="infoForm.id" autocomplete="off" placeholder="请填写id" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="iid" label-width="100px">
                            <el-input v-model="infoForm.num_iid" autocomplete="off" placeholder="请填写iid"
                                :disabled="true" />
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20" type="flex">
                    <el-col :span="24" class="my-lab-title">
                        <div>输入框</div>
                    </el-col>
                </el-row>
                <el-row :gutter="20" type="flex">
                    <el-col :span="12">
                        <el-form-item label="id" label-width="100px">
                            <el-input v-model="infoForm.id" autocomplete="off" placeholder="请填写id" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="iid" label-width="100px">
                            <el-input v-model="infoForm.num_iid" autocomplete="off" placeholder="请填写iid"
                                :disabled="true" />
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20" type="flex">
                    <el-col :span="24" class="my-lab-title">
                        <div>下拉模块</div>
                    </el-col>
                </el-row>
                <el-row :gutter="20" type="flex">
                    <el-col :span="12">
                        <el-form-item label="输入下拉:" label-width="100px">
                            <el-select v-model="infoForm.xl1" filterable placeholder="请选择">
                                <el-option v-for="item in options" :key="item.value" :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="多选下拉" label-width="100px">
                            <el-select v-model="infoForm.xl2" multiple filterable placeholder="请选择">
                                <el-option v-for="item in options" :key="item.value" :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20" type="flex">
                    <el-col :span="24" class="my-lab-title">
                        <div>上传图片</div>
                    </el-col>
                </el-row>
                <el-row :gutter="20" type="flex">
                    <el-col :span="12" class="upload-img-box">
                        <el-form-item label="商品主图:" label-width="100px">
                            <el-input v-model="infoForm.pic" autocomplete="off" />
                        </el-form-item>
                        <el-upload class="upload-img" name="image" :action="uploadUrl" :on-success="uploadImgSuccess"
                            :show-file-list="false">
                            <el-button size="medium" type="primary">点击上传</el-button>
                        </el-upload>
                    </el-col>
                </el-row>

                <el-row :gutter="20" type="flex">
                    <el-col :span="24" class="my-lab-title">
                        <div>时间模块</div>
                    </el-col>
                </el-row>
                <el-row :gutter="20" type="flex">
                    <el-col :span="12">
                        <el-form-item label="起止日期：" label-width="100px">
                            <el-date-picker v-model="infoForm.day" type="daterange" align="right" unlink-panels
                                range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"
                                :picker-options="pickerOptions">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20" type="flex">
                    <el-col :span="12" class="timeArr">
                        <template v-for="(item,index) in infoForm.time1">
                            <el-form-item :label="index==0?'起止时间：':''" label-width="100px" :key="index">
                                <el-time-picker is-range v-model="infoForm.time1[index]" range-separator="至"
                                    start-placeholder="开始时间" end-placeholder="结束时间" placeholder="选择时间范围">
                                </el-time-picker>
                                <i class="el-icon-minus icon-timeArr"
                                    v-if="infoForm.time1.length >1 && (index+1) < infoForm.time1.length"
                                    @click="deleteTime(index)"></i>
                                <i class="el-icon-plus icon-timeArr" v-else-if="infoForm.time1.length == (index+1)"
                                    @click="addTime()"></i>
                            </el-form-item>
                        </template>
                    </el-col>
                </el-row>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" class="my-blue-btn" @click="subBtn">确 定</el-button>
                <el-button @click="showDialog = false">取 消</el-button>
            </div>
        </el-dialog>
        <Statistics TipsTitle="我是测试" TipsWidth="800px" :dataForm="dataForms" :value="showTips"
            @closeDialog="closeDialog()" />
    </div>
</template>
<script>
    import Statistics from "@/components/Statistics.vue";


    export default {
        name: "mian",
        components: {
            Statistics
        },
        data() {
            return {
                showTips: false,
                dataForms: {
                    // ID
                    id: '1',
                    // 请求地址
                    postUrl: '/miniProgram/adReport',
                    // 折线图配置
                    options: {
                        legend: {
                            data: ['广告UV', '广告PV']
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
                            name: '广告UV',
                            areaStyle: {},
                            type: 'line',
                            smooth: true
                        }, {
                            data: [1],
                            name: '广告PV',
                            areaStyle: {},
                            type: 'line',
                            smooth: true
                        }]
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
                    }, {
                        title: "近一年",
                        data: 3
                    }]
                },
                showDialog: false,
                loading: false,
                dataForm: {
                    p: 1,
                    size: 20,
                    totalNum: 1,
                    keyword: ''
                },
                tableData: [{
                    id: 1,
                    num_iid: '1',
                    commission: 1
                }, {
                    id: 2,
                    num_iid: '2',
                    commission: 2
                }, {
                    id: 3,
                    num_iid: '3',
                    commission: 3
                }],
                infoForm: {
                    checkList: [],
                    id: 3,
                    num_iid: '3',
                    commission: 3,
                    pic: '',
                    xl1: '',
                    xl2: '',
                    day: 0,
                    time1: [null]
                },
                options: [{
                    value: '选项1',
                    label: '黄金糕'
                }, {
                    value: '选项2',
                    label: '双皮奶'
                }],
                optionss: {
                    series: [{
                        data: [1],
                        name: '广告UV',
                        areaStyle: {},
                        type: 'line',
                        smooth: true
                    }, {
                        data: [1],
                        name: '广告PV',
                        areaStyle: {},
                        type: 'line',
                        smooth: true
                    }]
                }
            }
        },
        methods: {
            closeDialog() {
                this.showTips = false;
            },
            // 换页响应
            currentChange(val) {
                this.tableData = [];
                this.dataForm.p = val;
                this.loadData();
            },
            addTime() {
                this.infoForm.time1.push(null)
            },
            deleteTime(index) {
                this.infoForm.time1.splice(index, 1)
            },
            subBtn() {
                console.info(this.infoForm)
            },
            uploadImgSuccess(file, fileList) {
                if (file.code !== 200) {
                    this.$message.error(file.msg);
                } else {
                    this.infoForm.pic = file.data;
                }
            },
            // 删除操作
            del() {
                this.$confirm("此操作将删除该销售数据, 是否继续?", "提示", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning"
                    })
                    .then(() => {
                        console.info('确认删除')
                    })
                    .catch(() => {});
            },
        },
        computed: {
            pickerOptions() {
                return this.$store.state.base.pickerOptions;
            },
            uploadUrl() {
                return this.$store.state.base.uploadUrl
            }
        },
        mounted() {}
    };

</script>

<style lang='scss' scoped>

</style>
