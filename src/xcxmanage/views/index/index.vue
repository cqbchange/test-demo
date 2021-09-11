<!--
 * @Descripttion: 
 * @version: 1.0
 * @Author: WangChuan
 * @Date: 2021-01-15 16:52:43
 * @LastEditors: WangChuan
 * @LastEditTime: 2021-04-25 17:19:40
-->
<template>
    <el-container>
        <el-aside width="200px">
            <Navi />
        </el-aside>
        <el-container>
            <el-header height="60px">
                <div class="topName">
                    <template v-if="breadCrumb.length >0">
                        <div class="topName-lab" v-for="(item,key) in breadCrumb" :key="key">
                            <span @click="handleSelect(item.path)">{{item.name}}</span>
                            <i class="el-icon-arrow-right" :key="key"></i>
                        </div>
                    </template>
                    <div class="topName-lab" :class="{'noBreadCrumb':breadCrumb.length ==0 }">{{ thisMenu.name}}</div>
                </div>
                <div class="topBtn">
                    <el-button size="mini" v-for="(item, key) in thisMenu.top_btn_list" :key="key"
                        @click="topBtn(item)">
                        {{ item.name }}
                    </el-button>
                </div>
            </el-header>
            <el-main :class="isfinanceTable ? 'finanpage' : ''">
                <keep-alive v-if="keep">
                    <router-view ref="viewBox" :key="$route.fullPath" />
                </keep-alive>
                <router-view ref="viewBox" :key="$route.fullPath" v-else />
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
    import Navi from "@/components/Navi.vue";

    export default {
        name: "index",
        components: {
            Navi
        },
        data() {
            return {};
        },
        methods: {
            topBtn(item) {
                if (item.type == 'url') {
                    this.$router.push(item.data);
                    this.$store.commit("setThisMenu", item);

                } else if (item.type == 'alert') {
                    if (item.data == 'zhuBoManage') {
                        this.$nextTick(() => {
                            this.$refs.viewBox.zhuBoManage();
                        })
                    }
                    if (item.data == '/addWhiteList') {
                        this.$nextTick(() => {
                            this.$refs.viewBox.edit()
                        })
                    }
                } else if (item.type == 'download') {
                    if (item.data == 'salemary') {
                        this.$nextTick(() => {
                            this.$refs.viewBox.download();
                        })
                    }
                }
            },
            handleSelect(key) {
                this.$router.push(key);
            },
            open2(msg) {
                this.$message({
                    showClose: true,
                    message: msg,
                    type: 'success',
                })
            },
        },
        computed: {
            // 面包屑
            breadCrumb() {
                if (this.$store.state.base.breadCrumb === undefined) {
                    let localData = JSON.parse(localStorage.getItem('breadCrumb'));
                    if (localData != null) {
                        this.$store.commit('setBreadCrumb', localData)
                    }
                }
                return this.$store.state.base.breadCrumb;
            },
            // 当前点击菜单
            thisMenu() {
                if (this.$store.state.base.thisMenu.name === '') {
                    let localData = JSON.parse(localStorage.getItem('thisMenu'));
                    if (localData != null) {
                        this.$store.commit('setThisMenu', localData)
                    }
                }

                // if (location.href.indexOf('salemary') != -1) {
                //     return this.$store.state.base.thisMenu.top_btn_list;
                // }
                return this.$store.state.base.thisMenu;
            },
            keep() {

                if (this.$route.path == '/taskLiveBlackList' || this.$route.path == '/activityGiftOrder' || this.$route
                    .path == '/userMechanismDetail' || this.$route.path == '/financeFtFlow') {
                    return false;
                }

                return process.env.NODE_ENV != "development";
            },
            isfinanceTable(){
                // console.log(window.location.hash,this.$store.state.base.isfinanceTable)
                return this.$store.state.base.isfinanceTable
            }
        }
    };

</script>

<style lang='scss'>
    .topName {
        display: flex;

        .topName-lab {
            cursor: pointer;

            span:hover {
                color: #409eff;
            }
        }

        .topName-lab:last-child {
            cursor: initial;
            color: #606266;

        }

        .noBreadCrumb {
            color: #000 !important;
        }

    }
    .finanpage{
        height: 100%;
        margin: 0;
        padding: 0 0px 20px;
        border-radius: 0px;
        background-color: inherit;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
    }
</style>
