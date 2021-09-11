/*
 * @Descripttion: 广告管理路由
 * @version: 1.0
 * @Author: WangChuan
 * @Date: 2021-01-16 16:14:55
 * @LastEditors: WangChuan
 * @LastEditTime: 2021-01-16 17:06:47
 */
const _import = require('./_import.js')
export default [
    {
        path: '/adType',
        name: 'adType',
        component: _import('ad/type'),
        hidden: false,
        meta: {
            title: '广告位管理',
            requiresAuth: true
        }
    }, {
        path: '/adList/:class_id?',
        name: 'adList',
        component: _import('ad/list'),
        hidden: false,
        meta: {
            title: '广告管理',
            requiresAuth: true
        }
    }
]