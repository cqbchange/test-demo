import XEUtils from 'xe-utils'
import md5 from 'js-md5'
const utils = {
  getMetaTitle (route,title = '优选VIP管理后台') {
    if (route.meta && route.meta.title) {
      title += '-' + (XEUtils.isFunction(route.meta.title) ? route.meta.title(route) : route.meta.title)
    }
    return title
  },
  getHeaders (contentType) {
    const headers = {
      'Content-Type': contentType,
      'appid': 'youadmin',
      'nonce': XEUtils.now(),
      'timestamp': XEUtils.toInteger(XEUtils.now() / 1000),
      'sign': ''
    }
    const sign = md5('appid=' + headers.appid + '&nonce=' + headers.nonce + '&timestamp=' + headers.timestamp + '&key=youadmin_cuzhekeji')
    headers.sign = sign
    return headers
  },
  formatDate (value) {
    let date = new Date(value)
    let y = date.getFullYear()
    let MM = date.getMonth() + 1
    MM = MM < 10 ? ('0' + MM) : MM
    let d = date.getDate()
    d = d < 10 ? ('0' + d) : d
    let h = date.getHours()
    h = h < 10 ? ('0' + h) : h
    let m = date.getMinutes()
    m = m < 10 ? ('0' + m) : m
    let s = date.getSeconds()
    s = s < 10 ? ('0' + s) : s
    return y + '-' + MM + '-' + d + ' ' + h + ':' + m + ':' + s
  }
}

export default utils
