<!--
 * @Descripttion: 互动类数据统计
 * @version: 1.0
 * @Author: WangChuan
 * @Date: 2021-01-15 16:52:43
 * @lastAuthor: CQBCode
 * @lastEditTime: 2021-09-11 14:40 PM
-->
<template>
    <div class="headerCard">
        <div class="new_content">
            <div class="today_statistics_box" v-loading="loading">
                <!-- 顶部按钮 -->
                <div class="button_box">
                    <template>
                        <div
                            v-for="(item, index) in topBtnsisclicked"
                            :key="index"
                            :class="
                                'top_btns ' +
                                    (topbtnIndex == index
                                        ? 'top_btn_clicked'
                                        : '')
                            "
                            ref="TopBtn"
                            @click="chooseTop(index)"
                        >
                            {{ item.title }}
                        </div>
                    </template>
                </div>
                <div class="right_btn_select">
                    <div class="select_time">
                        <el-date-picker
                            v-model="datequantum"
                            type="daterange"
                            align="right"
                            size="medium"
                            :editable="false"
                            :clearable="false"
                            unlink-panels
                            format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            @change="choosedatequantum"
                            :picker-options="pickerOptions2"
                            style="width:300px"
                        >
                        </el-date-picker>
                    </div>
                    <!-- -->
                    <!-- 选择小程序 -->
                    <div class="table_select">
                        <el-select
                            v-model="appletsId"
                            size="medium"
                            style="width:150px;margin-left:10px;"
                            filterable
                            placeholder="请选择小程序"
                            @change="selectXcx"
                        >
                            <!-- <el-option label="全部小程序" value="" /> -->
                            <el-option
                                v-for="(items, key) in xcxlist"
                                :key="key"
                                :label="items"
                                :value="key"
                            />
                        </el-select>
                    </div>

                    <div class="getData_btn" @click="uploadData()" v-if="appletsId==2021002161629327">
                        导出EXCEL
                    </div>
                </div>
            </div>

            <!-- 天天果园 -->
            <template v-if="appletsId == 2021002161629327">
                <div class="show_data_box">
                    <div class="data_boxes" v-loading="allDataLoading">
                        <div
                            :class="'data_item '"
                            v-for="(item, key) in dataKey"
                            :key="key"
                        >
                            <div class="item_title">
                                <span>{{ item.title }}</span>
                            </div>
                            <span class="data_num">
                                {{ topData[item.key1] | floatMoney }}&nbsp;{{
                                    item.key2 ? "/&nbsp;" : ""
                                }}{{ item.key2 ? topData[item.key2] : "" }}
                            </span>
                        </div>
                    </div>
                </div>
                <div class="two_echart" v-loading="echartsLoading">
                    <div class="show_data_box">
                        <!-- echarts -->
                        <div id="new_echarts" class="echtable"></div>
                    </div>
                    <div class="pie_data">
                        <div id="pie_box" class="show_pieData"></div>
                    </div>
                </div>

                <div class="bar_data" v-loading="barLoading">
                    <div id="bar_echart" class="bar_ech"></div>
                    <div class="bar_box_top">
                        <div class="table_select">
                            <el-select
                                v-model="show_data_type"
                                size="medium"
                                style="width:240px;margin-left:10px;"
                                filterable
                                placeholder="请选择需要展示的数据"
                            >
                                <!-- show_data_type_list -->
                                <el-option
                                    :label="item.label"
                                    :value="item.value"
                                    v-for="(item, index) in show_data_type_list"
                                    :key="index"
                                />
                                <!-- <el-option label="用户数(个)" value="1" />
                                <el-option label="浇水次数（次)" value="2" />
                                <el-option label="所有用户账户剩余水滴数（滴)" value="3" />
                                <el-option label="邀请好友数（个)" value="4" />
                                <el-option label="完成任务数（个)" value="5" />
                                <el-option label="消耗金额数(元)" value="6" /> -->
                            </el-select>
                            <el-select
                                v-if="
                                    show_data_type == 5 || show_data_type == 6
                                "
                                v-model="roundId"
                                size="medium"
                                style="width:150px;margin-left:10px;"
                                filterable
                                placeholder="选择第几轮"
                            >
                                <el-option
                                    v-for="(items, index) in roundList"
                                    :key="index"
                                    :label="'第' + items.tree_number + '轮'"
                                    :value="items.tree_number"
                                />
                            </el-select>
                        </div>
                    </div>
                </div>
            </template>

            <!-- 全民庄园 -->
            <template v-else-if="appletsId == 2021002171638476">
                <el-tabs v-model="activeName" @tab-click="handleClick">
                    <!-- 用户统计 -->
                    <el-tab-pane
                        label="用户统计"
                        name="first"
                        class="user_statistics"
                    >
                        <h3>用户数据统计</h3>
                        <div class="show_data_box">
                            <div class="data_boxes" v-loading="allDataLoading">
                                <div
                                    :class="'data_item'"
                                    v-for="(item, key) in dataKeyZy"
                                    :key="key"
                                >
                                    <p class="item_title">{{ item.title1 }}</p>
                                    <p>{{ topDataZy[item.key1] }}</p>
                                    <p class="user_newly">
                                        {{ key == 0 ? item.title2 + ":" : ""
                                        }}<span
                                            :style="
                                                key != 0 &&
                                                topDataZy[item.key2] == 0
                                                    ? 'color:#000'
                                                    : key != 0 &&
                                                      topDataZy[item.key2] > 0
                                                    ? 'color:green'
                                                    : key != 0
                                                    ? 'color:red'
                                                    : ''
                                            "
                                            >{{
                                                key > 0
                                                    ? topDataZy[item.key2] + "%"
                                                    : topDataZy[item.key2]
                                            }}</span
                                        ><i
                                            :class="
                                                key != 0 &&
                                                topDataZy[item.key2] == 0
                                                    ? ''
                                                    : key != 0 &&
                                                      topDataZy[item.key2] > 0
                                                    ? 'up_icon'
                                                    : key != 0 &&
                                                      topDataZy[item.key2] < 0
                                                    ? 'down_icon'
                                                    : ''
                                            "
                                        ></i>
                                    </p>
                                </div>
                            </div>
                        </div>
                        <!-- 中间图表 -->
                        <div class="two_echart" v-loading="echartsLoading">
                            <div class="show_data_box">
                                <div
                                    id="userData_echarts"
                                    class="echtable"
                                ></div>
                            </div>
                        </div>
                        <!-- 留存图表 -->
                        <h3>留存数据</h3>
                        <el-select
                            v-model="zy_show_data_type"
                            size="medium"
                            style="width:240px;"
                            filterable
                            placeholder="请选择需要展示的数据"
                        >
                            <el-option
                                :label="item.label"
                                :value="item.value"
                                v-for="(item, index) in zy_show_data_type_list"
                                :key="index"
                            />
                        </el-select>
                        <div class="two_echart" v-loading="keepEchartsLoading">
                            <div class="show_data_box">
                                <div
                                    id="keepData_echarts"
                                    class="echtable"
                                ></div>
                            </div>
                        </div>
                    </el-tab-pane>
                    <!-- 行为分析 -->
                    <el-tab-pane label="行为分析" name="second">
                        <h3>行为数据分析</h3>
                        <div
                            class="behavior"
                            id="monthwidth"
                            v-loading="allDataLoading==!allDataLoading"
                        >
                            <div id="line_chart" class="lineechtable"></div>
                        </div>
                        <div class="graph" v-loading="allDataLoading==!allDataLoading">
                            <div class="">
                                <div class="zhuxing" id="frequency"></div>
                                <div id="gain" class="zhuxing"></div>
                            </div>
                            <div class="">
                                <div class="trapezoidal" id="trapezoid"></div>
                            </div>
                        </div>
                    </el-tab-pane>
                    <!-- 成本分析 -->
                    <el-tab-pane label="成本分析" name="third" class="cost">
                        <h3>成本分析</h3>
                        <div class="cost_show_data_box">
                            <div
                                class="data_boxes"
                                v-loading="zyCostAllDataLoading"
                            >
                                <div
                                    :class="'data_item'"
                                    v-for="(item, key) in zyCostTop"
                                    :key="key"
                                >
                                    <p class="item_title">{{ item.title1 }}</p>
                                    <p>
                                        {{
                                            key == 2 &&
                                            zyCostTopData[item.key1] != 0
                                                ? "&yen;&nbsp;" +
                                                  zyCostTopData[item.key1]
                                                : zyCostTopData[item.key1]
                                        }}&nbsp;{{ item.key2 ? "/&nbsp;" : ""
                                        }}{{
                                            (key == 2 || key == 4) &&
                                            zyCostTopData[item.key2] != 0
                                                ? "&yen;&nbsp;" +
                                                  zyCostTopData[item.key2]
                                                : zyCostTopData[item.key2]
                                        }}
                                    </p>
                                    <p class="user_newly">
                                        {{ item.title2 }}:<span
                                            :style="
                                                key != 1 && key != 3
                                                    ? 'color:red;'
                                                    : key == 1
                                                    ? 'color:#0b5af0;'
                                                    : ''
                                            "
                                            >{{
                                                key != 1 &&
                                                key != 4 &&
                                                zyCostTopData[item.key3] != 0
                                                    ? zyCostTopData[item.key3] +
                                                      "%"
                                                    : key == 1
                                                    ? zyCostTopData[item.key3] +
                                                      "天/蛋"
                                                    : key == 4
                                                    ? zyCostTopData[item.key3] +
                                                      "元/任务"
                                                    : zyCostTopData[item.key3]
                                            }}</span
                                        >
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div class="cost_data" v-loading="costLineLoading">

                        <div id="cost_echarts" class="cost_ech"></div>
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </template>
        </div>
    </div>
</template>
<script>
import axios from "axios";
export default {
    name: "logXcx",
    data() {
        return {
            dataKey: [
                {
                    title: "新增用户/总用户",
                    key1: "userTodayTotal",
                    key2: "userTotal"
                },
                {
                    title: "完成任务总数/任务总成本",
                    key1: "taskTotal",
                    key2: "cost"
                },
                {
                    title: "今日邀请数/总邀请人数",
                    key1: "inviteTodayTotal",
                    key2: "inviteTotal"
                },
                {
                    title: "用户提现金额/用户账户余额",
                    key1: "withdrawal",
                    key2: "balance"
                }
            ], //用于头部数据显示
            dataKeyZy: [
                {
                    title1: "用户数",
                    title2: "新增用户数",
                    key1: "totalUser",
                    key2: "newUserNum"
                },
                {
                    title1: "访问次数",
                    title2: "下降",
                    key1: "visitNum",
                    key2: "visitNumRatio"
                },
                {
                    title1: "任务完成数",
                    title2: "提高",
                    key1: "taskNum",
                    key2: "taskNumRatio"
                },
                {
                    title1: "提现金额",
                    title2: "提高",
                    key1: "withdrawalMoney",
                    key2: "withdrawalMoneyRatio"
                }
            ], //用于全民庄园头部数据显示
            topData: {}, //头部数据
            topDataZy: {}, //庄园头部数据
            myChart: "", //echarts实例

            pieChart: "", //饼状图

            option: "", //echarts实例配置

            pieoption: "", //饼状图配置

            barChart: "", //柱状图
            baroption: "", //柱状图配置
            barXdata: [], //柱状图X轴数据
            barYdata: [], //柱状图Y轴数据
            barLoading: false, //柱状图loading

            XdateArr: [], //echartsX轴数据
            topbtnIndex: 0, //头部按钮下标
            start_time: "", //开始时间参数
            end_time: "", //结束时间参数

            // showTime: "", //用于显示切换不同时间段显示不同文字
            // zyUserStaXdataArr:[],// 全民庄园-用户统计(中间)-折线图X轴
            tooltipArr: [
                "累计访问次数",
                "总用户数",
                "新增用户",
                "访问次数",
                "访问用户数",
                "用户转化率"
            ],

            appletsId: "2021002161629327", //小程序ID // 根据不同小程序ID切换       天天果园    2021002161629327    全民庄园    2021002171638476
            appletsArr: {}, //小程序ID数组

            datequantum: [], //echarts选择的时间段
            dateStar: "", //echarts选择的时间段的开始
            dateEnd: "", //echarts选择的时间段的结束

            loading: false, //头部loading
            echartsLoading: false, //图表loading
            allDataLoading: false, //数据汇总loading
            pickerOptions2: {
                disabledDate: time => {
                    return (
                        time.getTime() >
                        new Date(
                            `${this.dateFormat(
                                "YYYY-mm-dd",
                                new Date()
                            )} 00:00:00`
                        ).getTime()
                    );
                },
                shortcuts: [
                    {
                        text: "最近一周",
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(
                                start.getTime() - 3600 * 1000 * 24 * 7
                            );
                            picker.$emit("pick", [start, end]);
                        }
                    },
                    {
                        text: "最近一个月",
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(
                                start.getTime() - 3600 * 1000 * 24 * 30
                            );
                            picker.$emit("pick", [start, end]);
                        }
                    },
                    {
                        text: "最近三个月",
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(
                                start.getTime() - 3600 * 1000 * 24 * 90
                            );
                            picker.$emit("pick", [start, end]);
                        }
                    }
                ]
            }, //时间段快捷选项
            echarts_show_datas: [],
            echarts_datas: [
                {
                    name: "签到次数",
                    dataKey: "total",
                    type: "line",
                    data: [],
                    symbolSize: 10,
                    smooth: true,
                    yAxisIndex: 1,
                    itemStyle: {
                        normal: {
                            color: "#86B2F9", //改变折线点的颜色
                            lineStyle: {
                                color: "#86B2F9" //改变折线颜色
                            }
                        }
                    }
                    // 触发操作
                }
            ],
            topBtnsisclicked: [
                {
                    title: "今日时时",
                    key: "today"
                },
                {
                    title: "近7天",
                    key: "nearWeek"
                },
                {
                    title: "近15天",
                    key: "nearHalfMon"
                },
                {
                    title: "近30天",
                    key: "nearMon"
                }
            ],
            source: null, //中断请求(头部)
            sourceLine: null, //中断请求(折线图)
            show_data_type: "1", // 请选择需要展示的数据
            show_data_type_list: [
                {
                    label: "用户数(个)",
                    value: "1"
                },
                {
                    label: "浇水次数（次)",
                    value: "2"
                },
                {
                    label: "所有用户账户剩余水滴数（滴)",
                    value: "3"
                },
                {
                    label: "邀请好友数（个)",
                    value: "4"
                },
                {
                    label: "完成任务数（个)",
                    value: "5"
                },
                {
                    label: "消耗金额数(元)",
                    value: "6"
                }
            ], // 请选择需要展示的数据 select列表
            zy_show_data_type: "1", // 请选择需要展示的数据
            zy_show_data_type_list: [
                {
                    label: "新增用户留存",
                    value: "1"
                }
            ], // 请选择需要展示的数据 select列表
            roundList: [
                // {
                //     tree_id:'1',
                //     label:'第1轮'
                // }
            ], //第几轮列表
            roundId: "", //选第几轮
            maxRound: "", //最后一轮是哪一轮·

            activeName: "first",

            zyUserLineChart: "", //用户统计中间折线图实例
            zyUserOption: "", //用户统计中间折线图配置
            zyKeepLineChart: "", //用户统计留存折线图实例
            zyKeepOption: "", //用户统计留存折线图配置
            keepEchartsLoading: false, //图表loading
            tooltipKeepArr: ["一日留存", "三日留存", "7日留存"],

            zyCostAllDataLoading: false, //成本统计总数据lloading
            costLineLoading: false, //成本统计折线图loading
            zyCostLineChart: "", //用户统计留存折线图实例
            zyCostOption: "", //用户统计留存折线图配置

            zyCostTop: [
                {
                    title1: "总产出饲料/任务产出饲料",
                    title2: "任务产出占比",
                    key1: "totalFeedNum",
                    key2: "taskFeedNum",
                    key3: "taskFeedRatio"
                },
                {
                    title1: "已产出金蛋/已消耗金蛋",
                    title2: "蛋平均产出天数",
                    key1: "livEggNum",
                    key2: "useEggNum",
                    key3: "avgEgg"
                },
                {
                    title1: "红包总额/已提现红包",
                    title2: "提现占比",
                    key1: "addMoney",
                    key2: "useMoney",
                    key3: "useMoneyRatio"
                },
                {
                    title1: "兑换鲜鸡蛋/兑红包(数量)",
                    title2: "兑换实物占比",
                    key1: "eggNum",
                    key2: "MoneyNum",
                    key3: "exchangeRatio"
                },
                {
                    title1: "任务完成数/支出成本",
                    title2: "任务",
                    key1: "taskNum",
                    key2: "taskMoney",
                    key3: "taskAvg"
                }
            ],
            zyCostTopData: {},
            cost_show_data_type: ["0"], // 请选择需要展示的数据
            cost_show_data_type_list: [
                {
                    label: "提现人数",
                    value: "0"
                },
                {
                    label: "提现笔数",
                    value: "1"
                },
                {
                    label: "提现金额",
                    value: "2"
                },
                {
                    label: "金蛋产生数量",
                    value: "3"
                },
                {
                    label: "金蛋消耗数量",
                    value: "4"
                },
                {
                    label: "任务完成数量",
                    value: "5"
                }
            ], // 请选择需要展示的数据 select列表
            tooltipCostArr: ["提现人数","提现笔数","提现金额","金蛋产生数量","金蛋消耗数量","任务完成数量"],

            myChartline: "", //行为分析行为数据分析echarts实例
            lineoption: "", //行为分析行为数据分析echarts实例配置
            linedatas: [], //行为分析行为数据分析数据
            heasdearr: [
                "新人引导",
                "好友送粮",
                "好友收粮",
                "每日抽奖参与人数",
                "兑换实物人数",
                "兑换3元红包",
                "兑换7元红包",
                "兑换10元红包",
                "第一次完成产蛋的数量",
                "参与蹭吃的人数",
                "签到的人数",
                "添加好友的人数",
                "邀请好友的人数",
                "爱心助力访问次数"
            ],
            eggdata: [
                {
                    name: "新人引导",
                    type: "line",
                    egglist: "newUserGuideNum",
                    smooth: true,
                    data: []
                },
                {
                    name: "好友送粮",
                    type: "line",
                    egglist: "giveFeedNum",
                    smooth: true,
                    data: []
                },
                {
                    name: "好友收粮",
                    type: "line",
                    egglist: "collectFeedNum",
                    smooth: true,
                    data: []
                },
                {
                    name: "每日抽奖参与人数",
                    type: "line",
                    egglist: "drawNum",
                    smooth: true,
                    data: []
                },
                {
                    name: "兑换实物人数",
                    type: "line",
                    egglist: "matterNum",
                    smooth: true,
                    data: []
                },
                {
                    name: "兑换3元红包",
                    type: "line",
                    egglist: "threeNum",
                    smooth: true,
                    data: []
                },
                {
                    name: "兑换7元红包",
                    type: "line",
                    egglist: "sevenNum",
                    smooth: true,
                    data: []
                },
                {
                    name: "兑换10元红包",
                    type: "line",
                    egglist: "tenNum",
                    smooth: true,
                    data: []
                },
                {
                    name: "第一次完成产蛋的数量",
                    type: "line",
                    egglist: "firstEggLaying",
                    smooth: true,
                    data: []
                },
                {
                    name: "参与蹭吃的人数",
                    type: "line",
                    egglist: "rubEatNum",
                    smooth: true,
                    data: []
                },
                {
                    name: "签到的人数",
                    type: "line",
                    egglist: "singNum",
                    smooth: true,
                    data: []
                },
                {
                    name: "添加好友的人数",
                    type: "line",
                    egglist: "addFriend",
                    smooth: true,
                    data: []
                },
                {
                    name: "邀请好友的人数",
                    type: "line",
                    egglist: "inviteFriend",
                    smooth: true,
                    data: []
                },
                {
                    name: "爱心助力访问次数",
                    type: "line",
                    egglist: "loveHelpClick",
                    smooth: true,
                    data: []
                }
            ],
            lineselect: [], //多选
            changes: "",
            myChartpillar: "", //行为分析人均访问频次echarts实例
            pillaroption: "", //行为分析人均访问频次echarts实例配置
            gaindata: [], //人均访问频次数据

            myChartgain: "", //行为分析获取 echarts实例
            gainoption: "", //行为分析获取 echarts实例配置
            xwGaindata: [], //行为分析获取数据
            ydata: ["1金蛋", "2金蛋", "4金蛋", "5金蛋", ">=6金蛋"],
            texttitle: "金蛋历史获得数量",

            myCharttrapezoid: "", //行为分析梯形 echarts实例
            gainoption: "", //行为分析梯形echarts实例配置
            gainarr: [
                "访问人数",
                "新人引导",
                "第一次为食",
                "第一次产蛋",
                "兑换红包/实物"
            ],
            gainlist: [
                { value: 50, name: "访问人数" },
                { value: 30, name: "新人引导" },
                { value: 15, name: "第一次为食" },
                { value: 5, name: "第一次产蛋" },
                { value: 10, name: "兑换红包/实物" }
            ],
            tablg: "", //判断监听数据
            linetime: []
        };
    },
    watch: {
        topbtnIndex: {
            handler(val) {
                if (val == 0) {
                    this.chooseTop(this.topbtnIndex);
                } else {
                    // this.showTime = this.topBtnsisclicked[val].title;
                }
                if (val < 4) {
                    this.datequantum = [this.start_time, this.end_time];
                }
            },
            immediate: true
        },
        datequantum: {
            handler: function(val) {
                if (val != null) {
                    if (val[0] == val[1]) {
                        // this.datequantum[1] = this.dateFormat('YYYY-mm-dd', (new Date(new Date(this.datequantum[1]).getTime() + 86400000)))
                        this.datequantum[1] = `${this.datequantum[1]}`;
                    }
                    this.dateStar = val[0];
                    this.dateEnd = val[1];

                    this.start_time = val[0];
                    this.end_time = val[1];
                } else {
                    this.datequantum = [this.start_time, this.end_time];
                }
                this.$nextTick(() => {
                    this.echartsLoading = true;
                    this.allDataLoading = true;
                    if(this.appletsId==2021002161629327){
                        this.getechartsdata();
                            this.getTopCt();
                    }else if(this.appletsId==2021002171638476){
                        switch (this.userIdent){
                            case 0 :
                                this.getZyUserSta();
                                this.getZyUserEchartsData();
                                this.getZyKeepEchartsData();
                                break;
                            case 1 :
                                this.acqrequst();
                                this.hisrequst();
                                this.funrequset();
                                this.linerequst();
                                break;
                            case 2 :
                                this.getZyCostData();
                                this.getZyCostLineData();
                                break
                        }
                    }
                });
            },
            immediate: true
        },
        // 监听appid变化
        appletsId: {
            handler: function(val) {
                this.echartsLoading = true;
                this.allDataLoading = true;
                this.activeName = "first";
                this.topbtnIndex = 0;
                if (val == 2021002161629327) {
                    this.getechartsdata();
                    this.getTopCt();
                } else if (val == 2021002171638476) {
                    this.userIdent = 0
                    this.getZyUserEchartsData();
                    this.getZyUserSta();
                    this.getZyKeepEchartsData();
                }
            }
        },
        roundId: {
            handler: function(val) {
                console.log("roundId", val);
                this.barLoading = true;
                this.getbardata();
            }
        },
        show_data_type: {
            handler: function(val) {
                if (val == 5 || val == 6) {
                    this.roundId = this.maxRound;
                } else {
                    this.roundId = "";
                }
                this.barLoading = true;
                this.getbardata();
            }
        },
    },
    created() {
        // this.loading = true
    },
    methods: {
        //下载数据
        uploadData() {
            // if (this.couldLink == false) {
            //     return;
            // }
            let url = "/XcxDataAnalysis/exportData";

            let arr = {};

            function filter(str) {
                // 特殊字符转义
                str += ""; // 隐式转换
                str = str.replace(/%/g, "%25");
                str = str.replace(/\+/g, "%2B");
                str = str.replace(/ /g, "%20");
                str = str.replace(/\//g, "%2F");
                str = str.replace(/\?/g, "%3F");
                str = str.replace(/&/g, "%26");
                str = str.replace(/\=/g, "%3D");
                str = str.replace(/#/g, "%23");
                return str;
            }

            function formateObjToParamStr(paramObj) {
                const sdata = [];
                for (let attr in paramObj) {
                    sdata.push(`${attr}=${filter(paramObj[attr])}`);
                }
                return sdata.join("&");
            }
            window.open(url + "?" + formateObjToParamStr(arr));
            // this.couldLink = false;
        },
        //获取小程序id
        getId() {
            this.getRequest("XcxTask/getMiniList", {
                page: 1,
                listRows: 12
            }).then(res => {
                this.appletsArr = res.data;
            });
        },
        //制定时间
        pointCheck(val) {
            this.allDataLoading = true;
            this.start_time = this.dateFormat("YYYY-mm-dd HH:MM:SS", val);
            this.end_time = this.dateFormat(
                "YYYY-mm-dd",
                new Date(val.getTime() + 24 * 3600 * 1000)
            );
            this.datequantum = [this.start_time, this.end_time];
            this.getTopCt();
            this.getZyUserSta();
            this.getZyCostData();
            this.acqrequst();
            this.hisrequst();
            this.funrequset();
            this.linerequst();
        },
        pointCheck2(val) {
            this.allDataLoading = true;
            this.start_time = this.dateFormat(
                "YYYY-mm-dd HH:MM:SS",
                new Date(val.getTime())
            );
            this.end_time = this.dateFormat(
                "YYYY-mm-dd",
                new Date(val.getTime() + 7 * 24 * 3600 * 1000)
            );
            this.datequantum = [this.start_time, this.end_time];
            this.getTopCt();
            this.getZyUserSta();
            this.getZyCostData();
            this.acqrequst();
            this.hisrequst();
            this.funrequset();
            this.linerequst();
        },
        pointCheck3(val) {
            this.allDataLoading = true;
            this.start_time = this.dateFormat("YYYY-mm-dd HH:MM:SS", val);
            this.end_time = this.dateFormat(
                "YYYY-mm-dd",
                new Date(val.getTime() + 30 * 86400000)
            );
            this.datequantum = [this.start_time, this.end_time];
            this.getTopCt();
            this.getZyUserSta();
            this.getZyCostData();
            this.acqrequst();
            this.hisrequst();
            this.funrequset();
            this.linerequst();
        },
        //顶部按钮点击
        chooseTop(str) {
            let coudeRequse = false;
            switch (str) {
                case 0:
                    this.topbtnIndex = 0;
                    this.start_time = this.dateFormat(
                        "YYYY-mm-dd",
                        new Date(new Date().getTime())
                    );
                    this.end_time = this.dateFormat("YYYY-mm-dd", new Date());
                    if (
                        this.start_time != this.datequantum[0] ||
                        this.end_time != this.datequantum[1]
                    ) {
                        this.datequantum = [this.start_time, this.end_time];
                    }
                    coudeRequse = true;
                    break;
                case 1:
                    this.topbtnIndex = 1;
                    this.start_time = this.dateFormat(
                        "YYYY-mm-dd",
                        new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000)
                    );
                    this.end_time = this.dateFormat("YYYY-mm-dd", new Date());
                    if (
                        this.start_time != this.datequantum[0] ||
                        this.end_time != this.datequantum[1]
                    ) {
                        this.datequantum = [this.start_time, this.end_time];
                    }
                    coudeRequse = true;
                    break;
                case 2:
                    this.topbtnIndex = 2;
                    this.start_time = this.dateFormat(
                        "YYYY-mm-dd",
                        new Date(
                            new Date().getTime() - 15 * 24 * 60 * 60 * 1000
                        )
                    );
                    this.end_time = this.dateFormat("YYYY-mm-dd", new Date());
                    if (
                        this.start_time != this.datequantum[0] ||
                        this.end_time != this.datequantum[1]
                    ) {
                        this.datequantum = [this.start_time, this.end_time];
                    }
                    coudeRequse = true;
                    break;
                case 3:
                    this.topbtnIndex = 3;
                    this.start_time = this.dateFormat(
                        "YYYY-mm-dd",
                        new Date(
                            new Date().getTime() - 30 * 24 * 60 * 60 * 1000
                        )
                    );
                    this.end_time = this.dateFormat("YYYY-mm-dd", new Date());
                    if (
                        this.start_time != this.datequantum[0] ||
                        this.end_time != this.datequantum[1]
                    ) {
                        this.datequantum = [this.start_time, this.end_time];
                    }
                    coudeRequse = true;
                    break;
                default:
                    break;
            }
            if (coudeRequse == true) {
                // this.allDataLoading = true
                // this.getTopCt()
                // this.getechartsdata();
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
                    fmt = fmt.replace(
                        ret[1],
                        ret[1].length == 1
                            ? opt[k]
                            : opt[k].padStart(ret[1].length, "0")
                    );
                }
            }

            return fmt;
        },
        //echarts渲染函数
        drawChart() {
            // 基于准备好的dom，初始化echarts实例
            this.myChart = this.$echarts.init(
                document.getElementById("new_echarts")
            );
            // 指定图表的配置项和数据
            this.option = {
                title: {
                    text: "签到统计",
                    left: "center",
                    bottom: "0"
                },
                // grid: {
                //     top: '50px',
                //     left: '70px',
                //     right: '70px',
                //     bottom: '20px',
                //     backgroundColor: '#fff',
                //     width: 'auto', //图例宽度
                // },
                xAxis: {
                    data: this.XdateArr,
                    boundaryGap: false,
                    axisLabel: {
                        textStyle: {
                            color: "rgba(0,0,0,.65)" //坐标值得具体的颜色
                        }
                    },
                    axisLine: {
                        lineStyle: {
                            type: "solid",
                            color: "rgba(0,0,0,.30)" //左边线的颜色
                        }
                    }
                },
                yAxis: [
                    {
                        type: "value",
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
                                type: "dashed"
                            }
                        },
                        axisLabel: {
                            textStyle: {
                                color: "rgba(0,0,0,.65)" //坐标值得具体的颜色
                            }
                        }
                    },
                    {
                        type: "value",
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
                                type: "dashed"
                            }
                        },
                        axisLabel: {
                            textStyle: {
                                color: "rgba(0,0,0,.65)" //坐标值得具体的颜色
                            }
                        }
                    }
                ],
                series: this.echarts_show_datas,
                tooltip: {
                    //？触发类型
                    trigger: "axis",
                    axisPointer: {
                        type: "line"
                    },
                    // 提示框内容: 可根据传入的data参数自定义内容、配合html自定义排版样式
                    formatter: function(params) {
                        var tip = "";
                        tip += `<div style="padding:0 0 0 10px;font-size:18px">时间：${params[0].name}</div>`;
                        params.forEach(ele => {
                            if (
                                ele.seriesName.indexOf("价格") != -1 ||
                                ele.seriesName.indexOf("金额") != -1
                            ) {
                                tip += `<div><span style="display:inline-block;margin-right:10px;color:#fff;width:70px;text-align:right;">${ele.seriesName}:</span><span class='shownum' style='font-size:18px;'>${ele.value}元</span></div>`;
                            } else if (ele.seriesName.indexOf("率") != -1) {
                                tip += `<div><span style="display:inline-block;margin-right:10px;color:#fff;width:70px;text-align:right;">${ele.seriesName}:</span><span class='shownum' style='font-size:18px;'>${ele.value}%</span></div>`;
                            } else {
                                tip += `<div><span style="display:inline-block;margin-right:10px;color:#fff;width:70px;text-align:right;">${ele.seriesName}:</span><span class='shownum' style='font-size:18px;'>${ele.value}</span></div>`;
                            }
                        });
                        return tip;
                    }
                }
            };
            // 使用刚指定的配置项和数据显示图表
            this.myChart.setOption(this.option, true);
        },
        //饼状图渲染
        pieDataDraw(pieData) {
            this.pieChart = this.$echarts.init(
                document.getElementById("pie_box")
            );
            this.pieoption = {
                title: {
                    text: "一日三餐活动",
                    subtext: "",
                    left: "center",
                    bottom: "0"
                },
                tooltip: {
                    trigger: "item"
                },
                // legend: {
                //     orient: 'vertical',
                //     left: 'left',
                // },
                series: [
                    {
                        name: "访问来源",
                        type: "pie",
                        radius: "50%",
                        data: pieData,
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: "rgba(0, 0, 0, 0.5)"
                            }
                        }
                    }
                ]
            };

            this.pieChart && this.pieChart.setOption(this.pieoption);
        },
        //柱状图渲染
        barDataDraw() {
            this.barChart = this.$echarts.init(
                document.getElementById("bar_echart")
            );
            this.baroption = {
                title: {
                    text:
                        "当前为每一阶段的：" +
                        this.show_data_type_list[
                            Number(this.show_data_type) - 1
                        ].label,
                    left: "center",
                    top: "0"
                },
                xAxis: {
                    type: "category",
                    data: this.barXdata
                },
                yAxis: {
                    type: "value"
                },
                series: [
                    {
                        data: this.barYdata,
                        type: "bar",
                        label: {
                            show: true,
                            position: "top"
                        },
                        itemStyle: {
                            color: "#5470C6"
                        }
                    }
                ]
            };

            this.barChart && this.barChart.setOption(this.baroption);
        },
        //获取柱状图数据
        getbardata() {
            this.getRequest("/XcxDataAnalysis/getFooter", {
                type: this.show_data_type,
                tree_id: this.roundId,
                appid: 2021002161629327
            })
                .then(resp => {
                    if (resp.code == 200) {
                        this.bardataDeal(resp.data);
                    } else {
                        this.open4(resp.msg);
                    }
                })
                .catch(res => {
                    // this.open4('请求错误')
                });
        },
        bardataDeal(data) {
            this.barXdata = [];
            this.barYdata = [];
            data.data.forEach((ele, index) => {
                this.barXdata.push(ele.name);
                this.barYdata.push(ele.total);
            });
            this.roundList = data.whatRound;
            this.maxRound = data.maxRound;
            this.barLoading = false;
            this.barDataDraw();
        },
        // checkbox选择
        checkes() {
            this.echatrs_data_deal();
            this.drawChart("formcheckbox");
        },
        //echarts时间段选择
        choosedatequantum(val) {
            if (val != null) {
                this.topbtnIndex = 4;
            }
        },
        //echarts数据处理
        echatrs_data_deal() {
            //清空线的数据
            this.echarts_show_datas = [];
            // 根据checkbox重新写入线的数据
            if (this.echarts_datas.length != 0) {
                this.echarts_datas.forEach(element => {
                    this.echarts_show_datas.push(element);
                });
            }
            if (this.echartsLoading == true) {
                this.echartsLoading = false;
            }
            this.drawChart();
        },
        cancelRequest(str) {
            if (str == "source") {
                if (typeof this.source === "function") {
                    this.source("请求中断1");
                }
            } else if (str == "sourceLine") {
                if (typeof this.sourceLine === "function") {
                    this.sourceLine("请求中断2");
                }
            }
        },
        //获取图表数据
        getechartsdata() {
            const _this = this;
            this.cancelRequest("sourceLine");
            this.getRequest(
                "/XcxDataAnalysis/getActivityData",
                {
                    start: this.dateStar,
                    end: this.dateEnd,
                    appid: this.appletsId
                },
                new axios.CancelToken(c => {
                    _this.sourceLine = c;
                })
            )
                .then(resp => {
                    if (axios.isCancel(resp)) {
                        this.open2("未加载请求已被中断");
                        this.sourceLine = null;
                        return;
                    }
                    if (resp.code == 200) {
                        this.echartsdatadeal(resp.data.sing);
                        this.pieDataDraw(resp.data.threeMeals);
                    } else {
                        this.open4(resp.msg);
                        this.echartsLoading = false;
                    }
                })
                .catch(res => {
                    // this.open4('请求错误')
                });
        },
        //图表数据处理
        echartsdatadeal(datarr) {
            this.echarts_datas.forEach(element => {
                element.data = [];
                datarr.forEach(ele => {
                    element.data.push(ele[element.dataKey]);
                });
            });
            this.XdateArr = [];
            datarr.forEach(ele => {
                this.XdateArr.push(ele.time);
            });
            this.changes = this.XdateArr;
            this.echatrs_data_deal();
        },
        copyToClipboard(text) {
            if (text.indexOf("-") !== -1) {
                let arr = text.split("-");
                text = arr[0] + arr[1];
            }
            var textArea = document.createElement("textarea");
            textArea.style.position = "fixed";
            textArea.style.top = "0";
            textArea.style.left = "0";
            textArea.style.width = "2em";
            textArea.style.height = "2em";
            textArea.style.padding = "0";
            textArea.style.border = "none";
            textArea.style.outline = "none";
            textArea.style.boxShadow = "none";
            textArea.style.background = "transparent";
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            try {
                var successful = document.execCommand("copy");
            } catch (err) {
                alert("该浏览器不支持点击复制到剪贴板");
            }
            document.body.removeChild(textArea);
        },
        open1(msg) {
            this.$message({
                showClose: true,
                message: msg
            });
        },
        open2(msg) {
            this.$message({
                showClose: true,
                message: msg,
                type: "success"
            });
        },
        open3(msg) {
            this.$message({
                showClose: true,
                message: msg,
                type: "warning"
            });
        },
        open4(msg) {
            this.$message({
                showClose: true,
                message: msg,
                type: "error"
            });
        },
        //获取数据汇总的数据
        getTopCt() {
            const _this = this;
            this.cancelRequest("source");
            this.getRequest(
                "/XcxDataAnalysis/getTop",
                {
                    start: this.start_time,
                    end: this.end_time
                },
                new axios.CancelToken(c => {
                    _this.source = c;
                })
            ).then(res => {
                if (axios.isCancel(res)) {
                    this.open2("未加载请求已被中断");
                    this.source = null;
                    return;
                }
                this.topData = res.data;
                this.allDataLoading = false;
            });
        },
        // 选择不同小程序
        selectXcx(e) {
            console.log(e);
            if (e == 2021002161629327) {
                // 天天果园
            } else {
                // 全民庄园
            }
        },
        handleClick(tab, event) {
            if (tab.index == "0") {
                this.getZyKeepEchartsData();
                this.getZyUserEchartsData();
                this.getZyUserSta();
                this.userIdent = 0
            } else if (tab.index == "1") {
                this.acqrequst();
                this.hisrequst();
                this.funrequset();
                this.linerequst();
                this.userIdent = 1
            } else {
                this.getZyCostData();
                this.getZyCostLineData();
                this.cost_show_data_type = ["0"];
                this.userIdent = 2
            }
        },
        // 获取全民庄园-用户统计-头部数据
        getZyUserSta() {
            const _this = this;
            this.cancelRequest("source");
            setTimeout(() => {
                this.getRequest(
                    "/EggStatistics/getUserTop",
                    {
                        start: this.start_time,
                        end: this.end_time,
                        appid: this.appletsId
                    },
                    new axios.CancelToken(c => {
                        _this.source = c;
                    })
                ).then(res => {
                    if (axios.isCancel(res)) {
                        this.open2("未加载请求已被中断");
                        this.source = null;
                        return;
                    }
                    this.topDataZy = res.data;
                    this.allDataLoading = false;
                });
            }, 0);
        },
        //  获取全民庄园-用户统计(中间)-折线图数据
        getZyUserEchartsData() {
            const _this = this;
            this.cancelRequest("sourceLine");
            setTimeout(() => {
                this.getRequest(
                    "/EggStatistics/getUserChat",
                    {
                        start: this.dateStar,
                        end: this.dateEnd,
                        appid: this.appletsId
                    },
                    new axios.CancelToken(c => {
                        _this.sourceLine = c;
                    })
                )
                    .then(res => {
                        if (axios.isCancel(res)) {
                            this.open2("未加载请求已被中断");
                            this.sourceLine = null;
                            return;
                        }
                        if (res.code == 200) {
                            this.processData(res.data);
                        } else {
                            this.open4(res.msg);
                            this.echartsLoading = false;
                        }
                    })
                    .catch(error => {
                        // this.open4('请求错误')
                    });
            }, 0);
        },
        // 渲染全民庄园-用户统计(中间)-折线图数据
        drawZyUserLine() {
            this.zyUserLineChart = this.$echarts.init(
                document.getElementById("userData_echarts")
            );
            this.zyUserOption = {
                tooltip: {
                    trigger: "axis",
                    padding: 20,
                    textStyle: {
                        lineHeight: 35
                    }
                },
                legend: {
                    top: "3%",
                    icon: "circle",
                    left: "5%",
                    itemGap: 100,
                    data: this.tooltipArr
                },
                grid: {
                    left: "1%",
                    right: "2%",
                    bottom: "0",
                    containLabel: true
                },
                xAxis: {

                    // x轴线样式
                    axisLine: {
                        lineStyle: {
                            color: "rgba(0,0,0,.30)" //左边线的颜色
                        }
                    },
                    // x轴文字样式
                    axisLabel: {
                        textStyle: {
                            color: "#666"
                        }
                    },
                    boundaryGap: false,

                    data: this.zyUserStaXdataArr
                },
                yAxis: {
                    type: "value",

                },
                series: this.zyUserStaYdataArr
            },
            this.zyUserLineChart.setOption(this.zyUserOption);
        },
        // 数据处理
        processData(data) {
            this.userLineIdentList = ['cumulativeVisits','userTotal','newUser','visitNum','userVisitNum','conversion']
            this.zyUserStaXdataArr = [];
            this.zyUserStaYdataArr = [];
            if (data.length != 0) {
                // 创建6个空对象
                this.tooltipArr.forEach((item,index) => {
                    let obj = {};
                    let arr = [];
                    obj.name = item;
                    obj.type = "line";
                    obj.smooth=true
                    obj.ident = this.userLineIdentList[index]
                    obj.data = arr;
                    this.zyUserStaYdataArr.push(obj);
                });
                data.forEach(item => {
                    this.zyUserStaXdataArr.push(item.strTime);
                    Object.keys(item).forEach(key => {
                        this.zyUserStaYdataArr.forEach((citem, index) => {
                            if (key == citem.ident) {
                                this.zyUserStaYdataArr[index].data.push(item[key]);
                            }
                        });
                    });
                });
            }
            if (this.echartsLoading == true) {
                this.echartsLoading = false;
            }
            this.drawZyUserLine();
        },
        // 获取全民庄园-用户统计-留存数据
        getZyKeepEchartsData() {
            const _this = this;
            this.cancelRequest("sourceLine");
            setTimeout(() => {
                this.getRequest(
                    "/EggStatistics/getUserRetained",
                    {
                        start: this.dateStar,
                        end: this.dateEnd,
                        appid: this.appletsId
                    },
                    new axios.CancelToken(c => {
                        _this.sourceLine = c;
                    })
                )
                    .then(res => {
                        if (axios.isCancel(res)) {
                            this.open2("未加载请求已被中断");
                            this.sourceLine = null;
                            return;
                        }
                        if (res.code == 200) {
                            this.processKeepData(res.data);
                        } else {
                            this.open4(res.msg);
                            this.keepEchartsLoading = false;
                        }
                    })
                    .catch(error => {
                        // this.open4('请求错误')
                    });
            }, 0);
        },
        // 渲染全民庄园-用户统计-留存折线图
        drawZyKeepData() {
            this.zyKeepLineChart = this.$echarts.init(
                document.getElementById("keepData_echarts")
            );
            (this.zyKeepOption = {
                tooltip: {
                    trigger: "axis",
                    padding: 20,
                    textStyle: {
                        lineHeight: 35
                    }
                },
                legend: {
                    top: "3%",
                    icon: "circle",
                    left: "5%",
                    itemGap: 100,
                    data: this.tooltipKeepArr
                },
                grid: {
                    left: "1%",
                    right: "2%",
                    bottom: "0",
                    containLabel: true
                },
                xAxis: {

                    // x轴线样式
                    axisLine: {
                        lineStyle: {
                            color: "rgba(0,0,0,.30)" //左边线的颜色
                        }
                    },
                    // x轴文字样式
                    axisLabel: {
                        textStyle: {
                            color: "#666"
                        }
                    },
                    boundaryGap: false,

                    data: this.zyKeepXdataArr
                },
                yAxis: {
                    type: "value",

                },
                series: this.zyKeepYdataArr
            }),
                this.zyKeepLineChart.setOption(this.zyKeepOption);
        },
        // 数据处理
        processKeepData(data) {
            this.keepIdentList = ['oneDayRetained','threeDayRetained','sevenDayRetained']
            this.zyKeepXdataArr = [];
            this.zyKeepYdataArr = [];
            if (data.length != 0) {
                // 创建6个空对象
                this.tooltipKeepArr.forEach((item,index) => {
                    let obj = {};
                    let arr = [];
                    obj.name = item;
                    obj.type = "line";
                    obj.smooth=true
                    obj.ident = this.keepIdentList[index]
                    obj.data = arr;
                    this.zyKeepYdataArr.push(obj);
                });

                data.forEach(item => {
                    this.zyKeepXdataArr.push(item.strTime);
                    Object.keys(item).forEach(key => {
                        this.zyKeepYdataArr.forEach((citem, index) => {
                            if (key == citem.ident) {
                                this.zyKeepYdataArr[index].data.push(item[key]);
                            }
                        });
                    });
                });
            }
            if (this.keepEchartsLoading == true) {
                this.keepEchartsLoading = false;
            }
            this.drawZyKeepData();
        },
        // 获取全民庄园-成本分析-头部数据
        getZyCostData() {
            const _this = this;
            this.cancelRequest("source");
            setTimeout(() => {
                this.getRequest(
                    "/EggStatistics/getCostData",
                    {
                        start: this.start_time,
                        end: this.end_time,
                        appid: this.appletsId
                    },
                    new axios.CancelToken(c => {
                        _this.source = c;
                    })
                ).then(res => {
                    if (axios.isCancel(res)) {
                        this.open2("未加载请求已被中断");
                        this.source = null;
                        return;
                    }
                    this.zyCostTopData = res.data;
                    this.allDataLoading = false;
                });
            }, 0);
        },
        // 获取全民庄园-成本分析-折线图数据
        getZyCostLineData() {
            const _this = this;
            this.cancelRequest("sourceLine");
            setTimeout(() => {
                this.getRequest(
                    "/EggStatistics/getCostChatData",
                    {
                        start: this.dateStar,
                        end: this.dateEnd,
                        appid: this.appletsId
                    },
                    new axios.CancelToken(c => {
                        _this.sourceLine = c;
                    })
                )
                    .then(res => {
                        if (axios.isCancel(res)) {
                            this.open2("未加载请求已被中断");
                            this.sourceLine = null;
                            return;
                        }
                        if (res.code == 200) {
                            this.processCostData(res.data);
                        } else {
                            this.open4(res.msg);
                            this.costLineLoading = false;
                        }
                    })
                    .catch(error => {
                        // this.open4('请求错误')
                    });
            }, 10);
        },
        // 渲染全民庄园-成本分析-折线图
        drawZyCostLine() {
            this.zyCostLineChart = this.$echarts.init(
                document.getElementById("cost_echarts")
            );
            this.zyCostOption = {
                tooltip: {
                    trigger: "axis",
                    padding: 20,
                    textStyle: {
                        lineHeight: 35
                    }
                },
                legend: {
                    top: "3%",
                    icon: "circle",
                    left: "5%",
                    itemGap: 100,
                    data: this.tooltipCostArr,
                    selected:{
                        "提现人数":true,
                        "提现笔数":false,
                        "提现金额":false,
                        "金蛋产生数量":false,
                        "金蛋消耗数量":false,
                        "任务完成数量":false
                    }

                },
                grid: {
                    left: "1%",
                    right: "2%",
                    bottom: "0",
                    containLabel: true
                },
                xAxis: {

                    // x轴线样式
                    axisLine: {
                        lineStyle: {
                            color: "rgba(0,0,0,.30)" //左边线的颜色
                        }
                    },
                    // x轴文字样式
                    axisLabel: {
                        textStyle: {
                            color: "#666"
                        }
                    },
                    boundaryGap: false,

                    data: this.zyCostXdataArr
                },
                yAxis: {
                    type: "value",

                },
                // series:[{
                //     name:'提现人数',
                //     type:'line',
                //     data:[0,0,0,0,0,0,0]
                // }],
                series: this.zyCostYdataArr
            },
                this.zyCostLineChart.setOption(this.zyCostOption, true);
        },
        // 数据处理 -成本分析
        processCostData(data) {
            const _this = this;
            this.costIdentList = ['withdrawalUserNum','withdrawalTimes','withdrawalMoney','eggAddNum','eggUseNum','taskNum']
            this.zyCostXdataArr = [];
            this.zyCostYdataArr = [];
            if (data.length != 0) {
                this.tooltipCostArr.forEach((item,index) => {
                    let costObj = {};
                    costObj.name = item;
                    costObj.type = "line";
                    costObj.smooth=true
                    costObj.ident = this.costIdentList[index]
                    costObj.data = [];
                    this.zyCostYdataArr.push(costObj);
                });
                data.forEach(item => {
                    this.zyCostXdataArr.push(item.strTime);
                    Object.keys(item).forEach(key => {
                        this.zyCostYdataArr.forEach((citem, index) => {
                            if (key == citem.ident) {
                                this.zyCostYdataArr[index].data.push(item[key]);
                            }
                        });
                    });
                });
            }
            if (this.costLineLoading == true) {
                this.costLineLoading = false;
            }
            this.zyCostOption = {};
            this.drawZyCostLine();
        },
        //行为分析折线图/EggStatistics/getActionChatData
        brokenLine() {
            setTimeout(() => {
                this.myChartline = this.$echarts.init(
                    document.getElementById("line_chart")
                );
                // 指定图表的配置项和数据
                this.lineoption = {
                    grid:{
                        top:'20%'
                    },
                    title: {},
                    legend: {
                        data: this.heasdearr,
                        itemGap:20,
                        selected:{
                            "新人引导":true,
                            "好友送粮":false,
                            "好友收粮":false,
                            "每日抽奖参与人数":false,
                            "兑换实物人数":false,
                            "兑换3元红包":false,
                            "兑换7元红包":false,
                            "兑换10元红包":false,
                            "第一次完成产蛋的数量":false,
                            "参与蹭吃的人数":false,
                            "签到的人数":false,
                            "添加好友的人数":false,
                            "邀请好友的人数":false,
                            "爱心助力访问次数":false
                        }
                    },
                    xAxis: {
                        data: this.linetime,
                        type: "category",
                        number: 10,
                        boundaryGap: false
                    },
                    yAxis: {
                        type: "value"
                    },
                    tooltip: {
                        trigger: "axis"
                    },
                    series: this.linedatas
                };
                this.myChartline.setOption(this.lineoption, true);
            });
        },
        //行为分析折线图请求数据/EggStatistics/getActionChatData
        linerequst() {
            this.getRequest(
                "/EggStatistics/getActionChatData",
                {
                    start: this.dateStar,
                    end: this.dateEnd,
                    appid: this.appletsId
                }
                //new axios.CancelToken(c => {
                //    _this.source = c;
                //})
            )
                .then(res => {
                    if (axios.isCancel(res)) {
                        this.open2("未加载请求已被中断");
                        this.sourceLine = null;
                        return;
                    }
                    if (res.code == 200) {
                        this.tool(res.data);
                        this.brokenLine();
                    } else {
                        this.open4(res.msg);
                        this.echartsLoading = false;
                    }
                })
                .catch(res => {
                    // this.open4('请求错误')
                });
        },
        //人均访问频次gain
        histogram() {
            setTimeout(() => {
                //myChartpillar: "", //行为分析人均访问频次echarts实例
                //pillaroption: "", //行为分析人均访问频次echarts实例配置
                var chartDom = document.getElementById("frequency");
                this.myChartpillar = this.$echarts.init(chartDom);

                this.pillaroption = {
                    title: {
                        text: "人均访问频次"
                    },
                    tooltip: {
                        trigger: "axis",
                        axisPointer: {
                            type: "shadow"
                        }
                    },
                    grid: {
                        left: "3%",
                        right: "4%",
                        bottom: "3%",
                        containLabel: true
                    },
                    xAxis: {
                        type: "value"
                        //boundaryGap: [0, 0.01]
                    },
                    yAxis: {
                        type: "category",
                        data: ["1", "2次", "3-5次", "6-9次", ">=10次"]
                    },
                    series: [
                        {
                            //name: "2011年",
                            itemStyle: {
                                normal: {
                                    color: "#61A5E8"
                                }
                            },
                            type: "bar",
                            data: this.gaindata
                        }
                    ]
                };

                this.myChartpillar.setOption(this.pillaroption, true);
            }, 100);
        },
        //人均访问频次请求数据
        hisrequst() {
            this.getRequest(
                "/EggStatistics/getUserVisitTimes",
                {
                    start: this.dateStar,
                    end: this.dateEnd,
                    appid: this.appletsId
                }
                //new axios.CancelToken(c => {
                //    _this.source = c;
                //})
            ).then(res => {
                if (axios.isCancel(res)) {
                    this.open2("未加载请求已被中断");
                    this.source = null;
                    return;
                }
                if (res.code == 200) {
                    this.gaindata = this.gainfn(res.data);
                    this.histogram();
                } else {
                    this.open4(res.msg);
                    this.echartsLoading = false;
                }
            });
        },

        //获得数量
        acquisition() {
            setTimeout(() => {
                //     myChartgain: "", //行为分析获取 echarts实例
                //gainoption: "", //行为分析获取 echarts实例配置
                var chartDom = document.getElementById("gain");
                this.myChartgain = this.$echarts.init(chartDom);
                this.gainoption = {
                    title: {
                        text: this.texttitle
                    },
                    tooltip: {
                        trigger: "axis",
                        axisPointer: {
                            type: "shadow"
                        }
                    },
                    grid: {
                        left: "3%",
                        right: "4%",
                        bottom: "3%",
                        containLabel: true
                    },
                    xAxis: {
                        type: "value"
                        //boundaryGap: [0, 0.01]
                    },
                    yAxis: {
                        type: "category",
                        data: this.ydata
                    },
                    series: [
                        {
                            itemStyle: {
                                normal: {
                                    color: "#61A5E8"
                                }
                            },
                            type: "bar",
                            data: this.xwGaindata
                        }
                    ]
                };
                this.myChartgain.setOption(this.gainoption, true);
            });
        },
        //行为统计 - 金蛋历史获得数量请求数据
        acqrequst() {
            this.getRequest(
                "/EggStatistics/getEggHistoryNum",
                {
                    end: this.dateEnd,
                    appid: this.appletsId
                }
                //new axios.CancelToken(c => {
                //    _this.source = c;
                //})
            ).then(res => {
                if (axios.isCancel(res)) {
                    this.open2("未加载请求已被中断");
                    this.source = null;
                    return;
                }
                if (res.code == 200) {
                    this.xwGaindata = this.gainfn(res.data);
                    this.acquisition();
                } else {
                    this.open4(res.msg);
                    this.echartsLoading = false;
                }
                //console.log(res, 1233333);
                //this.topData = res.data;
                //this.allDataLoading = false;
            });
        },
        //漏斗图
        funnel() {
            setTimeout(() => {
                //myCharttrapezoid: "", //行为分析梯形 echarts实例
                //gainoption: "" //行为分析梯形echarts实例配置
                var chartDom = document.getElementById("trapezoid");
                this.myCharttrapezoid = this.$echarts.init(chartDom);

                this.gainoption = {
                    title: {
                        text: "核心流程漏斗统计"
                    },
                    //tooltip: {
                    //    trigger: "item",
                    //    formatter: "{a} <br/>{b} : {c}%"
                    //},
                    //toolbox: {
                    //    feature: {
                    //        dataView: { readOnly: false },
                    //        restore: {},
                    //        saveAsImage: {}
                    //    }
                    //},
                    legend: {
                        data: this.gainarr,
                        bottom: 0
                    },

                    series: [
                        {
                            // name: '预期',
                            type: "funnel",
                            left: "10%",
                            width: "80%",
                            label: {
                                formatter: "{b}"
                            },
                            labelLine: {
                                show: false
                            },
                            itemStyle: {
                                opacity: 0.7
                            },
                            emphasis: {
                                label: {
                                    position: "inside",
                                    formatter: "{b}: {c}"
                                }
                            },
                            data: this.gainlist
                        },
                        {
                            name: "实际",
                            type: "funnel",
                            left: "10%",
                            width: "80%",
                            maxSize: "80%",
                            label: {
                                position: "inside",
                                formatter: "{c}",
                                color: "#fff"
                            },
                            itemStyle: {
                                opacity: 0.5,
                                borderColor: "#fff",
                                borderWidth: 2
                            },
                            emphasis: {
                                label: {
                                    position: "inside",
                                    formatter: "{b}实际: {c}"
                                }
                            },
                            data: this.gainlist,
                            // Ensure outer shape will not be over inner shape when hover.
                            z: 100
                        }
                    ]
                };
                this.myCharttrapezoid.setOption(this.gainoption, true);
            });
        },
        //行为统计 - 漏斗图请求数据
        funrequset() {
            this.getRequest(
                "/EggStatistics/getCoreProcess",
                {
                    start: this.dateStar,
                    end: this.dateEnd,
                    appid: this.appletsId
                }
                //new axios.CancelToken(c => {
                //    _this.source = c;
                //})
            ).then(res => {
                if (axios.isCancel(res)) {
                    this.open2("未加载请求已被中断");
                    this.source = null;
                    return;
                }
                if (res.code == 200) {
                    this.loufun(res.data);
                    this.funnel();
                } else {
                    this.open4(res.msg);
                    this.echartsLoading = false;
                }
                //console.log(res, 1244444);
                //this.topData = res.data;
                //this.allDataLoading = false;
            });
        },
        //行为数据分析 数据处理成数数
        tool(data) {
            //console.log(data, 1233333);
            //清空eggdata里面的data
            this.eggdata.forEach((list, index) => {
                this.eggdata[index].data = [];
            });
            //this.heasdearr = [];
            this.linetime = [];
            data.forEach(item => {
                this.linetime.push(item.strTime);
                //console.log(item.strTime, 11111, this.linetime);
                Object.keys(item).forEach(key => {
                    this.eggdata.forEach((list, index) => {
                        //this.heasdearr.push(list.name);
                        if (key == list.egglist) {
                            this.eggdata[index].data.push(Number(item[key]));
                        }
                    });
                });
            });
            this.linedatas = this.eggdata;
        },
        //数据处理
        gainfn(data) {
            let arr = [];
            Object.keys(data).forEach(key => {
                //console.log(key, data[key]);
                arr.push(data[key]);
            });
            return arr;
        },
        //漏斗数据处理
        loufun(data) {
            let arr = [];
            Object.keys(data).forEach(key => {
                //this.gainlist.forEach(item => {
                //    console.log(item);
                //    item.value = data[key];
                //});
                arr.push(data[key]);

                //arr.push(data[key]);
                //console.log(this.gainlist[1].value, 11111);
            });
            for (let i = 0; i < this.gainlist.length; i++) {
                this.gainlist[i].value = arr[i];
            }
        }
    },
    filters: {
        floatMoney(num) {
            return parseFloat(num).toLocaleString();
        }
    },
    computed: {
        xcxlist() {
            // return this.$store.state.base.xcxList == undefined ? this.appletsArr : this.$store.state.base.xcxList
            return {
                2021002161629327: "天天果园",
                2021002171638476: "全民庄园"
            };
        }
    },
    mounted() {
        setTimeout(() => {
            window.onresize = () => {
                this.myChart.resize();
                // this.zyUserLineChart.resize()
                // this.zyKeepLineChart.resize()
                // this.zyCostLineChart.resize()
            };
        }, 200);
        this.barLoading = true;
        this.getbardata();
    }
};
</script>

<style lang="scss" scoped>
.headerCard {
    margin-bottom: 24px;
    position: relative;
    // min-width: 795px;
}

//图表
.echtable {
    width: 100%;
    height: 400px;
    // min-width: 600px;
}

.show_pieData {
    width: 100%;
    height: 400px;
}

// 新内容
.new_content {
    box-sizing: border-box;
    background: #fff;
    border-radius: 4px;

    .two_echart {
        display: flex;
        padding: 0 0 50px 0;
        margin-bottom: 50px;
        border-bottom: 1px solid #999999;
        .show_data_box {
            width: 1000px;
        }
        .pie_data {
            flex: 1;
        }
    }

    .bar_data {
        display: flex;
        align-items: flex-start;
        .bar_ech {
            width: 1200px;
            height: 600px;
        }
        .bar_box_top {
            position: relative;
            left: -300px;
        }
    }

    .today_statistics_box {
        display: flex;
        align-items: center;
        justify-content: space-between;

        margin-bottom: 30px;

        .right_btn_select {
            display: flex;
            align-items: center;
            .getData_btn {
                width: 106px;
                height: 36px;
                background: linear-gradient(90deg, #73a7ff, #448aff);
                border-radius: 5px;
                font-size: 13px;
                font-family: PingFang SC;
                font-weight: 500;
                color: #ffffff;
                line-height: 38px;
                text-align: center;
                cursor: pointer;
                margin-left: 10px;
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
                border-color: #448aff;
            }

            .top_btn_clicked {
                color: #ffffff;
                // border-color: #0046f4;

                background: linear-gradient(90deg, #73a7ff, #448aff);
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
            border: 1px solid #0046f4;
            border-radius: 4px;

            text-align: center;

            cursor: pointer;
            transition: all 0.2s linear;

            span {
                width: 55px;
                height: 14px;
                font-size: 14px;
                font-family: PingFang SC;
                font-weight: 500;
                color: #0046f4;
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

    border: 1px solid #cecece;
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
            background: #4188ff;
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
    }

    .data_item:last-of-type {
        margin-right: 0px;
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
}

// element date_chooes
.select_time >>> .el-input__prefix {
    left: initial;
    right: 1%;
    top: 2%;
    height: 26px;
    background: #ececec;
    color: #666666;
    border-radius: 0px 4px 4px 0px;
}

.select_time >>> .el-input__inner {
    padding-left: 15px;
    color: #666666;
}

.select_time >>> .el-input__suffix {
    right: 20%;
}

//顶部时间选择器
.right_btn_select >>> .el-picker-panel {
    position: absolute;
    z-index: 33;
}

// 用户统计
.user_statistics,
.cost {
    .show_data_box {
        .data_boxes {
            border-radius: 8px;
        }
        .data_item {
            padding: 0 10px 0 20px;
            p {
                margin: 16px 0 20px 0;
            }

            .user_newly {
                span {
                    color: #f712de;
                }
                .down_icon {
                    display: inline-block;
                    width: 7px;
                    height: 12px;
                    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAgCAYAAAASYli2AAABI0lEQVRIie3ULUsEURTG8X/QD2ARg82N+wkE2U9gU4zm3SyCYDNYNoiIWcRkMQiCL4jIYjCo2CwmYYPYxXOGY9mBw+G6d3Y1yVyYMOfc53dfBgYyw6Ap8CjwZNDMzc8OhQsBEzCF61+DAr0SFLj/ix1eOvCmBmuwBmvwv4IG0wq7AlvjggWsK+wZNBB4dr/441FBhX2X76Pw4QIm0K0KCmyHrGGwEIsFtB145Xq37phrMaewVIZWY9OgNeidu8DZoLac2EQnXuxmWK0wmFM4cLUThcUEtpH6WCgcBvRL4d29a8QEdpKYu+heIpR8FI6GYgAGEwqvFbDTLObQGYXPIeBdZcyh8z9gLwaTI4MACivhmG8GU2Nh5Sigo9AXeDCYzc3/Br/ilgU6/Q99AAAAAElFTkSuQmCC)
                        no-repeat;
                    background-size: contain;
                }
                .up_icon {
                    display: inline-block;
                    width: 7px;
                    height: 12px;
                    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAgCAYAAAASYli2AAABM0lEQVRIie3VIUsEQRTA8X8zObOLfgCDURAN+g0Eg2A/q8HgB7AJFrvHFeOhmAUV0XD43twhWGwngkWsBi02LeMxuzvuumoR9sGk9/bHe28GFirCKC0rPBpFrJBW1ZdGqiwb4X10lOH0PWM/wxwzGcwfK9zUxiaVcSs8x0CPntUCrXD7FRaM3/0WZpSTSsyfRGmXYomyVxhPeSlFhe14Z47NAjZg3ijdYMzj1LFWqHNsZDvrs5ovSoUVv4LTEASwjvXITluf2FxkzK3ggi6Dj65GTTh2Ip0uYZSnHLafu/GL4Ln0Mjmlk0PfsMJDgJ3nd1sGevQgyL+SDJiywqFVOrHLqgJ9za5VjhJhNpavDdaKBmzABmzAfwoaRQLw+i867AX/DP19h30WjDI0wt3EgMWq+g+wvm/+BbOIsQAAAABJRU5ErkJggg==)
                        no-repeat;
                    background-size: contain;
                }
            }
        }
    }
    .two_echart {
        border: 1px solid #ccc;
        border-radius: 8px;
        margin-top: 20px;

        .show_data_box {
            width: 100%;
        }
    }
}

.cost {
    .cost_show_data_box {
        width: 100%;
        box-sizing: border-box;

        .data_item {
            padding: 0 10px 0 20px;
        }
    }
    .el-select__tags {
        overflow-x: scroll;
    }
    .data_boxes {
        .data_item {
            p {
                margin: 16px 0 20px 0;
            }
        }
    }

    .cost_data {
        margin-top: 20px;

        .cost_ech {
            box-sizing: border-box;
            padding-right: 15vw;
            width: 100vw;
            height: 600px;
        }
    }
}
.graph {
    margin-top: 50px;
    display: flex;
    width: 100vw;
    //height: 800px;
}
.behavior {
    width: 100%;
    height: 400px;
}
.lineechtable {
    box-sizing: border-box;
    width: 80vw;
    padding-right: 15px;
    height: 400px;
}
.zhuxing {
    box-sizing: border-box;
    width: 40vw;
    height: 300px;
}
.trapezoidal {
    box-sizing: border-box;
    width: 40vw;
    padding-right: 15px;
    height: 400px;
}
</style>
