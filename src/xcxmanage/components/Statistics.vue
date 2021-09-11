<!--
 * @Descripttion: 
 * @version: 1.0
 * @Author: WangChuan
 * @Date: 2021-01-25 15:15:56
 * @LastEditors: WangChuan
 * @LastEditTime: 2021-08-06 15:14:02
-->
<template>
    <el-dialog :visible.sync="thisShow" :title="TipsTitle" custom-class="my-dialog" :width="TipsWidth"
        :append-to-body="true" :close-on-press-escape="false" @close="closeDialog">

        <div style="display: flex;justify-content: space-between;align-items: center;">
            <div></div>
            <div>
                <template v-for="(item,key) in dataForm.timeData">
                    <el-button :key="key" @click="setType(item.data)" size="mini">{{item.title}}</el-button>
                </template>
            </div>
        </div>
        <div :style="{width: '100%', height: '300px'}" element-loading-spinner="el-icon-loading"
            element-loading-text="拼命加载中" id="myChart" v-loading="reportloading"></div>
    </el-dialog>
</template>

<script>
    import echarts from 'echarts'
    export default {
        name: 'statistics',
        props: {
            value: Boolean,

            TipsTitle: {
                type: String,
                default: '广告统计'
            },
            TipsWidth: {
                type: String,
                default: '800px'
            },
            dataForm: {
                type: Object,
                default: {
                    // ID
                    id: '',
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
                        title: "近3时",
                        data: 15
                    }, {
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
                }
            }
        },
        data() {
            return {
                thisShow: false,
                reportloading: true,
                type: this.dataForm.timeData[0].data,
            }
        },
        methods: {
            closeDialog() {
                this.$emit("closeDialog", false)
            },
            setType(type) {
                this.reportloading = true
                this.type = type
                this.initCharts()
            },
            initCharts() {
                let options = this.dataForm.options;
                this.postRequest(this.dataForm.postUrl, {
                    id: this.dataForm.id,
                    type: this.type
                }).then(resp => {
                    this.reportloading = false
                    if (resp && resp.code === 200) {
                        options.xAxis.data = resp.data.xAxis
                        options.series.forEach((item, index) => {
                            item.data = resp.data['series' + (index + 1)]
                        });
                        setTimeout(() => {
                            let myChart = echarts.init(document.getElementById('myChart'))
                            myChart.setOption(options)
                        }, 500)
                    }
                })
            }
        },
        watch: {
            value(e) {
                this.thisShow = e;
                if (e) {
                    this.initCharts()
                } else {
                    this.reportloading = true
                    this.type = this.dataForm.timeData[0].data
                }
            }
        }
    }

</script>
<style scoped>

</style>
