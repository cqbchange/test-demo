<template>
  <div class="student-list">
    <el-card>
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item>
          <el-button type="primary" @click="addstudent">新增</el-button>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="formInline.user" placeholder="姓名"></el-input>
        </el-form-item>
        <el-form-item label="学号">
          <el-input v-model="formInline.user" placeholder="学号"></el-input>
        </el-form-item>
        <el-form-item label="班级">
          <el-select v-model="formInline.region" placeholder="班级">
            <el-option label="框架九班" value="9"></el-option>
            <el-option label="框架十班" value="10"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="number" label="学号" align="center"></el-table-column>
        <el-table-column prop="age" label="年龄" align="center"></el-table-column>
        <el-table-column prop="name" label="姓名" align="center"></el-table-column>
        <el-table-column prop="sex_text" label="性别" align="center"></el-table-column>
        <el-table-column prop="class" label="班级" align="center"></el-table-column>
        <el-table-column prop="state" label="状态" align="center"></el-table-column>
        <el-table-column prop="address" label="地址" align="center"></el-table-column>
        <el-table-column prop="phone" label="联系方式" align="center"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
              @click="updateInfo(scope.row)"
            ></el-button>
            <el-button type="danger" size="mini" icon="el-icon-delete" @click="del"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 弹窗 -->
      <el-dialog :title="state ? '修改学生信息' : '添加学生信息' " :visible.sync="dialogFormVisible">
        <el-form :model="form">
          <el-form-item label="学号" :label-width="formLabelWidth">
            <el-input v-model="form.number" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="年龄" :label-width="formLabelWidth">
            <el-input v-model="form.age" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="姓名" :label-width="formLabelWidth">
            <el-input v-model="form.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="性别" :label-width="formLabelWidth">
            <el-radio v-model="form.sex" label="1">男</el-radio>
            <el-radio v-model="form.sex" label="2">女</el-radio>
          </el-form-item>
          <el-form-item label="班级" :label-width="formLabelWidth">
            <el-select v-model="form.class">
              <el-option label="框架一班" value="1"></el-option>
              <el-option label="框架二班" value="2"></el-option>
              <el-option label="框架三班" value="3"></el-option>
              <el-option label="框架四班" value="4"></el-option>
              <el-option label="框架五班" value="5"></el-option>
              <el-option label="框架六班" value="6"></el-option>
              <el-option label="框架七班" value="7"></el-option>
              <el-option label="框架八班" value="8"></el-option>
              <el-option label="框架九班" value="9"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="状态" :label-width="formLabelWidth">
            <el-input v-model="form.state" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="联系方式" :label-width="formLabelWidth">
            <el-input v-model="form.phone" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="sure">确 定</el-button>
        </div>
      </el-dialog>
      <Page></Page>
    </el-card>
  </div>
</template>
<script>
import Page from '../common/Pageing'
export default {
  components: {
    Page
  },
  // mounted () {
  //   this.axios.create({baseURL: 'http://rap2.taobao.org:38080/app/mock/264406/data/dictionaries',timeout: 1000,
  // withCredentials: true}).then((res) => {
  //     var status = res.data.status
  //     console.log(res)
  //     if (status === 0) {
  //       this.tableData = res.data.data.usersList
  //     }
  //   })
  // },
  data () {
    return {
      formInline: {
        user: ''
      },
      tableData: [],
      dialogFormVisible: false,
      form: {
      },
      formLabelWidth: '80px',
      state: false
    }
  },
  methods: {
    sure () {
      console.log(this.form)
      if (this.state) {
        this.service.put('http://rap2.taobao.org:38080/app/mock/264406/studentList', this.form)
          .then(res => res.data)
          .catch((err) => {
            console.log(err)
          })
      } else {
        this.service.post('http://rap2.taobao.org:38080/app/mock/264406/studentList', this.form)
          .then(res => {

          })
          .catch(err => {
            console.log(err)
          })
      }
      this.dialogFormVisible = false
    },
    updateInfo (row) {
      console.log(row)
      this.form = {...row}
      this.dialogFormVisible = true
      this.state = true
    },
    addstudent () {
      this.state = false
      this.form = {
        sex: '1'
      }
      this.dialogFormVisible = true
    },
    del () {
      this.$alert('你确定删除吗', '删除', {
        confirmButtonText: '确定',
        callback: action => {
          localStorage.removeItem('token')
        }
      })
    },
    onSubmit () {
      console.log('submit!')
    },
    getDataList () {
      this.service.get('studentList')
        .then((res) => {
          console.log(res)
          console.log(res.data.data.dictionaries)
          // this.tableData = [...res.data.data]
          if (res.data.status === '200') {
            res.data.data.forEach(item => {
              item.sex === '1' ? item.sex_text = '男' : item.sex_text = '女'
              console.log(item.state)
            })
            this.tableData = [...res.data.data]
          }
        })
        .catch((err) => {
          console.log(err)
        })
    }
  },
  created () {
    this.getDataList()
    // this.service.get('studentList')
    //   .then(res => {
    //     console.log(res)
    //     if (res.data.status === 200) {
    //       this.tableData = [...res.data.data]
    //       console.log(this.tableData)
    //     }
    //   })
    //   .catch((err) => {
    //     console.log(err)
    //   })
  }
}
</script>
<style scoped lang="scss">
.student-list {
  margin: 2px 0;
  .el-form {
    text-align: left;
  }
}
</style>
