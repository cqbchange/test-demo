<!--
 * @Descripttion: 菜单栏组件
 * @version: 1.0
 * @Author: WangChuan
 * @Date: 2021-01-15 16:52:43
 * @LastEditors: WangChuan
 * @LastEditTime: 2021-01-30 16:25:50
-->
<template>
    <div>
        <div class="head-box">
            <div class="head">
                <img src="../assets/images/head.jpg" alt="" />
            </div>
            <div class="name">
                {{ user.user_name}}
            </div>
            <el-tooltip class="item" effect="light" placement="bottom">
                <div slot="content">
                    <span class="out" @click="handleSelect('/login')">退出登录</span>
                </div>
                <div class="jiao"></div>
            </el-tooltip>
        </div>
        <el-menu id="asideNav" :default-openeds="defaultMenu" :default-active="defaultIndex" class="asideNav"
            @select="handleSelect" text-color="#bababc" active-text-color="#FFFFFF" :unique-opened="true">
            <template v-for="(item, key) in menuList">
                <el-submenu :key="key" :index="key + ''" v-if="item.children.length">
                    <template slot="title">
                        <!-- <i class="img-icon" :class="item.icon"></i> -->
                        <i class="iconfont iconimg-icon-task" :class="item.icon"></i>
                        <span>{{ item.name }}</span>
                    </template>
                    <el-menu-item v-for="(item1, key1) in item.children" :index="item1.route" :key="key1">
                        {{ item1.name }}</el-menu-item>
                </el-submenu>
                <el-menu-item v-else :key="key" :index="item.route">
                    <i class="iconfont" :class="item.icon"></i>
                    <span slot="title">{{ item.name }}</span>
                </el-menu-item>
            </template>
        </el-menu>
    </div>
</template>

<script>
    export default {
        name: "Navi",
        data() {
            return {};
        },
        computed: {
            // 用户信息
            user() {
                return this.$store.state.base.user;
            },
            menuList() {
                return this.$store.state.base.menuList;
            },
            defaultMenu() {
                let res = this.$store.state.base.menuList.findIndex((item, key) => {
                    if (item.children.length > 0) {
                        let ret = item.children.find((item1) => {
                            if (item1.route == this.$route.path) {
                                return true;
                            }
                        });
                        return ret != undefined;
                    }
                    if (item.route == this.$route.path) {
                        return true;
                    }
                });
                return [res + ""];
            },
            defaultIndex() {
                let index = "";
                this.$store.state.base.menuList.findIndex((item, key) => {
                    if (item.children.length > 0) {
                        let ret = item.children.find((item1) => {
                            if (item1.route == this.$route.path) {
                                index = item1.route;
                                return true;
                            }
                        });
                        return ret != undefined;
                    }
                    if (item.route == this.$route.path) {
                        index = item.route;
                        return true;
                    }
                });
                return index;
            },
        },
        methods: {
            handleIconClick(ev) {},
            handleSelect(key, keyPath) {
                this.$router.push(key);
            },
        },
    };

</script>

<style lang='scss'>
    .out {
        cursor: pointer;
    }

    .asideNav {
        width: 207px;
        height: 100vh;
        background-color: #292e3b;
        border-right: none;
        overflow: auto;
        overflow-y: scroll;
        box-sizing: border-box;

        .el-menu-item,
        .el-submenu__title {
            font-size: 15px;

            i,
            span {
                color: #FFF;
            }
        }

        .el-submenu__title:focus,
        .el-submenu__title:hover {
            outline: 0;
            color: #ffffff !important;
            background-color: #333a4e;
        }

        .el-menu {
            .el-menu-item {
                padding-left: 50px !important;
            }
        }

        .el-menu-item:hover,
        .el-menu-item:focus {
            color: #ffffff !important;
            background-color: #333a4e !important;
        }

        .el-menu-item.is-active {
            color: #ffffff;
            background: linear-gradient(90deg, #73a7ff, #448aff);
        }

        .el-menu--inline {
            background-color: #232639 !important;
        }

        // 菜单图标 Start
        .iconfont {
            margin-right: 8px;
        }

    }

</style>
