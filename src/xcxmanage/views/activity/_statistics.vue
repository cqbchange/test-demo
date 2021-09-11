<template>
  <el-dialog :before-close="closeDialog" :visible.sync="value" title="广告点击统计" width="800px"  custom-class="my-dialog" :append-to-body="true" :close-on-press-escape="false">
    <div style="display: flex;justify-content: space-between;align-items: center;">
      <div></div>
      <div>
        <el-button @click="setType(1)" size="mini">近7天</el-button>
        <el-button @click="setType(2)" size="mini">近30天</el-button>
        <!--                <el-button size="mini" @click="setType(3)">近一年</el-button>-->
      </div>
    </div>
    <div
      :style="{width: '100%', height: '300px'}"
      element-loading-spinner="el-icon-loading"
      element-loading-text="拼命加载中"
      id="myChart"
      v-loading="reportloading"
    ></div>
  </el-dialog>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import echarts from 'echarts'

// eslint-disable-next-line no-unused-vars
export default {
  name: 'statistics',
  props: {
    value: Boolean,
    dataForm: {
      // eslint-disable-next-line vue/require-valid-default-prop
      default: {},
      type: Object
    }
  },
  data () {
    return {
      reportloading: true,
      type: 1
    }
  },
  methods: {
    setType (type) {
      this.reportloading = true
      this.type = type
      this.initCharts()
    },
    closeDialog () {
      this.$emit('input', false)
    },
    initCharts () {
      let options = {
        legend: {
          data: ['广告UV', '广告PV', '参与人数', '参与次数']
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
        }, {
          data: [1],
          name: '参与人数',
          areaStyle: {},
          type: 'line',
          smooth: true
        }, {
          data: [1],
          name: '参与次数',
          areaStyle: {},
          type: 'line',
          smooth: true
        }]
      }
      this.postRequest('/XcxCapture/statistics', {
        id: this.dataForm.id,
        type: this.type
      }).then(resp => {
        this.reportloading = false
        if (resp && resp.code === 200) {
          options.xAxis.data = resp.data.xAxis
          options.series[0].data = resp.data.series1
          options.series[1].data = resp.data.series2
          options.series[2].data = resp.data.series3
          options.series[3].data = resp.data.series4
          setTimeout(() => {
            let myChart = echarts.init(document.getElementById('myChart'))
            myChart.setOption(options)
          }, 500)
        }
      })
    }
  },
  watch: {
    value (e) {
      if (e) {
        this.initCharts()
      } else {
        this.reportloading = true
        this.type = 1
      }
    }
  }
}
</script>

<style scoped>

</style>