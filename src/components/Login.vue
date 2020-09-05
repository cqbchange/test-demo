<template>
  <div class="login">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span class="title">教务后台管理系统</span>
      </div>
      <el-form ref="form" :rules="rules" :model="form" label-width="80px" class="form-box">
        <el-form-item label="用户名" prop="username">
         <el-input v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
         <el-input type="password" v-model="form.password"></el-input>
        </el-form-item>
        <el-form-item>
         <el-button class="loginBtn" type="primary" @click="login('form')">登录</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
// import router from '../router/index.js'
export default {
  data () {
    return {
      form: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 7, message: '长度在 3 到 7 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    login (form) {
      // 会把用户和密码传给后端，验证用户和密码是否正确，如果正确则转跳主页面，如果不正确则重新登录
      this.$refs[form].validate((valid) => {
        if (valid) {
          this.service.post('login', this.form)
            .then((res) => {
              console.log(res)
              if (res.data.status === '200') {
                // console.log(router)
                // let routerArr = [
                //   {
                //     path: '/home',
                //     name: '数据分析',
                //     components: require('@/components/Home.vue'),
                //     iconClass: 'fa fa-list-alt',
                //     children: [
                //       {
                //         path: '/home/dataview',
                //         name: '数据概览',
                //         components: require('@/components/dataAnalysis/DataOverView.vue'),
                //         iconClass: 'fa fa-bar-chart'
                //       },
                //       {
                //         path: '/home/mapdata',
                //         name: '地图概览',
                //         components: require('@/components/dataAnalysis/MapData.vue'),
                //         iconClass: 'fa fa-map-o'
                //       },
                //       {
                //         path: '/home/twomap',
                //         name: '出差地址',
                //         components: require('@/components/dataAnalysis/TwoMap.vue'),
                //         iconClass: 'fa fa-map-pin'
                //       }
                //     ]
                //   }
                // ]
                // // router.addRoutes(routerArr)
                // router.options.routes.push(routerArr)
                this.$message({
                  message: res.data.msg,
                  type: 'success',
                  duration: 1000
                })
                this.$router.push('/home')
                localStorage.setItem('token', res.data.data.token)
              } else {
                console.log(res.data.msg)
              }
            })
            .catch(function (error) {
              console.log(error)
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>
<style lang="scss">
.login{
  width: 100vw;
  height: 100vh;
  background: #ccc;
  .box-card{
    width: 480px;
    position: absolute;
    top: 200px;
    left: 50%;
    transform: translateX(-50%);
    title{
      font-size: 28px;
    }
    .form-box{
      width: 350px;
    }
    .loginBtn{
      width: 100%;
    }
  }
}
</style>
