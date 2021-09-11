/*
 * @Descripttion: 统计路由
 * @version: 1.0
 * @Author: WangChuan
 * @Date: 2021-01-16 16:39:49
 * @LastEditors: WangChuan
 * @LastEditTime: 2021-08-16 17:20:54
 */
const _import = require('./_import.js')
export default [
    {
        path: '/logXcxPush',
        name: 'logXcxPush',
        component: _import('log/xcxPush'),
        hidden: false,
        meta: {
            title: '小程序推送统计',
            requiresAuth: true
        }
    },{
        path: '/logSubscribePush',
        name: 'logSubscribePush',
        component: _import('log/subscribePush'),
        hidden: false,
        meta: {
            title: '订阅推送统计',
            requiresAuth: true
        }
    },{
        path: '/logXcx',
        name: 'logXcx',
        component: _import('log/xcx'),
        hidden: false,
        meta: {
            title: '小程序统计',
            requiresAuth: true
        }
    },{
        path: '/logFt',
        name: 'logFt',
        component: _import('log/ft'),
        hidden: false,
        meta: {
            title: '纷推统计',
            requiresAuth: true
        }
    },{
        path: '/logSale',
        name: 'logSale',
        component: _import('log/sale'),
        hidden: false,
        meta: {
            title: '销售统计',
            requiresAuth: true
        }
    },{
        path: '/logSaleTest',
        name: 'logSaleTest',
        component: _import('log/sale_test'),
        hidden: false,
        meta: {
            title: '测试统计',
            requiresAuth: true
        }
    },{
        path: '/salemary',
        name: 'salemary',
        component: _import('log/salemary'),
        hidden: false,
        meta: {
            title: '更新实销',
            requiresAuth: true
        }
    },{
        path: '/logFtAdzone',
        name: 'logFtAdzone',
        component: _import('log/ftAdzone'),
        hidden: false,
        meta: {
            title: '纷推渠道统计',
            requiresAuth: true
        }
    },{
        path: '/newTable',
        name: 'newTable',
        component: _import('log/newTable'),
        hidden: false,
        meta: {
            title: '统计表格',
            requiresAuth: true
        }
    },{
        path: '/double',
        name: 'double',
        component: _import('log/double'),
        hidden: false,
        meta: {
            title: '翻倍卡统计',
            requiresAuth: true
        }
    },{
        path: '/gameLog',
        name: 'gameLog',
        component: _import('log/game'),
        hidden: false,
        meta: {
            title: '互动类统计',
            requiresAuth: true
        }
    }
    
]