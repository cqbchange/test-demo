/*
 * @Descripttion: 
 * @version: 1.0
 * @Author: WangChuan
 * @Date: 2021-01-15 16:52:43
 * @LastEditors: WangChuan
 * @LastEditTime: 2021-01-30 16:16:39
 */
import Vue from 'vue'
import XEUtils from 'xe-utils'
import VXEUtils from 'vxe-utils'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/style/base.css'
import './assets/iconfont/iconfont.css'

import utils from '@/common/utils'
import FixTable from '../comm/components/FixTable'
import router from '@/router'
import store from './store'
import App from '@/App'
import echarts from 'echarts'



import { getRequest, postRequest, uploadFileRequest } from '../comm/script/utils/api'

Vue.prototype.getRequest = getRequest
Vue.prototype.postRequest = postRequest
Vue.prototype.uploadFileRequest = uploadFileRequest
Vue.prototype.$echarts = echarts

// Plugins
Vue.use(ElementUI)
Vue.component('FixTable', FixTable)
Vue.use(VXEUtils, XEUtils, { mounts: ['cookie'] })
// Config
XEUtils.mixin(utils)

String.prototype.myReplace=function(f,e){//把f替换成e
    let reg=new RegExp(f,"g"); //创建正则RegExp对象   
    return this.replace(reg,e); 
}
Vue.config.productionTip = false
// Router
router.beforeEach((to, from, next) => {
    document.title = XEUtils.getMetaTitle(to, '小程序后台')
    if (to.path == '/login') {
        store.commit("setIsfinanceTable", false);
        next()
    } else {
        store.state.base.menuList.findIndex((item, keys) => {
            if (item.children.length > 0) {
                let ret = item.children.find((item1) => {
                    if (item1.route == to.path) {
                        store.commit("setThisMenu", item1);
                        return 0;
                    }
                });
            } else if (item.route == to.path) {
                store.commit("setThisMenu", item);
                return 0;
            }
        });
        if (to.meta.requiresAuth && !sessionStorage.getItem('accessToken')) {
            store.commit("setIsfinanceTable", false);
            next({path: '/login'})
        }
    }
    if(to.path == '/financeTable'){
        store.commit("setIsfinanceTable", true);
    }else{
        store.commit("setIsfinanceTable", false);
    }
    next()
})
/* eslint-disable no-new */
// 获取菜单
getRequest('/home/getMenu?type=xcxadmin').then((data) => {
    if (data.code === 200) {
        store.commit('setMenuList', data.data);
        getRequest('/home/getUser').then((data) => {
            if (data.code === 200) {
                store.commit('setUser', data.data);
            }
        })
    }
})
// 获取小程序配置
getRequest('/XcxTask/getMiniList').then((data) => {
    if (data.code === 200) {
        store.commit('setXcxList', data.data);
    }
})

new Vue({
    el: '#app',
    router,
    store,
    XEUtils,
    template: '<App/>',
    components: { App }
})