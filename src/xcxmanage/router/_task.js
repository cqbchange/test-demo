/*
 * @Descripttion: 任务管理路由
 * @version: 1.0
 * @Author: WangChuan
 * @Date: 2021-01-16 16:07:36
 * @LastEditors: WangChuan
 * @LastEditTime: 2021-01-19 15:55:46
 */
const _import = require('./_import.js')
export default [
    {
        path: '/taskType',
        name: 'taskType',
        component: _import('task/type'),
        hidden: false,
        meta: {
            title: '任务位管理',
            requiresAuth: true
        }
    }, {
        path: '/taskList/:class_id?',
        name: 'taskList',
        component: _import('task/list'),
        hidden: false,
        meta: {
            title: '任务管理',
            requiresAuth: true
        }
    }, {
        path: '/taskFtList',
        name: 'taskFtList',
        component: _import('task/ftList'),
        hidden: false,
        meta: {
            title: '纷推投放管理',
            requiresAuth: true
        }
    }, {
        path: '/taskLiveBlackList',
        name: 'taskLiveBlackList',
        component: _import('task/liveBlackList'),
        hidden: false,
        meta: {
            title: '主播黑名单',
            requiresAuth: true
        }
    }, {
        path: '/anchorLimit',
        name: 'anchorLimit',
        component: _import('task/anchorLimit'),
        hidden: false,
        meta: {
            title: '限制主播',
            requiresAuth: true
        }
    }
]