<!--
 * @Descripttion: 纷推广告图
 * @version: 1.0
 * @Author: Lizhi
 * @Date: 2021-01-15 16:52:43
 * @LastEditors: WangChuan
 * @LastEditTime: 2021-01-30 16:09:43
-->
<template>
    <div>
        <div class="topBox">

            <el-form :inline="true" ref="dataForm" class="form-inline-box">
                <div class="el-form-item-left">
                    <el-form-item>
                        <el-button @click="addlist" type="primary" icon="el-icon-plus" class="my-blue-btn"
                            size="medium">添加图片</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button class="my-def-btn" @click="classification" size="medium">分类管理</el-button>
                    </el-form-item>
                </div>
                <div class="el-form-item-right">
                     <!-- prop="cid" -->
                    <el-form-item label style="width:150px;">
                        <el-select v-model="cat" filterable placeholder="状态" size="medium" @change="changecat">
                            <el-option value=''  label="全部分类" />
                            <el-option v-for="(item,index) in catData" :key="index" :label="item.name" :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </div>
            </el-form>
        </div>

        <fix-table :data="tableData" ref="table" border element-loading-spinner="el-icon-loading"
            header-row-class-name="my-table-header" class="my-table" element-loading-text="拼命加载中" height="73.7vh"
            size="small" style="width: 100%" v-loading="loading" key="list">
            <el-table-column align="center" fixed header-align="center" label="ID" prop="id" width="120px">
            </el-table-column>
            <el-table-column label="分类" prop="cid_name" align="center" />
            <el-table-column align="center" fixed="right" label="任务区">
                <template slot-scope="scope">
                    <img :src="scope.row.image" alt="" width="55">
                </template>
            </el-table-column>
            <el-table-column align="center" fixed="right" label="气泡集分宝">
                <template slot-scope="scope">
                    <img :src="scope.row.bubble_jfb" alt="" width="70">
                </template>
            </el-table-column>
            <el-table-column align="center" fixed="right" label="气泡金币">
                <template slot-scope="scope">
                    <img :src="scope.row.bubble_integral" alt="" width="70">
                </template>
            </el-table-column>
            <el-table-column align="center" fixed="right" label="分类图片">
                <template slot-scope="scope">
                    <img :src="scope.row.cat_img" alt="" width="55">
                </template>
            </el-table-column>
            <el-table-column align="center" fixed="right" label="操作" width="230">
                <template slot-scope="scope">
                    <el-button @click="edit(scope.row)" size="medium" type="text">编辑</el-button>
                    <el-button @click="del(scope.row)" size="medium" type="text">删除</el-button>
                </template>
            </el-table-column>
        </fix-table>
        <div class="pages">
            <el-pagination :current-page.sync="currentPage" :page-size="pageSize" :total="totalNum"
                @current-change="handleCurrentChange" layout="total, prev, pager, next" />
        </div>
        <add :dataForm="currentData" v-model="showDialog" @addClassemit="addClassemit"></add>

        <el-dialog title="分类管理" :visible.sync="showDialogClass" custom-class="my-dialog" width="730px"
            :append-to-body="true" :close-on-press-escape="false"  @close="closeDialog">
            <div style="flex-wrap:wrap;" v-loading='calssLoading' element-loading-spinner="el-icon-loading">
                <div v-for="(item,index) in catData" :key="index" @click="checkedfn(item,index)" class="div" >
                    <el-input ref="elInput" type="text" :disabled='item.isDisable' placeholder="请输入..."
                        v-model="item.name" class="div-input" autocomplete="off" :readonly="item.isUpdate"
                        :class="{active:item.isChecked}" />
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button v-if="update" type="primary" class="my-blue-btn" @click="addClass" size="medium">添加分类
                </el-button>
                <el-button v-if="!update" type="primary" @click="addSubmit" size="medium">确定</el-button>
                <el-button v-if="!update" @click="showDialogClass=false" size="medium">取消</el-button>
                <el-button v-if="update" class="my-def-btn" plain @click="updateClass" size="medium">编辑分类</el-button>
                <el-button v-if="update" class="my-del-btn" @click="delClass" size="medium">删除分类</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import add from './add'

    export default {
        name: "resourcesFtTaskImg",
        data() {
            return {
                // 表格当前页
                currentPage: 1,
                // 每页显示数据数量
                pageSize: 12,
                // 表格数据总量
                totalNum: 0,
                // 每页显示数据数量
                loading: true,
                // 列表数据
                tableData: [],
                // 当前数据
                currentData: {},
                // 是否显示模态
                showDialog: false,
                //分类管理
                showDialogClass: false,
                // 搜索表单
                cat:'',
                // 分类列表
                catData: [],
                calssDataForm: {},
                delClassData: {},
                isbtnShow: true,
                updateData: {},
                changeNum: '',
                update: true,
                calssLoading: false
            }
        },
        components: {
            add
        },
        methods: {
            addClassemit(val) {
                if (val) {
                    this.loadData()
                }
            },
            // 获取分类
            getCat() {
                this.calssLoading = true
                this.getRequest('/adimg/cat', {
                    p: 1,
                    size: 100
                }).then(resp => {
                    if (resp && resp.code === 200) {
                        this.catData = resp.data.list
                        this.catData.forEach((item, i) => {
                            item['isUpdate'] = true,
                            item['isDisable'] = false
                        })
                    }
                    this.calssLoading = false
                })
            },
            //添加分类按钮
            addClass() {
                this.catData.forEach((ele, i) => {
                    ele.isUpdate = true
                    ele.isDisable = true
                    ele.isChecked = false
                })
                if (this.catData[0].isUpdate === true) {
                    this.catData.unshift({
                        name: '',
                        isUpdate: false,
                        isDisable: false,
                        isChecked:true
                    })
                    this.calssDataForm = this.catData[0]
                    this.changeNum = 0
                    this.update = false
                    this.$refs.elInput[0].focus()
                }
            },
            //提交分类添加
            addSubmit() {
                if(!this.catData[0].name){
                    this.$message.warning('请输入分类名称')
                    this.$refs.elInput[0].focus()
                    return
                }
                this.calssDataForm.name = this.catData[this.changeNum].name
                this.calssLoading = true
                let url = '/adimg/addCat'
                if (this.calssDataForm.id > 0) {
                    url = '/adimg/editCat'
                }
                this.postRequest(url, this.calssDataForm).then(resp => {
                    if (resp && resp.code === 200) {
                        this.$message({
                            message: this.dilogTitle + '成功',
                            type: 'success',
                            showClose: true,
                            duration: 1000,
                        })
                        this.showDialogClass = false
                        this.update = true //判断按钮显示
                        this.calssDataForm = {}
                        this.catData.forEach(ele => {
                            ele.isUpdate = true
                        })
                        this.calssLoading = false
                    } else {
                        this.$message({
                            message: resp.msg,
                            type: 'faild',
                            showClose: true,
                            duration: 1000
                        })
                        this.calssLoading = false
                    }
                })
            },
            //编辑分类
            updateClass() {
                if (this.changeNum === '' || this.changeNum === undefined) {
                    this.$message.warning("请选择分类")
                    return
                }
                this.catData.forEach(ele => {
                    ele.isUpdate = true
                    ele.isDisable = true
                })
                this.update = false //判断按钮显示
                this.catData[this.changeNum].isUpdate = false
                this.catData[this.changeNum].isDisable = false
                this.$refs.elInput[this.changeNum].focus()
            },
            //点击分类
            checkedfn(item, index) {
                if(item.isDisable){
                    this.catData.forEach((ele,i)=>{
                        if(ele.isUpdate===false){
                            this.$refs.elInput[i].focus()
                        }
                    })
                    return
                }
                this.catData.forEach(el => {
                    this.$set(el,'isChecked',false)
                });
                this.$set(item,'isChecked',true)

                this.changeNum = index
                this.delClassData = item
                this.calssDataForm = item
                
            },
            //删除分类
            delClass() {
                if (this.delClassData.name === undefined) {
                    this.$message.warning("请选择分类")
                    return
                }
                this.$refs.elInput[this.changeNum].focus()
                this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.calssLoading = true
                    this.postRequest('/adimg/deleteCat', this.delClassData).then(resp => {
                        if (resp && resp.code === 200) {
                            this.$message({
                                message: '删除成功',
                                type: 'success',
                                showClose: true,
                                duration: 1000,
                            })
                            this.getCat()
                            this.calssLoading = false

                            this.showDialogClass = false
                            this.update = true //判断按钮显示
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    })
                })
            },
            //分类管理
            classification() {
                this.showDialogClass = true
                this.getCat()
                this.changeNum = ''
                this.delClassData = {}
                this.catData.forEach(ele => {
                    ele.isUpdate = true
                    ele.isDisable = false
                })
                this.update = true //判断按钮显示
            },
            //关闭分类弹窗
            closeDialog(){
                if(this.catData[0].name===''){
                    this.catData.splice(0,1)
                }
            },
            // 换页响应
            handleCurrentChange(val) {
                this.currentPage = val
                this.loadData()
            },
            // 请求数据
            loadData() {
                this.loading = true
                this.getRequest('/adimg/list', {
                    p: this.currentPage,
                    cid: this.cat,
                    size: this.pageSize
                }).then(resp => {
                    this.loading = false
                    if (resp && resp.code === 200) {
                        this.totalNum = resp.data.total
                        this.tableData = resp.data.list
                    }
                })
            },
            // 添加数据
            addlist() {
                this.currentData = {
                    'bubble_integral': '',
                    'bubble_jfb': '',
                    'bubble_zlqdd': '',
                    'cat_img': '',
                    'cid': this.cat,
                    'id': '',
                    'image': '',
                    'name': ''
                }

                this.showDialog = true
            },
            // 编辑数据
            edit(row) {
                this.currentData = Object.assign({}, row)
                this.showDialog = true
            },
            // 删除数据
            del(row) {
                let that = this
                this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.postRequest('/adimg/delete', row).then(resp => {
                        if (resp && resp.code === 200) {
                            this.$message({
                                message: '删除成功',
                                type: 'success',
                                showClose: true,
                                duration: 1000,
                                onClose: function () {
                                    that.loadData()
                                }
                            })
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    })
                })
            },
            // 获取Cid
            getCid() {
                this.cat = this.$route.params.cid === undefined ? '' : this.$route.params.cid
            },
            changecat(){
                this.currentPage = 1
                this.loadData()
            }
        },
        mounted() {
            this.getCat()
            this.getCid()
            this.loadData()
        },
        watch: {
            // cat(newval) {
            //     this.currentPage = 1
            //     this.loadData()
            // }
        },
        computed: {
            dilogTitle() {
                return this.calssDataForm.id > 0 ? '编辑数据' : '增加数据'
            }
        }
    }

</script>

<style scoped>
     /* .div-input>>>.el-input__inner{ 
    border: none;
    cursor: pointer;
    }  */
    /* .active{
        border: 2px solid royalblue;
        border-radius:10px ;
    }  */
    .div-input.el-input {
        width: 140px;
        margin: 10px 16px;
        height: 40px;
        /* border: none; */
    }

    .div-input>>>.el-input__inner {

        text-align: center;
        background: #F5F5F5;
        width: 140px;

    }

    .classCat {
        padding: 10px 30px;
        background: #F5F5F5;
        box-sizing: border-box;
        margin: 16px;
        display: inline-block;
    }

    .div {
        display: inline-block;
    }

    .div-input.active>>>.el-input__inner {
        border-color: #448AFF !important;
        color:  #448AFF;
    }

    .dialog-footer {
        display: flex;
        justify-content: center;
    }

    .my-del-btn {
        border: 1px solid #FF213B;
        color: #FF213B;

    }

</style>
