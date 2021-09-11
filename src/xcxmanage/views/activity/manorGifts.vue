<!--
 * @Descripttion: 开心庄园
 * @version: 1.0
 * @Author: lizhi
 * @Date: 2021-01-15 16:52:43
 * @LastEditors: lizhi
 * @LastEditTime: 2021-01-30 15:50:04
-->
<template>
    <div class="memberList">
        <div class="topBox">
            <el-form :inline="true" ref="dataForm" class="demo-form-inline">
                <el-form-item style="flex:1;">
                    <el-button size="medium"  type="primary" class="my-blue-btn" @click="editData()">添加好礼</el-button>
                </el-form-item>
                <div class="el-form-item-right">
                    <el-form-item style="width:150px;">
                        <el-select v-model="dataForm.appid" @change="loadData()" filterable placeholder="选择小程序"
                            size="medium">
                            <el-option :value="''" label="全部小程序" />
                            <el-option v-for="(item,i) in xcxList" :label="item.app_name" :value="item.mini_appid" :key="i"></el-option>
                        </el-select>
                    </el-form-item>
                </div>
            </el-form>
        </div>
        <fix-table
            ref="table"
            :data="tableData"
            border v-loading="loading" element-loading-spinner="el-icon-loading"
            element-loading-text="拼命加载中" height="73.7vh" size="small"
            header-row-class-name="my-table-header" class="my-table"
        >
            <el-table-column fixed prop="id" label="ID" width="80" align="center" header-align="center"/>
            <el-table-column prop="appName" label="小程序" align="center"></el-table-column>
            <el-table-column prop="exchange_type" label="类型" align="center">
                <template slot-scope="scope">
                    <span v-if="scope.row.exchange_type === 1">虚拟</span>
                    <span v-if="scope.row.exchange_type === 2">实物</span>
                </template>
            </el-table-column>
            <el-table-column prop="thing_name" label="商品标题" width="260" align="center">
                <template slot-scope="scope">
                    <el-row type="flex" style="align-items: center;">
                            <el-image style="width: 42px; height: 42px" :src="scope.row.image_url" :preview-src-list="scope.row.pic_list"/>
                            <span style="flex: 1;text-align: left;margin-left:5px;">{{ scope.row.thing_name}}</span>
                    </el-row>
                </template>
            </el-table-column>
            <el-table-column prop="red_envelope_amount" label="金额" align="center"/>
            <el-table-column prop="price" label="需要金蛋" width="90" align="center"/>
            <el-table-column prop="quantityRedeemed" label="每日兑换/每日上限" align="center"></el-table-column>
            <el-table-column prop="rush_time" label="每日兑换时间" align="center"></el-table-column>
            <el-table-column prop="enabled" label="状态" width="90" align="center">
                <template slot-scope="scope">
                    <span v-if="scope.row.enabled == 0" style="color:#4FB0FF">上线中</span>
                    <span v-if="scope.row.enabled == 1">已下线</span> 
                </template>
            </el-table-column>
            <el-table-column prop="order_sort" label="排序" align="center" width="100" />
            <el-table-column fixed="right" label="操作" width="180" align="center">
                <template slot-scope="scope">
                    <el-button @click="editData(scope.row)" type="text" size="small">编辑</el-button>
                </template>
            </el-table-column>
        </fix-table>

        <div class="pages">
            <el-pagination
                @current-change="handleCurrentChange"
                layout="total, prev, pager, next"
                :page-size="dataForm.pageSize"
                :current-page="dataForm.pageNum"
                :total="totalNum"
            />
        </div>

        <add :dataForm="infoForm" :xcxList='xcxList' @success="loadData" v-model="showDialog"></add>
    </div>
</template>
<script>
    import add from './manorGifts_add.vue'
    export default {
        name: "activityManorGifts",
        components:{
            add
        },
        data() {
            return {
                // 表格数据总量
                totalNum: 0,
                // 每页显示数据数量
                loading: true,
                dataForm: {
                    appid:'',
                    pageNum: 1,
                    pageSize: 12

                },
                tableData: [],
                showDialog: false,
                infoForm: {},
                xcxList:[]
            };
        },
        mounted() {
            
            this.getAppidList()
        },
        methods: {
             // 获取Appid列表
            getAppidList() {
                this.loading = true
                this.getRequest('/collaregg/supportAppid', {}).then((res) => {
                    if (res.code == 200) {
                        if (res.data) {
                            this.xcxList = res.data
                            this.loadData();
                        }
                    } else {
                        this.$message.warning(res.msg)
                    }
                })
            },
            handleCurrentChange(val) {
                this.tableData = [];
                this.dataForm.pageNum = val;
                this.loadData();
            },
            loadData: function () {               
                const _this = this;
                this.loading = true;
                this.getRequest("/collaregg/exchangeGoods/backstage/goods",_this.dataForm).then(resp => {
                    _this.loading = false;
                    if (resp && resp.code === 200) {
                        _this.totalNum = resp.data.total;
                        _this.tableData = resp.data.list;
                    }
                });
            },
            dateFormat (fmt, date) {
                let ret
                const opt = {
                'Y+': date.getFullYear().toString(),        // 年
                'm+': (date.getMonth() + 1).toString(),     // 月
                'd+': date.getDate().toString(),            // 日
                'H+': date.getHours().toString(),           // 时   
                'M+': date.getMinutes().toString(),         // 分
                'S+': date.getSeconds().toString()          // 秒
                // 有其他格式化字符需求可以继续添加，必须转化成字符串
                }
                for (let k in opt) {
                ret = new RegExp('(' + k + ')').exec(fmt)
                if (ret) {
                    fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, '0')))
                }
                }

                return fmt
            },
            editData(row) {
                this.infoForm = {}
                if (row !== undefined) {
                    this.infoForm = Object.assign({}, row);
                    let time = this.dateFormat('YYYY-mm-dd',new Date())
                    time = parseInt(new Date(time +' '+ row.rush_time).getTime()) 
                    this.infoForm.rush_time = time
                }
                this.showDialog = true;
            },
        },
        computed: {
            catList() {
                return this.$store.state.base.catList;
            }
        },
    };
</script>
<style lang="scss" scoped>
  .demo-form-inline{
    display: flex;
  }
  .demo-form-inline .el-form-item:last-child{
    margin-right: 0;
  }
    .img_pic_box {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .gourl_a {
        display: contents;
    }
</style>

