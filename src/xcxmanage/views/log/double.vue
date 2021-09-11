<!--
 * @Descripttion: 小程序用户
 * @version: 1.0
 * @Author: Lizhi
 * @Date: 2021-01-15 16:52:43
 * @LastEditors: WangChuan
 * @LastEditTime: 2021-05-10 14:28:06
-->
<template>
    <div> 
        <!--  height="73.7vh" -->
        <fix-table ref="table" border v-loading="loading" element-loading-spinner="el-icon-loading"
            element-loading-text="拼命加载中" :data="tableData" key="list" size="medium"
            header-row-class-name="my-table-header" class="my-table">
            <el-table-column prop="date_time" label="日期" align="center" />
            <el-table-column prop="bronze" label="青铜玩家" align="center" />
            <el-table-column prop="gold" label="黄金玩家" align="center" />
            <el-table-column prop="platinum" label="铂金玩家" align="center" />
            <el-table-column prop="diamond" label="钻石玩家" align="center" />
            <el-table-column prop="real_love" label="真爱粉" align="center" />
            <el-table-column prop="count" label="合计人数" align="center" />
            <el-table-column prop="invite_num" label="邀请人数" align="center" />
            <el-table-column prop="card_gold" label="金币卡(奖/未/过)" align="center">
                <template slot-scope="scope">
                    <span>{{scope.row.card_gold}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="card_sign" label="签到卡(奖/未/过)" align="center" />
            <el-table-column prop="card_all" label="万能卡(奖/未/过) " align="center" />
        </fix-table>

        <div class="pages">
            <el-pagination @current-change="currentChange" layout="total, prev, pager, next" :page-size="dataForm.size"
                :current-page="dataForm.page" :total="totalNum" />
        </div>
    </div>
</template>
<script>
    export default {
        name: "userAppletUser",
        data() {
            return {
                // 表格load状态
                loading: false,
                // form数据
                totalNum: 0,//总数
                dataForm: {
                    page: 1,//当前页
                    size:15,
                },
                // Table数据
                tableData: [],
            };
        },
        methods: {
             //时间处理important
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
            // 获取Table数据
            loadData() {
                this.loading = true;
                this.getRequest("DoubleCard/getList", this.dataForm).then(resp => {
                    this.loading = false;
                    console.log(resp)
                    if (resp && resp.code === 200) {
                        this.totalNum = resp.data.count
                        this.tableData = resp.data.list
                    }
                });
            },
            // 换页响应
            currentChange(val) {
                this.tableData = [];
                this.dataForm.page = val;
                this.loadData();
            },
        },
        watch:{
        },
        computed: {
        },
        created() {
            this.loadData();
        },
        
    }

</script>

<style lang='scss' scoped>
div >>> .el-form-item:last-child{
    transform: translateY(2px);
}
div >>> .el-dialog__body{
    padding: 40px 17px 10px;
}
    .avatar-uploader {

        width: 96px;
        position: relative;

        .avatar-uploader-icon {
            font-size: 28px;
            color: #8c939d;
            width: 96px;
            height: 96px;
            line-height: 96px;
            text-align: center;
            border: 1px dashed #d9d9d9;
            border-radius: 6px;
        }

        .avatar-uploader-icon:hover {
            border-color: #409EFF;
        }

        .avatar {
            width: 96px;
            height: 96px;
            display: block;
        }
    }

    .el-icon-error {
        position: absolute;
        top: -4px;
        right: -5px;
    }

</style>
