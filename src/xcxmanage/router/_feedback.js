/*
 * @Descripttion: 建议反馈路由
 * @version: 1.0
 * @Author: WangChuan
 * @Date: 2021-01-16 16:49:29
 * @LastEditors: WangChuan
 * @LastEditTime: 2021-01-16 16:56:00
 */
const _import = require('./_import.js')
export default [
    {
        path: '/feedbackList',
        name: 'feedbackList',
        component: _import('feedback/list'),
        hidden: false,
        meta: {
            title: '建议反馈',
            requiresAuth: true
        }
    }
]