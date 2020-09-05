// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import axios from 'axios' // 导入axios
import service from './service'
import 'font-awesome/css/font-awesome.min.css'
import echarts from 'echarts'

Vue.config.productionTip = false
Vue.use(ElementUI)
// Vue.prototype.axios = axios // axios挂载到原型上
Vue.prototype.service = service // axios挂载到原型上
Vue.prototype.$echarts = echarts // echarts挂载到原型上

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
