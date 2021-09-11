/*
 * @Descripttion: 路由配置
 * @version: 1.0
 * @Author: WangChuan
 * @Date: 2021-01-15 16:52:43
 * @LastEditors: WangChuan
 * @LastEditTime: 2021-02-04 13:47:12
 */
import Vue from 'vue'
import Router from 'vue-router'
import _activity from './_activity.js'
import _ad from './_ad.js'
import _feedback from './_feedback.js'
import _finance from './_finance.js'
import _log from './_log.js'
import _push from './_push.js'
import _resources from './_resources.js'
import _task from './_task.js'
import _user from './_user.js'
import _financeTable from './_financeTable.js'


const _import = require('./_import.js');
Vue.use(Router);
export default new Router({
    mode: 'hash',
    routes: [
        {
            path: '*',
            redirect: '/'
        },
        {
            path: '/login',
            name: 'login',
            component: _import('login/index'),
            hidden: true,
            meta: {
                title: '登录'
            }
        },
        {
            path: '/logout',
            name: 'logout',
            component: _import('login/logout'),
            hidden: true,
            meta: {
                title: '退出登录'
            }
        },
        {
            path: '/',
            component: _import('index/index'),
            hidden: false,
            meta: {
                title: '首页',
                requiresAuth: true
            },
            children: [
                {
                    path: '/',
                    name: 'main',
                    component: _import('index/main'),
                    hidden: false,
                    meta: {
                        title: '首页',
                        requiresAuth: true
                    }
                },{
                    path: '/code',
                    name: 'code',
                    component: _import('index/code'),
                    hidden: false,
                    meta: {
                        title: '测试',
                        requiresAuth: true
                    }
                }, {
                    path: '/cs',
                    name: 'cs',
                    component: _import('index/cs'),
                    hidden: false,
                    meta: {
                        title: '测试',
                        requiresAuth: true
                    }
                },
                ..._activity,
                ..._ad,
                ..._feedback,
                ..._finance,
                ..._log,
                ..._push,
                ..._resources,
                ..._task,
                ..._user,
                ..._financeTable,
            ]
        }
    ]
})
