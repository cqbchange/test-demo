<template>
  <div class="data-over-view">
    <el-card>
      <div id="main1"></div>
    </el-card>
    <el-card>
      <div id="main2"></div>
    </el-card>
  </div>
</template>
<script>
export default {
  data () {
    return {

    }
  },
  mounted () {
    // 基于准备好的dom，初始化echarts实例
    var myChart1 = this.$echarts.init(document.getElementById('main1'))
    // 绘制图表
    myChart1.setOption({
      title: {
        text: '九期框架班'
      },
      tooltip: {},
      xAxis: {
        data: ['语文', '数学', '英语', '化学', '物理', '生物']
      },
      yAxis: {},
      series: [{
        name: '销量',
        type: 'bar',
        data: [95, 90, 80, 50, 50, 60]
      }]
    })
    var myChart2 = this.$echarts.init(document.getElementById('main2'))
    myChart2.setOption({
      color: ['#157ef5'],
      title: {
        text: '九期框架'
      },
      textStyle: {
        color: '#828282'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {
        data: ['2011年']
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'value',
        boundaryGap: [0, 0.01],
        min: 0,
        max: 100,
        interval: 25,
        axisTick: {
          show: false
        },
        axisLine: {
          lineStyle: {
            color: 'transparent'
          }
        }
      },
      yAxis: {
        type: 'category',
        data: ['框架一班', '框架二班', '框架四班', '框架六班', '框架七班', '框架九班'],
        axisTick: {
          show: false
        },
        axisLine: {
          lineStyle: {
            color: '#e0e0e0'
          }
        },
        textStyle: {
          color: '#000'
        }
      },
      series: [
        {
          name: '2011年',
          type: 'bar',
          data: [65, 32, 55, 66, 74, 63],
          barWidth: '22px',
          itemStyle: {
            normal: {
              barBorderRadius: [0, 10, 10, 0]
            }
          }
        }
      ]
    })
  }
}
</script>
<style scoped lang="scss">
.data-over-view {
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 20px 0;
  .el-card {
    width: 50%;
    #main1, #main2 {
      height: 500px;
      padding: 20px;
    }
  }
}
</style>
