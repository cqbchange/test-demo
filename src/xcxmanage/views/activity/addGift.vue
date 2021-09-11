<!--
 * @Descripttion: 商城积分-添加商品
 * @version: 1.0
 * @Author: Dulei
 * @Date: 2021-01-15 16:52:43
 * @LastEditors: Dulei
 * @LastEditTime: 2021-01-16 17:34:13
-->
<template>
    <div>
        <el-dialog
            :title="infoForm.id?'编辑商品':'新增商品'"
            :visible="value"
            @update:visible="(val) => this.$emit('input',val)"
            custom-class="my-dialog"
            width="1500px" :append-to-body="true" style="margin-left: 210px;">
            <el-form :model="infoForm" size="medium" v-loading="loading">
                        <el-row type="flex" :gutter="0" justify="space-between">
                            <el-col :span="8">
                                <el-form-item label="标题:" label-width="100px">
                                    <el-input size="medium" 
                                        v-model="infoForm.title"
                                        autocomplete="off"
                                        placeholder="请填写标题"
                                        clearable
                                    />
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="副标题:" label-width="100px">
                                    <el-input size="medium" 
                                        v-model="infoForm.small_title"
                                        autocomplete="off"
                                        placeholder="请填写副标题"
                                        clearable
                                    />
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="文案:" label-width="100px">
                                    <el-input size="medium" 
                                        v-model="infoForm.desc"
                                        autocomplete="off"
                                        placeholder="请填写文案"
                                        clearable
                                    />
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row type="flex" :gutter="0" justify="space-between">
                            <el-col :span="8">
                                <el-form-item label="渠道:" label-width="100px">
                                    <el-select size="medium"  filterable v-model="infoForm.channel" placeholder="渠道">
                                        <el-option :value="0" label="全部"/>
                                        <el-option :value="1" label="App"/>
                                        <el-option :value="2" label="小程序"/>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="类型:" label-width="100px">
                                    <el-select size="medium"  filterable v-model="infoForm.type" placeholder="渠道">
                                        <el-option :value="0" label="虚拟"/>
                                        <el-option :value="1" label="实物"/>
                                        <el-option :value="2" label="红包"/>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="商品库存:" label-width="100px">
                                    <el-input size="medium" 
                                        v-model="infoForm.total"
                                        autocomplete="off"
                                        placeholder="请填写库存"
                                        clearable
                                    />
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row type="flex" :gutter="0" justify="space-between">
                            <el-col :span="8">
                                <el-form-item label="原价:" label-width="100px">
                                    <el-input size="medium" 
                                        v-model="infoForm.price"
                                        autocomplete="off"
                                        placeholder="请填写原价"
                                        clearable
                                    />
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="积分:" label-width="100px">
                                    <el-input size="medium" 
                                        v-model="infoForm.integral"
                                        autocomplete="off"
                                        placeholder="请填写兑换积分"
                                        clearable
                                    />
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="销量:" label-width="100px">
                                    <el-input size="medium" 
                                        v-model="infoForm.use_num"
                                        autocomplete="off"
                                        placeholder="请填写销量"
                                        clearable
                                    />
                                </el-form-item>
                            </el-col>
                            
                        </el-row>
                        <el-row type="flex" :gutter="0">
                            <el-col :span="8">
                                <el-form-item label="状态:" label-width="100px">
                                    <el-radio-group v-model="infoForm.status">
                                        <el-radio :label="0">在线</el-radio>
                                        <el-radio :label="1">下线</el-radio>
                                    </el-radio-group>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="活动时间:" label-width="100px">
                                    <el-date-picker size="medium"
                                        v-model="infoForm.goods_time"
                                        value-format="timestamp"
                                        type="datetimerange"
                                        range-separator="至"
                                        start-placeholder="开始日期"
                                        end-placeholder="结束日期"
                                        style="width:100%"
                                        :default-time="['00:00:00', '23:59:59']"
                                        prefix-icon="el-icon-date"
                                        :picker-options="pickerOptions"
                                    />
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="排序:" label-width="100px">
                                    <el-input size="medium" 
                                        v-model="infoForm.order_list"
                                        autocomplete="off"
                                        placeholder="请填写排序"
                                        clearable
                                    />
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row type="flex" :gutter="0" justify="space-between">
                            <el-col :span="8">
                            <el-form-item label="商品主图:" label-width="100px" class="gift_uploader">
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
                            <el-col :span="8">
                            <el-form-item label="商品幻灯:" label-width="100px" class="picList">
                                <el-upload
                                    list-type="picture-card"
                                    class="upload-demo"
                                    name="image"
                                    :action="uploadUrl"
                                    :on-success="handlePicList"
                                    :on-remove="handleRemovePicList"
                                    :show-file-list="true"
                                    :limit="5"
                                    multiple
                                    :file-list="pic_list"
                                >
                                    <i class="el-icon-plus"/>
                                </el-upload>
                            </el-form-item>
                            </el-col>
                            <el-col :span="8">
                            <el-form-item label="商品详情:" label-width="100px" class="descList">
                                <el-upload
                                    list-type="picture-card"
                                    class="upload-demo"
                                    name="image"
                                    :action="uploadUrl"
                                    :on-success="handleDescList"
                                    :on-remove="handleRemoveDescList"
                                    :show-file-list="true"
                                    multiple
                                    :file-list="desc_list"
                                >
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
    let defaultInfo;
    defaultInfo = function () {
        return {
            id: 0,
            title: '',
            small_title: '',
            type: 0,
            pic: '',
            price: '',
            integral: '',
            total: '',
            use_num: '',
            desc: '',
            start: new Date(),
            end: 0,
            pic_list: [],
            desc_list: [],
            goods_time: []
        }
    };
    export default {
        name: "giftDetail",
        props: {
            value: {
                type: Boolean,
                default: false
            },
            info: {
                type: Object,
                default: {}
            }
        },
        data() {
            return {
                loading: false,
                showSkuDialog: false,
                infoForm: defaultInfo(),
                pic_list: [],
                desc_list: []
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
            // 上传幻灯
            handlePicList(file, fileList) {
                if (file.code !== 200) {
                    this.$message.error(file.msg);
                } else {
                    this.infoForm.pic_list.push(file.data);
                }
                if (this.infoForm.pic_list.length >= 5) {
                    this.$message({
                        message: '商品幻灯上传已达上限',
                        type: 'warning'
                    });
                }
            },
            handleRemovePicList(file, fileList) {
                this.infoForm.pic_list = [];
                fileList.map(item => {
                    this.infoForm.pic_list.push(item.response.data);
                });
            },
            // 上传详情
            handleDescList(file, fileList) {
                if (file.code !== 200) {
                    this.$message.error(file.msg);
                } else {
                    this.infoForm.desc_list.push(file.data);
                }
            },
            handleRemoveDescList(file, fileList) {
                this.infoForm.desc_list = [];
                fileList.map(item => {
                    this.infoForm.desc_list.push(item.response.data);
                });
            },
            deleteRow(index, rows) {
                rows.splice(index, 1);
            },
            close() {
                this.$emit("input", false);
            },
            submitEdit: function () {
                console.log(this.infoForm);
                if (this.infoForm.goods_time !== null) {
                    this.infoForm.start = this.infoForm.goods_time[0] / 1000;
                    this.infoForm.end = this.infoForm.goods_time[1] / 1000;
                }
                this.infoForm.skus = JSON.stringify(this.infoForm.sku);
                this.infoForm.sku_datas = JSON.stringify(this.infoForm.sku_data);
                if (this.infoForm.id !== 0) {
                    this.$confirm("此操作将修改该商品的数据, 是否继续?", "提示", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        customClass: 'with_custom_class',
                        type: "warning"
                    })
                        .then(() => {
                            this.postData();
                        })
                        .catch(() => {
                        });
                } else {
                    this.postData();
                }
            },
            postData: function () {
                this.loading = true;
                this.postRequest("/gift/postEdit", this.infoForm).then(data => {
                    this.loading = false;
                    if (data.code === 200) {
                        this.$message.success(data.msg);
                        this.$emit("input", false);
                        this.$emit("chage", this.infoForm);
                    } else {
                        this.$message.error(data.msg);
                    }
                });
            },
        },
        computed: {
            catList() {
                return this.$store.state.base.catList;
            },
            uploadUrl() {
                return this.$store.state.base.uploadUrl;
            },
            pickerOptions() {
                return this.$store.state.base.pickerOptions;
            }
        },
        mounted() {
            if (this.info.id !== undefined) {
                this.infoForm = Object.assign({}, this.info);
                this.pic_list = [];
                this.desc_list = [];
                if (this.info.pic_list !== undefined) {
                    this.info.pic_list.map(item => {
                        this.pic_list.push({name: item, url: item});
                    });
                }
                if (this.info.desc_list !== undefined) {
                    this.info.desc_list.map(item => {
                        this.desc_list.push({name: item, url: item});
                    });
                }
            }
        },
        watch: {
            info(val) {
                this.infoForm = Object.assign({}, val);
            }
        }
    };
</script>
<style lang="scss" scoped>
    .descList {
        height: 240px;
        overflow-y: auto;

        /deep/ .upload-demo {
            height: 240px;
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
