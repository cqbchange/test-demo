<!--
 * @Descripttion: 任务管理
 * @version: 1.0
 * @Author: Dulei
 * @Date: 2021-01-19 10:42:43
 * @LastEditors: WangChuan
 * @LastEditTime: 2021-08-06 15:16:20
-->
<template>
    <div id="ad">
        <!-- 头部 -->
        <div class="topBox">
            <div>
                <el-form :inline="true" ref="dataForm" class="demo-form-inline">
                    <el-form-item style="flex:1;">
                        <!-- <el-button icon="el-icon-search" size="mini" @click="submitForm()">查询</el-button>
            <el-button @click="reload" icon="el-icon-refresh" size="mini">刷新</el-button> -->
                        <el-button size="medium" type="primary" icon="el-icon-plus" class="my-blue-btn" @click="add">
                            添加任务</el-button>
                        <el-button size="medium" class="my-def-btn" @click="batchDialogFun()">批量操作</el-button>
                        <!-- <el-button @click="taskOnLowershelf('1')" icon="el-icon-s-operation" size="mini">一键上架</el-button>
            <el-button @click="taskOnLowershelf('0')" icon="el-icon-s-operation" size="mini">一键下架</el-button>
            <el-button @click="editBatch()" icon="el-icon-s-operation" size="mini">批量编辑</el-button>
            <el-button @click="editUrlBatch()" icon="el-icon-s-operation" size="mini">任务跳转</el-button>
            <el-button @click="editmechanism()" icon="el-icon-s-operation" size="mini">批选机构</el-button> -->
                    </el-form-item>
                    <el-form-item>
                        <el-button size="medium" @click="generateAnchor()">生成主播链接</el-button>
                    </el-form-item>
                    <el-form-item style="width:150px;">
                        <el-select size="medium" filterable v-model="mmid" :disabled="loading" placeholder="小程序"
                            @change="xcxChange">
                            <el-option value="" label="全部小程序" />
                            <el-option v-for="(item,index) in mList" :value="index" :label="item" :key="index" />
                        </el-select>
                    </el-form-item>
                    <el-form-item style="width:150px;">
                        <el-select size="medium" filterable v-model="slotId" :disabled="slotLoading||loading"
                            placeholder="区域" @change="slotChange">
                            <el-option value="" label="全部区域" />
                            <el-option :key="item.id" :label="item.name" :value="item.id" v-for="item in categoryList">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item style="width:150px;">
                        <el-select size="medium" filterable v-model="list_status" :disabled="slotLoading||loading"
                            placeholder="上线状态">
                            <el-option label="正常" :value="1"></el-option>
                            <el-option label="未上线" :value="2"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item style="width:150px;">
                        <el-select size="medium" filterable v-model="dev" :disabled="loading">
                            <el-option value="0" label="正式任务" />
                            <el-option value="1" label="内部测试" />
                            <el-option value="2" label="用户测试" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label prop="keyword" style="width:200px;">
                        <el-input size="medium" @clear="submitForm()" @change="submitForm()" placeholder="搜索"
                            v-model="keyword" class="input-search-btn" clearable>
                            <el-button size="medium" slot="append" icon="el-icon-search" @click="submitForm()">
                            </el-button>
                        </el-input>
                    </el-form-item>
                </el-form>
            </div>
        </div>
        <!-- /头部 -->
        <!-- 表格 -->
        <fix-table border v-loading="loading" element-loading-spinner="el-icon-loading" element-loading-text="拼命加载中"
            :data="tableData" key="list" height="73.7vh" size="small" header-row-class-name="my-table-header"
            class="my-table" ref="taskTable" @sort-change="sortchange">
            <el-table-column fixed type="selection" width="40" align="center" header-align="center"
                :selectable="checkboxInit" />
            <el-table-column align="center" fixed header-align="center" label="ID" prop="id" width="90" />
            <el-table-column label="标题/描述" prop="title" width="230">
                <template slot-scope="scope">
                    <span>{{scope.row.title}}</span><br>
                    <span>{{scope.row.subtitle}}</span>
                </template>
            </el-table-column>
            <el-table-column label="小程序" prop="categories" align="center" width="120">
                <template slot-scope="scope">
                    <div @click="ckXcxInfo(scope.row)" v-if="scope.row.isShowXcxList">
                        <span>已选:</span>{{scope.row.miniprogram.length}}
                        <br />
                        <span>未选:</span>{{Object.keys(xcxSlot).length-scope.row.miniprogram.length}}
                    </div>
                    <el-tag :key="index" type="success" v-for="(item,index) in scope.row.miniprogram" v-else>
                        {{item}}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column label="区域" prop="categories" align="center" width="160">
                <template slot-scope="scope">
                    <div :key="index" type="success" v-for="(category,index) in scope.row.qy">
                        {{index}}
                    </div>
                </template>
            </el-table-column>
            <el-table-column align="center" label="任务/跳转类型" prop="type" width="120">
                <template slot-scope="scope">
                    <div v-if="scope.row.put_type_name != '普通任务'">
                        <span>{{scope.row.put_type_name}}</span>
                    </div>
                    <div v-else>
                        <span v-if="scope.row.type === '1'">链接跳转</span>
                        <span v-if="scope.row.type === '2'">小程序跳转</span>
                        <span v-if="scope.row.type === '3'">跳转页面</span>
                        <span v-if="scope.row.type === '4'">关注生活号</span>
                        <span v-if="scope.row.type === '5'">插件页面</span>
                        <span v-if="scope.row.type === '6'">跳转生活号</span>
                        <span v-if="scope.row.type === '7'">跳转指定页面</span>
                        <span v-if="scope.row.type === '8'">增加到桌面</span>
                        <span v-if="scope.row.type === '9'">增加到首页</span>
                        <span v-if="scope.row.type === '10'">收藏小程序</span>
                        <span v-if="scope.row.type === '11'">邀请好友</span>
                        <span v-if="scope.row.type === '12'">加群</span>
                        <span v-if="scope.row.type === '13'">跳转指定页面(饿了么)</span>
                        <span v-if="scope.row.type === '14'">跳转淘宝</span>
                        <span v-if="scope.row.type === '15'">关注财富号</span>
                        <span v-if="scope.row.type === '18'">聚合拉新</span>
                        <span v-if="scope.row.type === '19'">CPA&CPM</span>
                        <span v-if="scope.row.type === '20'">灯火商品</span>
                        <span v-if="scope.row.type === '21'">顶部收藏</span>
                        <span v-if="scope.row.type === '22'">2千任务</span>
                    </div>
                    <!-- <span v-if="scope.row.type === '17'">云猫猫</span>
          <span v-if="scope.row.type === '18'">云码</span>  -->
                </template>
            </el-table-column>
            <el-table-column label="均匀" prop="is_avg_publish" width="70" align="center">
                <template slot-scope="scope">
                    <span>{{scope.row.is_avg_publish == 1 ? "是":"否"}}</span>
                </template>
            </el-table-column>
            <el-table-column label="是否转链" prop="is_avg_publish" width="80" align="center">
                <template slot-scope="scope">
                    <span>{{scope.row.is_freely == 1 ? "是":"否"}}</span>
                </template>
            </el-table-column>
            <!-- <el-table-column label="日期/小时" prop="time" width="170"> -->
            <el-table-column label="日期/时间" prop="time" width="142" sortable="time">
                <template slot-scope="scope">
                    <span>开始: {{scope.row.start_time_str}}</span><br>
                    <span>结束: {{scope.row.end_time_str}}</span><br>

                    <!-- <span>小时开始: {{scope.row.time_start_str}}</span><br>
          <span>小时结束: {{scope.row.time_end_str}}</span><br> -->

                    <span>时间: {{scope.row.throw_time}}</span><br>
                </template>
            </el-table-column>
            <el-table-column label="奖励类型" prop="reward_type" width="110">
                <template slot-scope="scope">
                    <span v-if="scope.row.reward_type === '1'">奖励积分（{{scope.row.integral}}积分）</span>
                    <span v-if="scope.row.reward_type === '2'">奖励步数（{{scope.row.step}}步）</span>
                    <span v-if="scope.row.reward_type === '3'">红包（{{scope.row.money}}元）</span>
                    <span v-if="scope.row.reward_type === '4'">集分宝（{{scope.row.jfb}}）</span>
                    <span v-if="scope.row.reward_type === '5'">心愿豆（{{scope.row.wish_bean}}）</span>
                    <span v-if="scope.row.reward_type === '6'">幸运币（{{scope.row.lucky_coin}}）</span>
                    <span v-if="scope.row.reward_type === '7'">能量豆（{{scope.row.energy_bean}}）</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="排序" prop="list_order" sortable="list_order" width="80">
            </el-table-column>
            <el-table-column align="center" label="今日点击" prop="clickCount" width="120">
                <template slot-scope="scope">
                    <span>{{scope.row.today_click_amount}}/{{scope.row.limit_click_amount}}</span><br>
                    <span>{{scope.row.click_amount}}/{{scope.row.limit_amount}}</span><br>
                </template>
            </el-table-column>
            <el-table-column align="center" label="云码数" prop="aliTaskExposure" width="80"></el-table-column>
            <el-table-column align="center" label="赠送比例" prop="clickCount" width="80">
                <template slot-scope="scope">
                    <span>{{scope.row.gift_ratio + '%'}}</span>
                    <i style="margin-left:2px;cursor:pointer;" @click="editRate(scope.row)" class="el-icon-edit"></i>
                </template>
            </el-table-column>
            <el-table-column align="center" label="状态" prop="status" width="70">
                <template slot-scope="scope">
                    <span v-if="scope.row.status === '1'" style="color:#694BFF">已发布</span>
                    <span v-if="scope.row.status === '0'" style="color:#999999">已下架</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="归属人" prop="owner" width="70"></el-table-column>
            <el-table-column align="center" label="备注" prop="remark" width="120"></el-table-column>
            <el-table-column align="center" fixed="right" label="操作" width="100">
                <template slot-scope="scope">
                    <el-button @click="report(scope.row)" size="small" type="text">统计</el-button>
                    <el-button @click="edit(scope.row)" size="small" type="text">编辑</el-button>
                    <!-- <el-button @click="del(scope.row)" size="small" type="text">删除</el-button> -->
                </template>
            </el-table-column>
        </fix-table>
        <!-- /表格 -->
        <!-- 页码 -->
        <div class="pages">
            <el-pagination :page-size="pageSize" :total="totalNum" @current-change="handleCurrentChange"
                layout="total, prev, pager, next" :current-page="currentPage"></el-pagination>
        </div>
        <!-- /页码 -->
        <addTask :dataForm="info" @success="success" v-model="showDialog" :isShow="isShow" :isActive="isActive"
            @iscloseShow="iscloseShow" @colseShow="colseShow" :mid="mid" :adSlot="categoryList"></addTask>
        <!-- <statistics :dataForm="info" v-model="dialogVisible"></statistics> -->
        <Statistics TipsTitle="统计" TipsWidth="800px" :dataForm="echatData" v-model="dialogVisible"
            @closeDialog="closeDialog()" />
        <batchTask :dataForm="info" @success="success" v-model="batchDialog" :isShow="isShow" :isActive="isActive"
            @iscloseShow="iscloseShow" @colseShow="colseShow" :mid="mid"></batchTask>

        <el-dialog title="小程序" :visible.sync="dialogXcxVisible" width="42%" custom-class="my-dialog xcxalert "
            :append-to-body="true" :close-on-press-escape="false">
            <div class="dialog_box">
                <el-transfer filterable :filter-method="filterMethod" filter-placeholder="请输入小程序名称"
                    :titles="['未选', '已选']" :button-texts="['移除', '添加']" v-model="xcxInfo" :data="xcxForm">
                </el-transfer>
                <div slot="footer" class="dialog-footer">
                    <el-button size="mini" class="my-blue-btn" type="primary" @click="subXcxList"
                        v-if="xcxInfoData.owner_id==0">确 定</el-button>
                    <el-button size="mini" @click="dialogXcxVisible = false">取 消</el-button>
                </div>
            </div>
        </el-dialog>

        <el-dialog title="生成链接" :visible.sync="dialogAnchor" width="42%" custom-class="my-dialog xcxalert "
            :append-to-body="true" :close-on-press-escape="false">
            <div class="dialog_box">
                <el-form v-loading="loading" element-loading-spinner="el-icon-loading">
                    <el-row :gutter="20" type="flex">
                        <el-col :span="20">
                            <el-form-item label-width="140px" label="输入主播昵称:" class="formItem">
                                <el-input v-model="nickname" clearable></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" type="flex">
                        <el-col :span="20">
                            <el-form-item label-width="140px" label="主播链接:" class="formItem">
                                <el-input type="textarea" :rows="3" placeholder="主播昵称链接" v-model="anchorLink">
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>

                <div slot="footer" class="dialog-footer">
                    <el-button size="mini" class="my-blue-btn" type="primary" @click="setAnchor()">确 定</el-button>
                    <el-button size="mini" @click="dialogAnchor = false">取 消</el-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    String.prototype.myReplace = function (f, e) { //吧f替换成e
        let reg = new RegExp(f, 'g') //创建正则RegExp对象
        return this.replace(reg, e)
    }

    import addTask from './_addTask.vue'
    import batchTask from './_batchTask.vue'
    import Statistics from "@/components/Statistics.vue";

    export default {
        name: 'task',
        data() {
            return {
                dialogXcxVisible: false,
                xcxForm: [],
                xcxInfoData: {},
                xcxInfo: [],
                filterMethod(query, item) {
                    return item.pinyin.indexOf(query) > -1;
                },
                xcxSlot: [],
                dialogVisible: false,
                dialogAnchor: false,
                nickname: '',
                anchorLink: '',
                // 表格当前页
                currentPage: 1,
                // 每页显示数据数量
                pageSize: 12,
                // 表格数据总量
                totalNum: 0,
                orderKey: '',
                orderDesc: '',
                // 每页显示数据数量
                loading: true,
                tableData: [],
                showDialog: false,
                info: {},
                mmid: '',
                keyword: '',

                dev: '0', //是否测试
                list_status: 1, //是否上线

                formLabelWidth: '100px',
                dialogEdit: false,
                dialogEdit2: false,
                timesArr: [null], //多段时间,
                dataEdit: {},
                isShow: false,
                isActive: true,
                mechanismList: {}, //批量机构列表
                couldchoose: true, //机构select是否禁用
                dialogUrlEdit: false,
                dataUrlForm: {},
                batchDialog: false,
                echatData: {
                    // ID
                    id: '',
                    // 请求地址
                    postUrl: '/XcxTask/report',
                    // 折线图配置
                    options: {
                        legend: {
                            data: ['点击UV', '点击PV', '集分宝', '金币', '心愿豆', '点击数', '红包', '幸运币', '能量豆', '三方']
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
                            name: '集分宝',
                            areaStyle: {},
                            type: 'line',
                            yAxisIndex: 1,
                            smooth: true
                        }, {
                            data: [1],
                            name: '金币',
                            areaStyle: {},
                            type: 'line',
                            yAxisIndex: 0,
                            smooth: true
                        }, {
                            data: [1],
                            name: '心愿豆',
                            areaStyle: {},
                            type: 'line',
                            yAxisIndex: 1,
                            smooth: true
                        }, {
                            data: [1],
                            name: '点击数',
                            areaStyle: {},
                            type: 'line',
                            yAxisIndex: 1,
                            smooth: true
                        }, {
                            data: [1],
                            name: '红包',
                            areaStyle: {},
                            type: 'line',
                            yAxisIndex: 1,
                            smooth: true
                        }, {
                            data: [1],
                            name: '幸运币',
                            areaStyle: {},
                            type: 'line',
                            yAxisIndex: 1,
                            smooth: true
                        }, {
                            data: [1],
                            name: '能量豆',
                            areaStyle: {},
                            type: 'line',
                            yAxisIndex: 1,
                            smooth: true
                        }, {
                            data: [1],
                            name: '三方',
                            areaStyle: {},
                            type: 'line',
                            yAxisIndex: 0,
                            smooth: true
                        }]
                    },
                    //时间配置
                    timeData: [{
                        title: "近3时",
                        data: 15
                    },{
                        title: "近24时",
                        data: 24
                    }, {
                        title: "近7天",
                        data: 1
                    }, {
                        title: "近30天",
                        data: 2
                    }]
                }, //统计数据
                categoryList: [],
                slotId: '',
                categoryAllList: [],
                slotLoading: false
            }
        },
        created() {},
        mounted() {
            if (this.$route.params.class_id) {
                this.slotId = this.$route.params.class_id
            }
            if (this.$route.query.mid) {
                this.mmid = this.$route.query.mid
            }
            this.getRequest('/XcxTask/getFixedMiniList').then((resp) => {
                if (resp && resp.code === 200) {
                    this.xcxSlot = resp.data
                    let arr = [];
                    for (let i in this.xcxSlot) {
                        let o = {
                            id: i,
                            name: this.xcxSlot[i]
                        };
                        arr.push(o)
                    }
                    this.xcxSlot = arr
                }
                this.loadData()
            })
            this.getCategoryList()
            this.getmechanismList()
        },
        watch: {
            // mid(newval) {
            //   this.currentPage = 1
            //   this.loadData()
            // },
            // categoryId(){
            //   this.currentPage = 1
            //   this.loadData()
            // },
            dev(newval) {
                this.currentPage = 1
                this.loadData()
            },
            list_status() {
                this.currentPage = 1
                this.loadData()
            },

            //多段时间回显
            dataEdit: {
                handler: function (val) {
                    val.time_list_str == undefined ? this.timesArr = [
                        [val.time_start_str, val.time_end_str]
                    ] : this.timesArr = JSON.parse(JSON.stringify(val.time_list_str))
                },
                immediate: true,
            }
        },
        computed: {
            categoryId() {
                return this.slotId
                // return this.$route.params.class_id === undefined ? this.slotId : this.$route.params.class_id
            },
            mid() {
                return this.mmid
                // return this.$route.query.mid === undefined ? this.mmid : this.$route.query.mid
            },
            newAnchorId() {
                let str = ''
                if (this.dataUrlForm.url.indexOf('userId%25253D') !== -1) {
                    str = decodeURIComponent(decodeURIComponent(decodeURIComponent(this.dataUrlForm.url)))
                } else if (this.dataUrlForm.url.indexOf('userId%253D') !== -1) {
                    str = decodeURIComponent(decodeURIComponent(this.dataUrlForm.url))
                } else if (this.dataUrlForm.url.indexOf('userId%3D') !== -1) {
                    str = decodeURIComponent(this.dataUrlForm.url)
                } else {
                    str = this.dataUrlForm.url
                }
                if (str.indexOf('userId=') !== -1) {
                    let num = 0
                    for (let i = str.indexOf('userId=') + 7; i < str.length; i++) {
                        if (!isNaN(str.charAt(i))) {
                            num = i
                        } else {
                            break;
                        }

                    }
                    return str.substring(str.indexOf('userId=') + 7, num + 1)
                } else {
                    return ''
                }
            },
            mList() {
                return this.$store.state.base.xcxList
            }
        },
        components: {
            addTask,
            Statistics,
            batchTask
        },
        methods: {
            generateAnchor() {
                this.dialogAnchor = true
                this.nickname = ''
                this.anchorLink = ''
            },
            setAnchor() {
                if (this.nickname == '' || this.nickname == undefined) {
                    this.$message.warning('主播昵称不能为空')
                    return

                }
                this.getRequest('/xcxtask/getNickname', {
                    nickname: this.nickname,
                }).then(resp => {
                    if (resp.code === 200) {
                        if (resp.data == '') {
                            this.$message.warning('暂未查到该主播')
                            this.anchorLink = ''
                        } else {
                            this.anchorLink = resp.data
                        }

                    }


                })

            },
            ckXcxInfo(row) {
                const data = [];
                const cities = [];
                for (let k in this.xcxSlot) {
                    cities.push(this.xcxSlot[k].name)
                }
                cities.forEach((city, index) => {
                    data.push({
                        label: city,
                        key: city,
                        pinyin: city,
                        disabled: row.owner_id != 0
                    });
                });
                this.xcxForm = data;
                this.xcxInfoData = row;
                this.xcxInfo = [];
                this.xcxInfo = row.miniprogram;
                this.dialogXcxVisible = true;
            },
            subXcxList() {
                if (this.xcxInfoData.owner_id > 0) {
                    return;
                }
                let addId = [];
                this.xcxSlot.forEach(item => {
                    if (this.xcxInfo.indexOf(item.name) >= 0) {
                        console.info(item.id)
                        addId.push(item.id);
                    }
                })
                if (addId.length > 0) {
                    this.postRequest('XcxTask/editTaskMini', {
                        taskIds: this.xcxInfoData.id,
                        miniIds: addId.toString()
                    }).then((resp) => {
                        if (resp && resp.code === 200) {
                            this.$message({
                                message: '修改成功',
                                type: 'success',
                                duration: 1000
                            })
                            this.dialogXcxVisible = false;
                            this.loadData()
                        } else {
                            this.$message({
                                message: resp.msg,
                                type: 'faild',
                                showClose: true,
                                duration: 1000,
                                onClose: () => {},
                            })
                        }
                    })
                }
            },
            closeDialog() {
                this.dialogVisible = false;
            },
            // 换页响应
            handleCurrentChange(val) {
                this.currentPage = val
                this.loadData()
            },
            // 排序响应
            sortchange(val) {
                this.currentPage = 1
                this.orderKey = val.prop
                if (val.order == 'descending') {
                    this.orderDesc = 'desc'
                } else {
                    this.orderDesc = 'asc'
                }
                this.loadData()
            },
            success() {
                this.loadData()
            },
            submitForm() {
                this.keyword = this.keyword.trim()
                this.keyword = this.keyword.split(' ').join('')
                this.currentPage = 1
                this.loadData()
            },
            loadData() {
                this.loading = true
                this.getRequest('/XcxTask/taskList', {
                    categoryId: this.categoryId,
                    page: this.currentPage,
                    mid: this.mid,
                    keyword: this.keyword,
                    listRows: this.pageSize,
                    orderKey: this.orderKey,
                    orderDesc: this.orderDesc,
                    isdev: this.dev,
                    status: this.list_status,
                }).then(resp => {
                    this.loading = false
                    if (resp && resp.code === 200) {
                        this.totalNum = resp.data.total
                        resp.data.list.forEach(ele => {
                            let qy = {};
                            ele.categories.forEach(ii => {
                                qy[ii.name] = 1;
                            })
                            ele.qy = qy;
                            ele.throw_time = (this.dealTimes(ele.time_list, ele.time_list_str) == '' ?
                                `${ele.time_start_str.substring(0,5)}至${ele.time_end_str.substring(0,5)}` :
                                this.dealTimes(ele.time_list, ele.time_list_str))
                            ele.isShowXcxList = false;
                            if (qy['特殊广告位'] != undefined || ele.owner_id > 0) {
                                ele.isShowXcxList = true;
                            }
                        });
                        this.tableData = resp.data.list
                    }
                })
            },
            //多短时间处理
            dealTimes(timelist, timelist_str) {
                if (timelist == '') {
                    return '';
                } else {
                    let newTime = this.dateFormat('HH:MM:SS', new Date())
                    // console.log('timelist',newTime,timelist,timelist_str)
                    if (timelist_str != undefined) {
                        let notlate = timelist_str.filter(item => {
                            return item[1] > newTime; //结束时间大于现在
                        })
                        if (notlate.length == 0) {
                            // let vipTime = timelist_str[Math.floor(Math.random() * timelist_str.length)]
                            let vipTime = timelist_str[0]
                            return `${vipTime[0].substring(0,5)}至${vipTime[1].substring(0,5)}`
                        } else {
                            let nostart = notlate.filter(item => {
                                return item[0] < newTime; //开始时间小于现在
                            })
                            if (nostart.length == 0) {
                                let nearArr = [];
                                notlate.forEach(element => {
                                    let time = {
                                        timenum: new Date(
                                                `${this.dateFormat('YYYY-mm-dd',new Date())} ${element[0]}`)
                                            .getTime() / 1000 - new Date().getTime() / 1000,
                                        str: `${element[0].substring(0,5)}至${element[1].substring(0,5)}`,
                                    };
                                    nearArr.push(time);
                                });
                                nearArr.sort((a, b) => {
                                    return a.timenum - b.timenum;
                                })
                                return `${nearArr[0].str}`
                            } else {
                                let vipTimeIsStart = nostart[Math.floor(Math.random() * nostart.length)]
                                return `${vipTimeIsStart[0].substring(0,5)}至${vipTimeIsStart[1].substring(0,5)}`
                            }
                        }
                    } else {
                        return '';
                    }
                }
            },
            //时间处理important
            dateFormat(fmt, date) {
                let ret;
                const opt = {
                    "Y+": date.getFullYear().toString(), // 年
                    "m+": (date.getMonth() + 1).toString(), // 月
                    "d+": date.getDate().toString(), // 日
                    "H+": date.getHours().toString(), // 时
                    "M+": date.getMinutes().toString(), // 分
                    "S+": date.getSeconds().toString() // 秒
                    // 有其他格式化字符需求可以继续添加，必须转化成字符串
                };
                for (let k in opt) {
                    ret = new RegExp("(" + k + ")").exec(fmt);
                    if (ret) {
                        fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length,
                            "0")))
                    };
                };
                return fmt;
            },
            add() {
                this.info = {
                    ads_id: '',
                    slot_id: '',
                    title: '',
                    subtitle: '',
                    description: '',
                    type: '1',
                    url: '',
                    appid: '',
                    path: '',
                    extra_data: '',
                    gold: '0',
                    reward_type: '1',
                    status: '1',
                    owner_id: 0,
                    owner: '有惠',
                    company_id: '',
                    is_repeat: '',
                    browse_time: 10,
                    put_type: 0,
                    limit_click_amount: 5000,
                    daterange: [
                        this.$utils.timestamp(new Date(), 'yyyy-MM-dd'),
                        this.$utils.timestamp(new Date(), 'yyyy-MM-dd')
                    ],
                    time_list_str: [null],
                    timerange: [
                        new Date(2020, 9, 10, 0, 0),
                        new Date(2020, 9, 10, 23, 59)
                    ],

                    appID: '',
                    appPrivateKey: '',
                    appPublicKey: '',
                    campId: '',
                    gift_ratio: '0',
                    is_avg_publish: '0',
                    is_thirdparty: '0',
                    dev: '0',
                    anchor_nickname: '',
                    anchor_id:'',
                };
                this.colseShow(false)
                this.showDialog = true
                this.iscloseShow(true)
            },
            colseShow(type) {
                this.isShow = type
            },
            iscloseShow(type) {
                this.isActive = type
            },
            edit(row) {
                let info = Object.assign({}, row)

                let start = this.$utils.timestamp(info.start_time * 1000, 'yyyy-MM-dd')
                let end = this.$utils.timestamp(info.end_time * 1000, 'yyyy-MM-dd')
                info.daterange = [start, end];

                let start_time = this.$utils.timestamp(info.time_start * 1000, 'yyyy-MM-dd HH:ii:ss')
                let end_time = this.$utils.timestamp(info.time_end * 1000, 'yyyy-MM-dd HH:ii:ss')
                info.timerange = [start_time, end_time];
                if (info.company_id === '0') { // 以前的数据没有选机构 机构id为0，需要清除为空。
                    info.company_id = ''
                }
                if (row.special_type === '1') {
                    info.slot_id = []
                    info.ads_id = []
                    info.categories.forEach((item) => {
                        info.ads_id.push(item.id)
                    })
                    // info.reward_type = '4'
                    this.isShow = true
                    this.isActive = true
                } else {
                    info.ads_id = []
                    info.slot_id = []
                    info.categories.forEach((item) => {
                        info.slot_id.push(item.id)
                    })
                    this.isShow = false
                    this.isActive = false
                }

                info.limit_click_amount = parseFloat((parseFloat(info.limit_click_amount) / (1 + (parseFloat(info
                    .gift_ratio) / 100))).toPrecision(12))

                if (info.company_id !== '' && info.owner !== '') {
                    info.isedit = true //判断是否是编辑数据
                } else {
                    info.isedit = false //判断是否是编辑数据
                }
                this.info = info
                this.showDialog = true

            },
            del(row) {
                let that = this
                this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.postRequest('/XcxTask/deleteTask', {
                        id: row.id
                    }).then(resp => {
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
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消删除'
                        })
                    })
                })
            },
            report(row) {
                this.echatData.id = row.id
                this.dialogVisible = true
            },
            reload() {
                this.currentPage = 1
                this.loadData()
            },
            // 
            taskOnLowershelf(status) {
                if (!this.$refs.taskTable.selection.length) {
                    this.$message.warning('请选择一条数据')
                    return
                }
                // if(this.$refs.taskTable.selection.some(element => {
                //   return element.status === status
                // })){
                //   this.$message.warning(status==='1'?"数据中包含已上架数据":"数据中包含已下架数据")
                //   return
                // }

                let id = ''
                this.$refs.taskTable.selection.forEach((element, index) => {
                    if (index === 0) {
                        id = element.id
                    } else {
                        id = id + ',' + element.id
                    }
                });
                this.postRequest('/XcxTask/taskOnLowershelf', {
                    status: status,
                    id: id
                }).then((resp) => {
                    if (resp && resp.code === 200) {
                        this.$message.success(resp.msg)
                        this.$refs.taskTable.clearSelection()
                        this.loadData()
                    } else {
                        this.$message.error(resp.msg)
                    }
                })
            },
            checkboxInit(row, index) {
                if (row.owner_id === '0') {
                    return 1;
                } else {
                    return 0; //不可勾选
                }
            },

            editBatch() {
                if (!this.$refs.taskTable.selection.length) {
                    this.$message.warning('请选择一条数据')
                    return
                }

                let info = Object.assign({}, this.$refs.taskTable.selection[0])
                let start = this.$utils.timestamp(info.start_time * 1000, 'yyyy-MM-dd')
                let end = this.$utils.timestamp(info.end_time * 1000, 'yyyy-MM-dd')
                info.daterange = [start, end];

                let start_time = this.$utils.timestamp(info.time_start * 1000, 'yyyy-MM-dd HH:ii:ss')
                let end_time = this.$utils.timestamp(info.time_end * 1000, 'yyyy-MM-dd HH:ii:ss')
                info.timerange = [start_time, end_time];
                this.dataEdit = info
                this.dialogEdit = true
            },
            editmechanism() {
                if (!this.$refs.taskTable.selection.length) {
                    this.$message.warning('请选择一条数据')
                    return
                }

                let info = Object.assign({}, this.$refs.taskTable.selection[0])
                let start = this.$utils.timestamp(info.start_time * 1000, 'yyyy-MM-dd')
                let end = this.$utils.timestamp(info.end_time * 1000, 'yyyy-MM-dd')
                info.daterange = [start, end];

                let start_time = this.$utils.timestamp(info.time_start * 1000, 'yyyy-MM-dd HH:ii:ss')
                let end_time = this.$utils.timestamp(info.time_end * 1000, 'yyyy-MM-dd HH:ii:ss')
                info.timerange = [start_time, end_time];
                this.dataEdit = info
                if (this.dataEdit.company_id == 0) {
                    this.dataEdit.company_id = ''
                }
                this.dialogEdit2 = true
            },
            editUrlBatch() {
                if (!this.$refs.taskTable.selection.length) {
                    this.$message.warning('请选择一条数据')
                    return
                }

                let info = Object.assign({}, this.$refs.taskTable.selection[0])
                this.dataUrlForm = info
                this.dialogUrlEdit = true
            },

            getfirst(data) {
                for (var key in data)
                    return key;
            },

            // 添加时间选择器
            addTimesArr() {
                this.timesArr.push(null)
            },
            //删除
            deleteArr(index) {
                this.timesArr.splice(index, 1)
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
            open3(msg) {
                this.$message({
                    showClose: true,
                    message: msg,
                    type: 'warning',
                })
            },
            //获取机构列表
            getmechanismList() {
                this.getRequest('/XcxTask/getCompanyList', {
                    name: '',
                }).then((res) => {
                    if (res.code == 200) {
                        if (res.data) {
                            this.mechanismList = res.data
                            this.couldchoose = false;
                            // this.isShowOwner = res.data.auth
                            // this.loading = false
                        }
                    } else {
                        // this.loading = false
                    }
                })
            },
            xcxChange() {
                this.slotId = ''
                this.getCategoryList()
                this.currentPage = 1
                this.loadData()
            },
            slotChange() {
                if (this.slotId) {
                    this.categoryAllList.forEach(element => {
                        if (element.id === this.slotId) {
                            this.mmid = element.miniprog_id
                        }
                    });
                    this.getCategoryList()
                    this.currentPage = 1
                    this.loadData()
                } else {
                    this.xcxChange()
                }
            },
            // 获取广告位
            getCategoryList() {
                this.categoryList = []
                this.slotLoading = true
                this.getRequest('/XcxTask/categorySelect', {
                    mid: this.mid
                }).then((resp) => {
                    if (resp && resp.code === 200) {
                        this.categoryList = resp.data
                    }
                    if (!this.mid) {
                        this.categoryAllList = resp.data
                    }
                    this.slotLoading = false
                })
            },
            // 提交数据
            submitData(index) {
                let url = ''
                if (index == 1) {
                    url = '/XcxTask/editTaskCompanyAll'

                } else {
                    url = '/XcxTask/editTaskAll'
                }

                let options = Object.assign({}, this.dataEdit)
                let id = ''
                this.$refs.taskTable.selection.forEach((element, index) => {
                    if (index === 0) {
                        id = element.id
                    } else {
                        id = id + ',' + element.id
                    }
                });
                if (!options.daterange) {
                    this.$message.warning('请选择起止日期')
                    return
                }
                if (options.company_id == '') {
                    this.$message.warning('请选择机构')
                    return
                }
                options.id = id
                options.start_time = options.daterange[0] / 1000
                options.end_time = options.daterange[1] / 1000
                options.time_start = options.timerange[0] / 1000
                options.time_end = options.timerange[1] / 1000

                //多段时间处理
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
                            '1' + item[1].myReplace(':', ''),
                        ]
                    })
                    // let jsonTimeArr = {}
                    array.forEach((element, index) => {
                        jsonTimeArr[index] = element
                    })
                }
                options.time_list = (jsonTimeArr == {} ? '' : JSON.stringify(jsonTimeArr)) //多段时间

                let obj = {}

                if (index == 1) {
                    obj = {
                        id: options.id,
                        company_id: options.company_id,
                    }
                } else {
                    obj = {
                        id: options.id,
                        reward_type: options.reward_type,
                        integral: options.integral,
                        step: options.step,
                        money: options.money,
                        jfb: options.jfb,
                        wish_bean: options.wish_bean,
                        lucky_coin: options.lucky_coin,
                        energy_bean: options.energy_bean,

                        start_time: options.start_time,
                        end_time: options.end_time,
                        time_start: options.time_start,
                        time_end: options.time_end,
                        time_list: options.time_list,
                        // status: options.status
                    }
                }



                this.postRequest(url, obj).then((resp) => {
                    if (resp && resp.code === 200) {
                        this.$message.success('编辑成功')
                        this.loadData()
                        this.dialogEdit = false
                        this.dialogEdit2 = false
                    } else {
                        this.$message({
                            message: resp.msg,
                            type: 'faild',
                            showClose: true,
                            duration: 1000,
                        })
                    }
                })
            },
            submitUrlData() {
                let obj = Object.assign({}, this.dataUrlForm)
                let id = ''
                this.$refs.taskTable.selection.forEach((element, index) => {
                    if (index === 0) {
                        id = element.id
                    } else {
                        id = id + ',' + element.id
                    }
                });
                obj['id'] = id
                this.postRequest('/XcxTask/batchEditUrl', obj).then((resp) => {
                    if (resp && resp.code === 200) {
                        this.$message.success(resp.msg)
                        this.$refs.taskTable.clearSelection()
                        this.dialogUrlEdit = false
                        this.loadData()
                    } else {
                        this.$message.error(resp.msg)
                    }
                })
            },
            paste(e) {
                let str = e.clipboardData.getData('text').trim()
                if (this.dataUrlForm.type === '7') {
                    e.preventDefault()
                    e.stopPropagation()
                    this.dataUrlForm.url = encodeURIComponent(str)
                    return
                }
                if (str.substr(0, 10) == 'alipays://') {
                    e.preventDefault()
                    e.stopPropagation()
                    let query = str.substr(str.indexOf('?') + 1)
                    let params = this.parseQuery(query)
                    this.dataUrlForm.appid = params.appId
                    this.dataUrlForm.path = decodeURIComponent(params.page)
                    this.dataUrlForm.type = '2'
                    if (params.query !== undefined) {
                        this.dataUrlForm.extra_data = params.query
                    } else {
                        this.dataUrlForm.extra_data = ''
                    }
                } else if (str.substr(0, 9) == 'plugin://') {
                    e.preventDefault()
                    e.stopPropagation()
                    this.dataUrlForm.type = '5'
                    this.dataUrlForm.url = str
                } else if (str.substr(0, 9) == 'tbopen://') {
                    e.preventDefault()
                    e.stopPropagation()
                    this.dataUrlForm.type = '7'
                    this.dataUrlForm.url = encodeURIComponent('https://mobile.yhshapp.com/goods/tbJump?url=' +
                        encodeURIComponent(str))
                } else if (
                    str.substr(0, 57) ==
                    'https://render.alipay.com/p/h5/life_public/www/index.html'
                ) {
                    e.preventDefault()
                    e.stopPropagation()
                    this.dataUrlForm.type = '6'
                    this.dataUrlForm.url = str
                } else if ((str.substr(0, 50) == 'https://h5.m.taobao.com/taolive/video.html?userId=') || (str.substr(0,
                        47) == 'https://m.taobao.com/taolive/video.html?userId=')) {
                    e.preventDefault()
                    e.stopPropagation()
                    this.dataUrlForm.type = '7'
                    this.dataUrlForm.url = encodeURIComponent('https://mobile.yhshapp.com/goods/tbJump?url=' +
                        encodeURIComponent(
                            'tbopen://m.taobao.com/tbopen/index.html?&action=ali.open.nav&module=h5&bootImage=0&source=taobaolive&h5Url=' +
                            encodeURIComponent(str)))
                }
            },
            batchDialogFun() {
                if (!this.$refs.taskTable.selection.length) {
                    this.$message.warning('请选择一条数据')
                    return
                }
                let info = Object.assign({}, this.$refs.taskTable.selection[0])
                let start = this.$utils.timestamp(info.start_time * 1000, 'yyyy-MM-dd')
                let end = this.$utils.timestamp(info.end_time * 1000, 'yyyy-MM-dd')
                info.daterange = [start, end];

                let start_time = this.$utils.timestamp(info.time_start * 1000, 'yyyy-MM-dd HH:ii:ss')
                let end_time = this.$utils.timestamp(info.time_end * 1000, 'yyyy-MM-dd HH:ii:ss')
                info.timerange = [start_time, end_time];

                if (info.company_id === '0') { // 以前的数据没有选机构 机构id为0，需要清除为空。
                    info.company_id = ''
                }
                if (info.special_type === '1') {
                    info.slot_id = []
                    info.ads_id = []
                    info.categories.forEach((item) => {
                        info.ads_id.push(item.id)
                    })
                    // info.reward_type = '4'
                } else {
                    info.ads_id = []
                    info.slot_id = []
                    info.categories.forEach((item) => {
                        info.slot_id.push(item.id)
                    })
                }
                let id = ''
                this.$refs.taskTable.selection.forEach((element, index) => {
                    if (index === 0) {
                        id = element.id
                    } else {
                        id = id + ',' + element.id
                    }
                });
                info.id = id
                this.info = info
                this.batchDialog = true
            },
            editRate(row) {
                this.$prompt('赠送比例', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputValue: row.gift_ratio,
                    inputValidator: (value) => {
                        if (!/(^[0-9]\d*$)/.test(value)) {
                            return '赠送比例为非负整数'
                        } else if (value > 20 && row.reward_type == '4') {
                            return '赠送比例不能大于20'
                        } else if (value > 30 && row.reward_type == '1') {
                            return '赠送比例不能大于30'
                        } else if (value > 100) {
                            return '赠送比例不能大于100'
                        }
                    },
                }).then(({
                    value
                }) => {
                    this.postRequest('/XcxTask/editGiftRatio', {
                        id: row.id,
                        gift_ratio: value
                    }).then(resp => {
                        if (resp && resp.code === 200) {
                            this.$message({
                                message: '修改成功',
                                type: 'success',
                                showClose: true,
                                duration: 1000,
                            })
                            this.loadData()
                        } else {
                            this.$message({
                                message: '修改失败',
                                type: 'warning',
                            })
                        }
                    })
                }).catch(() => {});
            }
        }
    }

</script>
<style scoped>
    .xcxlist-box {
        /* width: 100%; */
        height: 100px;
        border: 1px solid #DCDFE6;
        margin-top: 10px;
        border-radius: 3px;
    }

    .dialog-footer {
        margin-top: 20px;
    }

    .demo-form-inline {
        display: flex;
    }

    .demo-form-inline .el-form-item:last-child {
        margin-right: 0;
    }

    .el-tag {
        margin: 0 3px 10px;
    }

    .new_time_picker2 {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin: 0 0 5px 0;
    }

    .delete {
        font-size: 13px;
        font-family: PingFang SC;
        font-weight: 500;
        color: #fff;
        background: #FF2145;
        line-height: 36px;
        width: 60px;
        text-align: center;
        height: 36px;
        border-radius: 4px;
        cursor: pointer;
        transition: all .3s;
        margin-left: 10px;
    }

    .delete:hover {
        background: rgba(255, 33, 79, 0.7);
    }

</style>
