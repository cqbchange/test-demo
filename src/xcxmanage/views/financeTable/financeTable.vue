<template>
    <div class="page_content" v-loading="dataload">
        <div class="pageContent_top">
            <div class="page_top">
                <div :class="'title_item '+(select == key ? 'selectItem':'')" v-for="(val,key,i) in topItems" :key="i"
                    @click="changeSelect(key)">
                    {{val}}
                </div>
            </div>
            <div class="select_time">
                <el-date-picker size="medium" style="width:300px;" v-model="datequantum" type="daterange"
                    format="yyyy-MM-dd" :clearable="false" value-format="timestamp" :editable="false"
                    range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"
                    :default-time="['00:00:00', '23:59:59']" :picker-options="pickerOptions2">>
                </el-date-picker>
                <!-- value-format="yyyy-MM-dd HH:mm:ss" -->
            </div>
        </div>

        <div class="tables_box" v-for="(item,index) in tables" :key="index">
            <div class="table_item">
                <div class="item_top">
                    <div class="table_title">
                        {{item.title}}
                    </div>
                    <div class="getData_btn" @click="uploadData({
                        downUrl:item.downUrl,
                        downtype:item.downtype
                    })">
                        导出表格
                    </div>
                </div>
                <fix-table element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" :data="item.tableData"
                    border size="small" style="width: 100%" header-row-class-name="my-table-header"
                    class="my-table finance-tab" empty-text=" ">
                    <el-table-column v-for="(item2,index2,i2) in item.tableColumn" :key="i2" prop="" :label="item2"
                        align="center" header-align="center" />
                </fix-table>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        name: 'financeTable',
        data() {
            return {
                select: 1,
                topItems: {
                    0: '销售失效',
                },
                tables: [],
                topready: false,
                tablesready: false,
                datequantum: [
                    // `${this.dateFormat('YYYY-mm-dd',new Date(new Date().getTime() - 86400000))} 00:00:00`,`${this.dateFormat('YYYY-mm-dd',new Date(new Date().getTime() - 86400000))} 23:59:59`
                    new Date(`${this.dateFormat('YYYY-mm-dd',new Date())} 00:00:00`).getTime(), new Date(
                        `${this.dateFormat('YYYY-mm-dd',new Date())} 23:59:59`).getTime()
                ], //时间段
                pickerOptions2: {
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
                    }],
                    disabledDate: (time) => {
                        //     return time.getTime() > new Date(`${this.dateFormat('YYYY-mm-dd',new Date())} 23:59:59`).getTime()-86400000;

                        // return time.getTime() < new Date(`${this.dateFormat('YYYY-mm',new Date())}-01 00:00:00`).getTime() || time.getTime() > new Date(`${this.dateFormat('YYYY-mm-dd',new Date())} 23:59:59`).getTime()
                        return time.getTime() > new Date(`${this.dateFormat('YYYY-mm-dd',new Date())} 23:59:59`)
                            .getTime()
                    },
                }, //时间段快捷选项
            }
        },
        created() {

        },
        mounted() {
            this.topready = false
            this.tablesready = false
            this.gettopdata()
            this.gettabledata()
        },
        watch: {
            datequantum: {
                handler: function (val) {
                    console.log(val)
                },
                immediate: true,
            },
        },
        computed: {
            dataload() {
                return !(this.topready == true && this.tablesready == true)
            }
        },
        components: {

        },
        methods: {
            changeSelect(index) {
                this.select = index
                this.tablesready = false
                this.gettabledata()
            },
            gettopdata() {
                // /DerivedForm/getTableName 
                this.getRequest('/DerivedForm/getTableName', {

                }).then((res) => {
                    this.topready = true
                    if (res.code == 200) {
                        this.topItems = res.data
                    } else {
                        this.$message.error(res.msg)
                    }
                }).catch((error) => {

                })
            },
            gettabledata() {
                this.getRequest('/DerivedForm/getDataStructure', {
                    type: this.select
                }).then((res) => {
                    this.tablesready = true
                    if (res.code == 200) {
                        res.data.tableList.forEach(element => {
                            let vv = [];
                            element.tableColumn.forEach(keys => {
                                vv[keys] = '';
                            });
                            element.tableData.push(vv)
                        });
                        this.tables = res.data.tableList
                    } else {
                        this.$message.error(res.msg)
                    }
                }).catch((error) => {

                })
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
            //下载数据
            uploadData(row) {
                // if (this.couldLink == false) {
                //     return;
                // }
                let url = row.downUrl;

                let arr = {
                    downtype: row.downtype,
                    type: this.select,
                    start: this.datequantum[0] / 1000,
                    end: this.datequantum[1] / 1000,
                };

                function filter(str) { // 特殊字符转义
                    str += ''; // 隐式转换
                    str = str.replace(/%/g, '%25');
                    str = str.replace(/\+/g, '%2B');
                    str = str.replace(/ /g, '%20');
                    str = str.replace(/\//g, '%2F');
                    str = str.replace(/\?/g, '%3F');
                    str = str.replace(/&/g, '%26');
                    str = str.replace(/\=/g, '%3D');
                    str = str.replace(/#/g, '%23');
                    return str;
                }

                function formateObjToParamStr(paramObj) {
                    const sdata = [];
                    for (let attr in paramObj) {
                        sdata.push(`${attr}=${filter(paramObj[attr])}`);
                    }
                    return sdata.join('&');
                };
                window.open(url + '?' + formateObjToParamStr(arr))
                // this.couldLink = false;
            },
        }
    }

</script>
<style>
    .finance-tab .el-table__row {
        height: 40px;
    }

</style>

<style scoped lang="scss">
    .page_content {
        min-height: 200px;
    }

    .pageContent_top {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: #FFF;
        padding: 0px 40px 0 40px;
        box-sizing: border-box;
        margin-top: 1px;
    }

    .page_top {
        display: flex;
        align-items: center;

        .title_item {
            font-size: 17px;
            font-family: PingFang SC;
            font-weight: 500;
            color: #333333;
            margin-right: 89px;
            padding: 20px 0 20px;
            cursor: pointer;
            position: relative;
        }

        .selectItem {
            color: #468BFF;
        }

        .selectItem::after {
            content: '';
            display: block;
            position: absolute;
            width: 66px;
            height: 8px;
            background-image: url(~@img/task/selected.png);
            background-repeat: no-repeat;
            background-size: 100%;
            bottom: 0;
            left: 50%;
            margin-left: -33px;
        }
    }

    .tables_box {
        box-sizing: border-box;
        padding: 0 20px;
        margin-top: 20px;

        .table_item {
            background: #fff;
            padding: 30px 20px;
            border-radius: 16px;

            .item_top {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 24px;

                .table_title {
                    font-size: 17px;
                    font-family: PingFang SC;
                    font-weight: 500;
                    color: #333333;
                    padding: 0 0 0 14px;
                    position: relative;
                }

                .table_title::before {
                    content: '';
                    display: block;
                    position: absolute;
                    width: 3px;
                    height: 18px;
                    background: #488CFF;
                    left: 0;
                    top: 3px;
                }

                .getData_btn {
                    width: 106px;
                    height: 38px;
                    background: linear-gradient(90deg, #73A7FF, #448AFF);
                    border-radius: 5px;
                    font-size: 13px;
                    font-family: PingFang SC;
                    font-weight: 500;
                    color: #FFFFFF;
                    line-height: 38px;
                    text-align: center;
                    cursor: pointer;
                }
            }
        }

        .table_item>>>.el-table__fixed-right-patch {
            background-color: #EFF5FF !important;
        }
    }

</style>
