<!--
 * @Descripttion: 批量操作
 * @version: 1.0
 * @Author: Dulei
 * @Date: 2021-01-19 10:42:43
 * @LastEditors: WangChuan
 * @LastEditTime: 2021-03-19 19:29:06
-->
<template>
  <el-dialog
    :close-on-click-modal="false"
    :before-close="closeDialog"
    :title="dilogTitle"
    :visible.sync="value"
    custom-class="my-dialog" width="920px" :append-to-body="true"
    :close-on-press-escape="false">
    <el-form :model="dataList" size="medium">
      <el-row :gutter="20" type="flex">
          <el-col :span="24">
              <el-form-item label="">
                  <el-checkbox-group v-model="dataList.type" @change="checkboxChenge" class="top_checkbox">
                      <el-checkbox label="1" :disabled="dataList.type.indexOf('2') !== -1">一键上架</el-checkbox>
                      <el-checkbox label="2" :disabled="dataList.type.indexOf('1') !== -1">一键下架</el-checkbox>
                      <el-checkbox label="3">复制任务</el-checkbox>
                      <!-- <el-checkbox label="4">修改机构</el-checkbox> -->
                      <el-checkbox label="5">任务时间</el-checkbox>
                      <el-checkbox label="6">任务奖励</el-checkbox>
                      <el-checkbox label="7">任务跳转</el-checkbox>
                  </el-checkbox-group>
              </el-form-item>
          </el-col>
      </el-row>
      <div style="padding: 0 30px 0 5px">
      <template v-if="dataList.type.indexOf('3') !== -1">
        <el-row :gutter="20" type="flex">
            <el-col :span="24" class="my-lab-title">
                <div>复制任务</div>
            </el-col>
        </el-row>
        <el-row :gutter="20" type="flex">
            <el-col :span="24" class="timeArr">
                <el-form-item label="小程序与任务区：" label-width="150px" v-for="(ele, index) in dataEdit3" :key="index">
                    <div style="display: flex;align-items:center;position:relative;">
                      <el-select  size="medium" filterable
                          v-model="ele.mid"
                          placeholder="小程序"
                          @change="(e) => {addtagtask(e, index)}">
                          <el-option
                            v-for="(item, index) in xcxList"
                            :disabled="disableXcx.indexOf(index) !== -1"
                            :key="index"
                            :value="index"
                            :label="item"
                          />
                        </el-select>
                      <span style="margin:0 10px">与</span>
                      <el-select  size="medium" filterable
                        multiple
                        placeholder="广告位"
                        v-model="ele.slot_id">
                        <el-option
                          :key="item.id"
                          :label="item.name"
                          :value="item.id"
                          v-for="item in ele.adSlotList"
                        ></el-option>
                      </el-select>
                      <i class="el-icon-minus icon-timeArr"
                          v-if="dataEdit3.length >1 && (index+1) < dataEdit3.length"
                          @click="delete3Time(index)"></i>
                      <i class="el-icon-plus icon-timeArr" v-else-if="dataEdit3.length == (index+1)"
                          @click="add3Time()"></i>
                    </div>
                </el-form-item>
            </el-col>
        </el-row>
      </template>
      <template v-if="dataList.type.indexOf('4') !== -1">
        <el-row :gutter="20" type="flex">
            <el-col :span="24" class="my-lab-title">
                <div>修改机构</div>
            </el-col>
        </el-row>
        <el-row :gutter="20" type="flex">
            <el-col :span="24">
                <el-form-item label="机构：" label-width="150px">
                    <el-select  size="medium" filterable :disabled="couldchoose" placeholder="请选择机构" v-model="dataForm.company_id" style="width:100%">
                      <el-option v-for="(val,key,i) in mechanismList" :label="val" :value="key" :key="i"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
        </el-row>
      </template>
      <template v-if="dataList.type.indexOf('5') !== -1">
        <el-row :gutter="20" type="flex">
            <el-col :span="24" class="my-lab-title">
                <div>任务时间</div>
            </el-col>
        </el-row>
        <el-row :gutter="20" type="flex">
            <el-col :span="12">
                <el-form-item label="起止日期：" label-width="150px">
                    <el-date-picker size="medium"
                      end-placeholder="结束日期"
                      range-separator="至"
                      start-placeholder="开始日期"
                      style="width:100%"
                      type="daterange"
                      v-model="dataForm.daterange"
                      value-format="timestamp"
                      :picker-options="pickerOptions"
                    />  
                </el-form-item>
            </el-col>
        </el-row>
        <el-row :gutter="20" type="flex">
            <el-col :span="12" class="timeArr">
                <template v-for="(item,index) in timesArr">
                    <el-form-item :label="index==0?'起止时间：':''" label-width="150px" :key="index">
                        <el-time-picker is-range
                              v-model="timesArr[index]" range-separator="至"
                              start-placeholder="请选择" end-placeholder="请选择"
                              format="HH:mm" value-format="HH:mm:ss" placeholder="选择时间范围" 
                              @change="chooseTime(timesArr[index],index)"/>
                        <i class="el-icon-minus icon-timeArr"
                            v-if="timesArr.length >1 && (index+1) < timesArr.length"
                            @click="delete5Time(index)"></i>
                        <i class="el-icon-plus icon-timeArr" v-else-if="timesArr.length == (index+1)"
                            @click="add5Time()"></i>
                    </el-form-item>
                </template>
            </el-col>
        </el-row>
      </template>
      <template v-if="dataList.type.indexOf('6') !== -1">
        <el-row :gutter="20" type="flex">
            <el-col :span="24" class="my-lab-title">
                <div>任务奖励</div>
            </el-col>
        </el-row>
        <el-row :gutter="20" type="flex">
            <el-col :span="12">
                <el-form-item label="奖励类型：" label-width="150px">
                      <el-select  size="medium" filterable placeholder="奖励类型" v-model="dataForm.reward_type" style="width:100%">
                        <el-option label="奖励金币" value="1"></el-option>
                        <el-option label="奖励步数" value="2"></el-option>
                        <el-option label="奖励红包" value="3"></el-option>
                        <el-option label="奖励集分宝" value="4"></el-option>
                        <el-option label="奖励心愿豆" value="5"></el-option>
                        <el-option label="奖励幸运币" value="6"></el-option>
                        <el-option label="奖励能量豆" value="7"></el-option>
                      </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item
                  :label-width="formLabelWidth"
                  label="奖励金币"
                  v-if="dataForm.reward_type === '1'"
                >
                  <el-input size="medium"  autocomplete="off" v-model="dataForm.integral" clearable ></el-input>
                </el-form-item>
                <el-form-item
                  :label-width="formLabelWidth"
                  label="奖励步数"
                  v-if="dataForm.reward_type === '2'"
                >
                  <el-input size="medium"  autocomplete="off" v-model="dataForm.step" clearable ></el-input>
                </el-form-item>
                <el-form-item
                  :label-width="formLabelWidth"
                  label="奖励红包"
                  v-if="dataForm.reward_type === '3'"
                >
                  <el-input size="medium"  autocomplete="off" v-model="dataForm.money" clearable ></el-input>
                </el-form-item>
                <el-form-item
                  :label-width="formLabelWidth"
                  label="奖励集分宝"
                  v-if="dataForm.reward_type === '4'"
                >
                  <el-input size="medium"  autocomplete="off" v-model="dataForm.jfb" clearable ></el-input>
                </el-form-item>
                <el-form-item
                  :label-width="formLabelWidth"
                  label="奖励心愿豆"
                  v-if="dataForm.reward_type === '5'"
                >
                  <el-input size="medium"  autocomplete="off" v-model="dataForm.wish_bean" clearable ></el-input>
                </el-form-item>
                <el-form-item
                  :label-width="formLabelWidth"
                  label="奖励幸运币"
                  v-if="dataForm.reward_type === '6'"
                >
                  <el-input size="medium"  autocomplete="off" v-model="dataForm.lucky_coin" clearable ></el-input>
                </el-form-item>
                <el-form-item
                  :label-width="formLabelWidth"
                  label="奖励能量豆"
                  v-if="dataForm.reward_type === '7'"
                >
                  <el-input size="medium"  autocomplete="off" v-model="dataForm.energy_bean"/>
                </el-form-item>
            </el-col>
        </el-row>
      </template>
      <template v-if="dataList.type.indexOf('7') !== -1">
        <el-row :gutter="20" type="flex">
            <el-col :span="24" class="my-lab-title">
                <div>任务跳转</div>
            </el-col>
        </el-row>
        <el-row :gutter="20" type="flex">
            <el-col :span="12">
                <el-form-item label="跳转类型：" label-width="150px">
                  <el-select  size="medium" filterable placeholder="类型" v-model="dataForm.type">
                    <el-option label="跳转URL" value="1"></el-option>
                    <el-option label="跳转小程序" value="2"></el-option>
                    <el-option label="跳转页面" value="3"></el-option>
                    <el-option label="关注生活号" value="4"></el-option>
                    <el-option label="插件页面" value="5"></el-option>
                    <el-option label="跳转生活号" value="6"></el-option>
                    <el-option label="跳转指定页面" value="7"></el-option>
                    <el-option label="跳转指定页面(饿了么)" value="13"></el-option>
                    <el-option label="增加小程序到桌面" value="8"></el-option>
                    <el-option label="增加小程序到支付宝首页" value="9"></el-option>
                    <el-option label="收藏小程序" value="10"></el-option>
                    <el-option label="邀请好友" value="11"></el-option>
                    <el-option label="加群" value="12"></el-option>
                    <el-option label="跳转淘宝" value="14"></el-option>
                    <el-option label="关注财富号" value="15"></el-option>
                    <el-option label="聚合拉新" value="18"></el-option>
                    <el-option label="CPA&CPM" value="19"></el-option>
      <!--              <el-option label="阿里广告" value="16"></el-option>-->
                  </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item
                    :label-width="formLabelWidth"
                    label="跳转地址"
                    v-if="dataForm.type === '1' || dataForm.type === '5' || dataForm.type === '6' || dataForm.type === '7' || dataForm.type === '13' || dataForm.type === '14' || dataForm.type === '16' "
                  >
                    <el-input size="medium" @paste.native="paste" autocomplete="off" v-model="dataForm.url" clearable></el-input>
                    <span v-if="newAnchorId" style="color: #999;font-size:12px;">直播间ID：{{newAnchorId}}</span>
                  </el-form-item>

                  <el-form-item
                    :label-width="formLabelWidth"
                    label="APPID"
                    v-if="dataForm.type === '2' || dataForm.type === '4'  || dataForm.type === '15' || dataForm.type === '16'"
                  >
                    <el-input size="medium"  @paste.native="paste" autocomplete="off" v-model="dataForm.appid" clearable ></el-input>
                  </el-form-item>

                  <el-form-item
                    :label-width="formLabelWidth"
                    label="路径"
                    v-if="dataForm.type === '2' || dataForm.type === '3'"
                  >
                    <el-input size="medium"  @paste.native="paste" autocomplete="off" v-model="dataForm.path" clearable ></el-input>
                  </el-form-item>
                  <el-form-item
                    :label-width="formLabelWidth"
                    label="参数"
                    v-if="dataForm.type === '2' || dataForm.type === '3'"
                  >
                    <el-input size="medium"  @paste.native="paste" autocomplete="off" v-model="dataForm.extra_data" clearable ></el-input>
                  </el-form-item>
                <template v-if="dataForm.type === '4' || dataForm.type === '15'">
                  <el-form-item
                    :label-width="formLabelWidth"
                    label="appid"
                  >
                    <el-input size="medium"  @paste.native="paste" autocomplete="off" v-model="dataForm.appID" clearable ></el-input>
                  </el-form-item>
                  <el-form-item
                    :label-width="formLabelWidth"
                    label="秘钥"
                  >
                    <el-input size="medium"  @paste.native="paste" autocomplete="off" v-model="dataForm.appPrivateKey" clearable ></el-input>
                  </el-form-item>
                  <el-form-item
                    :label-width="formLabelWidth"
                    label="公钥"
                  >
                    <el-input size="medium"  @paste.native="paste" autocomplete="off" v-model="dataForm.appPublicKey" clearable ></el-input>
                  </el-form-item>
                  <el-form-item
                    :label-width="formLabelWidth"
                    label="campId"
                  >
                    <el-input size="medium"  @paste.native="paste" autocomplete="off" v-model="dataForm.campId" clearable ></el-input>
                  </el-form-item>
                </template>
            </el-col>
        </el-row>
      </template>
      </div>
  </el-form>
  <div slot="footer" class="dialog-footer">
      <el-button size="medium"  type="primary" class="my-blue-btn" @click="submitData">确 定</el-button>
      <el-button size="medium"  @click="closeDialog">取 消</el-button>
  </div>
  </el-dialog>
</template>

<script>
  String.prototype.myReplace = function (f, e) {//吧f替换成e
    let reg = new RegExp(f, 'g') //创建正则RegExp对象
    return this.replace(reg, e)
  }
  const defaultInfo = function () {
    return {
      name: '',
      tag: '',
    }
  }
  export default {
    name: 'addTask',
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
      isShow: {
        default: false,
        type: Boolean
      },
      isActive: {
        default: true,
        type: Boolean
      },
    },
    data () {
      return {
        formLabelWidth: '100px',
        xcxSlot: [],
        timesArr: [null],//多段时间,
        browseTime: [], //浏览时间
        userList:{},//归属人列表
        mechanismList: [],//全部机构列表
        couldchoose: true,
        companyList: [], //机构列表
        couldClick:true,//弹窗确定按钮是否可点击
        selfList: [],
        dataList:{
          type:[]
        },
        dataEdit3:[{
          slot_id:''
        }],
        oldanchor_id:'',//初始的主播id
        firoldurl:'',//初始进入时记录最早的链接
        clearOldData:false,//是否在关弹窗时清除过初始数据
      }
    },
    mounted () {
      // console.log(this.dataForm);
    },
    computed: {
      xcxList(){
        return this.$store.state.base.xcxList
      },
      dilogTitle () {
        return this.dataForm.id > 0 ? '编辑数据' : '增加数据'
      },
      uploadUrl () {
        return this.$store.state.base.uploadUrl
      },
      newAnchorId(){
        let str = ''
        if(this.dataForm.url.indexOf('userId%25253D') !== -1){
          str = decodeURIComponent(decodeURIComponent(decodeURIComponent(this.dataForm.url)))
        }else if(this.dataForm.url.indexOf('userId%253D') !== -1){
          str = decodeURIComponent(decodeURIComponent(this.dataForm.url))
        }else if(this.dataForm.url.indexOf('userId%3D') !== -1){
          str = decodeURIComponent(this.dataForm.url)
        }else{
          str = this.dataForm.url
        }
        if(str.indexOf('userId=') !== -1){
          let num = 0
          for (let i = str.indexOf('userId=') + 7; i < str.length; i++) {
            if(!isNaN(str.charAt(i))){
              num = i
            }else{
              break;
            }
            
          }
          if (str.substring(str.indexOf('userId=') + 7, num + 1) == this.oldanchor_id) {
            return str.substring(str.indexOf('userId=') + 7, num + 1)
          }else{
            if (this.dataForm.type == 7 && this.oldanchor_id != '0' && this.clearOldData == false) {
              this.clearOldData = false
              this.open3('直播间ID或主播ID不可更改(链接可更改)')
              // this.dataForm.url = this.firoldurl
              this.dataForm.url = this.dataForm.url.split(`${this.dataForm.url.indexOf('userId%25253D') !== -1 ? 'userId%25253D' : this.dataForm.url.indexOf('userId%253D') !== -1 ? 'userId%253D' : this.dataForm.url.indexOf('userId%3D') !== -1 ? 'userId%3D' : ''}${str.substring(str.indexOf('userId=') + 7, num + 1)}`)
              .join(`${this.dataForm.url.indexOf('userId%25253D') !== -1 ? 'userId%25253D' : this.dataForm.url.indexOf('userId%253D') !== -1 ? 'userId%253D' : this.dataForm.url.indexOf('userId%3D') !== -1 ? 'userId%3D' : ''}${this.oldanchor_id}`)
              // 上面代码就是得这么长，不要回车功能会出错
              return this.oldanchor_id
            }
            return str.substring(str.indexOf('userId=') + 7, num + 1)
          }
        }else{
          return ''
        }
      },
      disableXcx(){
        let array = []
        this.dataEdit3.forEach(element => {
          array.push(element.mid)
        });
        return array
      },
      pickerOptions() {
          return this.$store.state.base.pickerOptions;
      }
    },
    watch: {
      //多段时间回显
      dataForm: {
        handler: function (val) {
          this.oldanchor_id = this.dataForm.anchor_id ? JSON.parse(JSON.stringify(this.dataForm.anchor_id)) : ''
          this.firoldurl == '' ? this.dataForm.url ? this.firoldurl = JSON.parse(JSON.stringify(this.dataForm.url)): '' : '';
          let pdArr = this.timesArr.filter(item=>{
            return item != null
          })
          val.time_list_str == undefined ? this.timesArr = [[val.time_start_str, val.time_end_str]] : this.timesArr = JSON.parse(JSON.stringify(val.time_list_str))
        },
        immediate: true,
      },
      'dataForm.type':{
        handler: function (val) {
          
        },
      },
      value(val){
        if(val){
          this.getCompanyList()
        }else{
          this.dataList.type = []
          this.dataEdit3 = [{slot_id: ''}]
        }
      }
      
    },
    methods: {
      add5Time() {
          this.timesArr.push(null)
      },
      delete5Time(index) {
          this.timesArr.splice(index, 1)
      },
      checkboxChenge(val){
        // console.log(val);
      },
      // 获取机构列表
      getCompanyList(){
        this.getRequest('/xcxTask/getCompanyList',{name:''}).then((res)=>{
          if (res.code == 200) {
            this.mechanismList = res.data
            this.couldchoose = false;
          }
        })
      },
      // 多段时间选择确认
      chooseTime (val, arrindex) {
        if (val != null) {
          try {
            val.forEach(ele => {
              this.timesArr.forEach((element, index) => {
                if (element != null) {
                  if (index == arrindex) {

                  } else {
                    if (element[0] < ele && ele < element[1]) {
                      this.timesArr.splice(arrindex, 1)
                      this.timesArr.push(null)
                      this.open3('时间范围不能交叉')
                      throw new Error('delete')
                    }
                  }
                }

              })
            })
          } catch (error) {
            if (error.message != 'delete') {
              throw error
            }
          }

          try {
            this.timesArr.forEach((element, index) => {
              if (element != null) {
                if (index == arrindex) {

                } else {
                  if (val[0] < element[0] && val[1] > element[1]) {
                    this.timesArr.splice(arrindex, 1)
                    this.timesArr.push(null)
                    this.open3('时间范围不能包含已有时间')
                    throw new Error('delete')
                  }
                }
              }
            })
          } catch (error) {
            if (error.message != 'delete') {
              throw error
            }
          }

        } else {

        }
      },
      paste (e) {
        // if (this.dataForm.anchor_id !='0') {
        //   return
        // }
        let str = e.clipboardData.getData('text').trim()
        if (this.dataForm.type === '7') {
          e.preventDefault()
          e.stopPropagation()
          if (str.substr(0, 9) == 'tbopen://') {
            e.preventDefault()
            e.stopPropagation()
            // this.dataForm.type = '7'
            this.dataForm.url = encodeURIComponent('https://mobile.yhshapp.com/goods/tbJump?url=' +
              encodeURIComponent(str))
          } else if ((str.substr(0, 43) == 'https://h5.m.taobao.com/taolive/video.html?') || (str.substr(0,
            40) == 'https://m.taobao.com/taolive/video.html?')) {
            e.preventDefault()
            e.stopPropagation()
            // this.dataForm.type = '7'
            this.dataForm.url = encodeURIComponent('https://mobile.yhshapp.com/goods/tbJump?url=' +
              encodeURIComponent(
                'tbopen://m.taobao.com/tbopen/index.html?&action=ali.open.nav&module=h5&bootImage=0&source=taobaolive&h5Url=' +
                encodeURIComponent(str)))
          }else{
            this.dataForm.url = encodeURIComponent(str)
          }
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
        } else if (str.substr(0, 9) == 'tbopen://') {
          e.preventDefault()
          e.stopPropagation()
          this.dataForm.type = '7'
          this.dataForm.url = encodeURIComponent('https://mobile.yhshapp.com/goods/tbJump?url=' + encodeURIComponent(str))
        } else if (
          str.substr(0, 57) ==
          'https://render.alipay.com/p/h5/life_public/www/index.html'
        ) {
          e.preventDefault()
          e.stopPropagation()
          this.dataForm.type = '6'
          this.dataForm.url = str
        } else if ((str.substr(0, 43) == 'https://h5.m.taobao.com/taolive/video.html?') || (str.substr(0, 40) == 'https://m.taobao.com/taolive/video.html?')) {
          e.preventDefault()
          e.stopPropagation()
          this.dataForm.type = '7'
          this.dataForm.url = encodeURIComponent('https://mobile.yhshapp.com/goods/tbJump?url=' + encodeURIComponent('tbopen://m.taobao.com/tbopen/index.html?&action=ali.open.nav&module=h5&bootImage=0&source=taobaolive&h5Url=' + encodeURIComponent(str)))
        }
      },
      parseQuery (query) {
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
      submitData () {
        if (!this.couldClick) {
          return;
        }
        if (!this.dataList.type.toString()) {
          this.$message.warning('没有操作任务')
          return;
        }
        this.couldClick = false;
        let url = '/XcxTask/updateTaskAll'
        let options = Object.assign({}, this.dataForm)
        options.news_type = this.dataList.type.toString()
        options.start_time = options.daterange[0] / 1000
        options.end_time = options.daterange[1] / 1000
        options.time_start = options.timerange[0] / 1000
        options.time_end = options.timerange[1] / 1000
        for (let i = 0; i < this.dataEdit3.length; i++) {
          if (this.dataEdit3[i].slot_id === ''&&this.dataList.type.indexOf('3') !== -1) {
            this.$message.warning('任务广告位不能为空')
            this.couldClick = true
            return
          }else if(this.dataEdit3[i].slot_id.length===0&&this.dataList.type.indexOf('3') !== -1){
            this.$message.warning('任务广告位不能为空')
            this.couldClick = true
            return
          }
        }
        let slotId = ''
        this.dataEdit3.forEach((e,index) => {
          if(index===0){
            slotId = e.slot_id
          }else{
            slotId = slotId + ',' + e.slot_id
          }
          
        });
        options.slot_id = slotId.toString()
        //多段时间处理
        for (let i = 0; i < this.timesArr.length; i++) {
          if (this.timesArr[i] == null&&this.dataList.type.indexOf('5') !== -1) {
            this.$message.warning('多段时间不能为空')
            this.couldClick = true
            return
          }
        }

        let jsonTimeArr = {}
        if (this.timesArr.length == 1 && this.timesArr[0] == null) {

        } else {
          let array = []
          array = this.timesArr.map(item => {
            return item = [
              '1' + item[0].myReplace(':', ''),
              '1' + item[1].myReplace(':', ''),
            ]
          })
          // let jsonTimeArr = {}
          array.forEach((element, index) => {
            jsonTimeArr[index] = element
          })
        }
        options.time_list = (jsonTimeArr == {} ? '' : JSON.stringify(jsonTimeArr)) //多段时间
          // console.log(options);
        this.postRequest(url, options).then((resp) => {
          if (resp && resp.code === 200) {
            this.$message({
              message: this.dilogTitle + '成功',
              type: 'success',
              showClose: true,
              duration: 1000,
              onClose: () => {
                this.couldClick = true
              },
            })
            this.$emit('success', this.dataForm)
            this.closeDialog()
          } else {
            this.$message({
              message: resp.msg,
              type: 'faild',
              showClose: true,
              duration: 1000,
              onClose: () => {
                this.couldClick = true
              },
            })
          }
        })
      },
      closeDialog () {
        this.$emit('input', false)
        this.$emit('colseShow', false)
        // this.dataForm.slot_id=''
        // this.timesArr = [null];
        this.firoldurl = ''
        this.oldanchor_id = ''
        this.clearOldData = true
      },
      
      addtagtask(e,i) {
        this.getTagData(i);
        this.dataEdit3[i].slot_id = "";
      },
      // 获取广告位
      getTagData(i) {
        this.getRequest("/XcxTask/categorySelect", {
          mid: this.dataEdit3[i].mid,
        }).then((resp) => {
          if (resp && resp.code === 200) {
            // this.dataEdit3[i].adSlotList = resp.data;
            this.$set(this.dataEdit3[i],'adSlotList',resp.data)
          }
        });
      },
      add3Time() {
          this.dataEdit3.push({})
          // console.log(this.dataEdit3);
      },
      delete3Time(index) {
          this.dataEdit3.splice(index, 1)
          // console.log(this.dataEdit3);
      },
      // 提示
      open1 (msg) {
        this.$message({
          showClose: true,
          message: msg,
        })
      },
      open2 (msg) {
        this.$message({
          showClose: true,
          message: msg,
          type: 'success',
        })
      },
      open3 (msg) {
        this.$message({
          showClose: true,
          message: msg,
          type: 'warning',
        })
      },
      open4 (msg) {
        this.$message({
          showClose: true,
          message: msg,
          type: 'error',
        })
      },
    },
  }
</script>

<style scoped lang="scss">
  .top_checkbox{
    display: flex;
    justify-content: space-around;
  }
</style>
