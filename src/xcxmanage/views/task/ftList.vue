<!--
 * @Descripttion: 纷推投放管理
 * @version: 1.0
 * @Author: WangChuan
 * @Date: 2021-01-15 16:52:43
 * @LastEditors: WangChuan
 * @LastEditTime: 2021-08-30 10:51:06
-->
<template>
    <div>
        <el-form :inline="true" v-model="dataForm" ref="dataForm" class="form-inline-box">
            <div class="el-form-item-left">
                <el-form-item style="flex:1;">
                    <div>
                        <span>主播数量: {{anchor_count}}</span>
                    </div>
                </el-form-item>
            </div>
            <div class="el-form-item-right">
                <el-form-item style="width:150px;">
                    <el-select size="medium" v-model="dataForm.anchor" @change="submitForm" filterable
                        placeholder="主播昵称">
                        <el-option v-for="(item,index) in anchorStatusList" :key="index" :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item style="width:150px;">
                    <el-select size="medium" v-model="dataForm.invite_name" @change="submitForm" filterable clearable
                        placeholder="归属人筛选">
                        <el-option v-for="(item,index) in salesmanList" :key="index" :label="item.name"
                            :value="item.name">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item style="width:150px;">
                    <el-select size="medium" v-model="dataForm.dev" @change="submitForm" filterable placeholder="请选择环境">
                        <el-option v-for="(item,index) in devList" :key="index" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item style="width:150px;">
                    <el-select size="medium" v-model="dataForm.status" @change="submitForm" filterable
                        placeholder="请选择状态">
                        <el-option v-for="(item,index) in statusList" :key="index" :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item style="width:200px;">
                    <el-input size="medium" placeholder="搜索" @change="submitForm()" v-model="dataForm.keyword"
                        class="input-search-btn" clearable>
                        <el-button slot="append" icon="el-icon-search" @click="submitForm()"></el-button>
                    </el-input>
                </el-form-item>
            </div>
        </el-form>
        <div class="table_box">
            <fix-table ref="table" border v-loading="loading" element-loading-spinner="el-icon-loading"
                element-loading-text="拼命加载中" :data="tableData" key="list" height="73.7vh" size="small"
                header-row-class-name="my-table-header" class="my-table">
                <el-table-column fixed="left" prop="id" label="ID" align="center" width="60" />
                <el-table-column prop="task_id" label="任务ID" align="center" width="80" />
                <el-table-column prop="title" label="广告标题" align="center" width="140" />
                <el-table-column prop="task_title" label="标题/描述" width="160">
                    <template slot-scope="scope">
                        <span>{{ scope.row.task_title}}</span><br />
                        <span>{{ scope.row.task_desc}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="put_type_name" label="任务类型" align="center" width="110" />
                <el-table-column prop="start_time" label="投放时间" align="left" width="150">
                    <template slot-scope="scope">
                        <span>开始：{{scope.row.start_time_str}}</span><br>
                        <span>结束：{{scope.row.end_time_str}}</span><br>
                        <span>时间：{{scope.row.throw_time}}</span>

                    </template>
                </el-table-column>
                <el-table-column prop="play_speed_name" label="投放速度" align="center" width="90">
                    <template slot-scope="scope">
                        <span>{{scope.row.play_speed_name}}</span>
                        <span class="ico-box" v-if="scope.row.meal_id === '0'" style="cursor: pointer;"><i
                                class="el-icon-edit" @click="editAlert(scope.row,'playSpeed')" /></span>
                    </template>
                </el-table-column>
                <el-table-column prop="is_avg_publish" label="均匀" align="center" width="70">
                    <template slot-scope="scope">
                        <span>{{scope.row.is_avg_publish == 1 ? "是":"否"}}</span>
                        <span class="ico-box" v-if="scope.row.meal_id === '0'" style="cursor: pointer;"><i
                                class="el-icon-edit" @click="editAlert(scope.row,'is_avg_publish')" /></span>
                    </template>
                </el-table-column>
                <el-table-column label="是否转链" prop="is_freely" width="80" align="center">
                    <template slot-scope="scope">
                        <span>{{scope.row.is_freely == 1 ? "是":"否"}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="daily_budget" label="奖励" align="left" width="100">
                    <template slot-scope="scope">
                        <span>类型: {{scope.row.rewardTypeName}}</span><br>
                        <span>数量: {{scope.row.reward_num}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="daily_budget" label="投放预算" align="center" width="80">
                    <template slot-scope="scope">
                        <span>{{scope.row.daily_budget}}</span>
                        <span class="ico-box" v-if="scope.row.meal_id === '0'" style="cursor: pointer;"><i
                                class="el-icon-edit" @click="editAlert(scope.row,'dailyBudget')" /></span>
                    </template>
                </el-table-column>
                <el-table-column prop="click_num" label="流量包" align="center" width="80">
                    <template slot-scope="scope">
                        <span>{{scope.row.click_num}}</span>次
                    </template>
                </el-table-column>

                <el-table-column prop="cpc_money" label="单价/消耗" align="left" width="110">
                    <template slot-scope="scope">
                        <span>单价: {{scope.row.cpc_money}}</span><br>
                        <span>消耗: {{scope.row.consume}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="invite_name" label="归属" align="left" width="120">
                    <template slot-scope="scope">
                        <span>归属: {{scope.row.invite_name}}</span>
                        <!-- <span class="ico-box" style="cursor: pointer;"><i class="el-icon-edit"
                                @click="editAlert(scope.row,'editInviteName')" /></span> -->
                        <br>
                        <span>用户: {{scope.row.user_name ? scope.row.user_name : scope.row.user_id}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="ck_uv" label="点击UV" align="center" width="90" />

                <el-table-column prop="statusName" label="状态" align="center" width="80" />
                <el-table-column prop="anchor_id" label="主播ID" align="center" width="120">
                    <template slot-scope="scope">
                        <a :href="'https://tesi.m.taobao.com/app/mtb/daren-page-esr/pages/index/index.html?userId='+scope.row.anchor_id"
                            target="_blank" rel="noopener noreferrer">{{scope.row.anchor_id}}</a>
                    </template>
                </el-table-column>
                <el-table-column prop="anchor_nickname" label="主播昵称" align="center" width="80">
                    <template slot-scope="scope" v-if="scope.row.task_id != 0">
                        <span>{{scope.row.anchor_nickname}}</span>
                        <span class="ico-box" style="cursor: pointer;"><i class="el-icon-edit"
                                @click="editAlert(scope.row,'anchor_nickname')" /></span>
                    </template>
                </el-table-column>
                <!-- <el-table-column prop="statusName" label="套餐退款状态" align="center" width="120">
                    <template slot-scope="scope">
                        <span v-if="scope.row.meal_id != 0 && scope.row.user_id == 0">
                            退款完成
                        </span>
                        <span v-else-if="scope.row.meal_id != 0 && scope.row.user_id != 0">
                            未退款
                        </span>
                        <span v-else>
                            /
                        </span>
                    </template>
                </el-table-column> -->

                <el-table-column fixed="right" label="操作" width="140" align="center">
                    <template slot-scope="scope">
                        <el-button @click="report(scope.row)" v-if="scope.row.task_id!=0" size="small" type="text">统计
                        </el-button>
                        <el-button @click="edit(scope.row)" v-if="scope.row.status==0" type="text" size="small">审核
                        </el-button>
                        <el-button @click="suspend(scope.row)" v-if="scope.row.status==1" type="text" size="small">暂停
                        </el-button>
                        <el-button @click="launch(scope.row)" v-if="scope.row.status==5" type="text" size="small">投放
                        </el-button>
                        <el-button @click="mealReimburse(scope.row)"
                            v-if="scope.row.meal_id!=0 && scope.row.user_id != 0 && scope.row.status != 0" type="text"
                            size="small">套餐退款</el-button>
                        <el-button @click="relice(scope.row)" v-if="scope.row.anchor_id!='0'" type="text" size="small">
                            解除主播绑定</el-button>
                    </template>
                </el-table-column>

            </fix-table>
        </div>
        <div class="pages">
            <el-pagination @current-change="currentChange" layout="total, prev, pager, next" :page-size="dataForm.size"
                :current-page="dataForm.p" :total="dataForm.totalNum" />
        </div>

        <el-dialog title="修改投放速度" :visible.sync="playSpeedVisible" custom-class="my-dialog" width="30%"
            :append-to-body="true" :close-on-press-escape="false">
            <el-form :model="infoForm" size="medium">
                <el-form-item label-width="100px" label="投放速度">
                    <el-select v-model="infoForm.play_speed" placeholder="投放速度" size="mini">
                        <el-option v-for="(item,index) in playSpeed" :key="index" :value="index" :label="item" />
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="postData('playSpeed')">修 改</el-button>
                <el-button type="info" @click="playSpeedVisible = false">关 闭</el-button>
            </div>
        </el-dialog>

        <el-dialog title="修改投放预算" :visible.sync="dailyBudgetVisible" custom-class="my-dialog" width="30%"
            :append-to-body="true" :close-on-press-escape="false">
            <el-form :model="infoForm" size="medium">
                <el-form-item label="每日预算" label-width="100px">
                    <el-input v-model="infoForm.daily_budget" autocomplete="off" placeholder="请填写每日预算" clearable />
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="postData('dailyBudget')">修 改</el-button>
                <el-button type="info" @click="dailyBudgetVisible = false">关 闭</el-button>
            </div>
        </el-dialog>

        <el-dialog title="修改均匀投放" :visible.sync="dailyisAvgVisible" custom-class="my-dialog" width="30%"
            :append-to-body="true" :close-on-press-escape="false">
            <el-form :model="infoForm" size="medium">
                <el-form-item label="均匀投放：" label-width="100px">
                    <el-radio-group v-model="infoForm.is_avg_publish">
                        <el-radio :label="'1'">是</el-radio>
                        <el-radio :label="'0'">否</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="postData('is_avg_publish')">修 改</el-button>
                <el-button type="info" @click="dailyisAvgVisible = false">关 闭</el-button>
            </div>
        </el-dialog>

        <el-dialog title="修改主播昵称" :visible.sync="dailyAnchorNicknameVisible" custom-class="my-dialog" width="30%"
            :append-to-body="true" :close-on-press-escape="false">
            <el-form :model="infoForm" size="medium">
                <el-form-item label="主播昵称：" label-width="100px">
                    <el-input v-model="infoForm.anchor_nickname" autocomplete="off" placeholder="请填写主播昵称" clearable />
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="postData('anchor_nickname')">修 改</el-button>
                <el-button type="info" @click="dailyAnchorNicknameVisible = false">关 闭</el-button>
            </div>
        </el-dialog>

        <el-dialog title="修改归属人" :visible.sync="dailyEditInviteNameVisible" custom-class="my-dialog" width="30%"
            :append-to-body="true" :close-on-press-escape="false">
            <el-form :model="infoForm" size="medium">
                <el-form-item label="归属人：" label-width="100px">
                    <el-select v-model="infoForm.invite_name" placeholder="归属人" size="mini">
                        <el-option v-for="(item,index) in salesmanList" :key="index" :value="item.name"
                            :label="item.name" />
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="postData('invite_name')">修 改</el-button>
                <el-button type="info" @click="dailyEditInviteNameVisible = false">关 闭</el-button>
            </div>
        </el-dialog>

        <el-dialog title="审核" :visible.sync="showDialog" custom-class="my-dialog" width="42%" :append-to-body="true"
            :close-on-press-escape="false">
            <el-form :model="infoForm" size="medium">
                <el-row :gutter="20" type="flex">
                    <el-col :span="12">
                        <el-form-item label="标题" label-width="100px">
                            <el-input v-model="infoForm.task_title" autocomplete="off" placeholder="请填写互动区标题"
                                clearable />
                        </el-form-item>
                        <el-form-item label="气泡标题" label-width="100px">
                            <el-input v-model="infoForm.bubble_title" autocomplete="off" placeholder="请填写气泡标题"
                                clearable />
                        </el-form-item>
                        <el-form-item label="描述" label-width="100px">
                            <el-input v-model="infoForm.task_desc" autocomplete="off" placeholder="请填写互动区描述"
                                clearable />
                        </el-form-item>
                        <!-- <el-form-item label="完成描述" label-width="100px">
                            <el-input v-model="infoForm.task_complete_desc" autocomplete="off" placeholder="请填写互动区完成描述"
                                clearable />
                        </el-form-item> -->
                        <el-form-item label="按钮名称" label-width="100px">
                            <el-input v-model="infoForm.button_name" autocomplete="off" placeholder="请填写按钮名称"
                                clearable />
                        </el-form-item>
                        <el-form-item label="商家名称" label-width="100px">
                            <el-input v-model="infoForm.merchant_name" autocomplete="off" placeholder="请填写商家名称"
                                clearable />
                        </el-form-item>
                        <el-form-item label="直播ID" label-width="100px">
                            <el-input v-model="infoForm.anchor_id" autocomplete="off" placeholder="请填写直播ID" clearable />
                            <span v-if="infoForm.anchor_id" style="color: #999;font-size:12px;">
                                <a :href="'https://tesi.m.taobao.com/app/mtb/daren-page-esr/pages/index/index.html?userId='+infoForm.anchor_id"
                                    target="_blank" rel="noopener noreferrer">直播间ID：{{infoForm.anchor_id}}</a>
                            </span>
                        </el-form-item>
                        <el-form-item label="主播名称" label-width="100px">
                            <el-input v-model="anchor_nickname" autocomplete="off" placeholder="请填写主播名称" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="投放预算" label-width="100px">
                            <el-input v-model="infoForm.daily_budget" autocomplete="off" placeholder="请填写投放预算"
                                clearable />
                        </el-form-item>
                        <el-form-item label="展示区域" label-width="100px">
                            <el-select v-model="infoForm.exhibition_area" placeholder="展示区域">
                                <el-option :value="0" label="气泡+互动" />
                                <el-option :value="1" label="气泡" />
                                <el-option :value="2" label="互动" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="跳转类型" label-width="100px">
                            <el-select v-model="infoForm.type" placeholder="跳转类型">
                                <el-option :value="1" label="url跳转" />
                                <el-option :value="2" label="小程序跳转" />
                                <el-option :value="3" label="跳转页面" />
                                <el-option :value="4" label="关注生活号" />
                                <el-option :value="5" label="插件页面" />
                                <el-option :value="6" label="跳转生活号" />
                                <el-option :value="7" label="跳转指定页面" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="跳转链接" label-width="100px">
                            <el-input v-model="infoForm.jump_url" autocomplete="off" placeholder="请填写跳转链接" clearable />
                        </el-form-item>
                        <el-form-item label="投放速度" label-width="100px">
                            <el-select v-model="infoForm.play_speed" placeholder="投放速度">
                                <el-option v-for="(item,index) in playSpeed" :key="index" :value="index"
                                    :label="item" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label-width="100px" label="投放日期">
                            <el-date-picker end-placeholder="结束日期" range-separator="至" start-placeholder="开始日期"
                                style="width:100%" type="daterange" v-model="infoForm.daterange"
                                value-format="timestamp" />
                        </el-form-item>
                        <el-form-item label-width="100px" label="投放时间">
                            <div class="new_time_picker2" v-for="(item,index) in timesArr" :key="index">
                                <el-time-picker style="width:80%" is-range v-model="timesArr[index]"
                                    start-placeholder="请选择" end-placeholder="请选择" value-format="HH:mm:ss"
                                    placeholder="选择时间范围" format="HH:mm" @change="chooseTime(timesArr[index],index)">
                                </el-time-picker>
                            </div>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="examine()">审 核</el-button>
                <el-button type="danger" @click="refuseAd()">拒 绝</el-button>
                <el-button type="info" @click="showDialog = false">关 闭</el-button>
            </div>
        </el-dialog>

        <!-- <statistics :dataForm="info" v-model="dialogStatistics"></statistics> -->
        <Statistics TipsTitle="纷推投放统计" TipsWidth="800px" :dataForm="info" :value="dialogStatistics"
            @closeDialog="closeDialog()" />
    </div>
</template>
<script>
    String.prototype.myReplace = function (f, e) { // 吧f替换成e
        let reg = new RegExp(f, 'g') // 创建正则RegExp对象
        return this.replace(reg, e)
    }
    import Statistics from "@/components/Statistics.vue";

    export default {
        name: "taskFtList",
        data() {
            return {
                dialogStatistics: false, //统计弹窗显示
                showDialog: false, //主弹窗
                loading: false,
                dataForm: {
                    invite_name: '',
                    anchor: -1,
                    dev: 0,
                    status: -1,
                    p: 1,
                    size: 18,
                    totalNum: 10,
                    keyword: '',
                },
                info: {
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
                anchor_count: 0, //主播数量
                tableData: [],
                infoForm: {},
                anchorStatusList: [{
                        value: -1,
                        label: '主播昵称'
                    },
                    {
                        value: 0,
                        label: '未填写'
                    },
                    {
                        value: 1,
                        label: '已填写'
                    },
                ],
                statusList: [{
                        value: -1,
                        label: '全部状态'
                    },
                    {
                        value: 0,
                        label: '未审核'
                    },
                    {
                        value: 1,
                        label: '已审核'
                    },
                    {
                        value: 2,
                        label: '审核未通过'
                    },
                    {
                        value: 3,
                        label: '每日点击限额'
                    },
                    {
                        value: 4,
                        label: '账户每日限额'
                    },
                    {
                        value: 5,
                        label: '暂停'
                    },
                    {
                        value: 6,
                        label: '余额不足'
                    },
                    {
                        value: 7,
                        label: '未提交'
                    },
                    {
                        value: 8,
                        label: '已到期'
                    },
                ],
                devList: [{
                        value: 0,
                        label: '正常'
                    },
                    {
                        value: 1,
                        label: '测试'
                    },
                ],
                options: [{
                        value: 0,
                        label: '正常'
                    },
                    {
                        value: 1,
                        label: '测试'
                    },
                ],
                playSpeedVisible: false, //速度弹窗
                dailyBudgetVisible: false, //预算弹窗
                playSpeed: ['极速', '正常', '缓慢', '极缓', '极速+'],
                timesArr: [null], // 多段时间
                dailyisAvgVisible: false,
                dailyAnchorNicknameVisible: false, //修改主播昵称弹窗
                salesmanList: [], //归属人列表
                dailyEditInviteNameVisible: false, //修改归属弹窗
                anchor_nickname: '', //审核时用于填写主播名称
            }
        },
        components: {
            // statistics
            Statistics
        },
        watch: {
            'dataForm.keyword': {
                handler(val) {
                    this.dataForm.keyword = val.trim();
                    if (val.indexOf('userId%3D') !== -1 && val.indexOf('%26') !== -1) {
                        if (val.substr(0, 9) !== 'tbopen://' || val.substr(-10, 10) !== 'taobaolive') {
                            this.$message.warning('请输入正确格式的链接')
                            return
                        }
                        this.open1('链接已识别')
                        this.dataForm.keyword = val.substring(val.indexOf('userId%3D') + 9, val.indexOf('%26'))
                        return;
                    }
                    if (val.indexOf('userId%25253D') !== -1 && val.indexOf('%252526livesource') !== -1) {
                        if (val.substr(0, 32) !== 'https%3A%2F%2Fmobile.yhshapp.com' || val.substr(-10, 10) !==
                            'taobaolive') {
                            this.$message.warning('请输入正确格式的链接')
                            return
                        }
                        this.open1('链接已识别')
                        this.dataForm.keyword = val.substring(val.indexOf('userId%25253D') + 13, val.indexOf(
                            '%252526livesource'))
                        return;
                    }
                }
            },
        },
        created() {
            this.loadData();
            this.getSalesmanList();
        },
        methods: {
            closeDialog() {
                this.dialogStatistics = false;
            },
            // 获取归属人列表
            getSalesmanList() {
                this.getRequest('/xcxTask/salesman', {}).then((res) => {
                    if (res.code == 200) {
                        if (res.data) {
                            this.salesmanList = []
                            for (let key in res.data) {
                                let obj = {
                                    key: '',
                                    value: ''
                                }
                                obj.id = key
                                obj.name = res.data[key]
                                this.salesmanList.push(obj)
                            }
                        }
                    } else {

                    }
                })
            },
            //统计
            report(row) {
                this.info = Object.assign({}, row)
                this.info.id = row.task_id
                this.info.options = {
                    legend: {
                        data: ['点击UV', '点击PV', '消耗']
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
                        data: ['数量']
                    },
                    yAxis: [{}, {}],
                    series: [{
                        data: [1],
                        name: '点击UV',
                        areaStyle: {},
                        type: 'line',
                        yAxisIndex: 0,
                        smooth: true
                    }, {
                        data: [1],
                        name: '点击PV',
                        areaStyle: {},
                        type: 'line',
                        yAxisIndex: 0,
                        smooth: true
                    }, {
                        data: [1],
                        name: '消耗',
                        areaStyle: {},
                        type: 'line',
                        yAxisIndex: 0,
                        smooth: true
                    }]
                }
                this.info.timeData = [{
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
                this.info.postUrl = '/Daniu/report'
                this.dialogStatistics = true
            },
            //拒绝
            refuseAd() {
                this.$prompt('请输入拒绝理由', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消'
                }).then(({
                    value
                }) => {
                    if (value == null) {
                        this.$message({
                            message: '请输入拒绝理由',
                            type: 'warning',
                            showClose: true,
                            duration: 1000
                        })
                    } else {
                        this.postExamine(2, value)
                    }
                }).catch(() => {})
            },
            //审核
            examine() {
                if (this.infoForm.anchor_id !== '' && this.anchor_nickname == '') {
                    this.$message.error('请输入主播昵称')
                    return;
                }
                this.$confirm('是否审核该广告,审核后会自动上线?', '提示', {
                    confirmButtonText: '审核',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.postExamine(1, '')
                }).catch(() => {})
            },
            //审核或拒绝的执行接口
            postExamine(status, refuse) {
                this.postRequest('/Daniu/examineAd', {
                    id: this.infoForm.id,
                    status: status,
                    refuse: refuse,
                    anchor_nickname: this.anchor_nickname,
                }).then(resp => {
                    if (resp && resp.code === 200) {
                        this.$message({
                            message: resp.msg,
                            type: 'success',
                            showClose: true,
                            duration: 1000,
                            onClose: () => {
                                this.showDialog = false
                                this.loadData()
                            }
                        })
                    } else {
                        this.$message({
                            message: resp.msg,
                            type: 'warning',
                            showClose: true,
                            duration: 1000
                        })
                    }
                })
            },
            //退款
            mealReimburse(row) {
                this.$confirm('此操作将退款并解除用户绑定, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.postRequest('/Daniu/mealReimburse', {
                        adId: row.id,
                    }).then((res) => {
                        if (res.code == 200) {
                            this.open2(res.msg)
                            this.tableData = []
                            this.dataForm.p = 1
                            this.loadData()
                        } else {
                            this.open3(res.msg)
                        }
                    }).catch((err) => {

                    })
                }).catch(() => {

                })

            },
            //解除主播绑定
            relice(row) {
                this.$confirm('此操作将解除主播绑定, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.loading = true;
                    this.postRequest('/Daniu/untieAnchor', {
                        id: row.id,
                    }).then((res) => {
                        this.$message.success('解除绑定成功')
                        this.tableData = []
                        this.dataForm.p = 1
                        this.loadData()
                        row.anchor_id = "0";
                    }).catch((res) => {

                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消操作'
                    });
                });
            },
            //投放
            launch(row) {
                this.$confirm('是否投放该广告?', '提示', {
                    confirmButtonText: '投放',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.postRequest('/Daniu/launchAd', {
                        id: row.id
                    }).then(resp => {
                        if (resp && resp.code === 200) {
                            this.$message({
                                message: resp.msg,
                                type: 'success',
                                showClose: true,
                                duration: 1000,
                                onClose: () => {
                                    row.status = 1
                                    row.statusName = '投放中'
                                }
                            })
                        } else {
                            this.$message({
                                message: resp.msg,
                                type: 'warning',
                                showClose: true,
                                duration: 1000
                            })
                        }
                    })
                }).catch(() => {})
            },
            //暂停
            suspend(row) {
                this.$confirm('是否暂停该广告?', '提示', {
                    confirmButtonText: '暂停',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.postRequest('/Daniu/suspendAd', {
                        id: row.id
                    }).then(resp => {
                        if (resp && resp.code === 200) {
                            this.$message({
                                message: resp.msg,
                                type: 'success',
                                showClose: true,
                                duration: 1000,
                                onClose: () => {
                                    row.status = 5
                                    row.statusName = '已暂停'
                                }
                            })
                        } else {
                            this.$message({
                                message: resp.msg,
                                type: 'warning',
                                showClose: true,
                                duration: 1000
                            })
                        }
                    })
                }).catch(() => {})
            },
            //审核
            edit(row) {
                this.anchor_nickname = '';
                let infoForm = Object.assign({}, row)
                let start = this.$utils.timestamp(infoForm.start_time * 1000, 'yyyy-MM-dd')
                let end = this.$utils.timestamp(infoForm.end_time * 1000, 'yyyy-MM-dd')
                infoForm.daterange = [start, end]

                let start_time = this.$utils.timestamp(infoForm.time_start * 1000, 'yyyy-MM-dd HH:ii:ss')
                let end_time = this.$utils.timestamp(infoForm.time_end * 1000, 'yyyy-MM-dd HH:ii:ss')
                infoForm.timerange = [start_time, end_time]

                this.timesArr = row.time_list == '' ? [start_time, end_time] : row.time_list_str == undefined ? [
                    start_time, end_time
                ] : JSON.parse(JSON.stringify(row.time_list_str))

                this.infoForm = infoForm
                this.showDialog = true
            },
            //修改速度或预算
            editAlert(row, type) {
                this.infoForm = JSON.parse(JSON.stringify(row))
                if (type === 'playSpeed') {
                    this.playSpeedVisible = true
                } else if (type === 'dailyBudget') {
                    this.dailyBudgetVisible = true
                } else if (type === 'is_avg_publish') {
                    this.dailyisAvgVisible = true
                } else if (type === 'anchor_nickname') {
                    this.dailyAnchorNicknameVisible = true
                } else if (type === 'editInviteName') {
                    this.dailyEditInviteNameVisible = true
                }


            },
            postData(type) {
                let url = '/Daniu/editAd';
                let options = {}
                if (type === 'playSpeed') {
                    options = {
                        id: this.infoForm.id,
                        play_speed: this.infoForm.play_speed
                    }
                } else if (type === 'dailyBudget') {
                    options = {
                        id: this.infoForm.id,
                        daily_budget: this.infoForm.daily_budget
                    }
                } else if (type === 'is_avg_publish') {
                    options = {
                        id: this.infoForm.id,
                        is_avg_publish: this.infoForm.is_avg_publish
                    }
                } else if (type === 'anchor_nickname') {
                    url = '/XcxTask/editAnchorNickname';
                    options = {
                        id: this.infoForm.task_id,
                        anchor_id: this.infoForm.anchor_id,
                        anchor_nickname: this.infoForm.anchor_nickname
                    }
                } else if (type === 'invite_name') {
                    options = {
                        id: this.infoForm.id,
                        invite_name: this.infoForm.invite_name
                    }
                } else {
                    options = Object.assign({}, this.infoForm)
                    options.start_time = options.daterange[0] / 1000
                    options.end_time = options.daterange[1] / 1000
                    options.time_start = options.timerange[0] / 1000
                    options.time_end = options.timerange[1] / 1000

                    // 多段时间处理
                    for (let i = 0; i < this.timesArr.length; i++) {
                        if (this.timesArr[i] == null) {
                            this.$message.warning('多段时间不能为空')
                            return
                        }
                    }

                    let jsonTimeArr = {}
                    if (this.timesArr.length == 1 && this.timesArr[0] == null) {

                    } else {
                        let array = []
                        array = this.timesArr.map(item => {
                            return item = [
                                '1' + item[0].myReplace(':', ''),
                                '1' + item[1].myReplace(':', '')
                            ]
                        })
                        // let jsonTimeArr = {}
                        array.forEach((element, index) => {
                            jsonTimeArr[index] = element
                        })
                    }
                    options.time_list = (jsonTimeArr == {} ? '' : JSON.stringify(jsonTimeArr)) // 多段时间
                }
                this.dailyBudgetVisible = false
                this.playSpeedVisible = false
                this.dailyisAvgVisible = false
                this.dailyAnchorNicknameVisible = false
                this.dailyEditInviteNameVisible = false
                this.showDialog = false
                this.postRequest(url, options).then(resp => {
                    if (resp && resp.code === 200) {
                        this.$message({
                            message: resp.msg,
                            type: 'success',
                            showClose: true,
                            duration: 1000,
                            onClose: () => {

                            }
                        })
                        if (type === 'playSpeed') {
                            // this.infoForm.play_speed_name = this.playSpeed[this.infoForm.play_speed]
                            this.tableData.forEach(ele => {
                                if (ele.id == this.infoForm.id) {
                                    ele.play_speed_name = this.playSpeed[this.infoForm.play_speed];
                                    ele.play_speed = this.infoForm.play_speed
                                }
                            })
                            this.playSpeedVisible = false
                        } else if (type === 'dailyBudget') {
                            this.tableData.forEach(ele => {
                                if (ele.id == this.infoForm.id) {
                                    ele.daily_budget = this.infoForm.daily_budget;
                                }
                            })
                            this.dailyBudgetVisible = false
                        } else if (type === 'is_avg_publish') {
                            this.tableData.forEach(ele => {
                                if (ele.id == this.infoForm.id) {
                                    ele.is_avg_publish = this.infoForm.is_avg_publish;
                                }
                            })
                            this.dailyisAvgVisible = false
                        } else if (type === 'anchor_nickname') {
                            this.tableData.forEach(ele => {
                                if (ele.id == this.infoForm.id) {
                                    ele.anchor_nickname = this.infoForm.anchor_nickname;
                                }
                            })
                            this.dailyAnchorNicknameVisible = false
                        } else if (type === 'invite_name') {
                            this.tableData.forEach(ele => {
                                if (ele.id == this.infoForm.id) {
                                    ele.invite_name = this.infoForm.invite_name;
                                }
                            })
                            this.dailyEditInviteNameVisible = false
                        } else {
                            this.showDialog = false
                            this.loadData()
                        }
                    } else {
                        if (type === 'playSpeed') {
                            this.playSpeedVisible = true
                        } else if (type === 'dailyBudget') {
                            this.dailyBudgetVisible = true
                        } else if (type === 'is_avg_publish') {
                            this.dailyisAvgVisible = true
                        } else if (type === 'anchor_nickname') {
                            this.dailyAnchorNicknameVisible = true
                        } else if (type === 'invite_name') {
                            this.dailyEditInviteNameVisible = true
                        } else {
                            this.showDialog = true
                        }
                        this.$message({
                            message: resp.msg,
                            type: 'warning',
                            showClose: true,
                            duration: 1000
                        })
                    }
                })
            },
            // 搜索执行
            submitForm: function () {
                this.tableData = []
                this.dataForm.p = 1
                this.loadData()
            },
            // 请求数据
            loadData() {
                this.loading = true
                this.getRequest('/Daniu/getList', this.dataForm).then(resp => {
                    this.loading = false
                    if (resp && resp.code === 200) {
                        if (this.dataForm.p == 1) {
                            this.anchor_count = resp.data.anchor_count
                        }
                        this.dataForm.totalNum = resp.data.total
                        resp.data.list.map(item => {
                            item.start_end = [
                                item.start_time * 1000,
                                item.end_time * 1000
                            ]
                        })
                        this.tableData = resp.data.list
                        this.tableData.forEach(ele => {
                            ele.throw_time = (this.dealTimes(ele.time_list, ele.time_list_str) == '' ?
                                `${ele.time_start_str.substring(0, 5)}至${ele.time_end_str.substring(0, 5)}` :
                                this.dealTimes(ele.time_list, ele.time_list_str))
                        })
                    }
                })
            },
            // 多段时间选择确认
            chooseTime(val, arrindex) {
                if (val != null) {
                    try {
                        val.forEach(ele => {
                            this.timesArr.forEach((element, index) => {
                                if (element != null) {
                                    if (index == arrindex) {

                                    } else {
                                        if (element[0] < ele && ele < element[1]) {
                                            this.timesArr.splice(arrindex, 1)
                                            this.timesArr.push(null)
                                            this.open3('时间范围不能交叉')
                                            throw new Error('delete')
                                        }
                                    }
                                }
                            })
                        })
                    } catch (error) {
                        if (error.message != 'delete') {
                            throw error
                        }
                    }

                    try {
                        this.timesArr.forEach((element, index) => {
                            if (element != null) {
                                if (index == arrindex) {

                                } else {
                                    if (val[0] < element[0] && val[1] > element[1]) {
                                        this.timesArr.splice(arrindex, 1)
                                        this.timesArr.push(null)
                                        this.open3('时间范围不能包含已有时间')
                                        throw new Error('delete')
                                    }
                                }
                            }
                        })
                    } catch (error) {
                        if (error.message != 'delete') {
                            throw error
                        }
                    }
                } else {

                }
            },
            // 多短时间处理
            dealTimes(timelist, timelist_str) {
                if (timelist == '') {
                    return ''
                } else {
                    let newTime = this.dateFormat('HH:MM:SS', new Date())
                    // console.log('timelist',newTime,timelist,timelist_str)
                    if (timelist_str != undefined) {
                        let notlate = timelist_str.filter(item => {
                            return item[1] > newTime // 结束时间大于现在
                        })
                        if (notlate.length == 0) {
                            // let vipTime = timelist_str[Math.floor(Math.random() * timelist_str.length)]
                            let vipTime = timelist_str[0]
                            return `${vipTime[0].substring(0, 5)}至${vipTime[1].substring(0, 5)}`
                        } else {
                            let nostart = notlate.filter(item => {
                                return item[0] < newTime // 开始时间小于现在
                            })
                            if (nostart.length == 0) {
                                let nearArr = []
                                notlate.forEach(element => {
                                    let time = {
                                        timenum: new Date(
                                            `${this.dateFormat('YYYY-mm-dd', new Date())} ${element[0]}`
                                        ).getTime() / 1000 - new Date().getTime() / 1000,
                                        str: `${element[0].substring(0, 5)}至${element[1].substring(0, 5)}`
                                    }
                                    nearArr.push(time)
                                })
                                nearArr.sort((a, b) => {
                                    return a.timenum - b.timenum
                                })
                                return `${nearArr[0].str}`
                            } else {
                                let vipTimeIsStart = nostart[Math.floor(Math.random() * nostart.length)]
                                return `${vipTimeIsStart[0].substring(0, 5)}至${vipTimeIsStart[1].substring(0, 5)}`
                            }
                        }
                    } else {
                        return ''
                    }
                }
            },
            // 时间处理important
            dateFormat(fmt, date) {
                let ret
                const opt = {
                    'Y+': date.getFullYear().toString(), // 年
                    'm+': (date.getMonth() + 1).toString(), // 月
                    'd+': date.getDate().toString(), // 日
                    'H+': date.getHours().toString(), // 时
                    'M+': date.getMinutes().toString(), // 分
                    'S+': date.getSeconds().toString() // 秒
                    // 有其他格式化字符需求可以继续添加，必须转化成字符串
                }
                for (let k in opt) {
                    ret = new RegExp('(' + k + ')').exec(fmt)
                    if (ret) {
                        fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length,
                            '0')))
                    }
                }

                return fmt
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
            open1(msg) {
                this.$message({
                    showClose: true,
                    message: msg,
                })
            },
            open2(msg) {
                this.$message({
                    showClose: true,
                    message: msg,
                    type: 'success',
                })
            },
            open3(msg) {
                this.$message({
                    showClose: true,
                    message: msg,
                    type: 'warning',
                })
            },
            open4(msg) {
                this.$message({
                    showClose: true,
                    message: msg,
                    type: 'error',
                })
            },
        },
        computed: {
            uploadUrl() {
                return this.$store.state.base.uploadUrl
            }
        },
        mounted() {}
    };

</script>

<style lang='scss' scoped>
    .table_box>>>.el-table__fixed-right-patch {
        background-color: #EFF5FF !important;
    }

    .el-form-item-right>>>.el-form-item__content {
        line-height: inherit;
    }

</style>
