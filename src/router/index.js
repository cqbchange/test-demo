import Vue from 'vue'
import Router from 'vue-router'
// import NotFound from '@/components/NotFound'
// import Login from '@/components/Login'
// import Home from '@/components/Home'
// import StudentList from '@/components/students/StudentList'
// import WorkList from '@/components/students/WorkList'
// import DataOverView from '@/components/dataAnalysis/DataOverView'
// import MapData from '@/components/dataAnalysis/MapData'
// import TwoMap from '@/components/dataAnalysis/TwoMap'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/login',
      hidden: true
    },
    {
      path: '/login',
      name: 'Login',
      components: require('@/components/Login.vue'),
      hidden: true
    },
    {
      path: '/home',
      name: '学生管理',
      components: require('@/components/Home.vue'),
      iconClass: 'fa fa-users',
      children: [
        {
          path: '/home/student',
          name: '学生列表',
          iconClass: 'fa fa-list-alt',
          components: require('@/components/students/StudentList.vue')
        },
        {
          path: '/home/work',
          name: '作业列表',
          iconClass: 'fa fa-list',
          components: require('@/components/students/WorkList.vue')
        }
      ]
    },
    {
      path: '/home',
      name: '数据分析',
      components: require('@/components/Home.vue'),
      iconClass: 'fa fa-list-alt',
      children: [
        {
          path: '/home/dataview',
          name: '数据概览',
          components: require('@/components/dataAnalysis/DataOverView.vue'),
          iconClass: 'fa fa-bar-chart'
        },
        {
          path: '/home/mapdata',
          name: '地图概览',
          components: require('@/components/dataAnalysis/MapData.vue'),
          iconClass: 'fa fa-map-o'
        },
        {
          path: '/home/twomap',
          name: '出差地址',
          components: require('@/components/dataAnalysis/TwoMap.vue'),
          iconClass: 'fa fa-map-pin'
        }
      ]
    },
    {
      path: '*',
      name: 'NotFound',
      components: require('@/components/NotFound.vue'),
      hidden: true
    }
  ],
  mode: 'history'
})
