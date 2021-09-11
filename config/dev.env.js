/*
 * @Descripttion: 
 * @version: 1.0
 * @Author: WangChuan
 * @Date: 2021-01-15 16:52:43
 * @LastEditors: WangChuan
 * @LastEditTime: 2021-08-24 09:22:07
 */
'use strict'
const merge = require('webpack-merge');
const prodEnv = require('./prod.env');

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  baseUrl:{
    xcxmanage:'http://xcx.yhsh123.cn'
    // xcxmanage:'https://xcx.yhshapp.com'
  },
  host:{
    xcxmanage:'127.0.0.1'
  }
});
