<template>
  <el-dialog :before-close="closeDialog" :close-on-click-modal="false" :title="dilogTitle" :visible.sync="value"
             width="1200px" :append-to-body="true" :close-on-press-escape="false" custom-class="my-dialog">
    <el-form :model="dataForm" size="medium">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item :label-width="formLabelWidth" label="商品标题">
            <el-input clearable autocomplete="off" v-model="dataForm.goods_title"></el-input>
          </el-form-item>
          <el-form-item :label-width="formLabelWidth" label="商品描述">
            <el-input clearable autocomplete="off" v-model="dataForm.goods_description"></el-input>
          </el-form-item>
          <el-row :gutter="0" justify="space-between" type="flex">
            <el-col :span="16">
              <el-form-item label="商品主图" label-width="100px">
                <el-input clearable autocomplete="off" v-model="dataForm.goods_pic"/>
              </el-form-item>
            </el-col>
            <el-col :span="6" style="width:inherit">
              <el-upload  :before-upload="beforeAvatarUpload" :action="uploadUrl" :on-success="handleImgSuccess" :show-file-list="false" class="upload-demo" name="image">
                <el-button size="medium" style="background: #E4EEFF;border-radius: 10px;border:none;color:#4188FF" type="">点击上传</el-button>
              </el-upload>
            </el-col>
          </el-row>
          <el-form-item :label-width="formLabelWidth" label="商品原价">
            <el-input clearable autocomplete="off" v-model="dataForm.goods_price"></el-input>
          </el-form-item>
          <el-row :gutter="0" justify="space-between" type="flex">
            <el-col :span="16">
              <el-form-item label="商家logo" label-width="100px">
                <el-input clearable autocomplete="off" v-model="dataForm.merchant_logo"/>
              </el-form-item>
            </el-col>
            <el-col :span="6" style="width:inherit">
              <el-upload  :before-upload="beforeAvatarUpload" :action="uploadUrl" :on-success="handleImgSuccess1" :show-file-list="false" class="upload-demo" name="image">
                <el-button size="medium" style="background: #E4EEFF;border-radius: 10px;border:none;color:#4188FF" type="">点击上传</el-button>
              </el-upload>
            </el-col>
          </el-row>
          <el-form-item :label-width="formLabelWidth" label="商家名称">
            <el-input clearable autocomplete="off" v-model="dataForm.merchant_name"></el-input>
          </el-form-item>
          <el-form-item :label-width="formLabelWidth" label="商家描述">
            <el-input clearable autocomplete="off" v-model="dataForm.merchant_description"></el-input>
          </el-form-item>
          <el-form-item :label-width="formLabelWidth" label="商家地址">
            <el-input clearable autocomplete="off" v-model="dataForm.merchant_url"></el-input>
          </el-form-item>
          <el-form-item :label-width="formLabelWidth" label="排序">
            <el-input clearable autocomplete="off" v-model="dataForm.list_order"></el-input>
          </el-form-item>
          <el-form-item :label-width="formLabelWidth" label="状态">
            <el-input clearable autocomplete="off" v-model="dataForm.status"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label-width="formLabelWidth" label="每注所需金币">
            <el-input clearable autocomplete="off" v-model="dataForm.gold_bets"></el-input>
          </el-form-item>
          <el-form-item :label-width="formLabelWidth" label="最多投注次数">
            <el-input clearable autocomplete="off" v-model="dataForm.max_number_bets"></el-input>
          </el-form-item>
          <el-form-item :label-width="formLabelWidth" label="最小开奖人数">
            <el-input clearable autocomplete="off" v-model="dataForm.min_start_numer"></el-input>
          </el-form-item>
          <el-form-item :label-width="formLabelWidth" label="中奖人数">
            <el-input clearable autocomplete="off" v-model="dataForm.winning_number"></el-input>
          </el-form-item>
          <el-form-item :label-width="formLabelWidth" label="开始时间">
            <el-date-picker placeholder="选择日期时间" type="datetime" v-model="dataForm.start_time"
                            value-format="timestamp"></el-date-picker>
          </el-form-item>
          <el-form-item :label-width="formLabelWidth" label="开奖时间">
            <el-date-picker placeholder="选择日期时间" type="datetime" v-model="dataForm.lottery_time"
                            value-format="timestamp"></el-date-picker>
          </el-form-item>
          <el-form-item class="picList descList" label="商品图片" label-width="100px" >
            <el-upload  :before-upload="beforeAvatarUpload" :action="uploadUrl" :limit="5" :on-remove="handleRemovePicList" :on-success="handlePicList"
                       :show-file-list="true" class="upload-demo" list-type="picture-card" multiple name="image" style="text-align:left"
                       :file-list="dataForm.goods_slide2">
              <i class="el-icon-plus"/>
            </el-upload>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-row :gutter="0" justify="space-between" type="flex">
            <el-col :span="16">
              <el-form-item label="广告图片" label-width="100px">
                <el-input clearable autocomplete="off" v-model="dataForm.ad_pic"/>
              </el-form-item>
            </el-col>
            <el-col :span="6" style="width:inherit">
              <el-upload  :before-upload="beforeAvatarUpload" :action="uploadUrl" :on-success="handleImgSuccess2" :show-file-list="false" class="upload-demo" name="image">
                <el-button size="medium" style="background: #E4EEFF;border-radius: 10px;border:none;color:#4188FF" type="">点击上传</el-button>
              </el-upload>
            </el-col>
          </el-row>
          <el-form-item :label-width="formLabelWidth" label="广告地址">
            <el-input clearable autocomplete="off" v-model="dataForm.ad_url"></el-input>
          </el-form-item>
          <el-row :gutter="0" justify="space-between" type="flex">
            <el-col :span="16">
              <el-form-item label="下注成功图片" label-width="100px">
                <el-input clearable autocomplete="off" v-model="dataForm.succeed_ad_pic"/>
              </el-form-item>
            </el-col>
            <el-col :span="6" style="width:inherit">
              <el-upload  :before-upload="beforeAvatarUpload" :action="uploadUrl" :on-success="handleImgSuccess3" :show-file-list="false" class="upload-demo" name="image">
                <el-button size="medium" style="background: #E4EEFF;border-radius: 10px;border:none;color:#4188FF" type="">点击上传</el-button>
              </el-upload>
            </el-col>
          </el-row>
          <el-form-item :label-width="formLabelWidth" label="下注成功标题">
            <el-input clearable autocomplete="off" v-model="dataForm.succeed_ad_title"></el-input>
          </el-form-item>
          <el-form-item :label-width="formLabelWidth" label="下注成功描述">
            <el-input clearable autocomplete="off" v-model="dataForm.succeed_ad_description"></el-input>
          </el-form-item>
          <el-form-item :label-width="formLabelWidth" label="下注成功按钮">
            <el-input clearable autocomplete="off" v-model="dataForm.succeed_ad_button"></el-input>
          </el-form-item>
          <el-form-item :label-width="formLabelWidth" label="下注成功地址">
            <el-input clearable autocomplete="off" v-model="dataForm.succeed_ad_url"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="dialog-footer" slot="footer">
      <el-button @click="submitData"  class="my-blue-btn" type="primary">确 定</el-button>
      <el-button @click="closeDialog">取 消</el-button>
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
      formLabelWidth: '100px'
    }
  },
  methods: {
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
        this.$set(this.dataForm, 'succeed_ad_pic', file.data)
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
        this.dataForm.goods_slide.push(item.response.data)
      })
    },
    // 提交数据
    submitData () {
      let url = '/XcxCapture/addPost'
      if (this.dataForm.id > 0) {
        url = '/XcxCapture/editPost'
      }
      if (this.dataForm.goods_title == '') {
        this.$message.warning('请填写商品标题')
        return;
      }
      if (this.dataForm.goods_pic == '') {
        this.$message.warning('请上传商品主图')
        // return;
      }
      if (this.dataForm.goods_price == '') {
        this.$message.warning('请填写商品原价')
        return;
      }else{
        if(!/(^[1-9]\d*(\.\d{1,2})?$)|(^0(\.\d{1,2})?$)/.test(this.dataForm.goods_price)){
          this.$message.warning('请输入正确的商品原价(整数或两位小数)')
          return
        }else{
            
        }
      }
      if (this.dataForm.merchant_logo == '') {
        this.$message.warning('请上传商家logo')
        return;
      }
      if (this.dataForm.merchant_name == '') {
        this.$message.warning('请填写商家名称')
        return;
      }
      if (this.dataForm.goods_title == '') {
        this.$message.warning('请填写商品标题')
        return;
      }

      
      let options = Object.assign({}, this.dataForm)
      options.start_time = options.start_time / 1000
      options.lottery_time = options.lottery_time / 1000
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
            message: resp.message,
            type: 'faild',
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