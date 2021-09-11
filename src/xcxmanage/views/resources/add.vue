<!--
 * @Descripttion: 粉推广告图
 * @version: 1.0
 * @Author: LiZhi
 * @Date: 2021-01-15 16:52:43
 * @LastEditors: LiZhi
 * @LastEditTime: 2021-01-16 17:37:18
-->
<template>
  <el-dialog :close-on-click-modal="false" :before-close="closeDialog" :title="dilogTitle" 
  :visible.sync="value" width="600px" custom-class="my-dialog" :append-to-body="true" :close-on-press-escape="false">
    <el-form :model="dataForm" size="medium" class="el-body">
      <el-row>
        <el-form-item label-width="100px" label="分类：" >
          <el-select placeholder="分类" v-model="dataForm.cid" size="medium" filterable>
            <el-option :key="item.id" :label="item.name" :value="item.id" v-for="item in adSlot"></el-option>
          </el-select>
        </el-form-item>
      </el-row>
      <el-row type="flex" :gutter="0" justify="space-between">
        <el-form-item label-width="5px">
          <span>添加广告图：  </span>
        </el-form-item>
        <el-form-item  class="img-div" >
          <el-upload class="avatar-uploader" name="image" :action="uploadUrl" 
          :on-success="handleLevelSuccess1" :show-file-list="false" :before-upload="beforeUpload">
            <img v-if="dataForm.image" :src="dataForm.image" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <i v-if="dataForm.image" class="el-icon-error delete" @click.stop="dataForm.image=''"></i>
          </el-upload>
          <p class="text">任务区</p>
        </el-form-item>
        <el-form-item  class="img-div">
          <el-upload class="avatar-uploader" name="image" :action="uploadUrl" 
          :on-success="handleLevelSuccess2" :show-file-list="false" :before-upload="beforeUpload">
            <img v-if="dataForm.bubble_jfb" :src="dataForm.bubble_jfb" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon "></i>
            <i v-if="dataForm.bubble_jfb" class="el-icon-error delete" @click.stop="dataForm.bubble_jfb=''"></i>
          </el-upload>
          <p class="text">气泡集分宝</p>
        </el-form-item>
        <el-form-item  class="img-div">
          <el-upload class="avatar-uploader" name="image" :action="uploadUrl" 
          :on-success="handleLevelSuccess3" :show-file-list="false" :before-upload="beforeUpload">
            <img v-if="dataForm.bubble_integral" :src="dataForm.bubble_integral" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <i v-if="dataForm.bubble_integral" class="el-icon-error delete" @click.stop="dataForm.bubble_integral=''"></i>
          </el-upload>
          <p class="text">气泡金币</p>
        </el-form-item>
        <el-form-item  class="img-div">
          <el-upload class="avatar-uploader" name="image" :action="uploadUrl" 
          :on-success="handleLevelSuccess4" :show-file-list="false" :before-upload="beforeUpload">
            <img v-if="dataForm.cat_img" :src="dataForm.cat_img" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <i v-if="dataForm.cat_img" class="el-icon-error delete" @click.stop="dataForm.cat_img=''"></i>
          </el-upload>
          <p class="text">分类图片</p>
        </el-form-item>
      </el-row>
    </el-form>
    <div class="dialog-footer" slot="footer">
      <el-button @click="submitData" type="primary" size="medium">确 定</el-button>
      <el-button @click="closeDialog" size="medium">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    value: Boolean,
    cid: {
      default: 0,
      type: [String, Number],
    },
    dataForm: {
      type: Object,
      // eslint-disable-next-line vue/require-valid-default-prop
      default: {
        name: ''
      }
    }
  },
  data () {
    return {
      adSlot: [],
      size:100,
      dialogVisible:false
    }
  },
  methods: {
    // 获取广告位
    getCat() {
      this.getRequest('/adimg/cat', {cid: this.cid,
        p: 1,
        size: this.size}).then(
        (resp) => {
          if (resp && resp.code === 200) {
            this.adSlot = resp.data.list
          }
        }
      )
    },
    // 提交数据
    submitData () {
      if(this.dataForm.image===''||this.dataForm.bubble_jfb===''||this.dataForm.bubble_integral===''||this.dataForm.cat_img===''){
        this.$message.warning('图片不能为空')
        return
      }
      let url = '/adimg/add'
      if (this.dataForm.id > 0) {
        url = '/adimg/edit'
      }
      this.postRequest(url, this.dataForm).then(resp => {
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
          this.$emit('addClassemit',true)
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
    // 关闭弹窗
    closeDialog () {
      this.$emit('input', false)
    },
    beforeUpload(file){
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
   
    // 上传图片处理
    handleLevelSuccess1 (file, fileList) {
      if (file.code !== 200) {
        this.$message.error(file.message)
      } else {
        this.dataForm.image = file.data
      }
    },
    handleLevelSuccess2 (file, fileList) {
      if (file.code !== 200) {
        this.$message.error(file.message)
      } else {
        this.dataForm.bubble_jfb = file.data
      }
    },
    handleLevelSuccess3 (file, fileList) {
      if (file.code !== 200) {
        this.$message.error(file.message)
      } else {
        this.dataForm.bubble_integral = file.data
      }
    },
    handleLevelSuccess4 (file, fileList) {
      if (file.code !== 200) {
        this.$message.error(file.message)
      } else {
        this.dataForm.cat_img = file.data
      }
    },
    handleLevelSuccess5 (file, fileList) {
      if (file.code !== 200) {
        this.$message.error(file.message)
      } else {
        this.dataForm.bubble_zlqdd = file.data
      }
    }
  },
  mounted () {
    
  },
  watch: {
    cid: {
      handler(val) {
        if (val !== '') {
          this.getCat()
        }
      }
    },
    value(val){
      if(val){
          this.getCat()
      }
    }
  },
  computed: {
    dilogTitle () {
      return this.dataForm.id > 0 ? '编辑数据' : '增加数据'
    },
    uploadUrl () {
      return '/adimg/upload'
      // return this.$store.state.base.uploadUrl
    }
  }
}
</script>

<style scoped>
  .img-div >>> .avatar-uploader .el-upload {
    border: 1px solid #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    display: table-cell;
    vertical-align: middle;
  }
  .delete{
    position: absolute;
    right: 0;
    top: 0;
  }
  .img-div >>> .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  div >>> .avatar-uploader .el-upload {
    width: 96px ;
    height: 96px;
    display: table;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 96px;
    height: 96px;
    line-height: 96px;
    text-align: center;
  }
  .avatar {
    /* position: absolute; */
    width: 96px;
    /* height: 96px; */
    display: block
  }
  .text{
    padding: 0;
    text-align: center;
    margin: 0;
  }
  .dialog-footer{
    padding: 0px 20px 40px;
  }
  .el-form-item{
    margin-bottom: 36px;
  }
  div >>> .el-dialog__body{
    padding: 30px 20px 0;
  }
</style>
