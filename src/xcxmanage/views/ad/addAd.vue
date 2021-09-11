<!--
 * @Descripttion: 广告管理
 * @version: 1.0
 * @Author: LiZhi
 * @Date: 2021-01-15 16:52:43
 * @LastEditors: WangChuan
 * @LastEditTime: 2021-03-12 10:39:51
-->
<template>
<div>
<el-dialog :close-on-click-modal="false" :before-close="closeDialog" :title="dilogTitle" :visible.sync="value"
             custom-class="my-dialog" width="1140px" :append-to-body="true" :close-on-press-escape="false">
    <el-form :model="dataForm" size="medium" v-loading="loading" element-loading-spinner="el-icon-loading">
      <el-row :gutter="24">
        <el-col :span="11">
          <el-form-item :label-width="formLabelWidth" label="标题:" class="formItem">
            <el-input autocomplete="off" v-model="dataForm.title" clearable size="medium"/>
          </el-form-item>
          <el-form-item  :label-width="formLabelWidth" label="广告位:" class="mydiv formItem">
            <el-select multiple clearable  placeholder="广告位" v-model="dataForm.slot_id" filterable size="medium">
              <el-option :key="item.id" :label="item.name" :value="item.id"
                         v-for="item in adSlot"/>
            </el-select>
          </el-form-item>
          
          <el-form-item :label-width="formLabelWidth" label="排序:" class="formItem">
            <el-input autocomplete="off" v-model="dataForm.list_order" clearable size="medium"/>
          </el-form-item>
          <el-form-item :label-width="formLabelWidth" label="上传图片:" class="formItem">
            <el-row  type="flex" :gutter="0" justify="space-between">
              <!-- <el-col :span="17" class="upload-img-box">
                <el-input autocomplete="off" readonly v-model="dataForm.image"/>
              </el-col> -->
              <div class="imgdiv" :style="dataForm.image? '':'border:1px dotted #ccc' ">
                <img v-if="dataForm.image" :src="dataForm.image" alt="" width="36" height="36" >
              </div>
              <el-col :span="7">
                <el-upload :action="uploadUrl" :on-success="handleImgSuccess" :show-file-list="false" class="upload-img" name="image">
                  <el-button size="medium" type="primary" class="el__btn" >点击上传</el-button>
                </el-upload>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item :label-width="formLabelWidth" label="起止日期:" class="formItem">
            <el-date-picker
              end-placeholder="结束日期"
              range-separator="至"
              start-placeholder="开始日期"
              style="width:100%"
              type="daterange"
              unlink-panels
              v-model="dataForm.daterange"
              value-format="timestamp"
              :picker-options="pickerOptions"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item :label-width="formLabelWidth" label="类型:" class="formItem">
            <el-select placeholder="类型" v-model="dataForm.type" size="medium">
              <el-option label="空" value="0"/>
              <el-option label="跳转URL" value="1"/>
              <el-option label="跳转小程序" value="2"/>
              <el-option label="跳转页面" value="3"/>
              <el-option label="插件页面" value="5"/>
              <el-option label="跳转生活号" value="6"/>
              <el-option label="跳转指定页面" value="7"/>
              <el-option label="加群" value="8"/>
              <el-option label="分享" value="9"/>
              <el-option label="打卡提现弹窗" value="10"/>
              <el-option label="跳转淘宝" value="11"/>
              <el-option label="自有启动" value="12"/>
              <el-option label="三方启动" value="13"/>
            </el-select>
          </el-form-item>
          <el-form-item :label-width="formLabelWidth" label="每日点击数量:" class="formItem">
            <el-input autocomplete="off" v-model="dataForm.limit_click_amount" clearable/>
          </el-form-item>   
        </el-col>     

        <el-col :span="11" >
          <el-form-item :label-width="formLabelWidth" label="小标题:" class="formItem">
            <el-input autocomplete="off" v-model="dataForm.subtitle" clearable size="medium"/>
          </el-form-item>
          <el-form-item :label-width="formLabelWidth" label="cpc单价:" class="formItem">
            <el-input autocomplete="off" v-model="dataForm.cpc_money" clearable size="medium"></el-input>
          </el-form-item>
          <el-form-item :label-width="formLabelWidth" label="描述:" class="formItem">
            <el-input autocomplete="off" v-model="dataForm.description" clearable size="medium"/>
          </el-form-item>
          <el-form-item :label-width="formLabelWidth" label="最低显示版本:" class="formItem">
            <el-input autocomplete="off" v-model="dataForm.version" clearable size="medium"/>
          </el-form-item>
          <el-form-item :label-width="formLabelWidth" label="起止时间:" class="formItem">
          <el-time-picker
            style="width:100%"
            is-range
            v-model="dataForm.timerange"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            placeholder="选择时间范围"
            value-format="timestamp"
          >
          </el-time-picker>
          </el-form-item>
          <el-form-item :label-width="formLabelWidth" label="跳转地址:"
                        v-if="dataForm.type === '1'  || dataForm.type === '5' || dataForm.type === '6'  || dataForm.type === '7' || dataForm.type === '11' || dataForm.type === '12'" class="formItem">
            <el-input @paste.native="paste" autocomplete="off" v-model="dataForm.url" clearable/>
          </el-form-item>
          <el-form-item :label-width="formLabelWidth" label="APPID" v-if="dataForm.type === '2'">
            <el-input @paste.native="paste" autocomplete="off" v-model="dataForm.appid" clearable/>
          </el-form-item>
          <el-form-item :label-width="formLabelWidth" label="路径"
                        v-if="dataForm.type === '2' || dataForm.type === '3'">
            <el-input @paste.native="paste" autocomplete="off" v-model="dataForm.path" clearable/>
          </el-form-item>
          <el-form-item :label-width="formLabelWidth" label="参数"
                        v-if="dataForm.type === '2' || dataForm.type === '3'">
            <el-input @paste.native="paste" autocomplete="off" v-model="dataForm.extra_data" clearable/>
          </el-form-item>
          
        </el-col>
      </el-row>
      <div class="bottom_radio">
        <el-form-item label-width="100px" label="测试广告:" class="formItem">
          <el-radio-group v-model="dataForm.dev" class="radioitem">
            <el-radio :label="'1'">是</el-radio>
            <el-radio :label="'0'">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label-width="100px" label="是否发布:" class="formItem" >
          <el-radio-group v-model="dataForm.status" class="radioitem">
            <el-radio :label="'1'" class="radioitem">是</el-radio>
            <el-radio :label="'0'">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label-width="100px" label="特殊显示:" class="formItem">
          <el-radio-group v-model="dataForm.filter" class="radioitem">
            <el-radio :label="'1'">是</el-radio>
            <el-radio :label="'0'">否</el-radio>
          </el-radio-group>
        </el-form-item>
        
      </div>
    </el-form>
    
    <div class="dialog-footer" slot="footer">
      <el-button @click="submitData" type="primary" size="medium">确 定</el-button>
      <el-button @click="closeDialog" size="medium">取 消</el-button>
    </div>
  </el-dialog>
</div>
  
</template>

<script>
  const defaultInfo = function () {
    return {
      name: '',
      tag: '',
      
    }
  }
  export default {
    name: 'addAd',
    props: {
      value: Boolean,
      class_id: {
        default: 0,
        type: [String, Number]
      },
      mid: {
        default: 0,
        type: [String, Number]
      },
      dataForm: {
        default: defaultInfo,
        type: Object
      }
    },
    data() {
      return {
        formLabelWidth: '140px',
        adSlot: [],
        loading:false
      }
    },
    methods: {
      // 上传图片
      handleImgSuccess(file, fileList) {
        if (file.code !== 200) {
          this.$message.error(file.message)
        } else {
          this.$set(this.dataForm, 'image', file.data)
        }
      },
      // 获取广告位
      getData() {
        this.getRequest('/miniProgram/getAdSlot', {mid: this.mid}).then(resp => {
          if (resp && resp.code === 200) {
            this.adSlot = resp.data
          }
        })
      },
      paste(e) {
        let str = e.clipboardData.getData('text').trim()
        if (this.dataForm.type === '7') {
          e.preventDefault()
          e.stopPropagation();
          this.dataForm.url = encodeURIComponent(str)
          return
        }
        if (str.substr(0, 10) == 'alipays://') {
          e.preventDefault()
          e.stopPropagation()
          let query = str.substr(str.indexOf('?') + 1)
          let params = this.parseQuery(query)
          this.dataForm.appid = params.appId
          this.dataForm.path = decodeURIComponent(params.page)
          this.dataForm.type = '2'
          if (params.query !== undefined) {
            this.dataForm.extra_data = params.query
          } else {
            this.dataForm.extra_data = ''
          }
        } else if (str.substr(0, 9) == 'plugin://') {
          e.preventDefault()
          e.stopPropagation()
          this.dataForm.type = '5'
          this.dataForm.url = str
        } else if (str.substr(0, 57) == 'https://render.alipay.com/p/h5/life_public/www/index.html') {
          e.preventDefault()
          e.stopPropagation()
          this.dataForm.type = '6'
          this.dataForm.url = str
        } else if ((str.substr(0, 50) == 'https://h5.m.taobao.com/taolive/video.html?userId=') || (str.substr(0, 47) == 'https://m.taobao.com/taolive/video.html?userId=')) {
          e.preventDefault()
          e.stopPropagation()
          this.dataForm.type = '7'
          this.dataForm.url = encodeURIComponent('tbopen://m.taobao.com/tbopen/index.html?h5Url='+encodeURIComponent(str));
        }
      },
      parseQuery(query) {
        let params = {}
        if (query.indexOf('?') !== false) {
          let tmp = query.substr(query.indexOf('?'))
          let tmp1 = ''
          if (tmp.indexOf('&query') !== -1) {
            tmp1 = tmp.substring(0, tmp.indexOf('&query'))
          } else {
            tmp1 = tmp
          }
          query = query.replace(tmp1, encodeURIComponent(tmp1))
        }
        for (let item of query.split('&')) {
          var tmp = item.split('=')
          params[tmp[0]] = decodeURIComponent(tmp[1])
        }
        return params
      },
      // 提交数据
      submitData() {
        this.loading = true
        let url = '/miniProgram/adAddPost'
        if (this.dataForm.id > 0) {
          url = '/miniProgram/adEditPost'
        }
        let options = Object.assign({}, this.dataForm)
        options.start_time = options.daterange[0] / 1000
        options.end_time = options.daterange[1] / 1000
        options.time_start = options.timerange[0] / 1000;
        options.time_end = options.timerange[1] / 1000;
        this.postRequest(url, options).then(resp => {
          if (resp && resp.code === 200) {
            this.loading = false
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
            this.loading = false
          }
        })
      },
      closeDialog() {
        this.$emit('input', false)
      }
    },
    mounted() {
      // this.getData()
    },
    computed: {
      dilogTitle() {
        return this.dataForm.id > 0 ? '编辑数据' : '增加数据'
      },
      uploadUrl() {
        return this.$store.state.base.uploadUrl
      },
      pickerOptions(){
        return this.$store.state.base.pickerOptions
      }
    },
    watch: {
      mid: {
        handler(val) {
          if (val !== '') {
            this.getData()
          }
        },
        immediate: true
      }
    }
  }
</script>

<style scoped>
.dialogdiv{
  font-size: 20px;
}
  .el-radio {
    margin-right: 0 !important;
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
  .el-form-item{
    margin-bottom: 24px;
  }
  .el__btn{
    color: #5292FE;
    background: #E4EEFF;
    border: none;
    border-radius: 6px;
    margin-left: 10px;
  }
  .bottom_radio{
    display: flex;
    width: 91%;
    justify-content:space-between;
    margin: auto;
  }
  div >>> .el-dialog__body{
    padding: 30px 20px 0 20px;
  }
  div >>> .dialog-footer{
    margin-bottom: 30px;
  }
  .imgdiv{
    width: 36px;
    height: 36px;
    overflow: hidden;
    border-radius: 8px;
  }
</style>
