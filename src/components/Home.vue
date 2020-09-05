<template>
  <div class="home">
    <el-container>
      <el-header>
        <div class="header-left">
            <span v-show="!isCollapse">教务系统管理后台</span>
            <i :class="isCollapse ? 'coll el-icon-s-fold' : 'coll el-icon-s-unfold'" @click="isCollapse = !isCollapse"></i>
        </div>
        <div>
           <span class="login-out" @click="loginOut">退出</span>
        </div>
      </el-header>
      <el-container class="main">
        <Menu></Menu>
        <el-main>
          <el-card>
            <el-breadcrumb separator-class="el-icon-arrow-right">
              <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
              <el-breadcrumb-item v-for="(item,index) in $route.matched" :key="index">
                <strong>{{item.name}}</strong>
              </el-breadcrumb-item>
            </el-breadcrumb>
          </el-card>
          <router-view></router-view>
          <Footer></Footer>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import Menu from './common/Menu'
import Footer from './common/footer'
export default {
  name: 'Home',
  components: {
    Menu,
    Footer
  },
  data () {
    return {
      isCollapse: false,
      menus: [],
      activePath: ''
    }
  },
  methods: {
    loginOut () {
      this.$alert('你确定退出吗', '退出', {
        confirmButtonText: '确定',
        callback: action => {
          // this.$message({
          //   // type: 'info',
          //   // message: `action: ${ action }`
          // })
          localStorage.removeItem('token')
          this.$router.push('/login')
        }
      })
    }
  }
  // created () {
  //   this.menus = [...this.$router.options.routes]
  //   this.activePath = this.menus[2].children[0].path
  //   // console.log(this.$router.options.routers)
  // },
  // methods: {
  //   handleOpen (key, keyPath) {
  //     console.log(key, keyPath)
  //   },
  //   handleClose (key, keyPath) {
  //     console.log(key, keyPath)
  //   }
  // }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.home{
  .el-header {
    background-color: #00b8ff;
    color: #333;
    text-align: center;
    line-height: 60px;
    display: flex;
    justify-content: space-between;
    .header-left {
      .coll {
        cursor: pointer;
      }
    }
    .login-out {
      cursor: pointer;
    }
  }
  .main {
    width: 100%;
    position: absolute;
    top: 60px;
    bottom: 0px;
    // overflow: hidden;
    .el-main {
      background-color: #E9EEF3;
      color: #333;
      text-align: center;
      padding: 0;
    }
  }
}
</style>
