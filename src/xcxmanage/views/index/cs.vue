<!--
 * @Descripttion: 首页
 * @version: 1.0
 * @Author: WangChuan
 * @Date: 2021-01-15 16:52:43
 * @LastEditors: WangChuan
 * @LastEditTime: 2021-03-15 13:52:33
-->
<template>
    <div>
        <el-form :inline="true" v-model="dataForm" ref="dataForm" class="form-inline-box">
            <div class="el-form-item-left">
                <el-form-item>
                    <el-button class="my-def-btn" @click="showDialog = true" size="medium">基础弹窗</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-plus" class="my-blue-btn" @click="showTips = true"
                        size="medium">测试统计
                    </el-button>
                </el-form-item>
            </div>
            <div class="el-form-item-right">
                <el-form-item>
                    <el-input placeholder="搜索" v-model="dataForm.keyword" class="input-search-btn" clearable
                        size="medium">
                        <el-button slot="append" icon="el-icon-search"></el-button>
                    </el-input>
                </el-form-item>
            </div>
        </el-form>

        <el-dialog title="计算" :visible.sync="showDialog" custom-class="my-dialog" width="30%" :append-to-body="true"
            :close-on-press-escape="false">
            <el-form :model="infoForm" size="medium">         
                <el-row :gutter="20" type="flex">
                    <el-col :span="12">
                        <el-form-item label="荣誉:" label-width="100px" style="color:red">
                            {{infoForm.rongyu}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20" type="flex">
                    <el-col :span="12">
                        <el-form-item label="最高势力" label-width="100px">
                            <el-input v-model="infoForm.shili" autocomplete="off" placeholder="最高势力100:1" clearable />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20" type="flex">
                    <el-col :span="12">
                        <el-form-item label="攻城杀敌" label-width="100px">
                            <el-input v-model="infoForm.shadi" autocomplete="off" placeholder="攻城杀敌1W:1" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="攻城拆迁" label-width="100px">
                            <el-input v-model="infoForm.hcaiqian" autocomplete="off" placeholder="攻城拆迁3000:1" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20" type="flex">
                    <el-col :span="12">
                        <el-form-item label="拆迁翻地" label-width="100px">
                            <el-input v-model="infoForm.fandi" autocomplete="off" placeholder="拆迁翻地10:1" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="拆迁拆除" label-width="100px">
                            <el-input v-model="infoForm.chaichu" autocomplete="off" placeholder="拆迁拆除1000:1" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20" type="flex">
                    <el-col :span="12">
                        <el-form-item label="灭敌总数" label-width="100px">
                            <el-input v-model="infoForm.meidi" autocomplete="off" placeholder="灭敌总数10W:1" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="武勋总数" label-width="100px">
                            <el-input v-model="infoForm.wuxun" autocomplete="off" placeholder="武勋总数1W:1" />
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" class="my-blue-btn" @click="subBtn">确 定</el-button>
                <el-button @click="showDialog = false">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    export default {
        name: "mian",
        components: {},
        data() {
            return {
                showDialog: false,
                loading: false,
                dataForm: {
                    p: 1,
                    size: 20,
                    totalNum: 1,
                    keyword: ''
                },
                tableData: [{
                    id: 1,
                    num_iid: '1',
                    commission: 1
                }, ],
                infoForm: {
                    shili: '',
                    shadi: '',
                    hcaiqian: '',
                    fandi: '',
                    chaichu: '',
                    meidi: '',
                    wuxun: '',
                    rongyu: '',
                },
            }
        },
        methods: {
            subBtn() {
                let rongyu = 0;
                rongyu = (this.infoForm.shili / 100) +
                    (this.infoForm.shadi / 10000) +
                    (this.infoForm.hcaiqian / 3000) +
                    (this.infoForm.fandi / 10) +
                    (this.infoForm.chaichu / 1000) +
                    (this.infoForm.meidi / 100000) +
                    (this.infoForm.wuxun / 10000)
                this.infoForm.rongyu = rongyu;
            }
        },
        computed: {},
        mounted() {}
    };

</script>

<style lang='scss' scoped>

</style>
