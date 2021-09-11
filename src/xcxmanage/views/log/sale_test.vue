<!--
 * @Descripttion: 测试统计
 * @version: 1.0
 * @Author: LiXinRui
 * @Date: 2021-06-08 10:17:43
 * @LastEditors: LiXinRui
 * @LastEditTime: 2021-06-08 10:17:43
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
                    <!-- <div v-if="isshoworgan" class="top_btns top_btns_sec" ref="TopBtn" @click="tosaleorgan">机构管理</div> -->
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
                        <el-date-picker v-model="appointDay" align="right" type="date" size="mini" style="width:150px"
                            :editable='false' :clearable="false" v-show="topBtnIndex == 4" placeholder="选择日期" ref="day"
                            :popper-append-to-body='false' @change="pointCheck" :picker-options="pickerOptions">
                        </el-date-picker>
                    </template>
                    <!-- 选择归属人 -->
                    <div class="table_select" v-if="!isShowOwner">
                        <el-select v-model="owner" size="medium" style="width:150px;margin-left:10px;"
                            placeholder="请选择归属人" clearable filterable>
                            <el-option label="全部归属人" value="" />
                            <el-option v-for="(val,key,i) in ownerList" :label="val" :value="val" :key="i"></el-option>
                        </el-select>
                    </div>
                    <div class="table_select" v-if="!isShowOwner">
                        <el-select @change="changemechanism()" :disabled="choosemechan" v-model="company_id" size="medium" style="width:150px;margin-left:10px;"
                            placeholder="请选择机构" clearable filterable>
                            <el-option label="全部机构" value="" />
                            <el-option v-for="(val,key,i) in companys" :label="val" :value="key" :key="i"></el-option>
                        </el-select>
                    </div>
                    <div class="table_select">
                        <el-select @change="changeuser" v-model="zhubo" size="medium" style="width:150px;margin-left:10px;"
                            placeholder="请选择主播" clearable :disabled="couldchoose" filterable>
                            <el-option label="全部主播" value="" />
                            <el-option v-for="(val,key,i) in zhuboList"
                                :label="val == null || val == '' ? '主播-'+key : val+'-'+key" :value="key" :key="i">
                            </el-option>
                        </el-select>
                    </div>
                </div>
            </div>
            <div class="show_data_box">
                <h3 class="fir_h3">数据汇总<span v-if="anchor_name">{{`(${anchor_name})`}}</span></h3>
                <!-- 新数据汇总 上传处理页面白屏 -->
                <div class="new_all_data" v-loading="topDataLoading">
                    <div class="all_data_box">
                        <!--  v-if="!item.isshow || zhubo == ''"  -->
                        <div v-if="!item.isshow || zhubo == ''" v-for="(item,index) in TopDataList" :key="index" style="flex:1">
                            <!-- v-for="(item,index) in TopDataList" :key="index" -->
                            <el-popover
                                v-if="index == 2 || index == 5"
                                placement="bottom"
                                width="300"
                                trigger="hover"
                                popper-class="popper_box"
                                style="flex:1">
                                <div class="popover_box">
                                    <!-- popData -->
                                    <div class="popover_data_box" v-for="(poplist,popindex) in item.popData" :key="popindex">
                                        <div :class="' ' + (item.popData.length >= 1 && poplist.length == 1 ? 'only_one' : 'data_item')" v-for="(item2,index2) in poplist" :key="index2">
                                            <div class="list_item_num">
                                                {{item2.dataNum}}
                                            </div>
                                            <div class="list_item_title">
                                                {{item2.dataName}}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div slot="reference" :class="'top_data_item vip_top_data_item ' + (index == TopDataList.length-1 ? 'last_item':'')">
                                    <!--  v-if="!item2.isshow || zhubo == ''" -->
                                    <div :class="'item_item ' + (inx == 0 ? 'fir_item ': inx == 2 && zhubo != '' ? 'nozhubo':'')" v-for="(item2,inx) in item.list_item" :key="inx">
                                        <div :class="'item_data ' + (int == 1 ? 'right_item_data':'left_item_data')" v-for="(ele,int) in item2.item_data" :key="int">
                                            <div :class="'data_title ' + (int == 1 && ele.dev == 'dec' && owner == '' ? 'text_dec_title':'')" v-if="((inx == 0 && int == 0) || (inx == 0 && int == 1 && owner != '') || (inx != 0 && int == 1 && owner != '')) && !(index == 1 && inx == 0 && int == 1)">{{ele.dataName}}</div>
                                            <div :class="'show_data_change ' + (ele.dev == 'sec' ? '':'change_dec')" v-if="int == 1 && ele.dev != 'nochange' && owner == '' && !(index == 1 && inx == 0 && int == 1)"></div>
                                            <div :class="'data_num ' + (int == 1 && ele.dev == 'dec' && owner == '' ? 'text_dec_num':'')" v-if="(inx == 0 || int == 1) && !(index == 1 && inx == 0 && int == 1)">{{ele.dataNum}}</div>
                                            <div class="data_num" v-if="inx != 0 && int == 0">{{ele.dataNum}}</div>
                                            <div class="data_title" v-if="inx != 0 && int == 0">{{ele.dataName}}</div>
                                        </div>
                                    </div>
                                </div>
                            </el-popover>
                            <div v-else :class="'top_data_item ' + (index == TopDataList.length-1 ? 'last_item':'')">
                                <!--  v-if="!item2.isshow || zhubo == ''" -->
                                <div v-for="(item2,inx) in item.list_item" :key="inx">
                                    <el-popover
                                        v-if="(index == 3 && inx ==2) || (index == 4 && inx == 1)"
                                        placement="bottom"
                                        width="300"
                                        trigger="hover"
                                        popper-class="popper_box">
                                        <div class="popover_box">
                                            <!-- popData -->
                                            <div class="popover_data_box" v-for="(poplist,popindex) in (index == 0 && inx == 0) ? TopDataList[0].list_item[0].popData : item.popData" :key="popindex">
                                                <div :class="'data_item'" v-for="(item2,index2) in poplist" :key="index2">
                                                    <div class="list_item_num">
                                                        {{item2.dataNum}}
                                                    </div>
                                                    <div class="list_item_title">
                                                        {{item2.dataName}}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div slot="reference" :class="'item_item vip_item ' + (inx == 0 ? 'fir_item ':'')">
                                            <div :class="'item_data ' + (int == 1 ? 'right_item_data':'left_item_data')" v-for="(ele,int) in item2.item_data" :key="int">
                                                <div :class="'data_title ' + (int == 1 && ele.dev == 'dec' && owner == '' ? 'text_dec_title':'')" v-if="(inx == 0 && int == 0) || (inx == 0 && int == 1 && owner != '') || (inx != 0 && int == 1 && owner != '')">{{ele.dataName}}</div>
                                                <div :class="'show_data_change ' + (ele.dev == 'sec' ? '':'change_dec')" v-if="int == 1 && ele.dev != 'nochange' && owner == ''"></div>
                                                <div :class="'data_num ' + (int == 1 && ele.dev == 'dec' && owner == '' ? 'text_dec_num':'')" v-if="inx == 0 || int == 1">{{ele.dataNum}}</div>
                                                <div class="data_num" v-if="inx != 0 && int == 0">{{ele.dataNum}}</div>
                                                <div class="data_title" v-if="inx != 0 && int == 0">{{ele.dataName}}</div>
                                            </div>
                                        </div>
                                    </el-popover>
                                    <div v-else :class="'item_item ' + (inx == 0 ? 'fir_item ':'')">
                                        <div :class="'item_data ' + (int == 1 ? 'right_item_data':'left_item_data')" v-for="(ele,int) in item2.item_data" :key="int">
                                            <div :class="'data_title ' + (int == 1 && ele.dev == 'dec' && owner == '' ? 'text_dec_title':'')" v-if="(inx == 0 && int == 0) || (inx == 0 && int == 1 && owner != '') || (inx != 0 && int == 1 && owner != '')">{{ele.dataName}}</div>
                                            <div :class="'show_data_change ' + (ele.dev == 'sec' ? '':'change_dec')" v-if="int == 1 && ele.dev != 'nochange' && owner == ''"></div>
                                            <div :class="'data_num ' + (int == 1 && ele.dev == 'dec' && owner == '' ? 'text_dec_num':'')" v-if="inx == 0 || int == 1">{{ele.dataNum}}</div>
                                            <div class="data_num" v-if="inx != 0 && int == 0">{{ele.dataNum}}</div>
                                            <div class="data_title" v-if="inx != 0 && int == 0">{{ele.dataName}}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <el-dialog title="主播管理" :visible.sync="dialogVisible" width="700px" :close-on-click-modal="false"
            custom-class="my-dialog" :append-to-body="true" :close-on-press-escape="false">
            <div class="dialog_top_search" style="display:flex;margin-bottom:10px;justify-content: space-between;">
                <el-select v-if="!isShowOwner" v-model="dialogowner" style="width:150px;margin-right:20px;"
                    placeholder="请选择归属人" clearable size="medium">
                    <el-option label="全部归属人" value="" />
                    <el-option v-for="(val,key,i) in ownerList" :label="val" :value="val" :key="i"></el-option>
                </el-select>
                <el-input size="medium" :clearable="true" class="input-search-btn" placeholder="填写任务跳转链接查询主播"
                    style="width:250px;" v-model="search_link">
                    <el-button @click="searchLink" slot="append" icon="el-icon-search">
                    </el-button>
                </el-input>
            </div>
            <div class="table_box">
                <fix-table v-loading="anchorloading" element-loading-text="拼命加载中"
                    element-loading-spinner="el-icon-loading" header-row-class-name="my-table-header" class="my-table"
                    :data="anchorList" height="40vh" border size="small" style="width: 100%"
                    :default-sort="{prop: 'create_time', order: 'descending'}">
                    <el-table-column prop="anchor_id" label="主播Id" align="center" />
                    <el-table-column label="主播备注" align="center">
                        <template slot-scope="scope">
                            <span v-if="scope.row.isChanging == false">{{scope.row.anchor_name}}</span>
                            <el-input :clearable="true" v-else size="mini" v-model="scope.row.anchor_name"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column fixed="right" label="操作" width="150" align="center">
                        <template slot-scope="scope">
                            <el-button v-if="scope.row.isChanging == false" @click="editData(scope.row)" type="text"
                                size="small">编辑</el-button>
                            <el-button v-if="scope.row.isChanging == true" @click="confirm(scope.row)" type="text"
                                size="small">确定</el-button>
                            <el-button v-if="scope.row.isChanging == true" @click="cancel(scope.row)" type="text"
                                size="small">取消</el-button>
                        </template>
                    </el-table-column>
                </fix-table>
            </div>
            <el-pagination @current-change="CurrentChange" layout="total, prev, pager, next" :page-size="dialogSize"
                :current-page="dialogPage" :total="dialogTop" />
        </el-dialog>
    </div>
</template>
<script>
    import util from "@/common/utils";
    import axios from 'axios'
    export default {
        name: "logSale",
        data() {
            return {
                adzoneId: '', //渠道id
                table_data_type: 0, //数据的时间类型

                topBtnIndex: 0, //顶部按钮的下标
                start_time: '', //开始时间参数
                end_time: '', //结束时间参数
                appointDay: '', //指定的日期
                appointWeek: '', //指定的一周
                appointMon: '', //指定的一月

                appletsId: '', //小程序ID
                datequantum: [], //echarts选择的时间段

                loading: false, //头部loading
                pickerOptions: {
                    disabledDate: (time) => {
                        return time.getTime() > new Date(`${this.dateFormat('YYYY-mm-dd',new Date())} 00:00:00`)
                            .getTime() - 86400000;
                    },
                    shortcuts: [{
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
                    }],
                }, //日期快捷选项
                pickerOptions2: {
                    disabledDate: (time) => {
                        return time.getTime() > new Date(`${this.dateFormat('YYYY-mm-dd',new Date())} 00:00:00`).getTime() ;
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
                    // {
                    //     title: '日',
                    //     key: 'appointDay',
                    // },
                ],
                owner: '', //归属人
                ownerList: {}, //归属人列表
                company_id:'',//机构
                companys:{},//机构列表
                isShowOwner: true, //是否是主账号
                isfinancial: false, //是否是财务(否)
                zhuboList: {}, //主播列表
                zhubo: '',
                couldchoose: true, //是否可以选择主播
                anchorloading: true, //弹窗主播列表loading
                anchorList: [], //主播列表
                dialogVisible: false, //弹窗是否展示
                search_link: '', //搜索主播的任务链接
                dialogPage: 1, //弹窗主播列表页码
                dialogSize: 20, //弹窗主播列表条数
                dialogTop: 0, //弹窗主播列表总数
                searchId: '', //查询的ID
                dialogowner: '',
                source: null, //中断请求(头部)(第一部分)
                sourceSec:null,//中断请求(头部)(第二部分)
                sourceThr:null,//中断请求(头部)(第三四部分)
                sourceFou:null,//中断请求(头部)(第五部分)
                sourceFiv:null,//中断请求(头部)(三方部分)
                companyable:true,//用于控制机构是否可以选择
                selcowList:true,//用于判断机构选择后回显归属人的数据是否已取得
                selectownerList:[],//归属人列表(用于选择机构后回显归属人)
                chooseMe:false,//清空参数时机
                ownerMe:true,//
                TopDataList:[
                    {
                        list_item:[
                            {
                                item_data:[
                                    {
                                        dataName:'点击数',
                                        dataNum:'0',
                                    },
                                    {
                                        dataName:'占总量',
                                        dataNum:'0%',
                                        dev:'sec',
                                    },
                                ],
                                popData:[],
                            },
                            {
                                item_data:[
                                    {
                                        dataName:'纷推',
                                        dataNum:'0',
                                    },
                                    {
                                        dataName:'占总量',
                                        dataNum:'0%',
                                        dev:'sec',
                                    },
                                ],
                                popData:[],
                            },
                            {
                                item_data:[
                                    {
                                        dataName:'后台',
                                        dataNum:'0',
                                    },
                                    {
                                        dataName:'占总量',
                                        dataNum:'0%',
                                        dev:'dec',
                                    },
                                ]
                            },
                        ],
                        popData:[]
                    },
                    {
                        list_item:[
                            {
                                item_data:[
                                    {
                                        dataName:'三方点击',
                                        dataNum:'0',
                                    },
                                    {
                                        dataName:'占总量',
                                        dataNum:'0%',
                                        dev:'sec',
                                    },
                                ],
                                popData:[],
                            },
                            {
                                item_data:[
                                    {
                                        dataName:'纷推',
                                        dataNum:'0',
                                    },
                                    {
                                        dataName:'占总量',
                                        dataNum:'0%',
                                        dev:'sec',
                                    },
                                ],
                                popData:[],
                            },
                            {
                                item_data:[
                                    {
                                        dataName:'后台',
                                        dataNum:'0',
                                    },
                                    {
                                        dataName:'占总量',
                                        dataNum:'0%',
                                        dev:'dec',
                                    },
                                ]
                            },
                        ],
                        popData:[]
                    },
                    {
                        list_item:[
                            {
                                item_data:[
                                    {
                                        dataName:'广告数',
                                        dataNum:'0',
                                    },
                                    {
                                        dataName:'占总量',
                                        dataNum:'0%',
                                        dev:'dec',
                                    },
                                ]
                            },
                            {
                                item_data:[
                                    {
                                        dataName:'新增',
                                        dataNum:'0',
                                    },
                                    {
                                        dataName:'占总量',
                                        dataNum:'0%',
                                        dev:'dec',
                                    },
                                ]
                            },
                            {
                                item_data:[
                                    {
                                        dataName:'投放',
                                        dataNum:'0',
                                    },
                                    {
                                        dataName:'占总量',
                                        dataNum:'0%',
                                        dev:'dec',
                                    },
                                ]
                            },
                        ],
                        popData:[]
                    },
                    {
                        list_item:[
                            {
                                item_data:[
                                    {
                                        dataName:'用户充值',
                                        dataNum:'0',
                                    },
                                    {
                                        dataName:'占总量',
                                        dataNum:'0%',
                                        dev:'sec',
                                    },
                                ]
                            },
                            {
                                item_data:[
                                    {
                                        dataName:'纷推充值',
                                        dataNum:'0',
                                    },
                                    {
                                        dataName:'占总量',
                                        dataNum:'0%',
                                        dev:'sec',
                                    },
                                ]
                            },
                            {
                                item_data:[
                                    {
                                        dataName:'后台加款',
                                        dataNum:'0',
                                    },
                                    {
                                        dataName:'占总量',
                                        dataNum:'0%',
                                        dev:'sec',
                                    },
                                ]
                            },
                        ],
                        popData:[]
                    },
                    {
                        list_item:[
                            {
                                item_data:[
                                    {
                                        dataName:'消耗金额',
                                        dataNum:'0',
                                    },
                                    {
                                        dataName:'占总量',
                                        dataNum:'0%',
                                        dev:'sec',
                                    },
                                ]
                            },
                            {
                                item_data:[
                                    {
                                        dataName:'纷推余额消耗',
                                        dataNum:'0',
                                    },
                                    {
                                        dataName:'占总量',
                                        dataNum:'0%',
                                        dev:'sec',
                                    },
                                ]
                            },
                            {
                                item_data:[
                                    {
                                        dataName:'销售核销',
                                        dataNum:'0',
                                    },
                                    {
                                        dataName:'占总量',
                                        dataNum:'0%',
                                        dev:'dec',
                                    },
                                ]
                            },
                        ],
                        popData:[]
                    },
                    {
                        list_item:[
                            {
                                item_data:[
                                    {
                                        dataName:'成本',
                                        dataNum:'0',
                                    },
                                    {
                                        dataName:'占总量',
                                        dataNum:'0%',
                                        dev:'sec',
                                    },
                                ]
                            },
                            {
                                item_data:[
                                    {
                                        dataName:'代理收益',
                                        dataNum:'0',
                                    },
                                    {
                                        dataName:'占总量',
                                        dataNum:'0%',
                                        dev:'sec',
                                    },
                                ]
                            },
                            {
                                item_data:[
                                    {
                                        dataName:'奖励支出',
                                        dataNum:'0',
                                    },
                                    {
                                        dataName:'占总量',
                                        dataNum:'0%',
                                        dev:'sec',
                                    },
                                ]
                            },
                        ],
                        popData:[]
                    },
                ],//新的头部数据
                topFirReady:false,//新的头部数据第一部分是否准备完毕
                topSecReady:false,//新的头部数据第二部分是否准备完毕
                topThrReady:false,//新的头部数据第三四部分是否准备完毕
                topFouReady:false,//新的头部数据第五部分是否准备完毕
                topFivReady:false,//新的头部数据三方部分是否准备完毕
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
                            
                            this.datequantum[1] = this.datequantum[1] == this.dateFormat('YYYY-mm-dd',new Date()) ? this.dateFormat('YYYY-mm-dd HH:MM:SS',new Date()) :`${this.datequantum[1]} 23:59:59`

                            //新增
                            this.start_time = val[0]
                            this.end_time = val[1]
                        }else{
                            //新增
                            this.start_time = val[0]
                            this.end_time = val[1].length == 10 ? `${val[1]} 23:59:59`:val[1]
                        }
                        
                    } else {
                        this.datequantum = [
                            this.start_time,
                            this.end_time,
                        ]
                    }
                    this.$nextTick(() => {
                        this.getTopCt()
                    })
                },
                immediate: true,
            },
            owner: {
                handler: function (val) {

                    this.companyable = true

                    if (this.zhubo != '') {
                        this.zhubo = '';
                        this.couldchoose = true;
                        this.getZhuBoList()
                        this.companyable = false
                        return;
                    }

                    if (val != '') {
                        if (!this.chooseMe) {
                            this.company_id != '' ? this.company_id = '' : '';
                            this.chooseMe = false;
                            this.ownerMe = false;
                            this.getmechanismList()
                            this.getTopCt()
                            return;
                        }else{
                            this.chooseMe = false;
                            this.ownerMe = false;
                        }
                    }else{
                        this.ownerMe = true;
                        this.chooseMe = false;
                        this.company_id != '' ? this.company_id = '' : '';
                    }
                    
                    this.zhubo != '' ? this.zhubo = '' : '';

                    this.getmechanismList()

                    this.getTopCt()

                    this.couldchoose = true;
                    this.getZhuBoList()
                }
            },
            zhubo: {
                handler: function (val) {
                    this.getTopCt()
                }
            },
            search_link: {
                handler: function (val) {
                    if (val == '') {
                        this.searchId = '';
                        this.getanchorList()
                    }
                }
            },
            dialogVisible: {
                handler: function (val, old) {
                    if (!old && val) {
                        this.getanchorList()
                    } else {
                        this.search_link == '' ? '' : this.search_link = '';
                    }
                }
            },
            dialogowner: {
                handler: function (val) {
                    this.getanchorList()
                }
            },
        },
        created() {
            this.loading = true
            this.getUserList()
            this.getZhuBoList()
            //请求机构列表和归属人
            this.getmechanismList()
            this.getowner()
        },
        methods: {
            //选择用户
            changeuser(val){
                this.company_id == "" ? '' : this.company_id = '';
                this.getTopCt()
            },
            //选择机构后获取归属人
            getowner(){
                this.getRequest('/XcxTask/getCompanyListNews',{
                    
                }).then((res)=>{
                    if (res.code == 200) {
                        res.data.forEach(ele=>{
                            ele.company.forEach(element=>{
                                element.par = ele;
                            })
                        })
                        this.selectownerList = res.data
                        this.selcowList = false;
                    }else{
                        this.open3(res.msg)
                    }
                })
            },
            //选择机构
            changemechanism(val){
                this.zhubo == "" ? '' : this.zhubo = '';
                this.selectownerList.forEach(ele => {
                    ele.company.forEach(element=>{
                        if (element.id == this.company_id) {
                            this.owner = ele.user_name
                            this.ownerMe == true ?  this.chooseMe = true : '' ;
                        }else{
                            console.log('机构为匹配',this.company_id)
                        }
                    })
                });
                this.getTopCt()
            },
            //获取机构列表
            getmechanismList(){
                this.getRequest('/XcxTask/getCompanyList',{
                    name:this.owner,
                }).then((res)=>{
                    if (res.code == 200) {
                        if (res.data) {
                            this.companys = res.data
                            this.companyable = false;
                        }
                    }else{
                        this.open4(res.msg)
                    }
                })
            },
            
            tosaleorgan() {
                this.$router.push('/userMechanism')
            },
            //取消修改
            cancel(row) {
                row.anchor_name = row.oldname
                row.isChanging = false;
            },
            //确定修改
            confirm(row) {
                this.anchorloading = true;
                this.postRequest('/XcxCtTwo/anchorEdit', {
                    anchor_id: row.anchor_id,
                    anchor_name: row.anchor_name
                }).then((res) => {
                    if (res.code == 200) {
                        this.open2(res.msg)
                        this.getanchorList();
                        this.couldchoose = true;
                        this.getZhuBoList();
                    } else {
                        this.open4(res.msg)
                        this.anchorloading = false;
                    }
                })
            },
            //删除主播
            delData(row) {
                this.$confirm('此操作将永久删除该主播, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.anchorloading = true;
                    this.postRequest('/XcxCtTwo/anchorDelete', {
                        anchor_id: row.anchor_id,
                    }).then((res) => {
                        if (res.code == 200) {
                            this.open2(res.msg)
                            this.getanchorList();
                        } else {
                            this.open4(res.msg)
                            this.anchorloading = false;
                        }
                    })
                }).catch(() => {
                    this.open1('取消删除')
                })
            },
            //编辑主播
            editData(row) {
                row.isChanging = true;
            },
            //输入连接搜索
            searchLink() {
                if (this.search_link == '') {
                    this.open3('请输入任务链接或主播ID')
                    return;
                }
                this.search_link = this.search_link.trim();
                if (this.search_link.indexOf('userId%3D') !== -1 && this.search_link.indexOf('%26') !== -1) {
                    if (this.search_link.substr(0, 9) !== 'tbopen://' || this.search_link.substr(-10, 10) !==
                        'taobaolive') {
                        this.$message.warning('请输入正确格式的链接')
                        return
                    }
                    this.searchId = this.search_link.substring(this.search_link.indexOf('userId%3D') + 9, this
                        .search_link.indexOf('%26'))
                    this.dialogPage = 1;
                    this.getanchorList();
                    return;
                }
                if (this.search_link.indexOf('userId%25253D') !== -1 && this.search_link.indexOf(
                        '%252526livesource') !== -1) {
                    if (this.search_link.substr(0, 32) !== 'https%3A%2F%2Fmobile.yhshapp.com' || this.search_link
                        .substr(-10, 10) !== 'taobaolive') {
                        this.$message.warning('请输入正确格式的链接')
                        return
                    }
                    this.searchId = this.search_link.substring(this.search_link.indexOf('userId%25253D') + 13, this
                        .search_link.indexOf('%252526livesource'))
                    this.dialogPage = 1;
                    this.getanchorList();
                    return;
                }
                if (!isNaN(this.search_link)) {
                    this.searchId = this.search_link
                    this.dialogPage = 1;
                    this.getanchorList();
                    return;
                }
                this.open3('请输入正确的任务链接或主播ID')
            },
            //制定时间
            pointCheck(val) {
                this.start_time = this.dateFormat('YYYY-mm-dd HH:MM:SS', val)
                this.end_time = this.dateFormat('YYYY-mm-dd', new Date(val.getTime() + 24 * 3600 * 1000))
                this.datequantum = [
                    this.start_time,
                    this.end_time
                ]
                this.getTopCt()
            },
            pointCheck2(val) {
                this.start_time = this.dateFormat('YYYY-mm-dd HH:MM:SS', new Date(val.getTime()))
                this.end_time = this.dateFormat('YYYY-mm-dd', new Date(val.getTime() + 7 * 24 * 3600 * 1000))
                this.datequantum = [
                    this.start_time,
                    this.end_time
                ]
                this.getTopCt()
            },
            pointCheck3(val) {
                this.start_time = this.dateFormat('YYYY-mm-dd HH:MM:SS', val)
                this.end_time = this.dateFormat('YYYY-mm-dd', new Date(val.getTime() + 30 * 86400000))
                this.datequantum = [
                    this.start_time,
                    this.end_time
                ]
                this.getTopCt()
            },
            //顶部按钮点击
            chooseTop(str) {
                let coudeRequse = false
                switch (str) {
                    case 0:
                        this.topBtnIndex = 0
                        this.table_data_type = 0
                        this.start_time = this.dateFormat('YYYY-mm-dd', new Date(new Date().getTime()))
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
                        this.table_data_type = 1
                        this.start_time = this.dateFormat('YYYY-mm-dd', new Date(new Date().getTime() - 24 * 60 * 60 *
                            1000)) //取昨天的日期
                        this.end_time = `${this.dateFormat('YYYY-mm-dd', new Date(new Date().getTime() - 24 * 60 * 60 *
                            1000))} 23:59:59`
                        if (this.start_time != this.datequantum[0] || this.end_time != this.datequantum[1]) {
                            this.datequantum = [
                                this.start_time,
                                this.end_time,
                            ]
                        }
                        break
                    case 2:
                        this.topBtnIndex == 2 ? '' : (this.topBtnIndex = 2) && (coudeRequse = true)
                        this.table_data_type = 2
                        this.start_time = this.dateFormat('YYYY-mm-dd', new Date(new Date().getTime() - 7 * 24 * 60 *
                            60 * 1000))
                        this.end_time = `${this.dateFormat('YYYY-mm-dd', new Date())} 23:59:59`
                        if (this.start_time != this.datequantum[0] || this.end_time != this.datequantum[1]) {
                            this.datequantum = [
                                this.start_time,
                                this.end_time,
                            ]
                        }
                        break
                    case 3:
                        this.topBtnIndex == 3 ? '' : (this.topBtnIndex = 3) && (coudeRequse = true)
                        this.table_data_type = 3
                        this.start_time = this.dateFormat('YYYY-mm-dd', new Date(new Date().getTime() - 30 * 24 * 60 *
                            60 * 1000))
                        this.end_time = `${this.dateFormat('YYYY-mm-dd', new Date())} 23:59:59`
                        if (this.start_time != this.datequantum[0] || this.end_time != this.datequantum[1]) {
                            this.datequantum = [
                                this.start_time,
                                this.end_time,
                            ]
                        }
                        break
                    case 4:
                        // this.table_data_type = 4
                        this.topBtnIndex == 4 ? '' : (this.topBtnIndex = 4) && (coudeRequse = false)
                        this.table_data_type = 1
                        // this.$refs.day.$el.click()
                        this.appointDay = null;
                        this.appointMon = null
                        this.appointWeek = null
                        if (this.start_time != this.datequantum[0] || this.end_time != this.datequantum[1]) {
                            this.datequantum = [
                                this.start_time,
                                this.end_time,
                            ]
                        }
                        break
                    case 5:
                        this.table_data_type = 5
                        // this.appointWeek = null;
                        this.appointMon = null
                        this.appointDay = null
                        if (this.start_time != this.datequantum[0] || this.end_time != this.datequantum[1]) {
                            this.datequantum = [
                                this.start_time,
                                this.end_time,
                            ]
                        }
                        break
                    case 6:
                        this.table_data_type = 6
                        // this.appointMon = null;
                        this.appointDay = null
                        this.appointWeek = null
                        if (this.start_time != this.datequantum[0] || this.end_time != this.datequantum[1]) {
                            this.datequantum = [
                                this.start_time,
                                this.end_time,
                            ]
                        }
                        break
                        // coudeRequse = true;
                    default:
                        break
                }
                if (coudeRequse == true) {
                    
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
            // 获取归属人列表
            getUserList() {
                this.getRequest('/XcxCtTwo/salesman', {

                }).then((res) => {
                    if (res.code == 200) {
                        if (res.data) {
                            this.ownerList = res.data.list
                            this.isShowOwner = res.data.auth
                            this.isfinancial = res.data.authNews
                            this.loading = false
                        }
                    } else {
                        this.open4(res.msg)
                        this.loading = false
                    }
                })
            },
            //获取select主播列表
            getZhuBoList() {
                this.getRequest('/XcxCtTwo/getAnchor', {
                    owner: this.owner,
                }).then((res) => {
                    if (res.code == 200) {
                        if (res.data) {
                            this.zhuboList = res.data
                            this.couldchoose = false
                        }
                    } else {
                        this.open4(res.msg)
                        // this.loading = false
                    }
                })
            },
            //获取弹窗主播列表
            getanchorList() {
                this.anchorloading = true;
                this.getRequest('/XcxCtTwo/getAnchorPage', {
                    p: this.dialogPage,
                    size: this.dialogSize,
                    keyword: this.searchId,
                    owner: this.dialogowner,
                }).then((res) => {
                    if (res.code == 200) {
                        this.dialogTop = res.data.total
                        this.anchorList = [];
                        res.data.data.forEach((element, index) => {
                            let item = {
                                anchor_name: element.anchor_name == null ? '' : element.anchor_name,
                                anchor_id: element.anchor_id,
                                isChanging: false,
                                oldname: element.anchor_name == null ? '' : element.anchor_name,
                                invite_name: element.invite_name,
                            }
                            this.anchorList.push(item);
                        });
                        this.anchorloading = false;
                    } else {
                        this.anchorList = [];
                        this.dialogTop = 0;
                        this.open4(res.msg)
                        // this.loading = false
                        this.anchorloading = false;
                    }
                })
            },
            CurrentChange(val) {
                this.dialogPage = val
                this.getanchorList()
            },
            //echarts时间段选择
            choosedatequantum(val) {
                if (val != null) {
                    this.dateFormat('YYYY-mm-dd',new Date(val[1])) == val[0] && this.dateFormat('YYYY-mm-dd',new Date(val[1])) == this.dateFormat('YYYY-mm-dd',new Date()) ? this.topBtnIndex = 0 : this.topBtnIndex = 7
                    this.table_data_type = 4
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
            //获取数据汇总的数据
            getTopCt() {
                this.getNewTopFir()
                this.getNewTopSec()
                this.getNewTopThr()
                this.getNewTopFou()
                this.getNewTopFiv()
            },
            getNewTopFir(){
                this.topFirReady = false;//新的头部数据第一部分是否准备完毕

                const _this = this;
                this.cancelRequest('source');
                this.getRequest('/CeshiAalesStatistics/getClick', {
                    start: this.start_time,
                    end: this.end_time,
                    adzone_id: this.adzoneId,
                    appid: this.appletsId,
                    owner: this.owner,
                    anchor_id: this.zhubo,
                    type: this.table_data_type,
                    company_id:this.company_id
                },
                new axios.CancelToken((c) => {
                    _this.source = c
                }), // '第三个参数'
                ).then((res) => {
                    if (axios.isCancel(res)) {
                        // this.open2('未加载请求已被中断')
                        this.source = null
                        return
                    }
                    if (res.code == 200) {
                        this.TopDataList[0].list_item = [
                            {
                                item_data:[
                                    {
                                        dataName:'点击数',
                                        dataNum:res.data.count_click,
                                    },
                                    // {
                                    //     dataName:'占总量',
                                    //     dataNum:Math.abs(res.data.count_click_ratio)+'%',
                                    //     dev:res.data.count_click_ratio > 0 ?'sec':res.data.count_click_ratio < 0 ? 'dec' : 'nochange',
                                    // },
                                ],
                                popData:[
                                    [
                                        {
                                            dataName:'后台测试点击',
                                            dataNum:res.data.ceshi_admin_click,
                                        },
                                        {
                                            dataName:'纷推测试点击',
                                            dataNum:res.data.ceshi_daniu_click,
                                        },
                                    ],
                                ]
                            },
                            {
                                item_data:[
                                    {
                                        dataName:'纷推',
                                        dataNum:res.data.daniu_click,
                                    },
                                    // {
                                    //     dataName:'占总量',
                                    //     dataNum:Math.abs(res.data.daniu_click_ratio)+'%',
                                    //     dev:res.data.daniu_click_ratio > 0 ?'sec':res.data.daniu_click_ratio < 0 ? 'dec' : 'nochange',
                                    // },
                                ],
                                isshow:true,
                            },
                            {
                                item_data:[
                                    {
                                        dataName:'后台',
                                        dataNum:res.data.admin_click,
                                    },
                                    // {
                                    //     dataName:'占总量',
                                    //     dataNum:Math.abs(res.data.admin_click_ratio )+'%',
                                    //     dev:res.data.admin_click_ratio > 0 ?'sec':res.data.admin_click_ratio < 0 ? 'dec' : 'nochange',
                                    // },
                                ]
                            },
                        ]
                        this.TopDataList[0].popData = [
                            [
                                {
                                    dataName:'核销点击',
                                    dataNum:res.data.click,
                                },
                                {
                                    dataName:'折算率',
                                    dataNum:res.data.convert+'%',
                                },
                                {
                                    dataName:'平均单价',
                                    dataNum:res.data.unit_price,
                                } 
                            ],
                        ]
                        this.topFirReady = true;
                    }else{
                        this.topFirReady = true;
                        this.open4(res.msg)
                    }
                }).catch((err) => {
                    if (axios.isCancel(err)) {
                        console.log('Rquest canceled', err.message);
                        //请求如果被取消，这里是返回取消的message
                    } else {
                        console.log(err);
                    }
                })
            },
            getNewTopSec(){
                this.topSecReady = false;//新的头部数据第二部分是否准备完毕

                const _this = this;
                this.cancelRequest('sourceSec');
                this.getRequest('/CeshiAalesStatistics/getAdvertisement', {
                    start: this.start_time,
                    end: this.end_time,
                    adzone_id: this.adzoneId,
                    appid: this.appletsId,
                    owner: this.owner,
                    anchor_id: this.zhubo,
                    type: this.table_data_type,
                    company_id:this.company_id
                },
                new axios.CancelToken((c) => {
                    _this.sourceSec = c
                }), // '第三个参数'
                ).then((res) => {
                    if (axios.isCancel(res)) {
                        // this.open2('未加载请求已被中断')
                        this.sourceSec = null
                        return
                    }
                    if (res.code == 200) {
                        this.TopDataList[2].list_item = [
                            {
                                item_data:[
                                    {
                                        dataName:'广告数',
                                        dataNum:res.data.not_count,
                                    },
                                    // {
                                    //     dataName:'占总量',
                                    //     dataNum:Math.abs(res.data.count_ad_ratio)+'%',
                                    //     dev:res.data.count_ad_ratio > 0 ?'sec':res.data.count_ad_ratio < 0 ? 'dec' : 'nochange',
                                    // },
                                ]
                            },
                            {
                                item_data:[
                                    {
                                        dataName:'新增',
                                        dataNum:res.data.new_count,
                                    },
                                    // {
                                    //     dataName:'占总量',
                                    //     dataNum:Math.abs(res.data.new_count_ratio)+'%',
                                    //     dev:res.data.new_count_ratio > 0 ?'sec':res.data.new_count_ratio < 0 ? 'dec' : 'nochange',
                                    // },
                                ]
                            },
                            {
                                item_data:[
                                    {
                                        dataName:'投放',
                                        dataNum:res.data.put_count,
                                    },
                                    // {
                                    //     dataName:'占总量',
                                    //     dataNum:Math.abs(res.data.put_count_ratio )+'%',
                                    //     dev:res.data.put_count_ratio > 0 ?'sec':res.data.put_count_ratio < 0 ? 'dec' : 'nochange',
                                    // },
                                ]
                            },
                        ]
                        this.TopDataList[2].popData = [
                            [
                                {
                                    dataName:'后台广告',
                                    dataNum:res.data.not_admin_count,
                                },
                                {
                                    dataName:'后台新增',
                                    dataNum:res.data.admin_new_count,
                                },
                                {
                                    dataName:'后台投放',
                                    dataNum:res.data.put_admin_count,
                                } 
                            ],
                            [
                                {
                                    dataName:'纷推广告',
                                    dataNum:res.data.not_daniu_count,
                                },
                                {
                                    dataName:'纷推新增',
                                    dataNum:res.data.daniu_new_count,
                                },
                                {
                                    dataName:'纷推投放',
                                    dataNum:res.data.put_daniu_count,
                                } 
                            ],
                        ]
                        this.topSecReady = true;
                    }else{
                        this.topSecReady = true;
                        this.open4(res.msg)
                    }
                }).catch((err) => {
                    if (axios.isCancel(err)) {
                        console.log('Rquest canceled', err.message);
                        //请求如果被取消，这里是返回取消的message
                    } else {
                        console.log(err);
                    }
                })
            },
            getNewTopThr(){
                this.topThrReady = false;//新的头部数据第三四部分是否准备完毕

                const _this = this;
                this.cancelRequest('sourceThr');
                this.getRequest('/CeshiAalesStatistics/getMoney', {
                    start: this.start_time,
                    end: this.end_time,
                    adzone_id: this.adzoneId,
                    appid: this.appletsId,
                    owner: this.owner,
                    anchor_id: this.zhubo,
                    type: this.table_data_type,
                    company_id:this.company_id
                },
                new axios.CancelToken((c) => {
                    _this.sourceThr = c
                }), // '第三个参数'
                ).then((res) => {
                    if (axios.isCancel(res)) {
                        // this.open2('未加载请求已被中断')
                        this.sourceThr = null
                        return
                    }
                    if (res.code == 200) {
                        this.$nextTick(()=>{
                            this.TopDataList[3]={
                                list_item:[
                                    {
                                        item_data:[
                                            {
                                                dataName:'用户充值',
                                                dataNum:res.data.count_money,
                                            },
                                            // {
                                            //     dataName:'占总量',
                                            //     dataNum:Math.abs(res.data.count_money_ratio)+'%',
                                            //     dev:res.data.count_money_ratio > 0 ?'sec':res.data.count_money_ratio < 0 ? 'dec' : 'nochange',
                                            // },
                                        ]
                                    },
                                    {
                                        item_data:[
                                            {
                                                dataName:'纷推充值',
                                                dataNum:res.data.record_money,
                                            },
                                            // {
                                            //     dataName:'占总量',
                                            //     dataNum:Math.abs(res.data.daniu_money_ratio)+'%',
                                            //     dev:res.data.daniu_money_ratio > 0 ?'sec':res.data.daniu_money_ratio < 0 ? 'dec' : 'nochange',
                                            // },
                                        ]
                                    },
                                    {
                                        item_data:[
                                            {
                                                dataName:'后台加款',
                                                dataNum:res.data.admin_money,
                                            },
                                            // {
                                            //     dataName:'占总量',
                                            //     dataNum:Math.abs(res.data.admin_money_ratio )+'%',
                                            //     dev:res.data.admin_money_ratio > 0 ?'sec':res.data.admin_money_ratio < 0 ? 'dec' : 'nochange',
                                            // },
                                        ]
                                    },
                                ],
                                popData : [
                                    [
                                        {
                                            dataName:'机构加款',
                                            dataNum:0,
                                        },
                                        {
                                            dataName:'纷推加款',
                                            dataNum:0,
                                        },
                                    ],
                                ],
                                isshow:true,
                            }
                            this.TopDataList[4]={
                                list_item:[
                                    {
                                        item_data:[
                                            {
                                                dataName:'消耗金额',
                                                dataNum:res.data.expend_money,
                                            },
                                            // {
                                            //     dataName:'占总量',
                                            //     dataNum:Math.abs(res.data.count_expend_money_ratio)+'%',
                                            //     dev:res.data.count_expend_money_ratio > 0 ?'sec':res.data.count_expend_money_ratio < 0 ? 'dec' : 'nochange',
                                            // },
                                        ]
                                    },
                                    {
                                        item_data:[
                                            {
                                                dataName:'纷推余额消耗',
                                                dataNum:res.data.expend_money,
                                            },
                                            // {
                                            //     dataName:'占总量',
                                            //     dataNum:Math.abs(res.data.daniu_expend_money_ratio)+'%',
                                            //     dev:res.data.daniu_expend_money_ratio > 0 ?'sec':res.data.daniu_expend_money_ratio < 0 ? 'dec' : 'nochange',
                                            // },
                                        ],
                                        isshow:true,
                                    },
                                    {
                                        item_data:[
                                            {
                                                dataName:'销售核销',
                                                // dataNum:this.TopDataList[3].list_item[2][0].dataNum == '' || 0 ? res.data.admin_expend_money : this.TopDataList[3].list_item[2][0].dataNum,
                                                dataNum:0,
                                            },
                                            // {
                                            //     dataName:'占总量',
                                            //     dataNum:Math.abs(res.data.admin_expend_money_ratio )+'%',
                                            //     dev:res.data.admin_expend_money_ratio > 0 ?'sec':res.data.admin_expend_money_ratio < 0 ? 'dec' : 'nochange',
                                            // },
                                        ]
                                    },
                                ],
                                popData : [
                                    [
                                        {
                                            dataName:'购买流量包消耗金额',
                                            dataNum:res.data.traffic_money,
                                        },
                                        {
                                            dataName:'流量包消耗量',
                                            dataNum:res.data.traffic_click_num,
                                        },
                                    ],
                                    [
                                        {
                                            dataName:'广告消耗金额',
                                            dataNum:res.data.money,
                                        },
                                        {
                                            dataName:'消耗赠送金额',
                                            dataNum:res.data.rebate_money,
                                        },
                                    ],
                                ]
                            }
                        })

                        // this.getNewTopFou(res.data.cost_price)
                        
                        this.topThrReady = true;
                    }else{
                        this.topThrReady = true;
                        this.open4(res.msg)
                    }
                }).catch((err) => {
                    if (axios.isCancel(err)) {
                        console.log('Rquest canceled', err.message);
                        //请求如果被取消，这里是返回取消的message
                    } else {
                        console.log(err);
                    }
                })
            },
            getNewTopFou(data){
                this.topFouReady = false;//新的头部数据第五部分是否准备完毕

                const _this = this;
                this.cancelRequest('sourceFou');
                this.getRequest('/CeshiAalesStatistics/getCostPrice', {
                    start: this.start_time,
                    end: this.end_time,
                    adzone_id: this.adzoneId,
                    appid: this.appletsId,
                    owner: this.owner,
                    anchor_id: this.zhubo,
                    type: this.table_data_type,
                    company_id:this.company_id
                },
                new axios.CancelToken((c) => {
                    _this.sourceFou = c
                }), // '第三个参数'
                ).then((res) => {
                    if (axios.isCancel(res)) {
                        // this.open2('未加载请求已被中断')
                        this.sourceFou = null
                        return
                    }
                    if (res.code == 200) {

                        this.TopDataList[5].list_item = [
                                {
                                    item_data:[
                                        {
                                            dataName:'成本',
                                            dataNum:res.data.count_money,
                                        },
                                        // {
                                        //     dataName:'占总量',
                                        //     dataNum:Math.abs(res.data.count_money_ratio)+'%',
                                        //     dev:res.data.count_money_ratio > 0 ?'sec':res.data.count_money_ratio < 0 ? 'dec' : 'nochange',
                                        // },
                                    ]
                                },
                                {
                                    item_data:[
                                        {
                                            dataName:'代理收益',
                                            dataNum:res.data.agency_money,
                                        },
                                        // {
                                        //     dataName:'占总量',
                                        //     dataNum:Math.abs(res.data.agency_money_ratio)+'%',
                                        //     dev:res.data.agency_money_ratio > 0 ?'sec':res.data.agency_money_ratio < 0 ? 'dec' : 'nochange',
                                        // },
                                    ],
                                    isshow:true
                                },
                                {
                                    item_data:[
                                        {
                                            dataName:'奖励支出',
                                            dataNum:res.data.pay_money,
                                        },
                                        // {
                                        //     dataName:'占总量',
                                        //     dataNum:Math.abs(res.data.pay_money_ratio )+'%',
                                        //     dev:res.data.pay_money_ratio > 0 ?'sec':res.data.pay_money_ratio < 0 ? 'dec' : 'nochange',
                                        // },
                                    ]
                                },
                        ]
                        this.TopDataList[5].popData = [
                            [
                                {
                                    dataName:'后台集分宝消耗',
                                    dataNum:res.data.admin_jfb,
                                },
                                {
                                    dataName:'后台金币消耗',
                                    dataNum:res.data.admin_jb,
                                },
                                {
                                    dataName:'后台红包消耗',
                                    dataNum:res.data.admin_hb,
                                } 
                            ],
                            [
                                {
                                    dataName:'纷推集分宝消耗',
                                    dataNum:res.data.daniu_jfb,
                                },
                                {
                                    dataName:'纷推金币消耗',
                                    dataNum:res.data.daniu_jb,
                                },
                                {
                                    dataName:'纷推红包消耗',
                                    dataNum:res.data.daniu_hb,
                                } 
                            ],
                            [
                                {
                                    dataName:'三方测试成本',
                                    dataNum:res.data.ceshi_triple_money,
                                },
                            ]
                        ]
                        this.topFouReady = true;
                    }else{
                        this.topFouReady = true;
                        this.open4(res.msg)
                    }
                }).catch((err) => {
                    if (axios.isCancel(err)) {
                        console.log('Rquest canceled', err.message);
                        //请求如果被取消，这里是返回取消的message
                    } else {
                        console.log(err);
                    }
                })
                // this.topFouReady = true;
            },
            getNewTopFiv(){
                this.topFivReady = false
                const _this = this;
                this.cancelRequest('sourceFiv');
                this.getRequest('/CeshiAalesStatistics/getTripleClick', {
                    start: this.start_time,
                    end: this.end_time,
                    adzone_id: this.adzoneId,
                    appid: this.appletsId,
                    owner: this.owner,
                    anchor_id: this.zhubo,
                    type: this.table_data_type,
                    company_id:this.company_id
                },
                new axios.CancelToken((c) => {
                    _this.sourceFiv = c
                }), // '第三个参数'
                ).then((res) => {
                    if (axios.isCancel(res)) {
                        // this.open2('未加载请求已被中断')
                        this.sourceFiv = null
                        return
                    }
                    if (res.code == 200) {
                        this.TopDataList[1].list_item = [
                            {
                                item_data:[
                                    {
                                        dataName:'三方测试点击',
                                        dataNum:res.data.count_ceshi_click,
                                    },
                                    // {
                                    //     dataName:'占总量',
                                    //     dataNum:Math.abs(res.data.count_click_ratio)+'%',
                                    //     dev:res.data.count_click_ratio > 0 ?'sec':res.data.count_click_ratio < 0 ? 'dec' : 'nochange',
                                    // },
                                ]
                            },
                            {
                                item_data:[
                                    {
                                        dataName:'纷推',
                                        dataNum:res.data.daniu_ceshi_click,
                                    },
                                    // {
                                    //     dataName:'占总量',
                                    //     dataNum:Math.abs(res.data.daniu_click_ratio)+'%',
                                    //     dev:res.data.daniu_click_ratio > 0 ?'sec':res.data.daniu_click_ratio < 0 ? 'dec' : 'nochange',
                                    // },
                                ],
                                isshow:true
                            },
                            {
                                item_data:[
                                    {
                                        dataName:'后台',
                                        dataNum:res.data.admin_ceshi_click,
                                    },
                                    // {
                                    //     dataName:'占总量',
                                    //     dataNum:Math.abs(res.data.admin_click_ratio )+'%',
                                    //     dev:res.data.admin_click_ratio > 0 ?'sec':res.data.admin_click_ratio < 0 ? 'dec' : 'nochange',
                                    // },
                                ]
                            },
                        ]
                        this.TopDataList[1].popData = [
                            [
                                {
                                    dataName:'后台三方测试点击',
                                    dataNum:0,
                                },
                                {
                                    dataName:'纷推三方测试点击',
                                    dataNum:0,
                                },
                            ]
                        ]
                        this.topFivReady = true
                    }else{
                        this.open4(res.msg)
                        this.topFivReady = true
                    }
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
                        this.source('请求中断1')
                    }
                } else if (str == 'sourceSec') {
                    if (typeof this.sourceSec === 'function') {
                        this.sourceSec('请求中断2')
                    }
                } else if (str == 'sourceThr') {
                    if (typeof this.sourceThr === 'function') {
                        this.sourceThr('请求中断2')
                    }
                } else if (str == 'sourceFou') {
                    if (typeof this.sourceFou === 'function') {
                        this.sourceFou('请求中断2')
                    }
                } else if (str == 'sourceFiv') {
                    if (typeof this.sourceFiv === 'function') {
                        this.sourceFiv('请求中断2')
                    }
                }

            },
            zhuBoManage(){
                this.dialogVisible = true;
            }
        },
        computed: {
            anchor_name() {
                return this.zhuboList[this.zhubo] == "" || this.zhuboList[this.zhubo] === null ? '主播' : this.zhuboList[
                    this.zhubo] == undefined ? undefined : this.zhuboList[this.zhubo]
            },
            isshoworgan() {
                return util.checkAccess("company_getlist");
            },
            choosemechan(){
                return !(!this.companyable && !this.selcowList)
            },
            topDataLoading(){
                return !(this.topFirReady == true && this.topSecReady == true && this.topThrReady == true && this.topFouReady == true && this.topFivReady == true)
            },
        },
        filters: {
            floatMoney(num) {
                return parseFloat(num).toLocaleString()
            }
        },
        mounted() {
            
        },
    };

</script>

<style lang='scss' scoped>
    .headerCard {
        margin-bottom: 24px;
        position: relative;
        min-width: 795px;
    }

    // 新内容
    .new_content {
        // padding: 30px;
        // box-sizing: border-box;
        // background: #fff;
        // border-radius: 4px;
        // box-shadow: 1px 1px 10px 2px rgba(0, 183, 255, 0.1);

        .today_statistics_box {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 30px;

            .right_btn_select {
                display: flex;
                align-items: center;
                .top_btns {
                    font-size: 12px;
                    font-family: PingFang SC;
                    font-weight: 500;
                    color: #666666;
                    border: 1px solid #ececec;
                    border-radius: 10px;
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
                    background: linear-gradient(90deg, #73A7FF, #448AFF);
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

    .show_data_box h3 {
        display: block;
        font-size: 18px;
        font-family: PingFang SC;
        font-weight: 500;
        color: #333333;
        margin: 44px 0 20px 0;
        position: relative;

        .title_anchor_name {
            font-weight: 400;
        }
    }

    .new_all_data{
        .all_data_box{
            display: flex;
            align-items: flex-start;
            .top_data_item{
                flex: 1;
                .item_item{
                    display: flex;
                    align-items: flex-end;
                    justify-content: space-between;
                    box-sizing: border;
                    padding: 18px 40px;
                    border-left: 1px solid transparent;
                    border-right: 1px solid #ECF3FE;
                    border-bottom: 1px solid #ECF3FE;
                    .item_data{
                        .show_data_change{
                            width: 9px;
                            height: 15px;
                            background-size: 100%;
                            background-repeat: no-repeat;
                            background-image: url(~@img/new_sec.png);
                            margin-right: 5px;
                        }
                        .change_dec{
                            background-image: url(~@img/new_dec.png);
                        }
                    }
                    .left_item_data{
                        .data_num{
                            margin-bottom: 9px;
                            font-size: 18px;
                            font-family: PingFang SC;
                            font-weight: bold;
                            color: #333333;
                        }
                        .data_title{
                            font-size: 13px;
                            font-family: PingFang SC;
                            font-weight: 500;
                            color: #999999;
                            letter-spacing: 1px;
                        }
                    }
                    .right_item_data{
                        display: flex;
                        align-items: center;
                        .data_title{
                            font-size: 13px;
                            font-family: PingFang SC;
                            font-weight: 500;
                            color: #4C8FFF;
                            margin-right: 16px;
                        }
                        .text_dec_title{
                            color: #FC2433;
                        }
                        .data_num{
                            font-size: 15px;
                            font-family: PingFang SC;
                            font-weight: bold;
                            color: #458AFF;
                        }
                        .text_dec_num{
                            color: #FD2332;
                        }
                    }
                }
                .fir_item{
                    background-color: #F0F6FF;
                    .left_item_data{
                        .data_title{
                            margin-bottom: 18px;
                            font-size: 15px;
                            color: #666666;
                            font-weight: bold;
                        }
                        .data_num{
                            margin-bottom: 0;
                        }
                    }
                }
                .last_item{

                }
                .vip_item{
                    cursor: pointer;
                }
                .nozhubo{
                    // border-left: 1px solid #ECF3FE;
                }
            }
            .last_item{
                .item_item{
                    border-right-color: transparent;
                }
            }
            .vip_top_data_item{
                cursor: pointer;
            }
        }
    }
    .popover_box{
        .popover_data_box{
            display: flex;
            margin-bottom: 20px;
            .data_item{
                flex: 1;
            }
            .only_one{
                width: 100px;
                text-align: center;
            }
                .list_item_title{
                    text-align: center;
                    font-size: 13px;
                    font-family: PingFang SC;
                    font-weight: 500;
                    color: #999999;
                }
                .list_item_num{
                    text-align: center;
                    font-size: 18px;
                    font-family: PingFang SC;
                    font-weight: 500;
                    color: #498DFF;
                }
        }
        .popover_data_box:last-child{
            margin-bottom: 0;
        }
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

    /* table_box */
    .table_box>>>.el-table__fixed-right-patch {
        background-color: #F1F1F1 !important;
    }

    .table_box>>>.my-table-header th {
        background: #F1F1F1 !important;
    }

    // element select
    .table_select {
        margin-bottom: 34px;
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
