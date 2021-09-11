/*
 * @Descripttion: 
 * @version: 1.0
 * @Author: WangChuan
 * @Date: 2021-01-15 16:52:43
 * @LastEditors: WangChuan
 * @LastEditTime: 2021-01-18 15:23:42
 */
import Vue from 'vue'
import { Table } from 'element-ui'
const FxTable = Vue.extend(Table)
export default {
  extends: Table,
  name: 'FixTable',
  data() {
    return {}
  },
  updated() {
    this.doLayout();
  },
  mounted() {
  }
}