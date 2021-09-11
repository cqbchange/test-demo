/*
 * @Descripttion: 状态管理
 * @version: 1.0
 * @Author: WangChuan
 * @Date: 2021-01-15 16:52:43
 * @LastEditors: WangChuan
 * @LastEditTime: 2021-04-15 17:10:29
 */
import * as types from '../mutation-types'

const state = {
    // 上传图片地址
    uploadUrl: process.env.NODE_ENV === 'development' ? '/api/base/upload' : '/base/upload',
    // 日期控件配置默认参数
    pickerOptions: {
        shortcuts: [{
            text: '最近一周',
            onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                picker.$emit('pick', [parseInt(start), parseInt(end)]);
            }
        }, {
            text: '最近一个月',
            onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                picker.$emit('pick', [start, end]);
            }
        }, {
            text: '最近三个月',
            onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                picker.$emit('pick', [start, end]);
            }
        }]
    },
    // 小程序配置
    xcxList: [],
    // 菜单
    menuList: [],
    // 用户信息
    user: {
        permissions: []
    },
    // 面包屑导航
    breadCrumb: [],
    // 当前点击导航
    thisMenu: {
        name: '',
        top_btn_list: []
    },
    isfinanceTable:false,
}
const getters = {
    showDialog: state => state.showDialog
}

const actions = {
    triggerEvent({ state, commit }, evnt) {
        commit(types.SET_EVENT, evnt)
    }
}

const mutations = {
    [types.SET_EVENT](state, evnt) {
        state[evnt.type] = evnt.data
    },
    setMenuList(state, data) {
        state.menuList = data;
    },
    setXcxList(state, data) {
        state.xcxList = data;
    },
    setUser(state, data) {
        state.user = data;
    },
    setThisMenu(state, data) {
        state.thisMenu = data;
        localStorage.setItem('thisMenu', JSON.stringify(state.thisMenu))
    },
    setBreadCrumb(state, data) {
        state.breadCrumb = data;
        localStorage.setItem('breadCrumb', JSON.stringify(state.breadCrumb))
    },
    setIsfinanceTable(state, data){
        state.isfinanceTable = data
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}
