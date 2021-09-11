/*
 * @Descripttion: 活动管理路由
 * @version: 1.0
 * @Author: WangChuan
 * @Date: 2021-01-16 16:27:43
 * @LastEditors: WangChuan
 * @LastEditTime: 2021-01-16 17:06:56
 */
const _import = require('./_import.js')
export default [
    {
        path: '/activityGift',
        name: 'activityGift',
        component: _import('activity/gift'),
        hidden: false,
        meta: {
            title: '积分商城',
            requiresAuth: true
        }
    },{
        path: '/activityGiftOrder',
        name: 'activityGiftOrder',
        component: _import('activity/giftOrder'),
        hidden: false,
        meta: {
            title: '订单列表',
            requiresAuth: true
        }
    }, {
        path: '/activityTtdb',
        name: 'activityTtdb',
        component: _import('activity/ttdb'),
        hidden: false,
        meta: {
            title: '天天夺宝',
            requiresAuth: true
        }
    }, {
        path: '/activityRedTurntable',
        name: 'activityRedTurntable',
        component: _import('activity/redTurntable'),
        hidden: false,
        meta: {
            title: '红包转盘',
            requiresAuth: true
        }
    }, {
        path: '/activityEnroll',
        name: 'activityEnroll',
        component: _import('activity/enroll'),
        hidden: false,
        meta: {
            title: '商家报名',
            requiresAuth: true
        }
    }, {
        path: '/activityRedSeckill',
        name: 'activityRedSeckill',
        component: _import('activity/redSeckill'),
        hidden: false,
        meta: {
            title: '红包秒杀',
            requiresAuth: true
        }
    }, {
        path: '/activityLuckDraw',
        name: 'activityLuckDraw',
        component: _import('activity/luckDraw'),
        hidden: false,
        meta: {
            title: '抽个奖',
            requiresAuth: true
        }
    }, {
        path: '/activityMoneyPrize',
        name: 'activityMoneyPrize',
        component: _import('activity/moneyPrize'),
        hidden: false,
        meta: {
            title: '现金抽奖',
            requiresAuth: true
        }
    },{
        path: '/activityDirecDeal',
        name: 'activitydirecDeal',
        component: _import('activity/direcDeal'),
        hidden: false,
        meta: {
            title: '厂家直销',
            requiresAuth: true
        }
    },{
        path: '/activityManorGifts',
        name: 'activityManorGifts',
        component: _import('activity/manorGifts'),
        hidden: false,
        meta: {
            title: '兑好换',
            requiresAuth: true
        }
    },{
        path: '/activityExchangeOrder',
        name: 'activityExchangeOrder',
        component: _import('activity/exchangeOrder'),
        hidden: false,
        meta: {
            title: '',
            requiresAuth: true
        }
    },
    
]