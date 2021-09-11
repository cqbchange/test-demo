<template>
    <el-dialog :before-close="closeDialog" :close-on-click-modal="false" :title="dilogTitle" :visible.sync="value"
                width="1200px"  custom-class="my-dialog" :append-to-body="true"
                :close-on-press-escape="false">
        <el-form :model="dataForm" size="medium">
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-form-item :label-width="formLabelWidth" label="商品标题：">
                        <el-input clearable autocomplete="off" v-model="dataForm.goods_title"></el-input>
                    </el-form-item>
                    <el-form-item :label-width="formLabelWidth" label="排序：">
                        <el-input clearable autocomplete="off" v-model="dataForm.list_order"></el-input>
                    </el-form-item>
                    <el-form-item :label-width="formLabelWidth" label="需幸运豆：">
                        <el-input clearable autocomplete="off" v-model="dataForm.lucky_count"></el-input>
                    </el-form-item>
                    <el-form-item :label-width="formLabelWidth" label="开始时间：">
                        <el-date-picker @change="choose" placeholder="选择日期时间" type="datetime" v-model="dataForm.open_prize_time"
                          value-format="timestamp"></el-date-picker>
                        <!-- <el-date-picker
                          v-model="value2"
                          type="datetimerange"
                          :picker-options="pickerOptions"
                          range-separator="至"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期"
                          value-format="timestamp"
                          align="right">
                        </el-date-picker> -->
                    </el-form-item>
                    <el-row :gutter="0" justify="space-between" type="flex">
                        <el-col :span="16">
                            <el-form-item label="广告图片：" label-width="120px">
                                <el-input clearable  style="margin-left:4px;" autocomplete="off" v-model="dataForm.goods_ad_pic"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6" style="width:inherit">
                            <el-upload :before-upload="beforeAvatarUpload" :action="uploadUrl" :on-success="handleImgSuccess3" :show-file-list="false" class="upload-demo" name="image">
                                <el-button size="medium" style="background: #E4EEFF;border-radius: 10px;border:none;color:#4188FF;height:36px" type="primary">上传图片</el-button>
                            </el-upload>
                        </el-col>
                    </el-row>
                    <el-form-item :label-width="formLabelWidth" label="广告地址：">
                        <el-input clearable autocomplete="off" v-model="dataForm.goods_ad_url"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-row :gutter="0" justify="space-between" type="flex">
                        <el-col :span="16">
                            <el-form-item label="商品主图：" label-width="120px">
                                <el-input clearable style="margin-left:4px;" autocomplete="off" v-model="dataForm.goods_pic"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6" style="width:inherit">
                            <el-upload :before-upload="beforeAvatarUpload" :action="uploadUrl" :on-success="handleImgSuccess" :show-file-list="false" class="upload-demo" name="image">
                                <el-button size="medium" style="background: #E4EEFF;border-radius: 10px;border:none;color:#4188FF;height:36px" type="primary">上传图片</el-button>
                            </el-upload>
                        </el-col>
                    </el-row>
                    <el-form-item :label-width="formLabelWidth" label="状态：">
                        <el-select placeholder="状态" size="" v-model="dataForm.status">
                            <el-option :value="'0'" label="未开奖"/>
                            <el-option :value="'1'" label="已开奖"/>
                        </el-select>
                    </el-form-item>
                    <el-form-item :label-width="formLabelWidth" label="最小开奖人数：">
                        <el-input clearable autocomplete="off" v-model="dataForm.min_start_number"></el-input>
                    </el-form-item>
                    <el-form-item :label-width="formLabelWidth" label="开奖时间：">
                        <el-date-picker @change="chooseL" placeholder="选择日期时间" type="datetime" v-model="dataForm.lottery_time"
                          value-format="timestamp"></el-date-picker>
                    </el-form-item>
                    <el-form-item :label-width="formLabelWidth" label="按钮文字：">
                        <el-input clearable autocomplete="off" v-model="dataForm.button_text"></el-input>
                    </el-form-item>
                    <el-form-item :label-width="formLabelWidth" label="广告描述：">
                        <el-input clearable autocomplete="off" v-model="dataForm.goods_ad_description"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item :label-width="formLabelWidth" label="商品原价：">
                        <el-input clearable autocomplete="off" v-model="dataForm.goods_price"></el-input>
                    </el-form-item>
                    <el-form-item :label-width="formLabelWidth" label="角标：">
                        <el-input clearable autocomplete="off" v-model="dataForm.subscript"></el-input>
                    </el-form-item>
                    <el-form-item :label-width="formLabelWidth" label="中奖人数：">
                        <el-input clearable autocomplete="off" v-model="dataForm.winning_number"></el-input>
                    </el-form-item>
                    <el-form-item :label-width="formLabelWidth" label="广告标题：">
                        <el-input clearable autocomplete="off" v-model="dataForm.goods_ad_title"></el-input>
                    </el-form-item>
                    
                    <el-form-item :label-width="formLabelWidth" label="广告按钮文字：">
                        <el-input clearable autocomplete="off" v-model="dataForm.goods_ad_text"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-form-item class="picList" label="商品详情：" label-width="120px" >
                <el-upload :before-upload="beforeAvatarUpload" class="uploadBox" :action="uploadUrl" :limit="5" :on-remove="handleRemovePicList2" :on-success="handlePicList2"
                        :show-file-list="true" list-type="picture-card" multiple name="image"
                        :file-list="dataForm.goods_slide3">
                    <i class="el-icon-plus"/>
                </el-upload>
            </el-form-item>
            <el-form-item class="picList" label="商品幻灯：" label-width="120px" >
                <el-upload :before-upload="beforeAvatarUpload" class="uploadBox" :action="uploadUrl" :limit="5" :on-remove="handleRemovePicList" :on-success="handlePicList"
                        :show-file-list="true" list-type="picture-card" multiple name="image"
                        :file-list="dataForm.goods_slide2">
                <i class="el-icon-plus"/>
                </el-upload>
            </el-form-item>
        </el-form>
        <div class="dialog-footer" slot="footer">
            <el-button @click="submitData" size="mini" style="width:90px;margin-right:40px" class="my-blue-btn" type="primary">确 定</el-button>
            <el-button @click="closeDialog" size="mini" style="width:90px">取 消</el-button>
        </div>
    </el-dialog>
</template>

<script>
const defaultInfo = function () {
  return {
    name: '',
    tag: ''
  }
}
export default {
  name: 'addTask',
  props: {
    value: Boolean,
    dataForm: {
      default: defaultInfo,
      type: Object
    }
  },
  data () {
    return {
      formLabelWidth: '120px',
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      value2:[],
    }
  },
  watch:{
    value2:{
      handler(val){
        // console.log(val)
      },
      immediate:true,
    },
  },
  methods: {
    choose(){
      if (this.dataForm.lottery_time != null && this.dataForm.open_prize_time>=this.dataForm.lottery_time) {
        if (this.dataForm.open_prize_time == null) {
          return
        }
        this.$message.warning('开始时间需小于开奖时间')
        this.dataForm.open_prize_time = null
      }
    },
    chooseL(){
      if (this.dataForm.open_prize_time != null && this.dataForm.lottery_time <=this.dataForm.open_prize_time) {
        if (this.dataForm.lottery_time == null) {
          return
        }
        this.$message.warning('开奖时间需大于开始时间')
        this.dataForm.lottery_time = null
      }
    },
    beforeAvatarUpload(file) {
      const isJPG = (file.type === 'image/jpg' || file.type === 'image/jpeg' || file.type === 'image/png');

      if (!isJPG) {
          this.$message.error('请上传图片文件(jpg,png)');
      }
      return isJPG;
    },
    // 上传图片
    handleImgSuccess (file, fileList) {
      if (file.code !== 200) {
        this.$message.error(file.message)
      } else {
        this.$set(this.dataForm, 'goods_pic', file.data)
      }
    },
    handleImgSuccess1 (file, fileList) {
      if (file.code !== 200) {
        this.$message.error(file.message)
      } else {
        this.$set(this.dataForm, 'merchant_logo', file.data)
      }
    },
    handleImgSuccess2 (file, fileList) {
      if (file.code !== 200) {
        this.$message.error(file.message)
      } else {
        this.$set(this.dataForm, 'ad_pic', file.data)
      }
    },
    handleImgSuccess3 (file, fileList) {
      if (file.code !== 200) {
        this.$message.error(file.message)
      } else {
        this.$set(this.dataForm, 'goods_ad_pic', file.data)
      }
    },
    handlePicList (file, fileList) {
      if (file.code !== 200) {
        this.$message.error(file.msg)
      } else {
        this.dataForm.goods_slide.push(file.data)
      }
      if (this.dataForm.goods_slide.length >= 5) {
        this.$message({
          message: '商品幻灯上传已达上限',
          type: 'warning'
        })
      }
    },
    handleRemovePicList (file, fileList) {
      this.dataForm.goods_slide = []
      fileList.map(item => {
        this.dataForm.goods_slide.push(item.url)
      })
    },

    handlePicList2 (file, fileList) {
      if (file.code !== 200) {
        this.$message.error(file.msg)
      } else {
        this.dataForm.goods_description.push(file.data)
      }
      if (this.dataForm.goods_description.length >= 5) {
        this.$message({
          message: '商品幻灯上传已达上限',
          type: 'warning'
        })
      }
    },
    handleRemovePicList2 (file, fileList) {
      this.dataForm.goods_description = []
      fileList.map(item => {
        this.dataForm.goods_description.push(item.url)
      })
    },
    // 提交数据
    submitData () {
      let url = '/XcxLuckyDraw/addPost'
      if (this.dataForm.id > 0) {
        url = '/XcxLuckyDraw/editPost'
      }

      let options = Object.assign({}, this.dataForm)
      if (!options.lottery_time) {
        this.$message.warning('请选择开始时间')
        return
      }
      if (!options.open_prize_time) {
        this.$message.warning('请选择开奖时间')
        return
      }
      options.lottery_time = options.lottery_time / 1000
      options.open_prize_time = options.open_prize_time / 1000
      this.postRequest(url, options).then(resp => {
        if (resp && resp.code === 200) {
          this.$message({
            message: this.dilogTitle + '成功',
            type: 'success',
            showClose: true,
            duration: 1000,
            onClose: () => {
            }
          })
          this.$emit('success', this.dataForm)
          this.closeDialog()
        } else {
          this.$message({
            message: resp.msg,
            type: 'warning',
            showClose: true,
            duration: 1000
          })
        }
      })
    },
    closeDialog () {
      this.$emit('input', false)
    }
  },
  mounted () {
    // this.goods_slide = []
    // if (this.dataForm.id !== undefined) {
    //   if (this.dataForm.goods_slide !== undefined) {
    //     this.dataForm.goods_slide.map(item => {
    //       this.goods_slide.push({name: item, url: item})
    //     })
    //   }
    // }
  },
  computed: {
    dilogTitle () {
      return this.dataForm.id > 0 ? '编辑奖品' : '增加奖品'
    },
    uploadUrl () {
      return this.$store.state.base.uploadUrl
    },
    goods_slide () {
      let slide = []
      this.dataForm.goods_slide.map(item => {
        slide.push({name: item, url: item})
      })
      return slide
    },
    goods_description () {
      let slide = []
      this.dataForm.goods_description.map(item => {
        slide.push({name: item, url: item})
      })
      return slide
    }
  }
}
</script>

<style scoped>
    .el-radio {
        margin-right: 0px !important;
    }

    .el-radio + .el-radio {
        margin-left: 15px;
    }

    .upload-demo {
        text-align: right;
    }

    .el-select {
        display: block;
    }

    .descList {
        height: 240px;
        overflow-y: auto;

        /deep/ .upload-demo {
        height: 240px;
        overflow-y: auto;
        }
    }
    .uploadBox >>> .el-upload--picture-card{
        background-color: #ffffff;
        border: 1px solid #DEDEDE;
        border-radius: 10px;
    }
    .el-upload--picture-card i{
        color: #333333;
        line-height: inherit;
    }

    /deep/ .el-upload--picture-card {
        width: 80px;
        height: 80px;
        line-height: 80px;
    }

    /deep/ .el-upload-list--picture-card .el-upload-list__item {
        width: 80px;
        height: 80px;
    }
</style>
