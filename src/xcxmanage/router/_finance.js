/*
 * @Descripttion: 财务信息路由
 * @version: 1.0
 * @Author: WangChuan
 * @Date: 2021-01-16 16:43:55
 * @LastEditors: WangChuan
 * @LastEditTime: 2021-04-23 09:35:58
 */
const _import = require('./_import.js')
export default [
    {
        path: '/financeWithdrawal',
        name: 'financeWithdrawal',
        component: _import('finance/withdrawal'),
        hidden: false,
        meta: {
            title: '代理提现',
            requiresAuth: true
        }
    }, {
        path: '/financeSummary',
        name: 'financeSummary',
        component: _import('finance/summary'),
        hidden: false,
        meta: {
            title: '财务汇总',
            requiresAuth: true
        }
    }, {
        path: '/financeFtFlow/:user_id?',
        name: 'financeFtFlow',
        component: _import('finance/flow'),
        hidden: false,
        meta: {
            title: '纷推资金明细',
            requiresAuth: true
        }
    },{
        path: '/financeAppletMoney',
        name: 'financeAppletMoney',
        component: _import('finance/appletMoney'),
        hidden: false,
        meta: {
            title: '小程序资金',
            requiresAuth: true
        }
    },{
        path: '/activityFundSummary',
        name: 'activityFundSummary',
        component: _import('finance/activityFundSummary'),
        hidden: false,
        meta: {
            title: '活动资金汇总',
            requiresAuth: true
        }
    },{
        path: '/chEarning',
        name: 'chEarning',
        component: _import('finance/chEarning'),
        hidden: false,
        meta: {
            title: '渠道结算',
            requiresAuth: true
        }
    },{
        path: '/settlement',
        name: 'settlement',
        component: _import('finance/settlement'),
        hidden: false,
        meta: {
            title: '纷推渠道结算',
            requiresAuth: true
        }
    }
]