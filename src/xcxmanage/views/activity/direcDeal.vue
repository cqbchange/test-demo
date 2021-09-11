<!--
 * @Descripttion: 厂家直销
 * @version: 1.0
 * @Author: lizhi
 * @Date: 2021-01-15 16:52:43
 * @LastEditors: lizhi
 * @LastEditTime: 2021-07-1 17:00:04
-->
<template>
    <div class="memberList">
        <div class="topBox">
            <el-form :inline="true" :model="dataForm" ref="dataForm" class="demo-form-inline">
                <el-form-item style="flex:1;">
                    <el-button size="medium"  type="primary" icon="el-icon-plus" class="my-blue-btn" @click="editData()">添加商品</el-button>
                </el-form-item>
                <el-form-item  prop="" style="width:200px;margin-right:20px">
                    <el-select size="medium" placeholder="状态" v-model="dataForm.status" @change="loadData">
                        <el-option :value="2" label="已下架"/>
                        <el-option :value="1" label="上架中"/>
                    </el-select>
                </el-form-item>
                <el-form-item prop="keyword" style="width:200px;">
                    <el-input size="medium"  placeholder="搜索" v-model="dataForm.keyword" class="input-search-btn" clearable  @change="submitForm()">
                        <el-button size="medium"  slot="append" icon="el-icon-search" @click="submitForm()"></el-button>
                    </el-input>
                </el-form-item>
            </el-form>
        </div>
        <fix-table ref="table" :data="tableData" key="memberlist" border v-loading="loading" element-loading-spinner="el-icon-loading"
            element-loading-text="拼命加载中" height="73.7vh" size="small"
            header-row-class-name="my-table-header" class="my-table"  @sort-change="sortChange">
            <el-table-column fixed prop="id" label="商品ID"  align="center" header-align="center"/>
            <el-table-column prop="title" label="标题" align="center"></el-table-column>
            <el-table-column label="主图"  align="center">
                <template slot-scope="scope">
                    <el-image style="width: 55px; height: 55px" :src="scope.row.pic" :preview-src-list="[scope.row.pic]"/>
                </template>
            </el-table-column>
            <el-table-column  label="列表标签" align="center" max-width="300">
                <template slot-scope="scope">
                    <el-row >
                        <div class="tagdiv" v-for="(item,index) in scope.row.list_tag">
                            <el-tag size="small">{{item}}</el-tag>
                        </div>
                    </el-row>
                </template>
            </el-table-column>
             <el-table-column label="详情标签" align="center" max-width="300" >
                 <template slot-scope="scope">
                     <el-row >
                        <div class="tagdiv" v-for="(item,index) in scope.row.detail_tag">
                            <span class="eltag" type="success">{{item}}</span>
                        </div>
                    </el-row>
                </template>
            </el-table-column>
            <el-table-column prop="integral" label="价格及描述" align="center">
                <template slot-scope="scope">
                    <span>{{scope.row.end_price}}</span>
                    <span v-if="scope.row.small_title">({{scope.row.small_title}})</span>
                </template>
            </el-table-column>
            <el-table-column prop="list_order" label="排序" align="center" sortable="custom" />
            <el-table-column label="状态" align="center">
                <template slot-scope="scope">
                    <span v-if="scope.row.status == 1" style="color:#694BFF">已上架</span>
                    <span v-if="scope.row.status == 2" style="color:#999999">已下架</span>
                </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作"  align="center">
                <template slot-scope="scope">
                    <el-button @click="editData(scope.row)" type="text" size="small">编辑</el-button>
                    <el-button v-if="scope.row.status == 1 " @click="offShelf(scope.row,'下架')" type="text" size="small">下架</el-button>
                    <el-button v-if="scope.row.status == 2 " @click="offShelf(scope.row,'上架')" type="text" size="small">上架</el-button>
                </template>
            </el-table-column>
        </fix-table>
        <div class="pages">
            <el-pagination
                @current-change="handleCurrentChange"
                layout="total, prev, pager, next"
                :page-size="dataForm.size"
                :current-page="dataForm.p"
                :total="totalNum"
            />
        </div>
        <addDirec v-if="showDialog" v-model="showDialog" :infoForm="infoForm" />
    </div>
</template>
<script>
    import addDirec from "./_addDirec.vue";

    export default {
        name: "activityDirecDeal",
        components: {addDirec},
        data() {
            return {
                // 表格数据总量
                totalNum: 0,
                // 每页显示数据数量
                loading: true,
                dataForm: {
                    keyword: "",
                    p: 1,
                    size: 12,
                    status: 1,
                    order:''
                },
                tableData: [],
                showDialog: false,
                infoForm: {}
            };
        },
        methods: {
            //排序
            sortChange(e) {
                if(e.order == 'descending'){
                    this.dataForm.order = 2
                }else{
                    this.dataForm.order = 1
                }
                this.loadData()
            },
            // 重置表单
            resetForm(formName) {
                this.dataForm.p = 1;
                this.$refs[formName].resetFields();
                this.loadData();
            },
            // 提交表单
            submitForm: function () {
                this.dataForm.p = 1;
                this.loadData();
            },
            // 换页响应
            handleCurrentChange(val) {
                this.tableData = [];
                this.dataForm.p = val;
                this.loadData();
            },
            // 请求数据
            loadData() {
                const _this = this;
                this.loading = true;
                this.getRequest("/DirectsShop/getList", _this.dataForm).then(resp => {
                    _this.loading = false;
                    if (resp && resp.code === 200) {
                        _this.totalNum = resp.data.total;
                        _this.tableData = resp.data.list;
                    }
                });
            },
            //编辑
            editData (row) {
                if (row !== undefined) {
                    this.infoForm = Object.assign({}, row);
                    if(row.list_tag.length == 0){
                        this.infoForm.list_tag=['']
                    }
                    if(row.detail_tag.length == 0){
                        this.infoForm.detail_tag=['']
                    }
                }else{
                    this.infoForm = {
                        list_tag:[''],
                        detail_tag:[''],
                        slide:[],
                        pic:''
                    };
                }
                this.showDialog = true;
            },
            //上下架
            offShelf(row,text){
                let status
                this.$confirm(`确认${text}该商品？`, "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    customClass: 'with_custom_class',
                    type: "warning"
                }).then(() => {
                    if(text=='上架'){
                        status = 1
                    }else{
                        status = 2
                    }
                    this.getRequest("/DirectsShop/loadUnload",{
                        id:row.id,
                        status:status
                    }).then(resp => {
                    if (resp && resp.code === 200) {
                        this.$message.success(resp.msg)
                        this.loadData()
                    }
                });
                }).catch(() => {
                    this.$message.warning(resp.msg)
                });
            },
            handleImgSuccess(file, fileList) {
                if (file.code !== 200) {
                    this.$message.error(file.msg);
                } else {
                    this.infoForm.pic = file.data;
                }
            },
            
        },
        computed: {

        },
        mounted() {
            this.loadData();
        }
    };
</script>
<style lang="scss" scoped>
.tagdiv{
    margin: 5px;
}
.demo-form-inline{
display: flex;
align-items: center;
}
.el-select{
    height: 42px;
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
.eltag{
    padding:4px 8px;
    background-color: #F2FAFF;
    border: 1px solid #009dff28;
    color: #25AAFF;
    border-radius: 4px;
    margin-bottom: 5px;
    font-size: 12px;
}
</style>

