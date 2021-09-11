<template>
  <el-dialog :before-close="closeDialog" :close-on-click-modal="false" :title="dilogTitle" :visible.sync="value"
             width="920px" custom-class="my-dialog" :close-on-press-escape="false">
    <el-form :model="dataForm" size="medium">
      <el-row :gutter="20">
        <el-col :span="11">
          <el-form-item :label-width="formLabelWidth" label="抽奖标题:">
            <el-input autocomplete="off" v-model="dataForm.title"  size="medium"></el-input>
          </el-form-item>
          <el-form-item :label-width="formLabelWidth" label="需要金币:">
            <el-input autocomplete="off" v-model="dataForm.consume_gold"  size="medium"></el-input>
          </el-form-item>
          <el-form-item :label-width="formLabelWidth" label="中奖人数:">
            <el-input autocomplete="off" v-model="dataForm.number"  size="medium"></el-input>
          </el-form-item>
          <el-form-item :label-width="formLabelWidth" label="奖励金额:">
            <el-input autocomplete="off" v-model="dataForm.money"  size="medium"></el-input>
          </el-form-item>
           <el-form-item :label-width="formLabelWidth" label="开奖时间:">
            <el-date-picker 
                placeholder="选择日期时间" 
                type="datetime" 
                v-model="dataForm.draw_time"
                value-format="timestamp"
                :picker-options="pickerOptions">
            </el-date-picker>
          </el-form-item>
        </el-col>

        <el-col :span="11">
          <el-form-item :label-width="formLabelWidth" label="抽奖描述:">
            <el-input autosize type="textarea" autocomplete="off" v-model="dataForm.description"  size="medium"></el-input>
          </el-form-item>
          <el-row :gutter="10" justify="space-between" type="flex">
            <el-col :span="6">
              <el-form-item label="抽奖主图:" label-width="100px" >
                <div class="imgdiv" :style="dataForm.image? '':'border:1px dotted #ccc;border-radius: 8px;' ">
                  <img v-if="dataForm.image" :src="dataForm.image" alt="" width="36" height="36" >
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="7" class="upload-img-box">
              <el-upload :before-upload="beforeAvatarUpload" :action="uploadUrl" :on-success="handleImgSuccess" :show-file-list="false" class="upload-demo" name="image">
                <el-button size="medium" type="primary" class="el__btn">点击上传</el-button>
              </el-upload>
            </el-col>
          </el-row>
          <el-form-item :label-width="formLabelWidth" label="排序:">
            <el-input autocomplete="off" v-model="dataForm.order_list" placeholder="为空默认1000"  size="medium"></el-input>
          </el-form-item>
          <el-form-item :label-width="formLabelWidth" label="状态:">
            <el-select placeholder="状态"  v-model="dataForm.status"  size="medium">
              <el-option :value="0" label="下线"/>
              <el-option :value="1" label="上线"/>
            </el-select>
          </el-form-item>
          <el-form-item :label-width="formLabelWidth" label="appid:">
            <el-select placeholder="状态"  v-model="dataForm.appid"  size="medium">
              <el-option v-for="(val,key,i) in xcxList" :label="val.name" :value="val.appid" :key="i"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="dialog-footer" slot="footer">
      <el-button @click="submitData" type="primary"  size="medium">确 定</el-button>
      <el-button @click="closeDialog"  size="medium">取 消</el-button>
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
    },
    xcxList:{
      default:[],
      type:Array
    }
  },
  data () {
    return {
      formLabelWidth: '100px',
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 86400000;
        },
      },
      appidList: []
    }
  },
  methods: {
    // 上传图片
    handleImgSuccess (file, fileList) {
      if (file.code !== 200) {
        this.$message.error(file.message)
      } else {
        this.$set(this.dataForm, 'image', file.data)
      }
    },
    handleImgSuccessJFB (file, fileList) {
      if (file.code !== 200) {
        this.$message.error(file.message)
      } else {
        this.$set(this.dataForm, 'img', file.data)
      }
    },
    beforeAvatarUpload(file) {
      console.log(file)
      const isJPG = (file.type === 'image/jpg' || file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/webp' || file.type === 'image/gif' ||
      file.type === 'image/bmp' || file.type === 'image/tif' || file.type === 'image/pcx' || file.type === 'image/tga' || file.type === 'image/exif' 
      || file.type === 'image/fpx' || file.type === 'image/svg' || file.type === 'image/psd' || file.type === 'image/cdr' || file.type === 'image/pcd' 
      || file.type === 'image/dxf' || file.type === 'image/ufo' || file.type === 'image/eps' || file.type === 'image/ai' || file.type === 'image/raw'
       || file.type === 'image/WMF');

      if (!isJPG) {
        this.$message.error('请上传图片文件');
      }
      return isJPG;
    },
    // 提交数据
    submitData () {
        let url = '/XcxCashDraw/save'

        let options = Object.assign({}, this.dataForm)
        console.log(options)
        if(options.title == ''){
            this.$message({
                message: "请输入标题",
                type: 'faild',
                showClose: true,
                duration: 1000
            })
            return;
        }
        if(options.image == ''){
            this.$message({
                message: "请上传抽奖图片",
                type: 'faild',
                showClose: true,
                duration: 1000
            })
            return;
        }
        if(options.order_list == '' || isNaN(options.order_list)){
            this.dataForm.order_list = 1000;
            options.order_list = 1000;
        }
        if(options.appid == ''){
            this.$message({
                message: "请选择appid",
                type: 'faild',
                showClose: true,
                duration: 1000
            })
            return;
        }
        options.draw_time = options.draw_time / 1000
        if ((isNaN(options.consume_gold) || isNaN(options.number) || isNaN(options.money)) || (!/^[1-9]\d*$/.test(options.consume_gold) || !/^[1-9]\d*$/.test(options.number) || options.money <= 0)) {
            this.$message({
                message: "需要金币，中奖人数，奖励金额需输入大于0数字",
                type: 'faild',
                showClose: true,
                duration: 1000
            })
            isNaN(options.consume_gold) ? this.dataForm.consume_gold = '' : /^[1-9]\d*$/.test(options.consume_gold) ? '' : this.dataForm.consume_gold = '' ;
            isNaN(options.number) ? this.dataForm.number = '' : /^[1-9]\d*$/.test(options.number) ? '' : this.dataForm.number = '';
            isNaN(options.money) ? this.dataForm.money = '' : options.money > 0 ? '' : this.dataForm.money = '';
            return;
        }
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
            type: 'faild',
            showClose: true,
            duration: 1000
          })
        }
      })
    },
    closeDialog () {
      this.$emit('input', false)
    },
    // 获取Appid列表
    getAppidList() {
        this.getRequest('/XcxCashDraw/appidList', {}).then((res) => {
            if (res.code == 200) {
                if (res.data) {
                    this.appidList = res.data
                }
            } else {

            }
        })
    },
  },
  mounted () {
    // this.getAppidList()
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
        return this.dataForm.id > 0 ? '编辑抽奖' : '增加抽奖'
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

<style lang="scss" scoped>
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
  
    .el__btn{
    color: #5292FE;
    background: #E4EEFF;
    border: none;
    border-radius: 6px;
    margin-left: 10px;
    
  }
  .imgdiv{
    /* display: inline; */
    width: 36px;
    height: 36px;
    border-radius: 8px;
    overflow: hidden;
    
  }
  
</style>
