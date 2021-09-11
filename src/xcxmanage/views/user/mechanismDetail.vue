<!--
 * @Descripttion: 机构明细
 * @version: 1.0
 * @Author: Dulei
 * @Date: 2021-01-19 10:42:43
 * @LastEditors: WangChuan
 * @LastEditTime: 2021-01-30 15:41:04
-->
<template>
  <div class="wrap">
    <div class="topBox">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item style="flex:1;">
          <label style="font-size:20px;font-weight:bold;">{{$route.params.sname}}—{{$route.params.name}}</label><span style="margin-left:10px;font-size:13px;">消耗：{{expenditure}}</span><span style="margin-left:10px;font-size:13px;">加款：{{recharge}}</span>
        </el-form-item>
        <el-form-item>
            <el-select size="medium"  placeholder="请选择类型" v-model="deatilForm.type" clearable :disabled="detailLoad" style="width:150px;">
              <el-option label="全部类型" value=""></el-option>
              <el-option v-for="(item, i) in detailTypeList" :label="item.name" :value="item.id" :key="i"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item>
          <el-date-picker size="medium" style="width:288px;"
            v-model="daterange"
            type="daterange"
            align="center"
            :editable="false"
            :clearable="false"
            unlink-panels
            start-placeholder="开始日期"
            value-format="timestamp"
            prefix-icon="prefix-icon"
            end-placeholder="结束日期"
            :picker-options="pickerOption">
            <i class="el-icon-date" slot="range-separator"></i>
          </el-date-picker>
        </el-form-item>
      </el-form>
    </div>
      <fix-table
        ref="detailTable"
        :data="tableDetailData"
        border
        style="width: 100%;" v-loading="detailLoad" element-loading-spinner="el-icon-loading"
            element-loading-text="拼命加载中" key="list" height="73.7vh" size="small"
            header-row-class-name="my-table-header" class="my-table">
        <el-table-column fixed prop="times" label="添加时间"  align="center"/>
        <el-table-column prop="moneys" label="打款金额(元)"  align="center">
          <template slot-scope="scope">
            {{myAccAdd(Number(scope.row.moneys),Number(scope.row.point_money))}}
          </template>
        </el-table-column>
        <el-table-column prop="moneys" label="广告费"  align="center"/>
        <el-table-column prop="point_money" label="税点"  align="center"/>
        <el-table-column prop="typeName" label="类型"  align="center"/>
        <el-table-column prop="pay_time" width="170"  label="打款时间"  align="center"/>
        <el-table-column prop="pay_type" label="收款方式"  align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.pay_type === '1'">支付宝</span>
            <span v-else-if="scope.row.pay_type === '2'">对公银行</span>
            <span v-else>——</span>
          </template>
        </el-table-column>
        <el-table-column prop="alipay_num" label="支付宝交易号/凭证"  align="center" width="300">
          <template slot-scope="scope">
            <div v-if="scope.row.pay_type === '1'">
              <span v-if="scope.row.alipay_num === '0'">——</span>
              <span v-else-if="scope.row.alipay_num">{{scope.row.alipay_num}}</span>
              <span v-else>——</span>
            </div>
            <div v-if="scope.row.pay_type === '2'">
                <el-image v-if="scope.row.images&&scope.row.images !== '0'" style="width: 55px; height: 55px" :src="scope.row.images" :preview-src-list="[scope.row.images]"/>
                <span v-else>——</span>
            </div>
          </template>
        </el-table-column>
        
        <el-table-column prop="status" label="状态"  align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.status === '1'" style="color:#666666;">已核销</span>
            <span v-else-if="scope.row.status === '0'" style="color:#694BFF;">未核销</span>
            <span v-else>——</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="120" align="center" v-if="auth !== 1">
          <template slot-scope="scope">
            <!-- <span v-if="scope.row.status !== '0'">——</span>
            <el-button v-else @click="writeOff(scope.row)" type="text" size="small">核销</el-button> -->
            <el-button v-if="scope.row.type==1002 && scope.row.status==='0'" @click="changeDetail(scope.row)" type="text" size="small">修改</el-button>
            <span v-else></span> 
            <el-button v-if="scope.row.status==='0'" @click="deleteDetail(scope.row)" type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
        </fix-table>
        <!-- 页码 -->
        <div class="pages">
          <el-pagination :page-size="deatilForm.size" :total="totalDetailNum" @current-change="handleCurrentDetail"
                        layout="total, prev, pager, next" :current-page="deatilForm.p"></el-pagination>
        </div>


     <el-dialog custom-class="my-dialog" title="明细修改" :visible.sync="changeDetailVisible" width="686px" :close-on-press-escape="false" :close-on-click-modal="false">
      <el-form :model="changeDetailInfo" size="medium">
        <el-row :gutter="20">
          <el-col :span="12">
          <el-form-item required :label="'打款金额'" label-width="80px">
            <el-input size="medium" 
              @input="inputChange4"
              v-model="changeDetailInfo.money"
              autocomplete="off"
              placeholder="请填写金额"
              clearable/>
          </el-form-item>
          </el-col>
          <el-col :span="12">
          <el-form-item required label-width="80px" label="打款时间">
            <el-date-picker size="medium" style="width:100%;"
              v-model="changeTime"
              type="datetime"
              value-format="timestamp"
              placeholder="选择日期时间"
              @change="pickerOptionsFun2"
              :picker-options="pickerOptions">
            </el-date-picker>
          </el-form-item>
          </el-col>
          <el-col :span="12">
          <el-form-item :label="'税'+'\xa0\xa0\xa0\xa0\xa0\xa0\xa0'+'点'" label-width="80px">
            <el-input size="medium" 
                @input="inputChange2"
                v-model="changeDetailInfo.point_money"
                autocomplete="off"
                placeholder="请填写税点"
                clearable/>
              <span style="white-space: nowrap;">减去税点实际到账广告费用：<span style="color:red" v-if="!isNaN(mySubtr(changeDetailInfo.money,changeDetailInfo.point_money))">{{mySubtr(changeDetailInfo.money,changeDetailInfo.point_money)}}</span></span>
          </el-form-item>
          </el-col>
          <el-col :span="12" class="upload-img-box">
            <el-form-item label-width="80px" label="收款方式">
                    <el-select size="medium"  placeholder="请选择类型" v-model="changeDetailInfo.pay_type" @change="typeChange">
                      <el-option value="1" label="支付宝"></el-option>
                      <el-option value="2" label="对公银行"></el-option>
                    </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12"></el-col>
          <el-col :span="12" v-if="changeDetailInfo.pay_type === '1'">
            <el-form-item label-width="80px" label="交易号">
              <el-input size="medium" v-model="changeDetailInfo.alipay_num" autocomplete="off"  clearable ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="upload-img-box" v-if="changeDetailInfo.pay_type === '2'">
            <el-form-item label-width="80px" label="凭证">
                  <el-col :span="14" style="padding: 0;">
                    <el-input size="medium"  autocomplete="off" readonly v-model="changeDetailInfo.images" clearable ></el-input>
                  </el-col>
                  <el-col :span="10" style="padding-right: 0;text-align:right">
                    <el-upload
                      :action="uploadUrl"
                      :before-upload="beforeUpload2"
                      :on-success="handleImgSuccess2"
                      :show-file-list="false"
                      class="upload-img"
                      name="image">
                      <el-button size="small" type="primary">上传凭证</el-button>
                    </el-upload>
                  </el-col>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="subDetail()" class="my-blue-btn" :disabled="subDetailLoading" size="small ">确 定</el-button>
        <el-button @click="changeDetailVisible = false" size="small ">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import {mapActions} from 'vuex'

  export default {
    name: 'daniuUserList',
    data () {
      return {
        totalDetailNum: 0,
        gotopageDetail: '',//跳转页数
        allDetailpages: '',//全部页数
        tableDetailData: [],
        detailLoad: false,
        deatilForm: {
          id:'',
          p: 1,
          size: 10,
          start: '',
          end: '',
          type: '',
          // seller_id: '',
        },
        daterange: [],
        detailTypeList: [{id: 1000,name:'消耗'},{id: 1002,name:'加款'}],
        expenditure: 0,
        recharge: 0,
        auth: '',
        editLoading: false,
        subMoneyLoading: false,
        pickerOptions: {
          disabledDate (time) {
            return time.getTime() > Date.now()
          },
          // selectableRange: `00:00:00 - ${this.$utils.toDateString(new Date(), 'HH:mm:ss')}`
        },
        myTime:'',
        changeTime:'',
        changeDetailVisible:false,
        changeDetailInfo:{
          id: 0,
          money: '',
          point_money:'',
          pay_time: '',
          images: '',
          company_id:'',
          pay_type: '1',
          alipay_num: ''
        },
        tempRow:'',
        subDetailLoading:false
      }
    },
    computed: {
      uploadUrl () {
        return this.$store.state.base.uploadUrl
      },
      companyAddcompanysaleauth(){
        return this.$store.state.base.user.permissions.indexOf('company_addcompanysaleauth') === -1 //true不是运营
      },
      permissions(){
        return this.$store.state.base.user.permissions
      },
      pickerOption(){
        return this.$store.state.base.pickerOptions
      }
    },
    watch:{
      daterange(val){
        if(val.length){
          if(val[0] === val[1]){
            val[1] = this.$utils.getWhatDay(val[0],0,'last')
          }else{
            val[1] = this.$utils.getWhatDay(val[1],0,'last')
          }
          this.deatilForm.start = Math.floor(val[0]/1000)
          this.deatilForm.end = Math.floor(val[1]/1000)
        }
        this.loadDetailData()
      },
      "deatilForm.type":{
        handler(val){
          this.loadDetailData()
        }
      },
    },
    components: {},
    mounted () {
      if(Object.keys(this.$route.params).length){
          this.deatilForm.id = this.$route.params.id
      }else{
        this.$router.replace({
            name: 'userMechanism'
        })
        this.$store.commit("setThisMenu", {"name":"机构管理","type":"","data":""});
      }
      // this.getUserList()
      this.initData()
      this.$store.commit("setBreadCrumb", [{name: '机构管理',path: '/userMechanism',}]);
    },
    destroyed() {
        this.$store.commit("setBreadCrumb", []);
    },
    methods: {
      initData () {
        this.detailVisible = true
        this.daterange = [
          this.$utils.getWhatMonth(new Date(),0,'first'),
          this.$utils.getWhatDay(new Date(),0,'last'),
        ]
        this.deatilForm.p = 1
        this.deatilForm.type = ''
      },
      pickerOptionsFun2: function() {
        let startAt = new Date(this.changeTime) * 1000 /1000;
          if(startAt > Date.now()) {
              this.$message.info('打款时间不能大于当前时间')
              this.changeTime = new Date();
          }
      },
      // 获取归属人列表
      getUserList(){
        this.getRequest('/xcxTask/salesman',{}).then((res)=>{
          if (res.code == 200) {
            if (res.data) {
              this.userList = []
              for(let key in res.data){
                let obj = {key:'',value:''}
                obj.id=key
                obj.name=res.data[key]
                this.userList.push(obj)
              }
            }
          }else{

          }
        })
      },
      
      // 明细数据
      loadDetailData () {
        this.detailLoad = true
        this.getRequest('/Company/getLog', this.deatilForm).then(resp => {
          this.detailLoad = false
          if (resp && resp.code === 200) {
            this.auth = resp.data.auth
            this.totalDetailNum = resp.data.list.total
            this.tableDetailData = resp.data.list.list
            this.tableDetailData.forEach(element => {
              element.pay_time = this.$utils.toDateString(element.pay_time*1000)
            });
            this.allDetailpages = Math.ceil(resp.data.list.total / this.deatilForm.size)
            this.gotopageDetail = this.deatilForm.p
            this.recharge = resp.data.list.Recharge
            this.expenditure = resp.data.list.expenditure
          }
        
        })
      },
      // 换页响应
      handleCurrentDetail (val) {
        this.tableDetailData = []
        this.deatilForm.p = val
        this.loadDetailData()
      },
      //明细修改
      changeDetail(row){
        this.changeTime=''
        this.tempRow=row
        this.changeDetailInfo.id = row.id
        this.changeDetailInfo.point_money = row.point_money
        this.changeDetailInfo.money = this.myAccAdd(Number(row.money),Number(row.point_money))
        this.changeDetailInfo.images = row.images
        this.changeDetailInfo.company_id=row.company_id
        if(row.pay_time){
          this.changeTime = this.$utils.timestamp(row.pay_time)
        }

        this.changeDetailInfo.pay_type=row.pay_type
        this.changeDetailInfo.alipay_num=row.alipay_num
        this.changeDetailVisible=true
      },
      typeChange(val){
        if(val === '2'){
          this.changeDetailInfo.alipay_num = ''
        }
      },
      //明细修改提交
      subDetail(){
        
        if(this.changeDetailInfo.money ===''){
          this.$message.warning('金额不能为空')
          return
        }
        if(String(this.changeDetailInfo.money).substr(-1) === '.'||!this.$utils.isInteger(this.changeDetailInfo.money)||this.changeDetailInfo.money <= 0){
          this.$message.warning('金额必须为正整数')
          return
        }
        if(String(this.changeDetailInfo.money).substr(-1) === '.'||this.changeDetailInfo.money === '0'||this.changeDetailInfo.money === '-0'){
          this.$message.warning('金额不正确')
          return
        }
        if(isNaN(Number(this.changeDetailInfo.point_money))||Number(this.changeDetailInfo.point_money)<0){
          this.$message.warning('税点不正确')
          return
        }
        if(!this.changeTime){
          this.$message.warning('打款时间不能为空')
          return
        }
        if(this.changeDetailInfo.alipay_num === '0'){
          this.changeDetailInfo.alipay_num = ''
          this.$message.warning('交易号不能为0')
          return
        }
        if(this.changeDetailInfo.pay_type === '1'&&this.changeDetailInfo.alipay_num === ''){
          this.$message.warning('交易号不能为空')
          return
        }
        if(this.changeDetailInfo.pay_type === '2'&&this.changeDetailInfo.images === ''){
          this.$message.warning('凭证不能为空')
          return
        }
        if(this.changeDetailInfo.pay_type === '2'){
          this.changeDetailInfo.alipay_num = ''
        }
        this.changeDetailInfo.pay_time = Math.floor(this.changeTime/1000)
        if(Number(this.changeDetailInfo.money)===this.myAccAdd(Number(this.tempRow.money),Number(this.tempRow.point_money))&&this.changeDetailInfo.point_money===this.tempRow.point_money&&this.changeDetailInfo.pay_time===Math.floor(this.$utils.timestamp(this.tempRow.pay_time))/1000&&this.changeDetailInfo.images===this.tempRow.images&&this.changeDetailInfo.alipay_num === this.tempRow.alipay_num){
          this.$message.warning('未填写更改')
          return
        }
        if(this.changeDetailInfo.point_money === ''){
          this.changeDetailInfo.point_money = 0
        }
        this.subDetailLoading = true
        this.postRequest('/Company/updateMoney', this.changeDetailInfo).then(resp => {
          if (resp && resp.code === 200) {
            this.$message({
              message: resp.msg,
              type: 'success',
              showClose: true,
              duration: 1000,
            })
            this.changeDetailVisible = false
            this.loadDetailData()
          } else {
            this.$message({
              message: resp.msg,
              type: 'warning',
              showClose: true,
              duration: 1000,
            })
          }
          setTimeout(() => {
            this.subDetailLoading = false
          }, 500);
        })
      },
      deleteDetail(row){
        this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          customClass: 'with_custom_class',
          type: 'warning'
        }).then(() => {
          this.postRequest('/Company/postDelLog', {
            id: row.id
          }).then(resp => {
            if (resp && resp.code === 200) {
              this.$message({
                message: '删除成功',
                type: 'success',
                showClose: true,
                duration: 1000,
              })
              this.loadDetailData()
            }
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
        })
      },
      beforeUpload2(file){
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
      // 上传图片
      handleImgSuccess2 (file, fileList) {
        if (file.code !== 200) {
          this.$message.error(file.message)
        } else {
          this.$set(this.changeDetailInfo, 'images', file.data)
        }
      },
      inputChange2(){
        this.changeDetailInfo.point_money = this.changeDetailInfo.point_money.toString().myReplace('-','')
        if(Number(this.changeDetailInfo.point_money)>Number(this.changeDetailInfo.money)){
          this.changeDetailInfo.point_money = 0
        }
      },
      inputChange4(){
        this.changeDetailInfo.money = this.changeDetailInfo.money.toString().myReplace('-','')
        if(Number(this.changeDetailInfo.point_money)>Number(this.changeDetailInfo.money)){
          this.changeDetailInfo.point_money = 0
        }
      },
      //加法
      myAccAdd(arg1,arg2){   
        var r1,r2,m;   
        try{r1=arg1.toString().split(".")[1].length}catch(e){r1=0}   
        try{r2=arg2.toString().split(".")[1].length}catch(e){r2=0}   
        m=Math.pow(10,Math.max(r1,r2))   
        return (arg1*m+arg2*m)/m   
      },
      //减法
      mySubtr(arg1,arg2){
        var r1,r2,m,n;  
        try{r1=arg1.toString().split(".")[1].length}catch(e){r1=0}  
        try{r2=arg2.toString().split(".")[1].length}catch(e){r2=0}  
        m=Math.pow(10,Math.max(r1,r2));  
        n=(r1>=r2)?r1:r2;  
        return ((arg1*m-arg2*m)/m).toFixed(n);  
      }
      
    }
  }
</script>

<style scoped>
  .demo-form-inline{
    display: flex;
  }
  .demo-form-inline .el-form-item:last-child{
    margin-right: 0;
  }
  .wrap{
    background: #FFF;
  }
  .img_pic_box {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .gourl_a {
    display: contents;
  }

  table.gridtable {
    font-family: verdana, arial, sans-serif;
    font-size: 11px;
    color: #333333;
    border-width: 1px;
    border-color: #666666;
    border-collapse: collapse;
  }

  table.gridtable th {
    border-width: 1px;
    padding: 8px;
    border-style: solid;
    border-color: #666666;
    background-color: #dedede;
  }

  table.gridtable td {
    border-width: 1px;
    padding: 8px;
    border-style: solid;
    border-color: #666666;
    background-color: #ffffff;
  }
  /* 分页样式 */
  .pagination {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 20px;
  }

  /*设置当前页码的样式，及鼠标移上其他页码时的样式,以及左右箭头鼠标移上的样式*/
  .pagination_box >>> .btn-prev {
    border: 1px solid #d6d6d6 !important;
    border-radius: 4px !important;
    padding: 0px 17px 0px 18px !important;
    display: inline-block !important;
    background-color: #fff !important;
  }

  .pagination_box >>> .btn-next {
    border: 1px solid #d6d6d6 !important;
    border-radius: 4px !important;
    padding: 0px 17px 0px 18px !important;
    display: inline-block !important;
    background-color: #fff !important;
  }

  .pagination_box >>> .el-pagination.is-background
  .el-pager
  li:not(.disabled).active {
    background-color: #409EFF !important;
  }

  .togo_that_page {
    font-size: 14px;
    font-family: PingFang SC;
    font-weight: 500;
    color: #666666;
    margin-right: 10px;
  }

  .show_datanum_allpage span {
    font-size: 14px;
    font-family: PingFang SC;
    font-weight: 500;
    color: #666666;
  }


  .detail_dialog >>> .el-dialog__body{
    padding: 0 30px 20px;
  }
  .is-dot-item >>> .is-dot{
    right: 3px;
    top: -3px;
  }
</style>

<style>

  .with_custom_class{
    border-radius: 10px;
    padding-bottom: 15px;
  }
  .with_custom_class .el-message-box__header{
    border-radius: 10px 10px 0 0;
    background: #EFF5FF;
    color: #111111;
  }
  .with_custom_class .el-message-box__title{
    line-height: inherit;
    font-size: 16px;
  }
  .with_custom_class .el-message-box__status+.el-message-box__message{
      padding-left: 22px;
  }
  .el-message-box__status.el-icon-warning{
      color: #409EFF;
      font-size: 18px!important;
  }
  .with_custom_class .el-message-box__btns{
      text-align: center;
      width: 180px;
      margin: 0 auto;
  }
  .with_custom_class .el-message-box__btns::after{
      clear: both;
  }
  .with_custom_class .el-message-box__btns .el-button{
      padding: 12px 26px;
      float: right;
  }
  .with_custom_class .el-message-box__btns .el-button.el-button--primary{
      background: linear-gradient(90deg, #73A7FF, #448AFF);
      float: left;
  }
  .with_custom_class .el-message-box__input{
      padding-top: 0;
  }
  .with_custom_class .el-message-box__content{
      padding: 15px 30px 10px;
  }
</style>
