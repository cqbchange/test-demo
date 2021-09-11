import axios from 'axios'
import { Message } from 'element-ui'
import XEUtils from 'xe-utils'
import router from '@/router'
import { Loading } from 'element-ui'
let loading
let needLoadingRequestCount = 0
// 请求动画白名单
const aLoadingWhiteList = [
    '/Agent/getCpc',
    '/Agent/addUser',
    '/Agent/setMoney',
    '/Agent/getAgentUser',

    '/Agent/getAliName',
    '/Agent/getProfit',
    '/Agent/setAliName',
    '/Agent/setWithdrawal',
    '/Agent/getFinanceList',
    
    '/Agent/getBase',
    '/Agent/recharge'
  ];
axios.interceptors.request.use(config => {
    config.headers['x-requested-with'] = 'XMLHttpRequest'
    if (aLoadingWhiteList.indexOf(config.url) !== -1) {
        showFullScreenLoading()
    }
    return config
}, err => {
    return Promise.resolve(err)
})
axios.interceptors.response.use(data => {
    if (aLoadingWhiteList.indexOf(data.config.url) !== -1) {
        tryHideFullScreenLoading()
    }
    if (data.status && data.status === 200 && data.data.code !== 200) {
        if (data.data.code == -2000) {
            if (location.hash.indexOf('#/login')===-1) {
                router.replace({
                    path: '/login',
                    query: {
                        gopath: router.app.$route.fullPath
                    }
                },()=>{
                    location.reload();
                })
            }
            return data.data;
            // router.stop();
        }
        return data.data;
    }
    return data.data
}, err => {
    if (err.response === undefined) {
        return Promise.resolve(err)
    }
    if (err.response.status === 504 || err.response.status === 404) {
        Message.error({ message: '服务器被吃了⊙﹏⊙∥' })
    } else if (err.response.status === 403) {
        Message.error({ message: '权限不足,请联系管理员!' })
    } else {
        Message.error({ message: '未知错误!' })
    }
    return Promise.resolve(err)
})
let base = '';
// if (process.env.NODE_ENV == 'development') {
//     base = '/api';
// }


export const getRequest = (url, params, cancelToken= {}) => {
    // console.log(cancelToken,cancelToken.promise)
    if (cancelToken.promise == undefined) {
        return axios({
            method: 'get',
            url: `${base}${url}`,
            params: params,
        })  
    }else{
        return axios({
            method: 'get',
            url: `${base}${url}`,
            params: params,
            cancelToken:cancelToken,
        })
    }
    
}
export const postRequest = (url, params) => {
    return axios({
        method: 'post',
        url: `${base}${url}`,
        data: params,

        transformRequest: [function(data) {
            if(params.application_json){
                return JSON.stringify(data) 
            }else{
                let ret = ''
                for (let it in data) {
                    ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
                }
                return ret
            }
        }],
        headers: {
            'Content-Type': params.application_json?'application/json':'application/x-www-form-urlencoded'
        }
    })
}
export const uploadFileRequest = (url, params) => {
    var formData=new FormData();
    for(var key in params){
        if(key){
            formData.append(key,params[key])
        }
    }
    return axios({
        method: 'post',
        url: `${base}${url}`,
        data: formData,
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}
export const putRequest = (url, params) => {
    return axios({
        method: 'put',
        url: `${base}${url}`,
        data: params,
        transformRequest: [function(data) {
            let ret = ''
            for (let it in data) {
                ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
            }
            return ret
        }],
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
}
export const deleteRequest = (url) => {
    return axios({
        method: 'delete',
        url: `${base}${url}`
    })
}


export function showFullScreenLoading() {
  if (needLoadingRequestCount === 0) {
    startLoading()
  }
  needLoadingRequestCount++
}

export function tryHideFullScreenLoading() {
  if (needLoadingRequestCount <= 0) return
  needLoadingRequestCount--
  if (needLoadingRequestCount === 0) {
    endLoading()
  }
}


function startLoading() {
  loading = Loading.service({
    lock: true,
    background: 'rgba(0, 0, 0, 0.3)'
  })
}

function endLoading() {
  loading.close()
}