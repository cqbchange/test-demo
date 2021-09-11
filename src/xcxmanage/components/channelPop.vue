<template>
    <div>
        <el-dialog :title="copyTitle" :visible.sync="showAlert" :close-on-press-escape="false" :close-on-click-modal="false"
        custom-class="showPwdTips channel" width="700px"  :before-close="closeShowPwdTips">
            <!-- el-icon-plus -->
            <div v-loading="loading">
                <el-button size="small" style="margin:0 0 17px 0" type="primary" icon="el-icon-plus" @click="addList()">添加渠道</el-button>
                <div class="table_box">
                    <el-table
                        :data="tableData"
                        style="width: 100%"
                        height="300px"
                        :header-cell-style="{
                            'background':'transparent',
                            'font-size': '16px',
                            'font-family': 'PingFang SC',
                            'font-weight': '500',
                            'color': '#333333',
                            'text-align': 'center',
                            'border-right':'1px solid #ffffff',
                        }"
                        :cell-style="{
                            'text-align': 'center',
                            'font-size': '14px',
                            'font-family': 'PingFang SC',
                            'font-weight': '500',
                            'color': '#666666',
                        }"
                        :header-row-style="{
                            'background':'rgba(207,228,255,0.16)',
                        }">
                        <!-- 'border-radius':'12px', -->
                        <el-table-column
                            label="ID"
                            align="center">
                            <template slot-scope="scope">
                                <span style="margin-left: 10px">{{ scope.row.id }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            label="名称"
                            align="center">
                            <template slot-scope="scope">
                                <div v-if="scope.row.showInput">
                                    <span>{{ scope.row.name }}</span>
                                    <i style="margin-left:2px;cursor:pointer;" @click="editRate(scope.row)" class="el-icon-edit"></i>
                                </div>
                                <div class="input_box" style="display:flex;align-items: center;" v-else>
                                    <el-input size="small" maxlength="8" style="width:150px" v-model="scope.row.name"  autocomplete="off" placeholder="请输入名称" :clearable="true"  /><!-- @clear="clearFun" -->
                                    <el-button style="margin:0 0 0 10px" type="text" @click="confirm(scope.row)">确定</el-button>
                                    <el-button style="margin:0 0 0 10px;color:#f00" type="text" @click="cancel(scope.row)">取消</el-button>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" align="center">
                            <template slot-scope="scope">
                                <el-button type="text" @click="copylink(scope.row)">{{copyData.isCopy?'复制成功':'复制链接'}}</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
        </el-dialog>
    </div>
</template>
<script>
export default {
    name: "channelPop",
    data() {
      return {
        copyTitle: '渠道管理测试',
        showAlert: false,
        tableData:[
            // {
            //     name:'天天夺宝',
            //     url:'https://baidu.com',
            //     id:'001',
            //     showInput:true,
            // },
            // {
            //     name:'天天夺宝',
            //     url:'https://baidu.com',
            //     id:'001',
            //     showInput:false,
            // },
            // {
            //     name:'天天夺宝',
            //     url:'https://baidu.com',
            //     id:'001',
            //     showInput:true,
            // },
            // {
            //     name:'天天夺宝天天夺宝',
            //     url:'https://baidu.com',
            //     id:'001',
            //     showInput:false,
            // },
            // {
            //     name:'天天夺宝',
            //     url:'https://baidu.com',
            //     id:'001',
            //     showInput:true,
            // },
        ],
        loading:true,
        lastId:'',
        nameList:[],
        copyData: {
            channel: '',
            xcx_id: '2021001167652345',
            type: '1',
            isCopy: false
        },//复制链接相关参数
      }
    },
    props: {
      showpop: {
        type: Boolean,
        default: false
      }
    },
    watch: {
        showpop: {
            handler: function (val) {
                console.log('showpop',val)
                this.showAlert = val;
                if(val){
                    this.getListData()
                }else{
                    this.loading = true
                }
            },
        },
    },
    computed: {
      
    },
    mounted() {
      
    },
    methods: {
        // 复制链接
        copy(item) {
            let obj = {}
            if (item.xcx_id) {
                Object.keys(this.xcxList).forEach(element => {
                    item.xcx_id.forEach(e => {
                        if (element === e) {
                            obj[element] = this.xcxList[element]
                        }
                    });
                });
                this.copyList = obj
            } else {
                this.copyList = this.xcxList
            }
            console.log(this.copyList)
            this.showCopyLinkDialog = true
            this.copyData.channel = item.id
        },
        // 复制链接2021001167652345
        copylink(row) {
            if(row.xcx_id){
                this.copyData.xcx_id = row.xcx_id.split(',')[0] == "" ? "2021001167652345" : row.xcx_id.split(',')[0]
            }
            if(this.copyData.isCopy == true){
                return
            }
            this.copyData.channel = row.id
            if (this.copyData.xcx_id == '' || this.copyData.channel == '') {
                this.$message({
                    message: '请选择推广的小程序',
                    type: 'warning'
                });
                return 0
            }
            let text = '';
            let query = 'adzoneId%3d' + this.copyData.channel + '%26filter%3d1';

            if (this.copyData.type == '0') {
                let page = 'pages%2findex%2findex'
                if (this.copyData.xcx_id == 2021001167680229) {
                    page = 'pages%2fwalk%2fwalk'
                }
                text = 'alipays://platformapi/startApp?appId=' + this.copyData.xcx_id + '&page=' + page + '&query=' + query
            } else {
                let path = 'appid%3d' + this.copyData.xcx_id + '%26path%3dpages%252findex%252findex';
                if (this.copyData.xcx_id == 2021001167680229 || this.copyData.xcx_id == 2021002128612909 || this.copyData.xcx_id == 2021002133640088) {
                    path = 'appid%3d' + this.copyData.xcx_id + '%26path%3dpages%2fwalk%2fwalk';
                }
                let page = 'pages%2findex%2findex%3f' + path + '%26extra_data%3dadzoneId%253d' + this.copyData.channel + '%2526filter%253d1'
                text = 'alipays://platformapi/startApp?appId=2021002129615691&page=' + page
            }
            if (text.indexOf('-') !== -1) {
                let arr = text.split('-');
                text = arr[0] + arr[1];
            }
            var textArea = document.createElement("textarea");
            textArea.style.position = 'fixed';
            textArea.style.top = '0';
            textArea.style.left = '0';
            textArea.style.width = '2em';
            textArea.style.height = '2em';
            textArea.style.padding = '0';
            textArea.style.border = 'none';
            textArea.style.outline = 'none';
            textArea.style.boxShadow = 'none';
            textArea.style.background = 'transparent';
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            try {
                var successful = document.execCommand('copy');
                // this.copyData.isCopy = true;
                this.$message.success('复制成功')
                // setTimeout(() => {
                //     this.copyData.isCopy = false;
                // }, 1500)
            } catch (err) {
                // alert('该浏览器不支持点击复制到剪贴板');
                this.$message.console.error();('该浏览器不支持点击复制到剪贴板')
            }
            document.body.removeChild(textArea);

        },
        addList(){
            let item = {
                name:'',
            }
            let item2 = item
            item2.showInput = false
            item2.id = this.lastId
            item2.isnew = true

            this.lastId++
            this.tableData.push(item)

            this.$nextTick(() => {
                let container = this.$el.querySelector('.el-table__body-wrapper');
                container.scrollTop = container.scrollHeight;
            })
        },
        closeShowPwdTips(){
            this.$emit('hide', false)
        },
        editRate(row){
            row.showInput = false
        },
        confirm(row){
            if(row.isnew){
                let postArr = [{
                    name:row.name
                }]
                this.loading = true
                this.postRequest('Channel/addAdzone',{
                    name:JSON.stringify(postArr),
                }).then((res)=>{
                    if(res.code == 200){
                        // this.loading = false
                        this.$message.success(res.msg)
                        row.showInput = true
                        delete row.isnew
                        row.id = res.data[0]
                        row.oldname = row.name
                        this.lastId = res.data[0]

                        this.$store.commit("setisGetList", true);

                        this.getRequest('Channel/getAdzoneList',{

                        }).then((res)=>{
                            this.loading = false

                            if(res.code == 200){
                                this.$store.commit("setchannelList", res.data);
                                this.$store.commit("setisGetList", false);

                                res.data.forEach((ele,index) => {
                                    ele.showInput = true;
                                    ele.oldname = ele.name;
                                });
                                this.lastId = Number(res.data[res.data.length-1].id)+1
                                this.tableData = res.data

                            }else{
                                this.$message.warning;(res.msg)
                            }
                        })
                    }else{
                        this.loading = false
                        this.$message.warning(res.msg)
                    }
                })
            }else{
                this.loading = true
                this.postRequest('Channel/editAdzone',{
                    name:row.name,
                    id:row.id,
                }).then((res)=>{
                    if(res.code == 200){
                        this.loading = false
                        this.$message.success(res.msg)
                        row.showInput = true
                        row.oldname = row.name

                        this.$store.commit("setisGetList", true);

                        this.getRequest('Channel/getAdzoneList',{

                        }).then((res)=>{
                            if(res.code == 200){
                                this.$store.commit("setchannelList", res.data);
                                this.$store.commit("setisGetList", false);
                            }
                        })
                    }else{
                        this.loading = false
                        this.$message.warning(res.msg)
                    }
                })
            }
        },
        cancel(row){
            row.showInput = true
            if(row.isnew){
                this.tableData.forEach((ele,index)=>{
                    if (ele.id == row.id) {
                        this.tableData.forEach((element,index2)=>{
                            if(index2>index){
                                element.id-=1
                            }
                        })
                        this.tableData.splice(index,1)
                        this.lastId-=1
                    }
                })
            }else{
                row.name = row.oldname
            }
        },
        getListData(){
            this.getRequest('Channel/getAdzoneList',{

            }).then((res)=>{
                this.loading = false
                if(res.code == 200){
                    res.data.forEach((ele,index) => {
                        ele.showInput = true;
                        ele.oldname = ele.name;
                    });
                    this.lastId = Number(res.data[res.data.length-1].id)+1
                    this.tableData = res.data
                }else{
                    this.$message.warning;(res.msg)
                }
            })
        }
    }
}
</script>
<style scoped lang="scss">
    .table_box{
        // border-radius: 12px;
        // overflow: hidden;
    }
    .table_box>>>.el-table th.gutter {
        background: rgba(207,228,255,0.16) !important;
        border-radius: 12px 12px 0px 0px;
    }
</style>