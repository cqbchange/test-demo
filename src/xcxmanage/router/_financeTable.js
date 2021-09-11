/*
 * @Descripttion: 资源管理路由
 * @version: 1.0
 * @Author: WangChuan
 * @Date: 2021-01-16 16:48:18
 * @LastEditors: WangChuan
 * @LastEditTime: 2021-03-26 10:27:30
 */
const _import = require('./_import.js')
export default [
    {
        path: '/financeTable',
        name: 'financeTable',
        component: _import('financeTable/financeTable'),
        hidden: false,
        meta: {
            title: '财务表格',
            requiresAuth: true
        }
    },
]