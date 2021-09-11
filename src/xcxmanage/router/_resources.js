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
        path: '/resourcesFtTaskImg',
        name: 'resourcesFtTaskImg',
        component: _import('resources/ftTaskImg'),
        hidden: false,
        meta: {
            title: '纷推广告图',
            requiresAuth: true
        }
    },
    {
        path: '/resourcesWool',
        name: 'resourcesWool',
        component: _import('resources/wool'),
        hidden: false,
        meta: {
            title: '羊毛直通车',
            requiresAuth: true
        }
    }

    
]