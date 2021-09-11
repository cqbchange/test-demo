<template>
  <div>
    <el-dialog
      title="新增/编辑"
      :visible="value"
      @update:visible="(val) => this.$emit('input',val)"
      custom-class="my-dialog" width="880px" :append-to-body="true"
            :close-on-press-escape="false"
    >
      <el-form :model="infoForm" size="medium" v-loading="loading">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="标题:" label-width="80px">
              <el-input
                v-model="infoForm.title"
                autocomplete="off"
                placeholder="请填写标题"
                clearable
              />
            </el-form-item>
            <el-form-item label="场次:" label-width="80px">
              <el-select v-model="infoForm.hour" placeholder="场次" size="medium">
                <el-option :value="10" label="10点场"/>
                <el-option :value="14" label="14点场"/>
                <el-option :value="18" label="18点场"/>
                <el-option :value="20" label="20点场"/>
              </el-select>
            </el-form-item>
            <el-form-item label="红包金额:" label-width="80px">
              <el-input
                v-model="infoForm.money"
                autocomplete="off"
                placeholder="请填写红包金额"
                clearable
                size="medium"
              />
            </el-form-item>
            <el-form-item label="商品库存:" label-width="80px">
              <el-input
                v-model="infoForm.total_num"
                autocomplete="off"
                placeholder="请填写库存"
                clearable
                size="medium"
              />
            </el-form-item>
            <el-form-item label="限制:" label-width="80px">
              <el-radio-group v-model="infoForm.limit">
                <el-radio :label="0">否</el-radio>
                <el-radio :label="1">是</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          
          <el-col :span="12">
            <el-form-item label="排序:" label-width="100px">
              <el-input
                v-model="infoForm.sort"
                autocomplete="off"
                placeholder="请填写排序"
                clearable
                size="medium"
              />
            </el-form-item>
            <el-form-item label="类型:" label-width="100px">
              <el-select v-model="infoForm.type" placeholder="类型" size="medium">
                <el-option :value="0" label="固定金额"/>
                <el-option :value="1" label="随机金额"/>
              </el-select>
            </el-form-item>
            <el-form-item label="积分" label-width="100px">
              <el-input
                v-model="infoForm.integral"
                autocomplete="off"
                placeholder="请填写兑换积分"
                clearable
                size="medium"
              />
            </el-form-item>
            <el-form-item label="已领:" label-width="100px">
              <el-input
                v-model="infoForm.use_num"
                autocomplete="off"
                placeholder="请填写已领"
                clearable
                size="medium"
              />
            </el-form-item>
            <el-row >
              <el-col :span="18">
                <el-form-item label="状态:" label-width="100px">
                  <el-radio-group v-model="infoForm.status">
                    <el-radio :label="0">在线</el-radio>
                    <el-radio :label="1">下线</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="close" size="medium">取 消</el-button>
        <el-button type="primary" @click="submitEdit" size="medium">确 定</el-button>
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
      type: 0,
      hour: 10,
      money: '',
      integral: '',
      total_num: '',
      use_num: '',
      sort: '',
      limit:0,
      status: 0
    }
  };
  export default {
    name: "detail",
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
        infoForm: defaultInfo()
      };
    },
    methods: {
      close() {
        this.$emit("input", false);
      },
      submitEdit: function () {
        console.log(this.infoForm);
        if (this.infoForm.id !== 0) {
          this.$confirm("此操作将修改该红包的数据, 是否继续?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
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
        this.postRequest("/red/postEdit", this.infoForm).then(data => {
          if (data.code === 200) {
            this.loading = false;
            this.$message.success(data.msg);
            this.$emit("input", false);
            this.$emit("updateData",true)
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
      }
    },
    mounted() {
      if (this.info.id !== undefined) {
        this.infoForm = Object.assign({}, this.info);
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
    width: 104px;
    height: 104px;
    line-height: 104px;
  }

  /deep/ .el-upload-list--picture-card .el-upload-list__item {
    width: 104px;
    height: 104px;
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
</style>
