/*
 * @Descripttion: 推送管理路由
 * @version: 1.0
 * @Author: WangChuan
 * @Date: 2021-01-16 16:24:41
 * @LastEditors: WangChuan
 * @LastEditTime: 2021-03-06 14:41:02
 */
const _import = require('./_import.js')
export default [
    {
        path: '/pushLifeNum',
        name: 'pushLifeNum',
        component: _import('push/lifeNum'),
        hidden: false,
        meta: {
            title: '生活号推送',
            requiresAuth: true
        }
    }, {
        path: '/pushXcx',
        name: 'pushXcx',
        component: _import('push/xcx'),
        hidden: false,
        meta: {
            title: '小程序推送',
            requiresAuth: true
        }
    }, {
        path: '/pushSubscribe',
        name: 'pushSubscribe',
        component: _import('push/subscribe'),
        hidden: false,
        meta: {
            title: '订阅推送',
            requiresAuth: true
        }
    }, {
        path: '/pushLuckDraw',
        name: 'pushLuckDraw',
        component: _import('push/luckDraw'),
        hidden: false,
        meta: {
            title: '抽个奖推送',
            requiresAuth: true
        }
    }, {
        path: '/pushXcxLog',
        name: 'pushXcxLog',
        component: _import('push/xcxLog'),
        hidden: false,
        meta: {
            title: '小程序推送日志',
            requiresAuth: true
        }
    }
]