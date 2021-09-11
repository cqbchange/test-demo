<!--
 * @Descripttion: 统计表格
 * @version: 1.0
 * @Author: LiXinRui
 * @Date: 2021-06-19 11:39:43
 * @LastEditors: LiXinRui
 * @LastEditTime: 2021-06-19 11:39:43
-->
<template>
    <div>
        
        <el-form :inline="true" v-model="dataForm" ref="dataForm" class="form-inline-box">
            <div class="el-form-item-left">
                <el-form-item>
                </el-form-item>
            </div>
            <div class="el-form-item-right">
                <el-form-item style="width:180px;">
                   <el-select v-model="dataForm.table" filterable placeholder="时间类型类型" size="medium">
                        <el-option v-for="(item,index) in typeList" :value="item.value" :label="item.name" :key="index" />
                    </el-select>
                </el-form-item>
                <el-form-item style="width:300px;">
                    <el-date-picker size="medium"  v-model="times"
                        value-format="timestamp" type="daterange" range-separator="至" start-placeholder="开始日期" :clearable='false'
                        end-placeholder="结束日期" style="width:100%" :default-time="['00:00:00', '23:59:59']" :picker-options="pickerOptions" 
                        />
                </el-form-item>
            </div>
        </el-form>

        <fix-table ref="table" border v-loading="loading" element-loading-spinner="el-icon-loading"
            element-loading-text="拼命加载中" :data="tableData" key="list" height="73.7vh" size="medium"
            header-row-class-name="my-table-header" class="my-table">
            <el-table-column prop="bucket" label="时间" align="center" />
            <el-table-column prop="jifenbaoImpressions" label="集分宝展示量" align="center" />
            <el-table-column prop="jifenbaoCompleted" label="集分宝完成量" align="center" />
            <el-table-column prop="pointImpressions" label="金币展示量" align="center" />
            <el-table-column prop="pointsCompleted" label="金币完成量" align="center" />
            <el-table-column prop="thirdPartyImpressions" label="第三方展示量" align="center" />
            <el-table-column prop="thirdPartyCompleted" label="第三方完成量" align="center" />
        </fix-table>

    </div>
</template>
<script>
    export default {
        name: "userAppletUser",
        data() {
            return {
                // 表格load状态
                loading: false,
                // form数据
                totalNum: 0,//总数
                dataForm: {
                    startTime:'',//开始时间
                    endTime:'',//结束时间
                    table:'day',//类型
                },
                // Table数据
                tableData: [],
                typeList:[
                    {
                        name:'天',
                        value:'day'
                    },
                    {
                        name:'小时',
                        value:'hour'
                    },
                    {
                        name:'分钟',
                        value:'minute'
                    },
                ],//类型列表
                showDialog: false,
                user_id:'',//添加白名单ID
                times:[
                    new Date(`${this.dateFormat('YYYY-mm-dd',new Date())} 00:00:00`).getTime() - 86400000,new Date(`${this.dateFormat('YYYY-mm-dd',new Date())} 23:59:59`).getTime()
                ],
                //时间默认在一月以内
                pickerOptions: {
                    onPick: ({maxDate, minDate}) => {
                        this.selectDate= minDate.getTime();
                        if (maxDate) {
                        this.selectDate= ''
                        }
                    }, disabledDate: (time) => {
                        if (this.selectDate!== '') {
                        const one = 30 * 24 * 3600 * 1000;
                        const minTime = this.selectDate- one;
                        const maxTime = this.selectDate+ one;
                        return time.getTime() < minTime || time.getTime() > maxTime
                        }
                    }
                }
            };
        },
        methods: {
             //时间处理important
            dateFormat (fmt, date) {
                let ret
                const opt = {
                    'Y+': date.getFullYear().toString(),        // 年
                    'm+': (date.getMonth() + 1).toString(),     // 月
                    'd+': date.getDate().toString(),            // 日
                    'H+': date.getHours().toString(),           // 时
                    'M+': date.getMinutes().toString(),         // 分
                    'S+': date.getSeconds().toString()          // 秒
                    // 有其他格式化字符需求可以继续添加，必须转化成字符串
                }
                for (let k in opt) {
                    ret = new RegExp('(' + k + ')').exec(fmt)
                    if (ret) {
                        fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, '0')))
                    }
                }

                return fmt
            },
            // 获取Table数据
            loadData() {
                this.loading = true;
                this.dataForm.startTime = this.times[0]/1000;
                this.dataForm.endTime = this.times[1]/1000;  
                this.getRequest("TaskStatistics/getData", this.dataForm).then(resp => {
                    this.loading = false;
                    console.log(resp)
                    if (resp && resp.code === 200) {
                        this.tableData = resp.data
                    }
                });
            },
        },
        watch:{
            "dataForm.table": {
                handler(val, old) {
                    this.tableData = []
                    this.loadData();
                }
            },
            times:{
                handler(val){
                    if(val){
                        this.tableData = []
                        this.loadData()
                    }else{
                        this.tableData = []
                        this.loadData()
                    }
                }
            }
        },
        computed: {

        },
        created() {
            this.loadData();
        },
        
    }

</script>

<style lang='scss' scoped>
div >>> .el-form-item:last-child{
    transform: translateY(2px);
}
div >>> .el-dialog__body{
    padding: 40px 17px 10px;
}
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
