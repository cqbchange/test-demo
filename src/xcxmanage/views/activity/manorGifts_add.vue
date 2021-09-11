<template>
  <el-dialog :before-close="closeDialog" :close-on-click-modal="false" :title="dilogTitle" :visible.sync="value"
             width="1020px" custom-class="my-dialog" :close-on-press-escape="false">
    <el-form :model="dataForm" size="medium">
      <el-row :gutter="20">
        <el-col :span="11">
            <el-form-item :label-width="formLabelWidth" label="小程序:">
                <el-select placeholder="小程序"  v-model="dataForm.appid"  size="medium">
                    <el-option v-for="(item,i) in xcxList" :label="item.app_name" :value="item.mini_appid" :key="i"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item :label-width="formLabelWidth" label="商品标题:">
                <el-input autocomplete="off" v-model="dataForm.thing_name"  size="medium"></el-input>
            </el-form-item>
            <el-form-item v-if="dataForm.exchange_type == 1" :label-width="formLabelWidth" label="金额:">
                <el-input autocomplete="off" v-model="dataForm.red_envelope_amount"  size="medium"></el-input>
            </el-form-item>
            <el-form-item :label-width="formLabelWidth" label="每日兑换上限:">
                <el-input autocomplete="off" v-model="dataForm.max_count"  size="medium"></el-input>
            </el-form-item>
            <el-form-item :label-width="formLabelWidth" label="排序:">
                <el-input autocomplete="off" v-model="dataForm.order_sort" placeholder="越大越靠前"  size="medium"></el-input>
            </el-form-item>
        </el-col>

        <el-col :span="11">
            <el-form-item :label-width="formLabelWidth" label="好礼类型:">
                <el-select placeholder="好礼类型"  v-model="dataForm.exchange_type"  size="medium">
                <el-option :value="1" label="虚拟"/>
                <el-option :value="2" label="实物"/>
                </el-select>
            </el-form-item>
            <el-row :gutter="10" justify="space-between" type="flex">
                <el-col :span="6">
                <el-form-item label="主图:" :label-width="formLabelWidth" >
                    <div class="imgdiv" :style="dataForm.image_url? '':'border:1px dotted #ccc;border-radius: 8px;' ">
                    <img v-if="dataForm.image_url" :src="dataForm.image_url" alt="" width="36" height="36" >
                    </div>
                </el-form-item>
                </el-col>
                <el-col :span="7" class="upload-img-box">
                <el-upload :before-upload="beforeAvatarUpload" :action="uploadUrl" :on-success="handleImgSuccess" :show-file-list="false" class="upload-demo" name="image">
                    <el-button size="medium" type="primary" class="el__btn">点击上传</el-button>
                </el-upload>
                </el-col>
            </el-row>

            <el-form-item :label-width="formLabelWidth" label="需要金蛋:">
                <el-input autocomplete="off" placeholder="兑换需要的金蛋数" v-model="dataForm.price" onkeyup="value = value.replace(/[^0-9]/g, '')"  size="medium"></el-input>
            </el-form-item>
           
            <el-form-item :label-width="formLabelWidth" label="每日开启兑换时间:">
                <el-time-picker 
                    placeholder="选择开启时间" 
                    type="datetime" 
                    v-model="dataForm.rush_time"
                    value-format="timestamp"
                    :picker-options="pickerOptions">
                </el-time-picker>
            </el-form-item>
            <el-form-item :label-width="formLabelWidth" label="状态:">
                <el-radio-group v-model="dataForm.enabled">
                    <el-radio :label="0">上线</el-radio>
                    <el-radio :label="1">下线</el-radio>
                </el-radio-group>
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
  name: 'manorGifts_add',
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
      formLabelWidth: '140px',
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 86400000;
        },
      },
    }
  },
  mounted () {
   
  },
  methods: {
    // 上传图片
    handleImgSuccess (file, fileList) {
      if (file.code !== 200) {
        this.$message.error(file.message)
      } else {
        this.dataForm.image_url = file.data
      }
    },
    beforeAvatarUpload(file) {
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
    // 提交数据
    submitData(){
      let url = '111'
      if(this.dataForm.id >0){
        url = '/collaregg/exchangeGoods/up'
      }else{
        url = '/collaregg/exchangeGoods/insert'
      }
      let options = Object.assign({}, this.dataForm)
      if(options.appid === '' || options.appid == undefined ){
        this.$message.warning('请选择小程序')
        return
      }
      if(options.thing_name === '' || options.thing_name == undefined){
        this.$message.warning('请输入标题')
        return
      }
      if(options.exchange_type === '' || options.exchange_type == undefined){
        this.$message.warning('请选择类型')
        return
      }else{
        if(options.exchange_type === 1 && (options.red_envelope_amount == '' || options.red_envelope_amount == undefined)){
          this.$message.warning('请输入金额')
          return
        }
      }
      if(options.max_count === '' || options.max_count == undefined){
        this.$message.warning('请输入每日兑换上限')
        return
      }
      if(options.order_sort === '' || options.order_sort == undefined){
        this.$message.warning('请输入排序')
        return
      }
      if(options.image_url === '' || options.image_url == undefined){
        this.$message.warning('请上传主图')
        return
      }
      if(options.price === '' || options.price === undefined){
        this.$message.warning('请输入金蛋数')
        return
      }
      if(options.rush_time === '' || options.rush_time === undefined){
        this.$message.warning('请选择开启兑换时间')
        return
      }
      if(options.enabled === '' || options.enabled == undefined){
        this.$message.warning('请选择状态')
        return
      }
      options.rush_time = this.dateFormat('HH:MM:SS',new Date(this.dataForm.rush_time))
      options.application_json = true
      
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
  },
  
  computed: {
    dilogTitle () {
        return this.dataForm.id > 0 ? '编辑好礼' : '增加好礼'
    },
    uploadUrl () {
        return this.$store.state.base.uploadUrl
    },
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
