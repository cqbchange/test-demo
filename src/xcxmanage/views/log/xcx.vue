<!--
 * @Descripttion: 小程序统计
 * @version: 1.0
 * @Author: WangChuan
 * @Date: 2021-01-15 16:52:43
 * @LastEditors: WangChuan
 * @LastEditTime: 2021-08-16 17:28:58
-->
<template>
    <div class="headerCard">
        <div class="new_content">
            <div class="today_statistics_box" v-loading="loading">
                <!-- 顶部按钮 -->
                <div class="button_box">
                    <template>
                        <div v-for='(item,index) in topBtnsisclicked' :key="index"
                            :class="'top_btns '+ (topbtnIndex==index ? 'top_btn_clicked' : '')" ref="TopBtn"
                            @click="chooseTop(index)">{{item.title}}
                        </div>
                        <!-- <el-date-picker v-model="appointDay" align="right" type="date" size="mini" style="width:140px"
                            :editable='false' :clearable="false" v-show="table_data_type == 4" placeholder="选择日期"
                            ref="day" :popper-append-to-body='false' @change="pointCheck">
                        </el-date-picker>
                        <el-date-picker v-model="appointWeek" type="week" size="mini" style="width:140px"
                            :editable='false' v-show="table_data_type == 5" format="yyyy 第 WW 周"
                            :popper-append-to-body='false' placeholder="选择周" ref="week" :clearable="false"
                            @change="pointCheck2">
                        </el-date-picker>
                        <el-date-picker v-model="appointMon" v-show="table_data_type == 6" type="month" size="mini"
                            style="width:140px" :editable='false' placeholder="选择月" :clearable="false" ref="month"
                            :popper-append-to-body='false' @change="pointCheck3">
                        </el-date-picker> -->
                    </template>
                </div>
                <div class="right_btn_select">

                    <div class="select_time">
                        <el-date-picker v-model="datequantum" type="daterange" align="right" size="medium"
                            :editable="false" :clearable="false" unlink-panels format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期"
                            end-placeholder="结束日期" @change="choosedatequantum" :picker-options="pickerOptions2"
                            style="width:300px">
                        </el-date-picker>
                    </div>
                    <div class="table_select">
                        <el-select v-model="channel_id" @change="changeChannelId" size="medium" filterable
                            style="width:150px;margin-left:10px;" placeholder="请选择">
                            <el-option label="全部渠道商" value="" />
                            <el-option v-for="(key,val,index) in channelList" :key="index" :label="key" :value="val" />
                        </el-select>
                    </div>
                    <div class="table_select">
                        <el-select :disabled="AdzoneLoading" v-model="adzoneId" @change="changeAdzoneId" size="medium"
                            filterable style="width:150px;margin-left:10px;" placeholder="请选择">
                            <el-option label="全部渠道" value="" />
                            <div v-if="channel_id == ''">
                                <el-option v-for="(items,index) in ditcharr" :key="index" :label="items.name"
                                    :value="items.id" />
                            </div>
                            <div v-else>
                                <el-option v-for="(val,key,index) in ditcharr" :key="index" :label="val" :value="key" />
                            </div>

                        </el-select>
                    </div>
                    <!-- 选择小程序 -->
                    <div class="table_select">
                        <el-select v-model="appletsId" size="medium" style="width:150px;margin-left:10px;" filterable
                            placeholder="请选择小程序">
                            <el-option label="全部小程序" value="" />
                            <el-option v-for="(items,key) in xcxlist" :key="key" :label="items" :value="key" />
                        </el-select>
                    </div>
                </div>
            </div>
            <div class="show_data_box">
                <div class="data_boxes" v-loading="allDataLoading">
                    <div :class="'data_item '+( item.key1==='click_uv'? 'could_click' : '')"
                        v-for="(item,key) in dataKey" :key="key" @click="showDetail(item.key1)">
                        <div class="item_title">
                            <span>{{item.title}}</span>
                        </div>
                        <span class="data_num">
                            {{topData[item.key1]|floatMoney}}&nbsp;/&nbsp;{{topData[item.key2]|floatMoney}}
                        </span>
                        <div class="compare_box">
                            <div class="gap_text sec" v-if="topRate[item.key1]>0">
                                {{Math.abs(topRate[item.key1])}}%
                                <i class="ordinal_icon sec_icon" />
                            </div>
                            <div class="gap_text" v-else-if="topRate[item.key1]==0">
                                {{Math.abs(topRate[item.key1])}}%
                            </div>
                            <div class="gap_text dec" v-else>
                                {{Math.abs(topRate[item.key1])}}%
                                <i class="ordinal_icon dec_icon" />
                            </div>
                            <span class="gap_jj">/</span>
                            <div class="gap_text sec" v-if="topRate[item.key2]>0">
                                {{Math.abs(topRate[item.key2])}}%
                                <i class="ordinal_icon sec_icon" />
                            </div>
                            <div class="gap_text" v-else-if="topRate[item.key2]==0">
                                {{Math.abs(topRate[item.key2])}}%
                            </div>
                            <div class="gap_text dec" v-else>
                                {{Math.abs(topRate[item.key2])}}%
                                <i class="ordinal_icon dec_icon" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="show_data_box" v-loading="echartsLoading">
                <h3>数据趋势</h3>
                <div class="checkbox_select">
                    <div class="checkboxes_box">
                        <el-checkbox-group v-model="checkList" @change="checkes()">
                            <div class="newuser check_item_box">
                                <el-checkbox label="新客">新客</el-checkbox>
                            </div>
                            <div class="uv check_item_box">
                                <el-checkbox label="渠道UV">渠道UV</el-checkbox>
                            </div>
                            <div class="UV check_item_box">
                                <el-checkbox label="UV">UV</el-checkbox>
                            </div>
                            <div class="PV check_item_box">
                                <el-checkbox label="PV">PV</el-checkbox>
                            </div>
                            <div class="click_rate check_item_box">
                                <el-checkbox label="点击率">点击率</el-checkbox>
                            </div>
                            <div class="click_uv check_item_box">
                                <el-checkbox label="点击UV">点击UV</el-checkbox>
                            </div>
                            <div class="click_pv check_item_box">
                                <el-checkbox label="点击PV">点击PV</el-checkbox>
                            </div>
                            <div class="rate check_item_box">
                                <el-checkbox label="转化率">转化率</el-checkbox>
                            </div>
                            <div class="paymoney check_item_box">
                                <el-checkbox label="支出金额">支出金额</el-checkbox>
                            </div>
                            <div class="income check_item_box">
                                <el-checkbox label="收益金额">收益金额</el-checkbox>
                            </div>
                        </el-checkbox-group>
                    </div>

                </div>
                <!-- echarts -->
                <div id="new_echarts" class="echtable"></div>
            </div>
            <!-- <div class="show_data_box">
            <h3>每天数据</h3>
            <div class="table_box">
                <el-table
                    v-loading="tableloading"
                    :data="tableData"
                    :stripe="true"
                    style="width: 100%"
                    :header-cell-style="{background:'#ECECEC',color:'#333333','font-size': '15px','font-family': 'PingFang SC','font-weight': '600',}"
                >
                    <el-table-column
                    prop="bk"
                    label="时间"
                    width="200">
                    </el-table-column>
                    <el-table-column
                    prop="newuser"
                    label="新客"
                    width="110">
                    </el-table-column>
                    <el-table-column
                    prop="uv"
                    label="渠道UV"
                    width="110">
                    </el-table-column>
                    <el-table-column
                    prop="guv"
                    label="UV"
                    width="110">
                    </el-table-column>
                    <el-table-column
                    prop="pv"
                    label="PV"
                    width="110">
                    </el-table-column>
                    <el-table-column
                    label="点击率"
                    width="140">
                    <template slot-scope="scope">
                        <div>{{ scope.row.click_rate }}%</div>
                    </template>
                    </el-table-column>
                    <el-table-column
                    prop="click_uv"
                    label="点击UV"
                    width="140">
                    </el-table-column>
                    <el-table-column
                    prop="click_num"
                    label="点击PV"
                    width="140">
                    </el-table-column>
                    <el-table-column
                    label="转化率"
                    width="140">
                    <template slot-scope="scope">
                        <div>{{ scope.row.convert_rate }}%</div>
                    </template>
                    </el-table-column>
                    <el-table-column label="支出金额 (元)">
                    <template slot-scope="scope">
                        <div style="padding: 0 0 0 20px">
                        <span>{{ scope.row.pay_money }}</span>
                        </div>
                    </template>
                    </el-table-column>
                    <el-table-column
                    label="收益金额 (元)">
                    <template slot-scope="scope">
                        <div style="padding: 0 0 0 20px">
                        <span>{{ scope.row.cpc_money }}</span>
                        <i class="edit_item_bt" v-if="adzoneId != 0" @click="edititem(scope.row)"/>
                        </div>
                    </template>
                    </el-table-column>
                </el-table>
                <div class="pagination">
                    <div class="show_datanum_allpage">
                    <span>共{{total}}条数据，共{{allpages}}页</span>
                    </div>
                    <div class="pagination_box">
                    <el-pagination
                        class="pagination_content"
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="currentPage1"
                        :page-sizes="[5, 10, 15, 20]"
                        :page-size="10"
                        layout="prev,pager,next"
                        :total="total"
                        prev-text="上一页"
                        next-text="下一页"
                        :background="true"
                    />
                    </div>
                    <div class="to_that_page">
                    <span class="togo_that_page">跳转</span>
                    <el-input v-model="gotopage" size="mini" style="width:60px" placeholder></el-input>
                    <el-button
                        size="mini"
                        style="background: #0046F4;
                        border-radius: 3px;
                        font-size: 12px;
                        font-family: PingFang SC;
                        font-weight: 500;
                        color: #FFFFFF;
                        margin-left:10px"
                        @click="togothatpage()"
                    >确定
                    </el-button>
                    </div>
                </div>
            </div>
        </div> -->
            <!-- 新建渠道弹窗 -->
            <div class="dialog">
                <el-dialog title="新建渠道" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
                    <el-form>
                        <el-form-item label="渠道名称：" :label-width="formLabelWidth">
                            <el-input size="medium" v-model="activity_name" clearable autocomplete="off"
                                placeholder="请输入名称" />
                        </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button size="medium" type="primary" :disabled="isactive_name" @click="addditch()">确 定
                        </el-button>
                        <el-button size="medium" @click="canceladdditch()">取 消</el-button>
                    </div>
                </el-dialog>
            </div>
            <!-- 复制链接弹窗 -->
            <div class="dialog">
                <el-dialog title="复制链接" :visible.sync="dialogcopy_link" :close-on-click-modal="false" width="720px">
                    <el-form>
                        <el-form-item label="渠道：" :label-width="formLabelWidth">
                            <el-select v-model="channel" placeholder="请选择渠道" style="width:100%">
                                <el-option v-for="(items,index) in ditcharr" :key="index" :label="items.name"
                                    :value="items.id" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="小程序：" :label-width="formLabelWidth">
                            <el-select v-model="applets" placeholder="请选择小程序" style="width:100%">
                                <el-option v-for="(items,key) in xcxlist" :key="key" :label="items" :value="key" />
                            </el-select>
                        </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button :disabled="(this.applets==='')||(this.channel==='')" size="medium" type="primary"
                            @click="copylink()">
                            复制链接
                        </el-button>
                        <el-button size="medium" @click="cancelcopy_link">返 回</el-button>
                    </div>
                </el-dialog>
            </div>

        </div>
        <!-- <detail v-model="detailShow" :adzoneId="adzoneId" :start="start_time" :end="end_time" :type="table_data_type"/> -->
    </div>
</template>
<script>
    import axios from 'axios'
    export default {
        name: "logXcx",
        data() {
            return {
                dataKey: [{
                    title: '渠道UV  /  新客',
                    key1: 'uv',
                    key2: 'newuser'
                }, {
                    title: 'UV  /  PV',
                    key1: 'guv',
                    key2: 'pv'
                }, {
                    title: '点击UV  /  点击PV',
                    key1: 'click_uv',
                    key2: 'click_num'
                }, {
                    title: ' 点击率  /  转化率',
                    key1: 'click_rate',
                    key2: 'convert_rate'
                }, {
                    title: ' 支出金额  /  收入金额',
                    key1: 'pay_money',
                    key2: 'money'
                }], //用于头部数据显示
                detailShow: false,
                topData: {},
                topRate: {},
                myChart: '', //echarts实例
                option: '', //echarts实例配置
                echtext: '展示量', //echarts提示文字
                XdateArr: [], //echartsX轴数据
                ditcharr: [], //所有渠道
                adzoneId: '', //渠道id
                table_data_type: 0, //数据的时间类型
                topbtnIndex: 0, //头部按钮下标
                today_statistics_time: '2010-10-20 14:30',
                data_num: '1570',
                compare: '较前一日',
                gap_lv: '59.48%',
                ordinal: ['dec', 'dec', 'sec', 'sec', 'sec', 'sec', 'sec', 'sec', 'sec'],
                checkList: ['新客'],
                start_time: '', //开始时间参数
                end_time: '', //结束时间参数
                appointDay: '', //指定的日期
                appointWeek: '', //指定的一周
                appointMon: '', //指定的一月
                dialogFormVisible: false, //弹窗显示
                dialogcopy_link: false, //复制链接显示
                activity_name: '', //渠道名称
                channel: '',
                applets: '',

                appletsId: '', //小程序ID
                appletsArr: {}, //小程序ID数组

                isactive_name: true, //是否可确定
                formLabelWidth: '100px',
                formLabelWidth1: '600px',
                currentPage1: 1, //页数
                gotopage: '', //跳转页数
                total: 0, //全部数据长度
                allpages: '', //全部页数
                datequantum: [], //echarts选择的时间段
                dateStar: '', //echarts选择的时间段的开始
                dateEnd: '', //echarts选择的时间段的结束

                // loading:false,//页面loading
                loading: false, //头部loading
                tableloading: false, //tabel的loading
                echartsLoading: false, //图表loading
                allDataLoading: false, //数据汇总loading

                // adzone_type:'0',
                fullscreenLoading: false,
                tableData: [],
                checkDay: false,
                checkWeek: false,
                checkMon: false,
                dateCheckes: {},
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() > Date.now()
                    },
                    shortcuts: [{
                        text: '今天',
                        onClick(picker) {
                            picker.$emit('pick', new Date())
                        }
                    }, {
                        text: '昨天',
                        onClick(picker) {
                            const date = new Date()
                            date.setTime(date.getTime() - 3600 * 1000 * 24)
                            picker.$emit('pick', date)
                        }
                    }, {
                        text: '一周前',
                        onClick(picker) {
                            const date = new Date()
                            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
                            picker.$emit('pick', date)
                        }
                    }]
                }, //日期快捷选项
                pickerOptions2: {
                    disabledDate: (time) => {
                        return time.getTime() > new Date(`${this.dateFormat('YYYY-mm-dd',new Date())} 00:00:00`)
                            .getTime();
                    },
                    shortcuts: [{
                        text: '最近一周',
                        onClick(picker) {
                            const end = new Date()
                            const start = new Date()
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
                            picker.$emit('pick', [start, end])
                        }
                    }, {
                        text: '最近一个月',
                        onClick(picker) {
                            const end = new Date()
                            const start = new Date()
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
                            picker.$emit('pick', [start, end])
                        }
                    }, {
                        text: '最近三个月',
                        onClick(picker) {
                            const end = new Date()
                            const start = new Date()
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
                            picker.$emit('pick', [start, end])
                        }
                    }]
                }, //时间段快捷选项
                echarts_show_datas: [],
                echarts_datas: [{
                        name: '新客',
                        dataKey: 'newuser',
                        type: 'line',
                        data: [],
                        symbolSize: 10,
                        smooth: true,
                        itemStyle: {
                            normal: {
                                color: '#3F88FF', //改变折线点的颜色
                                lineStyle: {
                                    color: '#3F88FF', //改变折线颜色
                                },
                            },
                        },
                        // 触发操作
                        // tooltip: "",
                    },
                    {
                        name: '渠道UV',
                        dataKey: 'uv',
                        type: 'line',
                        data: [],
                        symbolSize: 10,
                        smooth: true,
                        yAxisIndex: 1,
                        itemStyle: {
                            normal: {
                                color: '#86B2F9', //改变折线点的颜色
                                lineStyle: {
                                    color: '#86B2F9', //改变折线颜色
                                },
                            },
                        },
                        // 触发操作
                        // tooltip: "",
                    },
                    {
                        name: 'UV',
                        dataKey: 'guv',
                        type: 'line',
                        data: [],
                        symbolSize: 10,
                        smooth: true,
                        yAxisIndex: 1,
                        itemStyle: {
                            normal: {
                                color: '#FE8B51', //改变折线点的颜色
                                lineStyle: {
                                    color: '#FE8B51', //改变折线颜色
                                },
                            },
                        },
                        // 触发操作
                        // tooltip: "",
                    },
                    {
                        name: 'PV',
                        dataKey: 'pv',
                        type: 'line',
                        data: [],
                        symbolSize: 10,
                        smooth: true,
                        yAxisIndex: 1,
                        itemStyle: {
                            normal: {
                                color: '#FEBB51', //改变折线点的颜色
                                lineStyle: {
                                    color: '#FEBB51', //改变折线颜色
                                },
                            },
                        },
                        // 触发操作
                        // tooltip: "",
                    },
                    {
                        name: '点击率',
                        dataKey: 'click_rate',
                        type: 'line',
                        data: [],
                        symbolSize: 10,
                        smooth: true,
                        itemStyle: {
                            normal: {
                                color: '#AB47FF', //改变折线点的颜色
                                lineStyle: {
                                    color: '#AB47FF', //改变折线颜色
                                },
                            },
                        },
                        // 触发操作
                        // tooltip: "",
                    },
                    {
                        name: '点击UV',
                        dataKey: 'click_uv',
                        type: 'line',
                        data: [],
                        symbolSize: 10,
                        smooth: true,
                        yAxisIndex: 1,
                        itemStyle: {
                            normal: {
                                color: '#FF565F', //改变折线点的颜色
                                lineStyle: {
                                    color: '#FF565F', //改变折线颜色
                                },
                            },
                        },
                        // 触发操作
                        // tooltip: "",
                    },
                    {
                        name: '点击PV',
                        dataKey: 'click_num',
                        type: 'line',
                        data: [],
                        symbolSize: 10,
                        smooth: true,
                        yAxisIndex: 1,
                        itemStyle: {
                            normal: {
                                color: '#FF878E', //改变折线点的颜色
                                lineStyle: {
                                    color: '#FF878E', //改变折线颜色
                                },
                            },
                        },
                        // 触发操作
                        // tooltip: "",
                    },
                    {
                        name: '转化率',
                        dataKey: 'convert_rate',
                        type: 'line',
                        data: [],
                        symbolSize: 10,
                        smooth: true,
                        itemStyle: {
                            normal: {
                                color: '#E375FF', //改变折线点的颜色
                                lineStyle: {
                                    color: '#E375FF', //改变折线颜色
                                },
                            },
                        },
                        // 触发操作
                        // tooltip: "",
                    },
                    {
                        name: '支出金额',
                        dataKey: 'pay_money',
                        type: 'line',
                        data: [],
                        symbolSize: 10,
                        smooth: true,
                        itemStyle: {
                            normal: {
                                color: '#0BCF30', //改变折线点的颜色
                                lineStyle: {
                                    color: '#0BCF30', //改变折线颜色
                                },
                            },
                        },
                        // 触发操作
                        // tooltip: "",
                    },
                    {
                        name: '收益金额',
                        dataKey: 'cpc_money',
                        type: 'line',
                        data: [],
                        symbolSize: 10,
                        smooth: true,
                        itemStyle: {
                            normal: {
                                color: '#4DE29A', //改变折线点的颜色
                                lineStyle: {
                                    color: '#4DE29A', //改变折线颜色
                                },
                            },
                        },
                        // 触发操作
                        // tooltip: "",
                    },
                ],
                tooltip: {
                    show: true, // 是否显示
                    formatter: (params) => {
                        if (
                            params.seriesName.indexOf('价格') != -1 ||
                            params.seriesName.indexOf('金额') != -1
                        ) {
                            return `${params.seriesName}<br><span class='shownum' style='font-size:18px;'>${params.value}元</span><br>2020年${params.name}`
                        } else if (params.seriesName.indexOf('率') != -1) {
                            return `${params.seriesName}<br><span class='shownum' style='font-size:18px;'>${params.value}%</span><br>2020年${params.name}`
                        } else {
                            return `${params.seriesName}<br><span class='shownum' style='font-size:18px;'>${params.value}</span><br>2020年${params.name}`
                        }
                    },
                    trigger: 'item', // 触发类型，
                },
                topBtnsisclicked: [{
                        title: '今日时时',
                        key: 'today'
                    },
                    {
                        title: '近7天',
                        key: 'nearWeek',
                    },
                    {
                        title: '近15天',
                        key: 'nearHalfMon',
                    },
                    {
                        title: '近30天',
                        key: 'nearMon',
                    },
                    // {
                    //     title: '日',
                    //     key: 'appointDay',
                    // },
                    // {
                    //     title: '周',
                    //     key: 'appointWeek',
                    // },
                    // {
                    //     title: '月',
                    //     key: 'appointMon',
                    // }
                ],
                source: null, //中断请求(头部)
                sourceLine: null, //中断请求(折线图)
                channelList: [], //渠道商列表
                channel_id: '',
                AdzoneLoading: true,
            };
        },
        watch: {
            activity_name(val, old) {
                val != '' ? (this.isactive_name = false) : (this.isactive_name = true)
            },
            topbtnIndex: {
                handler(val) {
                    if (val == 0) {
                        this.chooseTop(this.topbtnIndex)
                    }
                    // this.getditch();
                    if (val < 4) {
                        this.datequantum = [
                            this.start_time,
                            this.end_time
                        ]
                    }
                },
                immediate: true,
            },
            datequantum: {
                handler: function (val) {
                    if (val != null) {
                        if (val[0] == val[1]) {
                            // this.datequantum[1] = this.dateFormat('YYYY-mm-dd', (new Date(new Date(this.datequantum[1]).getTime() + 86400000)))
                            this.datequantum[1] = `${this.datequantum[1]} 23:59:59`
                            this.table_data_type = 0
                        }
                        this.dateStar = val[0]
                        this.dateEnd = val[1]

                        this.start_time = val[0]
                        this.end_time = val[1]
                    } else {
                        this.datequantum = [
                            this.start_time,
                            this.end_time,
                        ]
                    }
                    this.$nextTick(() => {
                        this.echartsLoading = true
                        this.getechartsdata()
                        this.allDataLoading = true
                        this.getTopCt()
                    })
                    // this.loading = true;
                    // this.tableloading = true
                    // this.allDataLoading = true
                    // this.currentPage1 = 1
                    // this.getabledata()
                    // this.loading = false;
                },
                immediate: true,
            },
            // 监听appid变化
            appletsId: {
                handler: function (val) {
                    this.echartsLoading = true
                    // this.tableloading = true
                    this.allDataLoading = true
                    // this.getabledata()
                    this.getChannelList()
                    this.getditch()
                    this.getechartsdata()
                    this.getTopCt()
                }
            }
        },
        created() {
            this.loading = true
            this.getditch()
            // this.getId()
            this.getChannelList()

        },
        methods: {
            getAdzoneListInfo() {
                this.AdzoneLoading = true;
                this.getRequest('XcxCt/getAdzoneListInfo', {
                    id: this.channel_id
                }).then((res) => {
                    this.AdzoneLoading = false;
                    console.log('getAdzoneListInfo', res)
                    if (res.code == 200) {
                        this.ditcharr = res.data
                    } else {
                        this.open4(res.msg)
                    }
                })
            },
            //获取渠道商列表
            getChannelList() {
                this.channel_id = ''
                this.adzoneId = ''
                this.AdzoneLoading = true;
                this.getRequest('XcxCt/getOwnerIdList', {
                    appid: this.appletsId
                }).then((res) => {
                    console.log('获取渠道商列表', res)
                    this.AdzoneLoading = false;
                    if (res.code == 200) {
                        this.channelList = res.data
                    } else {
                        this.open4(res.msg)
                    }
                })
            },
            //获取小程序id
            getId() {
                this.getRequest('XcxTask/getMiniList', {
                    page: 1,
                    listRows: 12,
                }).then(res => {
                    this.appletsArr = res.data
                })
            },
            //制定时间
            pointCheck(val) {
                // this.loading = true;
                this.allDataLoading = true
                this.start_time = this.dateFormat('YYYY-mm-dd HH:MM:SS', val)
                this.today_statistics_time = this.dateFormat('YYYY-mm-dd', val)
                this.end_time = this.dateFormat('YYYY-mm-dd', new Date(val.getTime() + 24 * 3600 * 1000))
                this.datequantum = [
                    this.start_time,
                    this.end_time
                ]
                this.getTopCt()
            },
            pointCheck2(val) {
                // this.loading = true;
                this.allDataLoading = true
                this.start_time = this.dateFormat('YYYY-mm-dd HH:MM:SS', new Date(val.getTime()))
                this.today_statistics_time = this.dateFormat('YYYY-mm-dd', val)
                this.end_time = this.dateFormat('YYYY-mm-dd', new Date(val.getTime() + 7 * 24 * 3600 * 1000))
                this.datequantum = [
                    this.start_time,
                    this.end_time
                ]
                this.getTopCt()
            },
            pointCheck3(val) {
                // this.loading = true;
                this.allDataLoading = true
                this.start_time = this.dateFormat('YYYY-mm-dd HH:MM:SS', val)
                this.today_statistics_time = this.dateFormat('YYYY-mm-dd', val)
                this.end_time = this.dateFormat('YYYY-mm-dd', new Date(val.getTime() + 30 * 86400000))
                this.datequantum = [
                    this.start_time,
                    this.end_time
                ]
                this.getTopCt()
            },
            //顶部按钮点击
            chooseTop(str) {
                // this.loading = true;
                let coudeRequse = false
                switch (str) {
                    case 0:
                        // this.loading = true;
                        // this.compare = '较前一日';
                        this.topbtnIndex = 0
                        this.table_data_type = 0
                        this.start_time = this.dateFormat('YYYY-mm-dd', new Date(new Date().getTime()))
                        this.today_statistics_time = this.start_time
                        this.end_time = this.dateFormat('YYYY-mm-dd HH:MM:SS', new Date(new Date().getTime()))
                        if (this.start_time != this.datequantum[0] || this.end_time != this.datequantum[1]) {
                            this.datequantum = [
                                this.start_time,
                                this.end_time,
                            ]
                        }
                        coudeRequse = true
                        break
                    case 1:
                        // this.loading = true;
                        // this.compare = '较前7天';
                        this.topbtnIndex = 1
                        this.table_data_type = 1
                        this.start_time = this.dateFormat('YYYY-mm-dd', new Date(new Date().getTime() - 7 * 24 * 60 *
                            60 * 1000))
                        this.today_statistics_time = this.start_time
                        this.end_time = this.dateFormat('YYYY-mm-dd', new Date())
                        if (this.start_time != this.datequantum[0] || this.end_time != this.datequantum[1]) {
                            this.datequantum = [
                                this.start_time,
                                this.end_time,
                            ]
                        }
                        coudeRequse = true
                        break
                    case 2:
                        // this.loading = true;
                        // this.compare = '较前15天';
                        this.topbtnIndex = 2
                        this.table_data_type = 2
                        this.start_time = this.dateFormat('YYYY-mm-dd', new Date(new Date().getTime() - 15 * 24 * 60 *
                            60 * 1000))
                        this.today_statistics_time = this.start_time
                        this.end_time = this.dateFormat('YYYY-mm-dd', new Date())
                        if (this.start_time != this.datequantum[0] || this.end_time != this.datequantum[1]) {
                            this.datequantum = [
                                this.start_time,
                                this.end_time,
                            ]
                        }
                        coudeRequse = true
                        break
                    case 3:
                        // this.loading = true;
                        // this.compare = '较前30天';
                        this.topbtnIndex = 3
                        this.table_data_type = 3
                        this.start_time = this.dateFormat('YYYY-mm-dd', new Date(new Date().getTime() - 30 * 24 * 60 *
                            60 * 1000))
                        this.today_statistics_time = this.start_time
                        this.end_time = this.dateFormat('YYYY-mm-dd', new Date())
                        if (this.start_time != this.datequantum[0] || this.end_time != this.datequantum[1]) {
                            this.datequantum = [
                                this.start_time,
                                this.end_time,
                            ]
                        }
                        coudeRequse = true
                        break
                        // case 4:
                        //     this.table_data_type = 4
                        //     this.$refs.day.$el.click()
                        //     // this.compare = '较前一日';
                        //     // this.appointDay = null;
                        //     this.appointMon = null
                        //     this.appointWeek = null
                        //     if (this.start_time != this.datequantum[0] || this.end_time != this.datequantum[1]) {
                        //         this.datequantum = [
                        //             this.start_time,
                        //             this.end_time,
                        //         ]
                        //     }
                        //     break
                        // case 5:
                        //     this.table_data_type = 5
                        //     // this.compare = '较前一周';
                        //     // this.appointWeek = null;
                        //     this.appointMon = null
                        //     this.appointDay = null
                        //     if (this.start_time != this.datequantum[0] || this.end_time != this.datequantum[1]) {
                        //         this.datequantum = [
                        //             this.start_time,
                        //             this.end_time,
                        //         ]
                        //     }
                        //     break
                        // case 6:
                        //     this.table_data_type = 6
                        //     // this.compare = '较前一月';
                        //     // this.appointMon = null;
                        //     this.appointDay = null
                        //     this.appointWeek = null
                        //     if (this.start_time != this.datequantum[0] || this.end_time != this.datequantum[1]) {
                        //         this.datequantum = [
                        //             this.start_time,
                        //             this.end_time,
                        //         ]
                        //     }
                        //     break
                        // coudeRequse = true;
                    default:
                        break
                }
                if (coudeRequse == true) {
                    // this.allDataLoading = true
                    // this.getTopCt()
                    // this.getechartsdata();
                    // this.getabledata();
                }
            },
            //时间处理important
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
            //echarts渲染函数
            drawChart() {
                // 基于准备好的dom，初始化echarts实例
                this.myChart = this.$echarts.init(document.getElementById('new_echarts'))
                // 指定图表的配置项和数据
                this.option = {
                    tooltip: {},
                    grid: {
                        top: '50px',
                        left: '70px',
                        right: '70px',
                        bottom: '20px',
                        backgroundColor: '#fff',
                        width: 'auto', //图例宽度
                    },
                    xAxis: {
                        data: this.XdateArr,
                        boundaryGap: false,
                        axisLabel: {
                            textStyle: {
                                color: 'rgba(0,0,0,.65)', //坐标值得具体的颜色
                            },
                        },
                        axisLine: {
                            lineStyle: {
                                type: 'solid',
                                color: 'rgba(0,0,0,.30)', //左边线的颜色
                            },
                        },
                    },
                    yAxis: [{
                            type: 'value',
                            min: 0,
                            // max:100,
                            axisLine: {
                                show: false
                            },
                            axisTick: {
                                show: false
                            },
                            splitLine: {
                                show: true,
                                lineStyle: {
                                    type: 'dashed'
                                }
                            },
                            axisLabel: {
                                textStyle: {
                                    color: 'rgba(0,0,0,.65)', //坐标值得具体的颜色
                                }
                            },
                        },
                        {
                            type: 'value',
                            min: 0,
                            // max:100,
                            axisLine: {
                                show: false
                            },
                            axisTick: {
                                show: false
                            },
                            splitLine: {
                                show: true,
                                lineStyle: {
                                    type: 'dashed'
                                }
                            },
                            axisLabel: {
                                textStyle: {
                                    color: 'rgba(0,0,0,.65)', //坐标值得具体的颜色
                                }
                            },
                        },
                    ],
                    series: this.echarts_show_datas,
                    tooltip: {
                        //？触发类型
                        trigger: 'axis',
                        axisPointer: {
                            type: 'line'
                        },
                        // 提示框内容: 可根据传入的data参数自定义内容、配合html自定义排版样式
                        formatter: function (params) {
                            var tip = ''
                            tip += `<div style="padding:0 0 0 10px;font-size:18px">时间：${params[0].name}</div>`
                            params.forEach(ele => {
                                if (
                                    ele.seriesName.indexOf('价格') != -1 ||
                                    ele.seriesName.indexOf('金额') != -1
                                ) {
                                    tip +=
                                        `<div><span style="display:inline-block;margin-right:10px;color:#fff;width:70px;text-align:right;">${ele.seriesName}:</span><span class='shownum' style='font-size:18px;'>${ele.value}元</span></div>`
                                } else if (ele.seriesName.indexOf('率') != -1) {
                                    tip +=
                                        `<div><span style="display:inline-block;margin-right:10px;color:#fff;width:70px;text-align:right;">${ele.seriesName}:</span><span class='shownum' style='font-size:18px;'>${ele.value}%</span></div>`
                                } else {
                                    tip +=
                                        `<div><span style="display:inline-block;margin-right:10px;color:#fff;width:70px;text-align:right;">${ele.seriesName}:</span><span class='shownum' style='font-size:18px;'>${ele.value}</span></div>`
                                }
                            })
                            return tip
                        }
                    },
                }
                // 使用刚指定的配置项和数据显示图表
                this.myChart.setOption(this.option, true)
            },
            // checkbox选择
            checkes() {
                this.echatrs_data_deal()
                this.drawChart('formcheckbox')
            },
            handleSizeChange(val) {},
            handleCurrentChange(val) {
                this.tableloading = true
                this.currentPage1 = val
                this.getabledata()
            },
            // 第一次获取数据
            // firstget() {
            //   this.getditch();
            //   this.getechartsdata();
            //   this.getabledata();
            //   this.getditch();
            // },
            //获取渠道数据
            getditch() {
                this.AdzoneLoading = true
                this.getRequest('/XcxCt/getAdzoneList', {
                    appid: this.appletsId
                }).then(resp => {
                    this.AdzoneLoading = false
                    if (resp.code == 200) {
                        this.ditcharr = resp.data
                        this.loading = false
                    } else {
                        this.open4(resp.msg)
                        this.loading = false
                    }
                }).catch((res) => {
                    // this.open4('请求错误')
                })
            },
            //echarts时间段选择
            choosedatequantum(val) {
                if (val != null) {
                    this.topbtnIndex = 4;
                    this.table_data_type = 4;
                }
            },
            //echarts数据处理
            echatrs_data_deal() {
                //清空线的数据
                this.echarts_show_datas = []
                // 根据checkbox重新写入线的数据
                if (this.echarts_datas.length != 0) {
                    this.echarts_datas.forEach((element) => {
                        this.checkList.forEach((ele) => {
                            if (element.name == ele) {
                                // element.tooltip = this.tooltip;
                                this.echarts_show_datas.push(element)
                            }
                        })
                    })
                }
                // if (this.loading == true) {
                //   this.loading = false;
                // }
                if (this.echartsLoading == true) {
                    this.echartsLoading = false
                }
                this.drawChart()
            },
            //获取列表数据
            getabledata() {
                this.getRequest('/XcxCt/getLogList', {
                    start: this.dateStar,
                    end: this.dateEnd,
                    adzone_id: this.adzoneId,
                    type: this.table_data_type,
                    p: this.currentPage1,
                    appid: this.appletsId,
                }).then(resp => {
                    if (resp.code == 200) {
                        this.tableData = resp.data.data
                        this.total = resp.data.total
                        this.allpages = Math.ceil(resp.data.total / 10)
                        this.gotopage = this.currentPage1
                        this.tableloading = false
                        // this.loading = false;
                    } else {
                        this.open4(resp.msg)
                        this.tableloading = false
                    }
                }).catch((res) => {
                    // this.open4('请求错误')
                })
            },
            cancelRequest(str) {
                if (str == 'source') {
                    if (typeof this.source === 'function') {
                        this.source('请求中断1')
                    }
                } else if (str == 'sourceLine') {
                    if (typeof this.sourceLine === 'function') {
                        this.sourceLine('请求中断2')
                    }
                }

            },
            //获取图表数据
            getechartsdata() {
                const _this = this;
                this.cancelRequest('sourceLine');
                this.getRequest('/XcxCt/getLogData', {
                        start: this.dateStar,
                        end: this.dateEnd,
                        adzone_id: this.adzoneId,
                        type: this.table_data_type,
                        appid: this.appletsId,
                        owner_id: this.channel_id
                    },
                    new axios.CancelToken((c) => {
                        _this.sourceLine = c
                    }),
                ).then(resp => {
                    if (axios.isCancel(resp)) {
                        this.open2('未加载请求已被中断')
                        this.sourceLine = null
                        return
                    }
                    if (resp.code == 200) {
                        this.echartsdatadeal(resp.data)
                    } else {
                        this.open4(resp.msg)
                        // this.loading = false;
                        this.echartsLoading = false
                    }
                }).catch((res) => {
                    // this.open4('请求错误')
                })
            },
            //图表数据处理
            echartsdatadeal(datarr) {
                this.echarts_datas.forEach(element => {
                    element.data = []
                    datarr.forEach(ele => {
                        element.data.push(ele[element.dataKey])
                    })
                })
                this.XdateArr = []
                datarr.forEach(ele => {
                    this.XdateArr.push(ele.date_tag)
                })
                this.echatrs_data_deal()
            },
            //增加渠道功能
            addditch() {
                this.loading = true
                this.postRequest('/XcxCt/addAdzone', {
                        name: this.activity_name,
                    })
                    .then((resp) => {
                        if (resp.code == 200) {
                            this.open2(resp.msg)
                            this.getditch()
                            this.loading = false
                            this.activity_name = ''
                            this.dialogFormVisible = false
                        } else {
                            this.open4(resp.msg)
                            this.activity_name = ''
                            this.loading = false
                        }
                    })
                    .catch((res) => {
                        // this.open4('请求错误')
                    })
            },
            canceladdditch() {
                this.dialogFormVisible = false
                this.activity_name = ''
            },
            //复制链接功能
            copylink() {
                let url = 'alipays://platformapi/startApp?appId=' + this.applets +
                    '&page=pages%2findex%2findex&query=adzoneId%3d' + this.channel + '%26filter%3d1'
                if (this.applets == 2021001167680229) {
                    url = 'alipays://platformapi/startApp?appId=' + this.applets +
                        '&page=pages%2fwalk%2fwalk&query=adzoneId%3d' + this.channel + '%26filter%3d1'
                }
                this.copyToClipboard(url)
                this.dialogcopy_link = false
                this.channel = ''
                this.applets = ''
            },
            cancelcopy_link() {
                this.dialogcopy_link = false
                this.channel = ''
                this.applets = ''
            },
            copyToClipboard(text) {
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
                } catch (err) {
                    alert('该浏览器不支持点击复制到剪贴板');
                }
                document.body.removeChild(textArea);
            },

            //表格数据修改
            edititem(row) {
                this.$prompt('请输入支出金额', '修改', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputPattern: /^\+?[0-9][0-9]*$/,
                    inputErrorMessage: '请输入正确的金额',
                    closeOnClickModal: false,
                }).then(({
                    value
                }) => {
                    this.tableloading = true
                    this.postRequest('/XcxCt/setPay', {
                        day: row.bk,
                        adzone_id: this.adzoneId,
                        money: Number(value),
                    }).then(resp => {
                        if (resp.code == 200) {
                            this.getabledata()
                            this.getechartsdata()
                            this.getTopCt()
                            this.open2(resp.msg)
                        } else {
                            this.open4(resp.msg)
                            this.tableloading = false
                        }
                    }).catch((res) => {
                        // this.open4('请求错误')
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '取消输入'
                    })
                })
            },
            //输入页码跳转
            togothatpage() {
                this.tableloading = true
                if (this.gotopage < this.allpages) {
                    this.currentPage1 = Number(this.gotopage)
                    this.getabledata()
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
            changeAdzoneId() {
                this.echartsLoading = true
                this.tableloading = true
                this.allDataLoading = true
                this.getTopCt()
                this.getechartsdata()
                // this.getabledata()
            },
            changeChannelId() {
                this.echartsLoading = true
                this.tableloading = true
                this.allDataLoading = true
                this.adzoneId = ''
                this.getTopCt()
                this.getechartsdata()
                if (this.channel_id == '') {
                    this.getditch()
                } else {
                    this.getAdzoneListInfo()
                }

            },
            //获取数据汇总的数据
            getTopCt() {
                const _this = this;
                this.cancelRequest('source');
                this.getRequest('/XcxCt/topCt', {
                        start: this.start_time,
                        end: this.end_time,
                        adzone_id: this.adzoneId,
                        appid: this.appletsId,
                        owner_id: this.channel_id
                    },
                    new axios.CancelToken((c) => {
                        _this.source = c
                    }),
                ).then((res) => {
                    if (axios.isCancel(res)) {
                        this.open2('未加载请求已被中断')
                        this.source = null
                        return
                    }
                    this.topData = res.data.data
                    this.topRate = res.data.rate
                    switch (this.table_data_type) {
                        case 0:
                            this.compare = '较前一日'
                            break
                        case 1:
                            this.compare = '较前7天'
                            break
                        case 2:
                            this.compare = '较前15天'
                            break
                        case 3:
                            this.compare = '较前30天'
                            break
                        case 4:
                            this.compare = '较前一日'
                            break
                        case 5:
                            this.compare = '较前一周'
                            break
                        case 6:
                            this.compare = '较前一月'
                            break
                        default:
                            break
                    }
                    // this.loading = false;
                    this.allDataLoading = false
                })
            },
            showDetail(key) {
                if (key == 'click_uv') {
                    this.detailShow = true
                }
            }
        },
        filters: {
            floatMoney(num) {
                return parseFloat(num).toLocaleString()
            }
        },
        computed: {
            xcxlist() {
                return this.$store.state.base.xcxList == undefined ? this.appletsArr : this.$store.state.base.xcxList
            },
        },
        mounted() {
            setTimeout(() => {
                window.onresize = () => {
                    this.myChart.resize()
                }
            }, 200)

        }
    };

</script>

<style lang='scss' scoped>
    .headerCard {
        margin-bottom: 24px;
        position: relative;
        // min-width: 795px;
    }

    //图表
    .echtable {
        width: 100%;
        height: 400px;
        min-width: 600px;
    }

    // 新内容
    .new_content {
        box-sizing: border-box;
        background: #fff;
        border-radius: 4px;

        .today_statistics_box {
            display: flex;
            align-items: center;
            justify-content: space-between;

            margin-bottom: 30px;

            .right_btn_select {
                display: flex;
                align-items: center;

                .today_statistics_time {
                    font-size: 14px;
                    font-family: PingFang SC;
                    font-weight: 500;
                    color: #343434;
                    margin-right: 30px;
                }
            }

            .button_box {
                display: flex;
                justify-content: space-between;

                .top_btns {
                    font-size: 12px;
                    font-family: PingFang SC;
                    font-weight: 500;
                    color: #666666;
                    border: 1px solid #ececec;
                    border-radius: 5px;
                    margin-right: 20px;
                    padding: 8px 15px;
                    cursor: pointer;
                    transition: all 0.3s;
                }

                .top_btns:last-of-type {
                    margin-right: 0;
                }

                .top_btns:hover {
                    border-color: #448AFF;
                }

                .top_btn_clicked {
                    color: #ffffff;
                    // border-color: #0046f4;

                    background: linear-gradient(90deg, #73A7FF, #448AFF);
                }

                .table_select {
                    margin-bottom: 0;
                }
            }

            // 复制链接
            .copy_link {
                background: #0046f4;
                width: 114px;
                height: 34px;
                border: 1px solid #0046F4;
                border-radius: 4px;

                text-align: center;

                cursor: pointer;
                transition: all .2s linear;

                span {
                    width: 55px;
                    height: 14px;
                    font-size: 14px;
                    font-family: PingFang SC;
                    font-weight: 500;
                    color: #0046F4;
                    line-height: 34px;
                    color: #ffffff;
                }
            }

            .copy_link:hover {
                background: #4c7bf0;
                border-color: rgba(0, 70, 244, 0.6);
            }

            .creat_ditch {
                background: #0046f4;
                border: 1px solid #0046f4;
                border-radius: 4px;
                display: flex;
                align-items: center;
                padding: 7px 20px;
                box-sizing: border-box;
                transition: all 0.3s;
                cursor: pointer;

                .add_icon {
                    width: 13px;
                    height: 12px;
                    background-size: 100%;
                    background-image: url(~@img/add_icon.png);
                    margin-right: 9px;
                }

                span {
                    font-size: 14px;
                    font-family: PingFang SC;
                    font-weight: 500;
                    color: #ffffff;
                }
            }

            .creat_ditch:hover {
                background: #4c7bf0;
                border-color: rgba(0, 70, 244, 0.6);
            }
        }
    }

    // 数据汇总
    .data_boxes {
        display: flex;
        justify-content: space-between;

        border: 1px solid #CECECE;
        border-radius: 16px;

        .data_item {
            position: relative;
            padding: 20px 10px 20px 20px;
            // background: rgba(0, 70, 244, 0.03);
            // opacity: 0.03;
            border-radius: 0px 0px 4px 4px;
            flex: 1;
            margin-right: 11px;

            .item_title {
                margin-bottom: 20px;
                position: relative;

                span {

                    font-size: 16px;
                    font-family: PingFang SC;
                    font-weight: 500;
                    color: #333333;
                    line-height: 14px;
                }
            }

            .item_title::before {
                content: "";
                display: block;
                position: absolute;
                width: 4px;
                height: 20px;
                background: #4188FF;
                border-radius: 2px;
                left: -9px;
            }

            .data_num {
                display: inline-block;
                font-weight: 500;
                color: #343434;
                margin-bottom: 20px;


                font-size: 22px;
                font-family: AlipayNumber-Regular;
                color: #333333;

                span {
                    font-size: 14px;
                }
            }

            .compare_box {
                display: flex;
                /*align-items: center;*/
                /*justify-content: space-between;*/

                .compare_text {
                    font-size: 12px;
                    font-family: PingFang SC;
                    font-weight: 500;
                    color: #999999;
                }

                .gap_jj {
                    width: 6px;
                    height: 10px;
                    font-size: 12px;
                    font-family: PingFang SC;
                    font-weight: 500;
                    color: #000000;
                    display: inline-block;
                    margin-right: 6px;
                }

                .gap_text {
                    margin-right: 6px;

                    font-size: 14px;
                    font-family: PingFang SC;
                    font-weight: 500;
                    color: #343434;
                }

                .dec {
                    color: #FF0000;
                }

                .sec {
                    color: #13FF01;
                }

                .dec_icon {
                    display: inline-block;
                    width: 7px;
                    height: 12px;
                    background: url(~@img/dec.png) no-repeat;
                    background-size: contain;
                }

                .sec_icon {
                    display: inline-block;
                    width: 7px;
                    height: 12px;
                    background: url(~@img/sec.png) no-repeat;
                    background-size: contain;
                }
            }
        }

        .data_item:last-of-type {
            margin-right: 0px;
        }

        .could_click {
            cursor: pointer;
        }
    }

    .item_title {
        display: flex;
        align-items: center;

        .question_icon {
            display: inline-block;
            width: 15px;
            height: 15px;
            background-size: 100%;
            background-image: url(~@img/question.png);
            margin-left: 6px;
            cursor: pointer;
        }
    }

    // 数据趋势
    .checkbox_select {
        display: flex;
        align-items: center;
        justify-content: space-between;

        .time_fenge {
            margin: 0 10px;
        }

        .checkboxes_box {
            margin: 0 auto;
        }
    }

    //element checkbox
    .checkboxes_box>>>.el-checkbox {
        margin-right: 15px;
    }

    // 每天数据
    /* 分页样式 */
    .pagination {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 34px;
    }

    /*设置当前页码的样式，及鼠标移上其他页码时的样式,以及左右箭头鼠标移上的样式*/
    .pagination_box>>>.btn-prev {
        border: 1px solid #d6d6d6 !important;
        border-radius: 4px !important;
        padding: 0px 17px 0px 18px !important;
        display: inline-block !important;
        background-color: #fff !important;
    }

    .pagination_box>>>.btn-next {
        border: 1px solid #d6d6d6 !important;
        border-radius: 4px !important;
        padding: 0px 17px 0px 18px !important;
        display: inline-block !important;
        background-color: #fff !important;
    }

    .pagination_box>>>.el-pagination.is-background .el-pager li:not(.disabled).active {
        background-color: #0046f4 !important;
    }

    .togo_that_page {
        font-size: 14px;
        font-family: PingFang SC;
        font-weight: 500;
        color: #666666;
        margin-right: 10px;
    }

    .show_datanum_allpage span {
        font-size: 14px;
        font-family: PingFang SC;
        font-weight: 500;
        color: #666666;
    }

    /* table_box */

    // 修改支出金额
    .edit_expend_box .edit_comfirm_btn {
        display: inline-block;
        margin-left: 10px;
        margin-right: 10px;
        background-color: rgba(0, 70, 244, 1);
        color: #fff;
        font-size: 12px;
        padding: 2px 5px 3px 5px;
        border-radius: 5px;
        transition: all 0.3s;
        cursor: pointer;
    }

    .edit_expend_box>>>.el-button--mini {
        border-radius: 5px;
        padding: 8px 2px;
    }

    .edit_comfirm_btn:hover {
        background-color: rgba(0, 70, 244, 0.8);
    }

    .edit_expend_box>>>.el-input__inner {
        padding: 0 5px;
    }

    // element select
    .table_select {
        // margin-bottom: 34px;
    }

    // .table_select >>> .el-input__icon {
    //     width: 34px;
    // }

    // .table_select >>> .el-input__suffix {
    //     right: 0;
    //     background-color: #ececec;
    //     border-radius: 0 4px 4px 0;
    //     height: 26px;
    //     top: 1px;
    //     right: 0.75px;
    // }

    // element date_chooes
    .select_time>>>.el-input__prefix {
        left: initial;
        right: 1%;
        top: 2%;
        height: 26px;
        background: #ececec;
        color: #666666;
        border-radius: 0px 4px 4px 0px;
    }

    .select_time>>>.el-input__inner {
        padding-left: 15px;
        color: #666666;
    }

    .select_time>>>.el-input__suffix {
        right: 20%;
    }

    // checkbox 样式
    .checkboxes_box .check_item_box {
        display: inline-block;
    }

    .checkboxes_box>>>.el-checkbox__inner {
        border-radius: 50%;
        background-color: #fff;
    }

    .checkboxes_box>>>.el-checkbox {
        color: #666666;
        margin-right: 46px;
    }

    .checkboxes_box>>>.el-checkbox__label {
        padding-left: 6px;
    }

    .checkboxes_box>>>.el-checkbox__input.is-checked+.el-checkbox__label {
        color: #666666;
    }

    // 加未选中的 对号 css
    .checkboxes_box>>>.el-checkbox__inner::after {
        // ::after {
        // 对号
        border: 5px solid #0046f4;
        // 不覆盖下面的 会 导致对号变形
        box-sizing: content-box;
        content: "";
        height: 4px;
        left: -1px;
        position: absolute;
        top: -1px;
        width: 4px;
        border-radius: 50%;
        // }
    }

    .checkboxes_box .newuser>>>.el-checkbox__inner {
        border-color: #3F88FF;
    }

    .checkboxes_box .newuser>>>.el-checkbox__inner::after {
        border-color: #3F88FF;
    }

    .checkboxes_box .newuser>>>.el-checkbox__input.is-checked .el-checkbox__inner {
        background-color: #fff;
        border-color: #3F88FF;
    }

    .checkboxes_box .newuser>>>.el-checkbox__inner:hover {
        border-color: #3F88FF;
    }

    .checkboxes_box .newuser>>>.el-checkbox__input.is-focus .el-checkbox__inner {
        border-color: #3F88FF;
    }

    .checkboxes_box .uv>>>.el-checkbox__inner {
        border-color: #86B2F9;
    }

    .checkboxes_box .uv>>>.el-checkbox__inner::after {
        border-color: #86B2F9;
    }

    .checkboxes_box .uv>>>.el-checkbox__input.is-checked .el-checkbox__inner {
        background-color: #fff;
        border-color: #86B2F9;
    }

    .checkboxes_box .uv>>>.el-checkbox__inner:hover {
        border-color: #86B2F9;
    }

    .checkboxes_box .uv>>>.el-checkbox__input.is-focus .el-checkbox__inner {
        border-color: #86B2F9;
    }

    .checkboxes_box .UV>>>.el-checkbox__inner {
        border-color: #FE8B51;
    }

    .checkboxes_box .UV>>>.el-checkbox__inner::after {
        border-color: #FE8B51;
    }

    .checkboxes_box .UV>>>.el-checkbox__input.is-checked .el-checkbox__inner {
        background-color: #fff;
        border-color: #FE8B51;
    }

    .checkboxes_box .UV>>>.el-checkbox__inner:hover {
        border-color: #FE8B51;
    }

    .checkboxes_box .UV>>>.el-checkbox__input.is-focus .el-checkbox__inner {
        border-color: #FE8B51;
    }

    .checkboxes_box .PV>>>.el-checkbox__inner {
        border-color: #FEBB51;
    }

    .checkboxes_box .PV>>>.el-checkbox__inner::after {
        border-color: #FEBB51;
    }

    .checkboxes_box .PV>>>.el-checkbox__input.is-checked .el-checkbox__inner {
        background-color: #fff;
        border-color: #FEBB51;
    }

    .checkboxes_box .PV>>>.el-checkbox__inner:hover {
        border-color: #FEBB51;
    }

    .checkboxes_box .PV>>>.el-checkbox__input.is-focus .el-checkbox__inner {
        border-color: #FEBB51;
    }

    .checkboxes_box .click_uv>>>.el-checkbox__inner {
        border-color: #FF565F;
    }

    .checkboxes_box .click_uv>>>.el-checkbox__inner::after {
        border-color: #FF565F;
    }

    .checkboxes_box .click_uv>>>.el-checkbox__input.is-checked .el-checkbox__inner {
        background-color: #fff;
        border-color: #FF565F;
    }

    .checkboxes_box .click_uv>>>.el-checkbox__inner:hover {
        border-color: #FF565F;
    }

    .checkboxes_box .click_uv>>>.el-checkbox__input.is-focus .el-checkbox__inner {
        border-color: #FF565F;
    }

    .checkboxes_box .click_pv>>>.el-checkbox__inner {
        border-color: #FF878E;
    }

    .checkboxes_box .click_pv>>>.el-checkbox__inner::after {
        border-color: #FF878E;
    }

    .checkboxes_box .click_pv>>>.el-checkbox__input.is-checked .el-checkbox__inner {
        background-color: #fff;
        border-color: #FF878E;
    }

    .checkboxes_box .click_pv>>>.el-checkbox__inner:hover {
        border-color: #FF878E;
    }

    .checkboxes_box .click_pv>>>.el-checkbox__input.is-focus .el-checkbox__inner {
        border-color: #FF878E;
    }

    .checkboxes_box .click_rate>>>.el-checkbox__inner {
        border-color: #AB47FF;
    }

    .checkboxes_box .click_rate>>>.el-checkbox__inner::after {
        border-color: #AB47FF;
    }

    .checkboxes_box .click_rate>>>.el-checkbox__input.is-checked .el-checkbox__inner {
        background-color: #fff;
        border-color: #AB47FF;
    }

    .checkboxes_box .click_rate>>>.el-checkbox__inner:hover {
        border-color: #AB47FF;
    }

    .checkboxes_box .click_rate>>>.el-checkbox__input.is-focus .el-checkbox__inner {
        border-color: #AB47FF;
    }

    .checkboxes_box .rate>>>.el-checkbox__inner {
        border-color: #E375FF;
    }

    .checkboxes_box .rate>>>.el-checkbox__inner::after {
        border-color: #E375FF;
    }

    .checkboxes_box .rate>>>.el-checkbox__input.is-checked .el-checkbox__inner {
        background-color: #fff;
        border-color: #E375FF;
    }

    .checkboxes_box .rate>>>.el-checkbox__inner:hover {
        border-color: #E375FF;
    }

    .checkboxes_box .rate>>>.el-checkbox__input.is-focus .el-checkbox__inner {
        border-color: #E375FF;
    }

    .checkboxes_box .paymoney>>>.el-checkbox__inner {
        border-color: #0BCF30;
    }

    .checkboxes_box .paymoney>>>.el-checkbox__inner::after {
        border-color: #0BCF30;
    }

    .checkboxes_box .paymoney>>>.el-checkbox__input.is-checked .el-checkbox__inner {
        background-color: #fff;
        border-color: #0BCF30;
    }

    .checkboxes_box .paymoney>>>.el-checkbox__inner:hover {
        border-color: #0BCF30;
    }

    .checkboxes_box .paymoney>>>.el-checkbox__input.is-focus .el-checkbox__inner {
        border-color: #0BCF30;
    }

    .checkboxes_box .income>>>.el-checkbox__inner {
        border-color: #4DE29A;
    }

    .checkboxes_box .income>>>.el-checkbox__inner::after {
        border-color: #4DE29A;
    }

    .checkboxes_box .income>>>.el-checkbox__input.is-checked .el-checkbox__inner {
        background-color: #fff;
        border-color: #4DE29A;
    }

    .checkboxes_box .income>>>.el-checkbox__inner:hover {
        border-color: #4DE29A;
    }

    .checkboxes_box .income>>>.el-checkbox__input.is-focus .el-checkbox__inner {
        border-color: #4DE29A;
    }

    // 弹窗样式
    .dialog>>>.el-dialog {
        border-radius: 8px;
    }

    .dialog>>>.el-dialog__header {
        background-color: #0046f4;
        padding: 14px 30px;
        border-radius: 8px 8px 0px 0px;
    }

    .dialog>>>.el-dialog__title {
        font-size: 15px;
        font-family: PingFang SC;
        font-weight: 500;
        color: #ffffff;
    }

    .dialog>>>.el-dialog__close {
        color: #fff;
    }

    .dialog>>>.el-form-item__label {
        font-size: 14px;
        font-family: PingFang SC;
        font-weight: 500;
        color: #343434;
    }

    .dialog>>>.el-dialog__footer {
        text-align: center;
    }

    .dialog>>>.el-dialog__body {
        padding-bottom: 10px;
    }

    .dialog>>>.el-button--primary {
        background-color: #0046f4;
        border-color: #0046f4;
    }

    .dialog>>>.el-button--primary.is-disabled {
        background-color: #a0cfff;
        border-color: #a0cfff;
    }

    //顶部时间选择器
    .right_btn_select>>>.el-picker-panel {
        position: absolute;
        z-index: 33;
    }

</style>
