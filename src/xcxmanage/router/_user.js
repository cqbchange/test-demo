/*
 * @Descripttion: 用户管理路由
 * @version: 1.0
 * @Author: WangChuan
 * @Date: 2021-01-16 16:18:52
 * @LastEditors: WangChuan
 * @LastEditTime: 2021-01-30 16:06:19
 */
const _import = require('./_import.js')

export default [
    {
        path: '/userFtList',
        name: 'userFtList',
        component: _import('user/ftList'),
        hidden: false,
        meta: {
            title: '纷推用户',
            requiresAuth: true
        }
    }, {
        path: '/userAdzone',
        name: 'userAdzone',
        component: _import('user/adzone'),
        hidden: false,
        meta: {
            title: '渠道管理',
            requiresAuth: true
        }
    }, {
        path: '/userSale',
        name: 'userSale',
        component: _import('user/sale'),
        hidden: false,
        meta: {
            title: '销售管理',
            requiresAuth: true
        }
    }, {
        path: '/userMechanism',
        name: 'userMechanism',
        component: _import('user/mechanism'),
        hidden: false,
        meta: {
            title: '机构管理',
            requiresAuth: true
        }
    }, {
        path: '/userMechanismDetail',
        name: 'userMechanismDetail',
        component: _import('user/mechanismDetail'),
        hidden: false,
        meta: {
            title: '机构明细',
            requiresAuth: true
        }
    },  {
        path: '/userAppletUser',
        name: 'userAppletUser',
        component: _import('user/appletUser'),
        hidden: false,
        meta: {
            title: '小程序用户',
            requiresAuth: true
        }
    },  {
        path: '/userFtAdzone',
        name: 'userFtAdzone',
        component: _import('user/ftAdzone'),
        hidden: false,
        meta: {
            title: '纷推渠道',
            requiresAuth: true
        }
    },  {
        path: '/userRight',
        name: 'userRight',
        component: _import('user/userRight'),
        hidden: false,
        meta: {
            title: '账户权限管理',
            requiresAuth: true
        }
    }
]