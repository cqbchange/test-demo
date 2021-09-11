<template>
    <div id="app">
        <div id="login">
            <div class="login-bg">
                <div class="welcome_text">
                    <p class="text">Welcome!</p>
                    <p class="text_type">纷推互动</p>
                </div>
                <div class="login-righter">
                    <div class="form_head">
                        <img src="@img/login/logo_x.png" alt/>
                        <div>
                            <p class="logos">纷推互动</p>
                            <p>多维定向&nbsp;精准投放</p>
                        </div>
                    </div>
                    <div class="form_content">
                        <div>
                            <img src="@img/login/users_x.png" alt/>
                            <input v-model="name" type="text" placeholder="请输入账号"/>
                        </div>
                        <div>
                            <img src="@img/login/pass_x.png?v1" alt/>
                            <input v-model="pwd" type="password" placeholder="请输入密码" @keyup.enter="submitlogin"/>
                        </div>
                        <!--<div class="codes">-->
                        <!--    <img src="@img/login/code_x.png" alt/>-->
                        <!--    <input type="text" placeholder="验证码"/>-->
                        <!--    <p>ABCD</p>-->
                        <!--</div>-->
                    </div>
                    <div @click="submitlogin" class="login_button">
                        <p>登录</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "index",
        data() {
            return {
                pwd: '',
                name: ''
            };
        },
        methods: {
            logout() {
                this.postRequest("/login/logout", {}).then(
                    data => {
                        if (data.code === 200) {
                            sessionStorage.removeItem("accessToken");
                        }
                    }
                );
            },
            submitlogin() {
                this.postRequest("/login/index", {name: this.name, pwd: this.pwd}).then(
                    data => {
                        if (data.code === 200) {
                            sessionStorage.setItem("accessToken", 1);
                            this.getRequest("/home/getMenu?type=xcxadmin").then(data => {
                                if (data.code === 200) {
                                    this.$store.commit("setMenuList", data.data);
                                }
                            });
                            this.getRequest("/home/getUser").then(data => {
                                if (data.code === 200) {
                                    this.$store.commit("setUser", data.data);
                                }
                            });
                            // 重新登录刷新页面获取小程序配置
                            this.getRequest('/XcxTask/getMiniList').then((data) => {
                                if (data.code === 200) {
                                    this.$store.commit('setXcxList', data.data);
                                }
                            })
                            if (this.$route.query.gopath) {
                                this.$router.replace(this.$route.query.gopath);
                            } else {
                                this.$router.replace("/statistics");
                            }
                        } else {
                            this.$message({
                                message: data.msg,
                                type: "error"
                            });
                        }
                    }
                );
            }
        },
        mounted() {
            this.logout()
        }
    };
</script>
<style type="text/css">
    html,
    body {
        margin: 0;
        padding: 0;
    }

    #app {
        width: 100vw;
        height: 100vh;
    }

    p {
        margin-block-start: 0em;
        margin-block-end: 0em;
    }
</style>
<style lang="scss" scoped>
    #login {
        width: 100vw;
        height: 100vh;
        background: url(~@img/login/backg.png) no-repeat center;
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;

        .login-bg {
            width: 60vw;
            height: calc(60vw * (736 / 1207));
            background: url(~@img/login/pics.png) no-repeat center;
            background-size: 100%;
            position: relative;

            .welcome_text {
                position: absolute;
                top: 7%;
                left: 7%;

                .text_type {
                    font: normal calc(100vw / 58) PingFangSC-Medium;
                    color: #ffffff;
                    margin-top: 0.5rem;
                }

                .text {
                    font: normal calc(100vw / 29.5) PingFangSC-Medium;
                    color: #ffffff;
                }
            }

            .login-righter {
                position: absolute;
                width: 35%;
                top: 16%;
                left: 58%;

                .form_head {
                    display: flex;
                    align-items: center;
                    justify-content: flex-start;

                    img {
                        display: block;
                        width: calc(100% / 5.35);
                        height: calc(100% / 5);
                    }

                    div {
                        margin-left: 1rem;

                        p {
                            letter-spacing: 0.2rem;
                            color: #000000;
                            font-family: PingFangSC-Medium;
                            font-size: calc(100vw / 94);
                        }

                        .logos {
                            letter-spacing: 0.22rem;
                            font-size: calc(100vw / 47);
                        }
                    }
                }

                .form_content {
                    min-height: 24vh;
                    margin: calc(100vw / 36) 0;
                    background: #ffffff;

                    div {
                        display: flex;
                        align-items: center;
                        justify-content: flex-start;
                        border-bottom: 0.01rem solid #ececec;
                        margin: calc(100vw / 55) 0;
                        padding-bottom: 0.44rem;

                        img {
                            width: calc(100% / 20);
                            /*height: calc(100% / 20);*/
                            display: block;
                            margin-right: 1rem;
                        }

                        input {
                            width: 70%;
                            height: 28px;
                            outline: none;
                            border: none;
                            font: normal 0.89rem PingFangSC-Medium;
                            letter-spacing: 0.09rem;
                            color: initial;
                        }
                    }

                    .codes {
                        position: relative;

                        p {
                            position: absolute;
                            top: -7%;
                            left: 74%;
                            width: 4.44rem;
                            height: 1.78rem;
                            line-height: 1.78rem;
                            background-color: #f8f8f8;
                            text-align: center;
                        }

                        p:hover {
                            cursor: pointer;
                        }
                    }
                }

                .login_button {
                    margin: 0.15rem 0 0;
                    height: 3.33rem;
                    background-image: linear-gradient(
                            180deg,
                            #1b2d43 0%,
                            rgba(22, 6, 80, 0.4) 100%
                    ),
                    linear-gradient(#1b2d43, #1b2d43);
                    background-blend-mode: normal, normal;
                    border-radius: 1.5rem;

                    p {
                        font: normal 0.89rem PingFangSC-Medium;
                        line-height: 3.33rem;
                        letter-spacing: 0.09rem;
                        color: #ffffff;
                        text-align: center;
                    }
                }
            }
        }
    }
</style>
