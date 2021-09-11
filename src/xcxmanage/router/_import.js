/*
 * @Descripttion: 引入文件
 * @version: 1.0
 * @Author: WangChuan
 * @Date: 2021-01-15 16:52:43
 * @LastEditors: WangChuan
 * @LastEditTime: 2021-01-16 17:06:29
 */
module.exports = file => () =>
    import('@/views/' + file + '.vue')