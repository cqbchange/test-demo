<!--
 * @Descripttion: 任务位管理
 * @version: 1.0
 * @Author: LiZhi
 * @Date: 2021-01-15 16:52:43
 * @LastEditors: LiZhi
 * @LastEditTime: 2021-01-16 17:37:18
-->
<template>
<div>
  <el-dialog
    :before-close="closeDialog"
    :title="dilogTitle"
    :visible.sync="value"
    custom-class="my-dialog" 
    width="640px" 
    :append-to-body="true"
    :close-on-press-escape="false"
  >
    <el-form :model="dataForm" size="medium" v-loading="loading" element-loading-spinner="el-icon-loading">
       <el-row :gutter="20" type="flex">
          <el-col :span="20">
              <el-form-item :label-width="formLabelWidth" label="名称:" class="formItem">
                  <el-input autocomplete="off" v-model="dataForm.name" clearable></el-input>
              </el-form-item>
          </el-col>
      </el-row>
      <el-row :gutter="20" type="flex">
          <el-col :span="20">
            <el-form-item :label-width="formLabelWidth" label="标识:" class="formItem">
              <el-input autocomplete="off" v-model="dataForm.tag" clearable></el-input>
            </el-form-item>
          </el-col>
      </el-row>
    </el-form>
    <div class="dialog-footer" slot="footer">
      <el-button @click="submitData" type="primary" class="my-blue-btn">确 定</el-button>
      <el-button @click="closeDialog">取 消</el-button>
    </div>
  </el-dialog>
</div>
  
</template>

<script>
const defaultInfo = function () {
  return {
    id: 0,
    name: "",
    tag: ""
  };
};
export default {
  name: "addAdSlot",
  props: {
    value: Boolean,
    class_id: {
      default: 0,
      type: [String, Number],
    },
    mid: {
      default: 0,
      type: [String, Number],
    },
    dataForm: {
      default: defaultInfo,
      type: Object,
    },
  },
  data() {
    return {
      formLabelWidth: "120px",
      loading:false
    };
  },
  methods: {
    // 提交数据
    submitData() {
      if(!this.dataForm.name||!this.dataForm.tag){
        this.$message.warning("请输入名称和标识");
        return
      }
      this.loading = true
      let url = "/miniProgram/adSlotAddPost";
      if (this.dataForm.id > 0) {
        url = "/miniProgram/adSlotEditPost";
      }
      let options = Object.assign({miniprog_id:this.mid}, this.dataForm);
      this.postRequest(url, options).then((resp) => {
        if (resp && resp.code === 200) {
          this.loading = false
          this.$message({
            message: this.dilogTitle + "成功",
            type: "success",
            showClose: true,
            duration: 1000,
            onClose: () => {},
          });
          this.$emit("success", this.dataForm);
          this.closeDialog();
        } else {
          this.$message({
            message: resp.msg,
            type: "faild",
            showClose: true,
            duration: 1000,
          });
          this.loading = false
        }
      });
    },
    closeDialog() {
      this.$emit("input", false);
    },
  },
  computed: {
    dilogTitle() {
      return this.dataForm.id > 0 ? "编辑数据" : "增加数据";
    },
  },
};
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

div >>> .el-dialog__body{
  padding: 30px 20px 0 20px;
}
</style>
