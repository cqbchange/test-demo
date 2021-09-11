<!--
 * @Descripttion: 
 * @version: 1.0
 * @Author: WangChuan
 * @Date: 2021-01-15 16:52:43
 * @LastEditors: WangChuan
 * @LastEditTime: 2021-01-30 16:24:32
-->
<template>
    <div id="app">

    </div>
</template>

<script>
    export default {
        name: "logout",
        data() {
            return {};
        },
        methods: {
            logout() {
                this.postRequest("/login/logout", {}).then(
                    data => {
                        if (data.code === 200) {
                            sessionStorage.setItem("accessToken", 0);
                            this.$router.replace("/login");
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
<style lang="scss" scoped>
</style>
