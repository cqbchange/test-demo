<!--
 * @Descripttion: 厂家直销-添加商品
 * @version: 1.0
 * @Author: lizhi
 * @Date: 2021-07-01 16:52:43
 * @LastEditors: lizhi
 * @LastEditTime: 2021-7-01 17:34:13
-->
<template>
    <div>
        <el-dialog :title="infoForm.id?'编辑商品':'增加商品'" :visible="value" @update:visible="(val) => this.$emit('input',val)" custom-class="my-dialog"
            width="1000px" :append-to-body="true" style="margin-left: 210px;">
            <el-form :model="infoForm" size="medium" v-loading="loading">
                        <div class="titleText">
                            商品信息
                        </div>
                        <el-row type="flex" :gutter="0" >
                            <el-col :span="16">
                                <el-form-item label="查商品信息:" label-width="160px">
                                    <el-input size="medium" v-model="infoForm.iid" autocomplete="off" placeholder="输入IID查商品信息" onkeyup="this.value = this.value.replace(/[^\d]/g,'');" clearable class="input-search-btn">
                                        <el-button size="medium"  slot="append" icon="el-icon-search" @click="getGoods"></el-button>
                                    </el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <div class="titleText"> 
                              {{infoForm.id?'编辑商品':'添加商品'}}
                        </div>
                        <el-row type="flex" :gutter="0" justify="center">
                            <el-col :span="24">
                                <el-form-item label="商品标题:" label-width="160px">
                                   <el-input size="medium" v-model="infoForm.title" autocomplete="off" placeholder="请填写标题" clearable/>
                                </el-form-item>
                            </el-col>
                            <el-col :span="24">
                                <el-form-item label="推荐理由:" label-width="160px">
                                    <el-input size="medium" v-model="infoForm.remark" autocomplete="off" placeholder="请填写推荐理由" clearable/>
                                </el-form-item>
                            </el-col>
                        </el-row>
                         <el-row type="flex" :gutter="0" justify="center">
                            <el-col :span="12">
                                <el-form-item label="券后价格:" label-width="160px">
                                   <el-input size="medium" v-model="infoForm.end_price" onkeyup="this.value = this.value.replace(/[^\d.]/g,'');" autocomplete="off" placeholder="请填写券后价格" clearable/>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="价格描述:" label-width="160px">
                                    <el-input size="medium" v-model="infoForm.small_title" autocomplete="off" placeholder="请填写价格描述" maxlength="14" clearable/>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row type="flex" :gutter="0" justify="space-between">
                            <el-col :span="12">
                                <el-form-item label="优惠券id:" label-width="160px">
                                    <el-input size="medium" v-model="infoForm.coupon_id" autocomplete="off" placeholder="请填写优惠券id" clearable/>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="优惠券金额:" label-width="160px">
                                    <el-input size="medium" v-model="infoForm.coupon_money" onkeyup="this.value = this.value.replace(/[^\d.-]/g,'');" autocomplete="off" placeholder="请填写优惠券金额" clearable/>
                                </el-form-item>
                            </el-col>
                        </el-row>
                         <el-row type="flex" :gutter="0" justify="center">
                            <el-col :span="12">
                                <el-form-item label="排序:" label-width="160px">
                                   <el-input size="medium" v-model="infoForm.list_order" onkeyup="this.value = this.value.replace(/[^\d.-]/g,'');" autocomplete="off" placeholder="请填写排序" clearable/>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="商品类型:" label-width="160px">
                                    <el-select size="medium" placeholder="商品类型" v-model="infoForm.site" >
                                        <el-option :value="'0'" label="淘宝"/>
                                        <el-option :value="'1'" label="天猫"/>
                                        <el-option :value="'2'" label="拼多多"/>
                                        <el-option :value="'3'" label="京东"/>
                                        <el-option :value="'4'" label="唯品会"/>
                                        <el-option :value="'5'" label="苏宁"/>
                                        <el-option :value="'6'" label="直营"/>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>

                        <el-row type="flex" :gutter="0" justify="space-between">
                             <el-col :span="12">
                                <el-form-item class="item_content" label="列表标签:"  label-width="160px">
                                    <div class="more-content" v-for="(item,index) in infoForm.list_tag" :key="index">
                                        <el-input s size="medium" v-model="infoForm.list_tag[index]" autocomplete="off" placeholder="请填写列表标签" clearable maxlength="10"/>
                                        <img  v-if="infoForm.list_tag.length >1 && infoForm.list_tag.length!==index+1" 
                                            class="delete" @click="deleteListtag(index)" width="27px" src="@img/task/task-del.png" alt="图片">
                                        <img v-if="infoForm.list_tag.length === index+1" 
                                            class="delete" @click="addListtag" width="27px" src="@img/task/task-add.png" alt="图片">
                                    </div>
                                </el-form-item>
                            </el-col>
                             <el-col :span="12">
                                <el-form-item class="item_content" label="详情标签:"  label-width="160px">
                                    <div class="more-content" v-for="(item,index) in infoForm.detail_tag " :key="index">
                                        <el-input s size="medium" v-model="infoForm.detail_tag [index]" autocomplete="off" placeholder="请填写详情标签" clearable maxlength="10"/>
                                        <img  v-if="infoForm.detail_tag .length >1 && infoForm.detail_tag .length!==index+1" 
                                            class="delete" @click="deleteDetailtag(index)" width="27px" src="@img/task/task-del.png" alt="图片">
                                        <img v-if="infoForm.detail_tag .length === index+1" 
                                            class="delete" @click="addDetailtag" width="27px" src="@img/task/task-add.png" alt="图片">
                                    </div>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row type="flex" :gutter="0" justify="space-between">
                            <el-col :span="22">
                                <el-form-item label="商品主图:" label-width="160px" class="gift_uploader">
                                    <el-upload
                                        class="avatar-uploader"
                                        :action="uploadUrl"
                                        name="image"
                                        :show-file-list="false" 
                                        :on-success="handleImgSuccess">
                                        <img v-if="infoForm.pic" :src="infoForm.pic" class="avatar">
                                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                    </el-upload>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row type="flex" :gutter="0" justify="space-between">
                            <el-col :span="22">
                                <el-form-item label="商品详情:" label-width="160px" class="descList">
                                    <el-upload
                                        list-type="picture-card"
                                        class="upload-demo"
                                        name="image"
                                        :action="uploadUrl"
                                        :on-success="handleDescList"
                                        :on-remove="handleRemoveDescList"
                                        :show-file-list="true"
                                        multiple
                                        :file-list="desc_list">
                                        <i class="el-icon-plus"/>
                                    </el-upload>
                                </el-form-item>
                            </el-col>
                        </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="medium"  type="primary" class="my-blue-btn" @click="submitEdit">确 定</el-button>
                <el-button size="medium"  @click="close">取 消</el-button>
            </div>

        </el-dialog>
    </div>
</template>
<script>
    export default {
        name: "addDirec",
        props: {
            value: {
                type: Boolean,
                default: false
            },
            infoForm: {
                type: Object,
                default: {}
            },
        },
        data() {
            return {
                loading: false,
                showSkuDialog: false,
                desc_list:[],
                detail_tag:[],
                list_tag:[],
                slide:[]
            };
        },
        methods: {
            handleImgSuccess(file, fileList) {
                if (file.code !== 200) {
                    this.$message.error(file.message);
                } else {
                    this.infoForm.pic = file.data;
                }
            },
            // 上传详情
            handleDescList(file, fileList) {
                if (file.code !== 200) {
                    this.$message.error(file.msg);
                } else {
                    this.infoForm.slide.push(file.data);
                }
            },
            handleRemoveDescList(file, fileList) {
                this.infoForm.slide = [];
                fileList.map(item => {
                    this.infoForm.slide.push(item.url);
                });
            },
            //多段详情
            deleteListtag(index) {
                this.infoForm.list_tag.splice(index, 1)
            },
            //删除
            addListtag() {
                if(this.infoForm.list_tag.length >= 2){
                    this.$message.warning('最多只能添加两个标签')
                }else{
                    this.infoForm.list_tag.push(null)
                }
            },
            deleteDetailtag(index){
                this.infoForm.detail_tag.splice(index, 1)
            },
            addDetailtag(){
                if(this.infoForm.detail_tag.length >= 2){
                    this.$message.warning('最多只能添加两个标签')
                }else{
                    this.infoForm.detail_tag.push(null)
                }
            },
              
            close() {
                this.$emit("input", false);
            },
            submitEdit() {
                let isNulll = false
                if(this.infoForm.detail_tag.length > 0){
                    this.infoForm.detail_tag.forEach((e,i) => {
                        if(e == null || e == ''){
                            isNulll = true
                        }
                    });
                }
                if( this.infoForm.list_tag.length>0){
                    this.infoForm.list_tag.forEach((item,i) => {
                        if(item == null || item == ''){
                            isNulll  = true
                        }
                    });
                }
                if(isNulll){
                    this.$message.warning('标签不能为空')
                    return
                }
                if(this.infoForm.iid == '' || this.infoForm.iid == undefined || this.infoForm.iid == 0){
                    this.$message.warning('商品iid不能为空')
                    return
                }
                this.detail_tag = JSON.stringify(this.infoForm.detail_tag)
                this.list_tag = JSON.stringify(this.infoForm.list_tag)
                this.slide = JSON.stringify(this.infoForm.slide)
                this.postData()
            },
            postData() {
                this.loading = true;
                let url = "/DirectsShop/addGoods"
                if(this.infoForm.id){
                    url = "/DirectsShop/editGoods"
                }
                let obj = Object.assign({detail_tag:this.detail_tag,list_tag:this.list_tag,slide:this.slide},this.infoForm)
                obj.detail_tag = JSON.stringify(obj.detail_tag) 
                obj.list_tag = JSON.stringify(obj.list_tag)
                obj.slide = JSON.stringify(obj.slide)
                this.postRequest(url, obj).then(data => {
                    this.loading = false;
                    if (data.code == 200) {
                        this.$message.success(data.msg);
                        this.$emit("input",false);
                        this.$parent.loadData();
                    } else {
                        this.$message.error(data.msg);
                    }
                });
            },
            getGoods() {
                if (this.infoForm.iid !== undefined) {
                    this.getRequest("/DirectsShop/getSearchDetail", {
                        num_iid:this.infoForm.iid
                    }).then(resp => {
                        if (resp && resp.code === 200) {
                            if(resp.data.length == 0 || resp.data == null){
                                this.$message.warning('商品iid不存在')
                            }else{
                                this.desc_list = []
                                if(this.infoForm.id){
                                    this.infoForm = Object.assign({list_tag:[''],detail_tag:[''],iid:resp.data.num_iid,id:this.infoForm.id},resp.data)
                                }else{
                                    this.infoForm = Object.assign({list_tag:[''],detail_tag:[''],iid:resp.data.num_iid},resp.data)
                                }
                                if(this.infoForm.small_title.length>14){
                                    this.infoForm.small_title =  (this.infoForm.small_title).substr(0,14)
                                }
                                if (this.infoForm.slide !== undefined) {
                                    this.infoForm.slide.map(item => {
                                        this.desc_list.push({name: item, url: item})
                                    });
                                }
                            }
                        } else {
                            this.$message.error(resp.msg); 
                        }
                    });
                } else {
                    this.$message.error("请填写商品ID");
                }
            }
        },
        computed: {
            uploadUrl() {
                return this.$store.state.base.uploadUrl;
            },
        },
        mounted() {
            if (this.infoForm.slide !== undefined) {
                this.infoForm.slide.map(item => {
                    this.desc_list.push({name: item, url: item})
                });
            }
        },
        watch: {
            
        }
    };
</script>
<style lang="scss" scoped>
.avatar-uploader>>>.el-upload{
    border: 1px solid #DEDEDE !important;
}
.upload-demo >>>
.el-upload--picture-card{
    background-color: #ffffff; 
    border: 1px solid #DEDEDE;
}
.more-content{
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin: 0 0 10px 0;
    box-sizing: border-box;
    align-items: center;
    .el-input{
        width: 88%;
    }
        .delete {
            display: inline-block;
            vertical-align: middle;
            width: 27px;
            height: 27px;
        }
        .delete:hover {
            cursor: pointer;
        }
  }
.titleText{
    font-size: 16px;
    font-family: PingFang SC;
    font-weight: bold;
    color: #212121;
    margin:0 0 20px 40px;
}
    .descList {
        // height: 240px;
        overflow-y: auto;

        /deep/ .upload-demo {
            height: 120px; 
            overflow-y: auto;
        }
    }

    /deep/ .el-upload--picture-card {
        width: 100px;
        height: 100px;
        line-height: 100px;
    }

    /deep/ .el-upload-list--picture-card .el-upload-list__item {
        width: 100px;
        height: 100px;
    }


    .content {
        height: 460px;
        overflow-y: auto;

        .item {
            width: 50%;
            display: inline-block;

            ~ .item {
                margin-top: 10px;
            }

            .zhu, .zi {
                display: flex;
                justify-content: space-between;
                flex-wrap: wrap;
                width: 80%;

                > .button-group {
                    width: 94px;

                    .el-button {
                        padding: 0 10px;
                        font-size: 20px;
                        height: 36px;
                    }
                }

                > .input-box {
                    width: 50%;
                    position: relative;
                }
            }

            > .zi > .zi_item {
                margin-top: 10px;
                display: flex;
                justify-content: space-between;
                flex-wrap: wrap;
                width: 100%;

                > .button-group {
                    width: 94px;
                    margin-left: 7px;

                    .el-button {
                        padding: 0 10px;
                        font-size: 20px;
                        height: 36px;
                    }
                }

                > .zi_icon {
                    width: 9%;
                    text-align: right;
                }

                > .input-box {
                    position: relative;
                    width: 55%;

                    > .active {
                        margin: 0 5%;
                    }

                    > .el-input {
                        width: 70%;
                    }
                }
            }
        }
    }
    /** 上传组件样式 */
  .gift_uploader >>> .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .gift_uploader >>> .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .gift_uploader >>> .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    line-height: 100px;
    text-align: center;
  }
  .gift_uploader >>> .avatar {
    width: 100px;
    height: 100px;
    display: block;
  }
</style>
<style>
  .with_custom_class{
    border-radius: 10px;
    padding-bottom: 15px;
  }
  
  .with_custom_class .el-message-box__header{
    border-radius: 10px 10px 0 0;
    background: #EFF5FF;
    color: #111111;
  }
  .with_custom_class .el-message-box__title{
    line-height: inherit;
    font-size: 16px;
  }
  .with_custom_class .el-message-box__status+.el-message-box__message{
      padding-left: 22px;
  }
  .el-message-box__status.el-icon-warning{
      color: #409EFF;
      font-size: 18px!important;
  }
  .with_custom_class .el-message-box__btns{
      text-align: center;
      width: 180px;
      margin: 0 auto;
  }
  .with_custom_class .el-message-box__btns::after{
      clear: both;
  }
  .with_custom_class .el-message-box__btns .el-button{
      padding: 12px 26px;
      float: right;
  }
  .with_custom_class .el-message-box__btns .el-button.el-button--primary{
      background: linear-gradient(90deg, #73A7FF, #448AFF);
      float: left;
  }
  .with_custom_class .el-message-box__input{
      padding-top: 0;
  }
  .with_custom_class .el-message-box__content{
      padding: 20px 30px
  }
</style>
