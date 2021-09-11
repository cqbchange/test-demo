<!--
 * @Descripttion: 纷推统计
 * @version: 1.0
 * @Author: WangChuan
 * @Date: 2021-01-15 16:52:43
 * @LastEditors: WangChuan
 * @LastEditTime: 2021-01-30 16:00:23
-->
<template>
    <div class="headerCard">
        <div class="new_content">
            <div class="today_statistics_box" v-loading="loading">
                <!-- 顶部按钮 -->
                <div class="button_box">
                    <div v-for='(item,index) in topBtnsisclicked' :key="index"
                        :class="'top_btns '+ (topBtnIndex==index ? 'top_btn_clicked' : '')" ref="TopBtn"
                        @click="chooseTop(index)">{{item.title}}
                    </div>
                </div>
                <div class="right_btn_select">
                    <template>
                        <div class="select_time">
                            <el-date-picker v-model="datequantum" type="daterange" align="right" size="medium"
                                :editable="false" :clearable="false" unlink-panels format="yyyy-MM-dd"
                                value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期"
                                end-placeholder="结束日期" @change="choosedatequantum" :picker-options="pickerOptions2" style="width:300px">
                            </el-date-picker>
                        </div>
                    </template>
                    <!-- 选择归属人 -->
                    <div class="table_select" v-if="!isShowOwner">
                        <el-select v-model="owner" size="medium" style="width:150px;margin-left:10px;"
                            placeholder="请选择归属人" clearable filterable>
                            <el-option label="全部归属人" value="" />
                            <el-option v-for="(val,key,i) in ownerList" :label="val" :value="val" :key="i"></el-option>
                        </el-select>
                    </div>
                </div>
            </div>
            <div class="show_data_box">
                <div class="show_all_data" v-loading="allDataLoading">
                    <div class="data_boxes" style="margin-top:10px;">
                        <div :class="'data_item '+( item.key1==='click_uv'? 'could_click' : '')"
                            v-for="(item,key) in dataKeyfir" :key="key">
                            <div class="item_title">
                                <span>{{item.title}}</span>
                            </div>
                            <span class="data_num" v-if="item.title != '平台剩余点击量'">
                                {{topData[item.key1]|floatMoney}}/{{topData[item.key2]|floatMoney}}
                            </span>
                            <span class="data_num" v-else>
                                {{topData[item.key1]|floatMoney}}
                            </span>
                            
                            <div class="compare_box">
                                <div class="gap_text sec" v-if="topRate[item.key1] > 0">
                                    <i class="ordinal_icon sec_icon" />
                                    {{Math.abs(topRate[item.key1])}}% 
                                </div>
                                <div class="gap_text" v-else-if="topRate[item.key1] == 0">
                                    {{Math.abs(topRate[item.key1])}}%
                                </div>
                                <div class="gap_text" v-else-if="topRate[item.key1] == 0 ">
                                    {{Math.abs(topRate[item.key1])}}
                                </div>
                                <div class="gap_text dec" v-else>
                                    <i class="ordinal_icon dec_icon" />
                                    {{Math.abs(topRate[item.key1])}}%
                                </div>
                                <span class="gap_jj" v-if=" item.title != '平台剩余点击量' ">/</span>
                                <div class="gap_text sec" v-if="topRate[item.key2] > 0  && item.title != '平台剩余点击量'">
                                    <i class="ordinal_icon sec_icon" />
                                    {{Math.abs(topRate[item.key2])}}%
                                </div>
                                <div class="gap_text" v-else-if="topRate[item.key2] == 0 && item.title != '平台剩余点击量'">
                                    {{Math.abs(topRate[item.key2])}}%
                                </div>
                                <div class="gap_text dec" v-else-if=" item.title != '平台剩余点击量'">
                                    <i class="ordinal_icon dec_icon" />
                                    {{Math.abs(topRate[item.key2])}}%
                                </div>
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
                            <div class="newanchor check_item_box">
                                <el-checkbox label="新增主播">新增主播</el-checkbox>
                            </div>
                            <div class="anchor check_item_box">
                                <el-checkbox label="总主播">总主播</el-checkbox>
                            </div>
                            <div class="newad_num check_item_box">
                                <el-checkbox label="新增广告">新增广告</el-checkbox>
                            </div>
                            <div class="ad_num check_item_box">
                                <el-checkbox label="总广告">总广告</el-checkbox>
                            </div>
                            <div class="put_num check_item_box">
                                <el-checkbox label="投放中">投放中</el-checkbox>
                            </div>
                            <div class="click_uv check_item_box">
                                <el-checkbox label="点击UV">点击UV</el-checkbox>
                            </div>
                            <div class="click_pv check_item_box">
                                <el-checkbox label="点击PV">点击PV</el-checkbox>
                            </div>
                            <div class="recharge check_item_box">
                                <el-checkbox label="充值金额">充值金额</el-checkbox>
                            </div>
                        </el-checkbox-group>
                    </div>
                </div>
                <!-- echarts -->
                <div id="new_echarts" class="echtable"></div>
            </div>
        </div>
    </div>
</template>
<script>
    import util from "@/common/utils";
    import axios from 'axios'
    export default {
        name: "logSale",
        data() {
            return {
                dataKeyfir: [{
                        // title: '点击UV/点击PV',
                        title: '新增主播/总主播',
                        key1: 'new_anchor',
                        key2: 'anchor'
                    }, {
                        title: '新增广告/总广告',
                        key1: 'newad_num',
                        key2: 'ad_num'
                    }, {
                        title: '上线数/投放中',
                        key1: 'onlinead_num',
                        key2: 'putad_num'
                    },
                    {
                        title: '点击UV/点击PV',
                        key1: 'uv',
                        key2: 'pv'
                    }, {
                        title: '小时均消耗/日均消耗',
                        key1: 'hour_avg_money',
                        key2: 'day_avg_money'
                    }, {
                        title: '充值金额/消耗金额',
                        key1: 'recharge',
                        key2: 'money'
                    },
                    {
                        title: '平台剩余点击量',
                        key1: 'surplus_click',
                      
                    },
                ],
                topData: {},
                topRate: {},
                myChart: '', //echarts实例
                option: '', //echarts实例配置
                echtext: '展示量', //echarts提示文字
                XdateArr: [], //echartsX轴数据
                table_data_type: 1, //数据的时间类型

                topBtnIndex: 0, //顶部按钮的下标

                today_statistics_time: '2010-10-20 14:30',
                checkList: ['新增主播'],
                start_time: '', //开始时间参数
                end_time: '', //结束时间参数

                datequantum: [], //echarts选择的时间段
                dateStar: '', //echarts选择的时间段的开始
                dateEnd: '', //echarts选择的时间段的结束

                loading: false, //头部loading
                echartsLoading: false, //图表loading
                allDataLoading: false, //数据汇总loading
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
                        name: '新增主播',
                        dataKey: 'new_anchor',
                        type: 'line',
                        data: [],
                        symbolSize: 10,
                        yAxisIndex: 1,
                        smooth: true,
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
                        name: '总主播',
                        dataKey: 'anchor',
                        type: 'line',
                        data: [],
                        symbolSize: 10,
                        yAxisIndex: 1,
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
                        name: '新增广告',
                        dataKey: 'newad_num',
                        type: 'line',
                        data: [],
                        symbolSize: 10,
                        yAxisIndex: 1,
                        smooth: true,
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
                        name: '总广告',
                        dataKey: 'ad_num',
                        type: 'line',
                        data: [],
                        smooth: true,
                        symbolSize: 10,
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
                        name: '投放中',
                        dataKey: 'putad_num',
                        type: 'line',
                        data: [],
                        smooth: true,
                        symbolSize: 10,
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
                        name: '点击UV',
                        dataKey: 'uv',
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
                        name: '点击PV',
                        dataKey: 'pv',
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
                        name: '充值金额',
                        dataKey: 'recharge',
                        type: 'line',
                        data: [],
                        symbolSize: 10,
                        smooth: true,
                        itemStyle: {
                            normal: {
                                color: '#FD07AF', //改变折线点的颜色
                                lineStyle: {
                                    color: '#FD07AF', //改变折线颜色
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
                        title: '昨日',
                        key: 'nearHalfMon',
                    },
                    {
                        title: '近7天',
                        key: 'nearWeek',
                    },

                    {
                        title: '近30天',
                        key: 'nearMon',
                    },
                ],
                owner: '', //归属人
                ownerList: {}, //归属人列表
                isShowOwner: true, //是否是主账号
                source: null, //中断请求(头部)
                sourceLine: null, //中断请求(折线图)
                firgetTop: false, //第一次进页面是否请求top数据
            };
        },
        watch: {
            topBtnIndex: {
                handler(val) {
                    if (val == 0) {
                        this.chooseTop(val)
                    }
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
                },
                immediate: true,
            },
            owner: {
                handler: function (val) {
                    this.echartsLoading = true
                    this.allDataLoading = true
                    this.getechartsdata()
                    this.getTopCt()
                }
            },
        },
        created() {
            this.loading = true
            this.getUserList()
        },
        methods: {
            //顶部按钮点击
            chooseTop(str) {
                let coudeRequse = false
                switch (str) {
                    case 0:
                        this.topBtnIndex = 0
                        this.table_data_type = 1
                        this.start_time = this.dateFormat('YYYY-mm-dd', new Date(new Date().getTime()))
                        // this.today_statistics_time = this.start_time
                        this.today_statistics_time = this.dateFormat('YYYY-mm-dd', new Date(new Date().getTime()))
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
                        this.topBtnIndex == 1 ? '' : (this.topBtnIndex = 1) && (coudeRequse = true)
                        this.table_data_type = 2
                        this.start_time = this.dateFormat('YYYY-mm-dd', new Date(new Date().getTime() - 24 * 60 * 60 *
                            1000)) //取昨天的日期
                        // this.today_statistics_time = this.start_time
                        this.today_statistics_time = this.dateFormat('YYYY-mm-dd', new Date(new Date().getTime() - 24 *
                            60 * 60 * 1000))
                        this.end_time = this.dateFormat('YYYY-mm-dd', new Date())
                        if (this.start_time != this.datequantum[0] || this.end_time != this.datequantum[1]) {
                            this.datequantum = [
                                this.start_time,
                                this.end_time,
                            ]
                        }
                        break
                    case 2:
                        this.topBtnIndex == 2 ? '' : (this.topBtnIndex = 2) && (coudeRequse = true)
                        this.table_data_type = 3
                        this.start_time = this.dateFormat('YYYY-mm-dd', new Date(new Date().getTime() - 7 * 24 * 60 *
                            60 * 1000))
                        // this.today_statistics_time = this.start_time
                        this.today_statistics_time = this.dateFormat('YYYY-mm-dd', new Date(new Date().getTime() - 7 *
                            24 * 60 * 60 * 1000))
                        this.end_time = this.dateFormat('YYYY-mm-dd', new Date())
                        if (this.start_time != this.datequantum[0] || this.end_time != this.datequantum[1]) {
                            this.datequantum = [
                                this.start_time,
                                this.end_time,
                            ]
                        }
                        break
                    case 3:
                        this.topBtnIndex == 3 ? '' : (this.topBtnIndex = 3) && (coudeRequse = true)
                        this.table_data_type = 4
                        this.start_time = this.dateFormat('YYYY-mm-dd', new Date(new Date().getTime() - 30 * 24 * 60 *
                            60 * 1000))
                        // this.today_statistics_time = this.start_time
                        this.today_statistics_time = this.dateFormat('YYYY-mm-dd', new Date(new Date().getTime() - 30 *
                            24 * 60 * 60 * 1000))
                        this.end_time = this.dateFormat('YYYY-mm-dd', new Date())
                        if (this.start_time != this.datequantum[0] || this.end_time != this.datequantum[1]) {
                            this.datequantum = [
                                this.start_time,
                                this.end_time,
                            ]
                        }
                        break
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
            },
            // 获取归属人列表
            getUserList() {
                this.getRequest('/XcxCtTwo/salesman', {

                }).then((res) => {
                    if (res.code == 200) {
                        if (res.data) {
                            this.ownerList = res.data.list
                            this.isShowOwner = res.data.auth
                            this.loading = false
                        }
                    } else {
                        this.open4(res.msg)
                        this.loading = false
                    }
                })
            },
            //echarts时间段选择
            choosedatequantum(val) {
                if (val != null) {
                    this.table_data_type = 5
                    this.topBtnIndex = 4
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
            //获取图表数据
            getechartsdata() {
                const _this = this;
                this.cancelRequest('sourceLine');
                this.getRequest('/Daniu/getChartData', {
                        start: this.dateStar,
                        end: this.dateEnd,
                        type: this.table_data_type,
                        owner: this.owner,
                    },
                    new axios.CancelToken((c) => {
                        _this.sourceLine = c
                    }),
                ).then(resp => {
                    if (axios.isCancel(resp)) {
                        this.open2('未加载请求已被中断2')
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
                    console.log(res)
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
            //获取数据汇总的数据
            getTopCt() {
                const _this = this;
                this.cancelRequest('source');
                this.getRequest('/Daniu/ctNew', {
                        start: this.start_time,
                        end: this.end_time,
                        owner: this.owner,
                        type: this.table_data_type,
                    },
                    new axios.CancelToken((c) => {
                        _this.source = c
                    }), // '第三个参数'
                ).then((res) => {
                    if (axios.isCancel(res)) {
                        this.open2('未加载请求已被中断1')
                        this.source = null
                        return
                    }
                    this.topData = res.data.data
                    this.topRate = res.data.rate
                    this.allDataLoading = false
                }).catch((err) => {
                    if (axios.isCancel(err)) {
                        console.log('Rquest canceled', err.message);
                        //请求如果被取消，这里是返回取消的message
                    } else {
                        console.log(err);
                    }
                })
            },
            cancelRequest(str) {
                if (str == 'source') {
                    if (typeof this.source === 'function') {
                        this.source('请求中断source')
                    }
                } else if (str == 'sourceLine') {
                    if (typeof this.sourceLine === 'function') {
                        this.sourceLine('请求中断sourceLine')
                    }
                }

            },
        },
        computed: {},
        filters: {
            floatMoney(num) {
                return parseFloat(num).toLocaleString()
            }
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
        min-width: 795px;
    }

    //图表
    .echtable {
        width: 100%;
        height: 400px;
        min-width: 600px;
    }

    // 新内容
    .new_content {

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

                .table_select {
                    margin-bottom: 0;
                }
            }

            .button_box {
                display: flex;
                // justify-content: space-between;
                align-items: center;
                // width: 280px;
                font-size: 18px;
                font-family: PingFang SC;
                font-weight: 500;
                color: #333333;

                .top_btns {
                    display: inline-block;
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

                .top_btns_sec:hover {
                    color: #0046f4;
                    border-color: #0046f4;
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
            }
        }
    }

    .show_data_box h3 {
        display: block;
        font-size: 22px;
        font-family: PingFang SC;
        font-weight: 500;
        color: #333333;
        margin: 44px 0 20px 0;
        position: relative;

        .title_anchor_name {
            font-weight: 400;
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
    .checkboxes_box .check_item_box {
        display: inline-block;
    }

    .checkboxes_box>>>.el-checkbox {
        margin-right: 15px;
    }

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

    .checkboxes_box>>>.el-checkbox__input.is-checked .el-checkbox__inner {
        background-color: #fff;
        border-color: #0046f4;
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

    .checkboxes_box .newanchor>>>.el-checkbox__inner {
        border-color: #86B2F9;
    }

    .checkboxes_box .newanchor>>>.el-checkbox__inner::after {
        border-color: #86B2F9;
    }

    .checkboxes_box .newanchor>>>.el-checkbox__input.is-checked .el-checkbox__inner {
        background-color: #fff;
        border-color: #86B2F9;
    }

    .checkboxes_box .newanchor>>>.el-checkbox__inner:hover {
        border-color: #86B2F9;
    }

    .checkboxes_box .newanchor>>>.el-checkbox__input.is-focus .el-checkbox__inner {
        border-color: #86B2F9;
    }

    .checkboxes_box .anchor>>>.el-checkbox__inner {
        border-color: #3F88FF;
    }

    .checkboxes_box .anchor>>>.el-checkbox__inner::after {
        border-color: #3F88FF;
    }

    .checkboxes_box .anchor>>>.el-checkbox__input.is-checked .el-checkbox__inner {
        background-color: #fff;
        border-color: #3F88FF;
    }

    .checkboxes_box .anchor>>>.el-checkbox__inner:hover {
        border-color: #3F88FF;
    }

    .checkboxes_box .anchor>>>.el-checkbox__input.is-focus .el-checkbox__inner {
        border-color: #3F88FF;
    }

    .checkboxes_box .newad_num>>>.el-checkbox__inner {
        border-color: #FE8B51;
    }

    .checkboxes_box .newad_num>>>.el-checkbox__inner::after {
        border-color: #FE8B51;
    }

    .checkboxes_box .newad_num>>>.el-checkbox__input.is-checked .el-checkbox__inner {
        background-color: #fff;
        border-color: #FE8B51;
    }

    .checkboxes_box .newad_num>>>.el-checkbox__inner:hover {
        border-color: #FE8B51;
    }

    .checkboxes_box .newad_num>>>.el-checkbox__input.is-focus .el-checkbox__inner {
        border-color: #FE8B51;
    }

    .checkboxes_box .ad_num>>>.el-checkbox__inner {
        border-color: #FEBB51;
    }

    .checkboxes_box .ad_num>>>.el-checkbox__inner::after {
        border-color: #FEBB51;
    }

    .checkboxes_box .ad_num>>>.el-checkbox__input.is-checked .el-checkbox__inner {
        background-color: #fff;
        border-color: #FEBB51;
    }

    .checkboxes_box .ad_num>>>.el-checkbox__inner:hover {
        border-color: #FEBB51;
    }

    .checkboxes_box .ad_num>>>.el-checkbox__input.is-focus .el-checkbox__inner {
        border-color: #FEBB51;
    }

    .checkboxes_box .put_num>>>.el-checkbox__inner {
        border-color: #FF878E;
    }

    .checkboxes_box .put_num>>>.el-checkbox__inner::after {
        border-color: #FF878E;
    }

    .checkboxes_box .put_num>>>.el-checkbox__input.is-checked .el-checkbox__inner {
        background-color: #fff;
        border-color: #FF878E;
    }

    .checkboxes_box .put_num>>>.el-checkbox__inner:hover {
        border-color: #FF878E;
    }

    .checkboxes_box .put_num>>>.el-checkbox__input.is-focus .el-checkbox__inner {
        border-color: #FF878E;
    }

    .checkboxes_box .click_uv>>>.el-checkbox__inner {
        border-color: #AB47FF;
    }

    .checkboxes_box .click_uv>>>.el-checkbox__inner::after {
        border-color: #AB47FF;
    }

    .checkboxes_box .click_uv>>>.el-checkbox__input.is-checked .el-checkbox__inner {
        background-color: #fff;
        border-color: #AB47FF;
    }

    .checkboxes_box .click_uv>>>.el-checkbox__inner:hover {
        border-color: #AB47FF;
    }

    .checkboxes_box .click_uv>>>.el-checkbox__input.is-focus .el-checkbox__inner {
        border-color: #AB47FF;
    }

    .checkboxes_box .click_pv>>>.el-checkbox__inner {
        border-color: #E375FF;
    }

    .checkboxes_box .click_pv>>>.el-checkbox__inner::after {
        border-color: #E375FF;
    }

    .checkboxes_box .click_pv>>>.el-checkbox__input.is-checked .el-checkbox__inner {
        background-color: #fff;
        border-color: #E375FF;
    }

    .checkboxes_box .click_pv>>>.el-checkbox__inner:hover {
        border-color: #E375FF;
    }

    .checkboxes_box .click_pv>>>.el-checkbox__input.is-focus .el-checkbox__inner {
        border-color: #E375FF;
    }

    .checkboxes_box .recharge>>>.el-checkbox__inner {
        border-color: #FD07AF;
    }

    .checkboxes_box .recharge>>>.el-checkbox__inner::after {
        border-color: #FD07AF;
    }

    .checkboxes_box .recharge>>>.el-checkbox__input.is-checked .el-checkbox__inner {
        background-color: #fff;
        border-color: #FD07AF;
    }

    .checkboxes_box .recharge>>>.el-checkbox__inner:hover {
        border-color: #FD07AF;
    }

    .checkboxes_box .recharge>>>.el-checkbox__input.is-focus .el-checkbox__inner {
        border-color: #FD07AF;
    }

    //顶部时间选择器
    .right_btn_select>>>.el-picker-panel {
        position: absolute;
        z-index: 33;
    }

</style>
