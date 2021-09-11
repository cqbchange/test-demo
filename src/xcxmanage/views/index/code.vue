<!--
 * @Descripttion: 首页
 * @version: 1.0
 * @Author: WangChuan
 * @Date: 2021-01-15 16:52:43
 * @LastEditors: WangChuan
 * @LastEditTime: 2021-01-21 17:46:11
-->
<template>
    <div class="tbody">
        <div class="border-jj"></div>
        <div class="border-d"></div>
        <div class="border-jb"></div>
        <div class="border-djb"></div>
        <div class="border-djb1"></div>


    </div>
</template>
<script>
    export default {
        name: "mian",
        data() {
            return {}
        },
        methods: {},
        computed: {},
        mounted() {}
    };

</script>

<style lang='scss' scoped>
    .tbody {
        display: flex;

        div {
            width: 100px;
            height: 60px;
            margin-right: 30px;
        }
    }

    @keyframes rotate {
        100% {
            transform: rotate(1turn);
        }
    }

    @keyframes clippath {

        0%,
        100% {
            clip-path: inset(0 0 98% 0);
        }

        25% {
            clip-path: inset(0 98% 0 0);
        }

        50% {
            clip-path: inset(98% 0 0 0);
        }

        75% {
            clip-path: inset(0 0 0 98%);
        }
    }

    .border-djb1 {
        position: relative;
        text-align: center;
        font-size: 24px;


        &::before,
        &::after {
            content: "";
            position: absolute;
            top: 0px;
            left: 0px;
            right: 0px;
            bottom: 0px;
            border: 2px solid gold;
            transition: all .5s;
            animation: clippath 3s infinite linear;
            border-radius: 10px;
        }

        &::after {
            animation: clippath 3s infinite -1.5s linear;
        }
    }

    .border-djb {
        position: relative;
        z-index: 0;
        border-radius: 10px;
        overflow: hidden;

        &::before {
            content: '';
            position: absolute;
            z-index: -2;
            left: -50%;
            top: -50%;
            width: 200%;
            height: 200%;
            background-color: #1a232a;
            background-repeat: no-repeat;
            background-position: 0 0;
            background-image: conic-gradient(transparent, rgba(168, 239, 255, 1), transparent 30%);
            animation: rotate 4s linear infinite;
        }

        &::after {
            content: '';
            position: absolute;
            z-index: -1;
            left: 6px;
            top: 6px;
            width: calc(100% - 12px);
            height: calc(100% - 12px);
            background: #fff;
            border-radius: 5px;
        }

    }

    .border-jb {
        position: relative;
        overflow: hidden;


        &::before {
            content: '';
            position: absolute;
            left: -50%;
            top: -50%;
            width: 200%;
            height: 200%;
            background-repeat: no-repeat;
            background-size: 50% 50%, 50% 50%;
            background-position: 0 0, 100% 0, 100% 100%, 0 100%;
            background-image: linear-gradient(#399953, #399953), linear-gradient(#fbb300, #fbb300), linear-gradient(#d53e33, #d53e33), linear-gradient(#377af5, #377af5);
            animation: rotate 4s linear infinite;
        }


        &::after {
            content: '';
            position: absolute;
            left: 5%;
            top: 5%;
            width: 90%;
            height: 90%;
            background: #FFF;
        }

        @keyframes rotate {
            100% {
                transform: rotate(1turn);
            }
        }
    }

    .border-d {

        background:
            linear-gradient(90deg, #333 50%, transparent 0) repeat-x,
            linear-gradient(90deg, #333 50%, transparent 0) repeat-x,
            linear-gradient(0deg, #333 50%, transparent 0) repeat-y,
            linear-gradient(0deg, #333 50%, transparent 0) repeat-y;
        background-size: 4px 1px, 4px 1px, 1px 4px, 1px 4px;
        background-position: 0 0, 0 100%, 0 0, 100% 0;
        outline: 1px solid #333;
        outline-offset: -1px;

        &:hover {
            outline: none;
            animation: linearGradientMove .3s infinite linear;
        }

        @keyframes linearGradientMove {
            100% {
                background-position: 4px 0, -4px 100%, 0 -4px, 100% 4px;
            }
        }
    }

    .border-jj {
        position: relative;
        border: 1px solid #03A9F3;
        --borderColor: #03A9F3;

        &::before,
        &::after {
            content: "";
            position: absolute;
            width: 20px;
            height: 20px;
        }

        &::before {
            top: -5px;
            left: -5px;
            border-top: 1px solid var(--borderColor);
            border-left: 1px solid var(--borderColor);
            animation: ccc .3s ease-in-out 0s 1 alternate forwards;

        }

        &::after {
            right: -5px;
            bottom: -5px;
            border-bottom: 1px solid var(--borderColor);
            border-right: 1px solid var(--borderColor);
            animation: ddd .3s ease-in-out 0s 1 alternate forwards;

        }

        &:hover::before {
            animation: aaa .3s ease-in-out 0s 1 alternate forwards;
        }

        &:hover::after {
            animation: bbb .3s ease-in-out 0s 1 alternate forwards;
        }

        @keyframes aaa {
            0% {
                top: -5px;
                left: -5px;
            }

            100% {
                width: calc(100% + 9px);
                height: calc(100% + 9px);
            }
        }

        @keyframes bbb {
            0% {
                right: -5px;
                bottom: -5px;
            }

            100% {
                width: calc(100% + 9px);
                height: calc(100% + 9px);
            }
        }

        @keyframes ccc {
            0% {
                width: calc(100% + 9px);
                height: calc(100% + 9px);
            }

            100% {
                top: -5px;
                left: -5px;
            }
        }

        @keyframes ddd {
            0% {
                width: calc(100% + 9px);
                height: calc(100% + 9px);
            }

            100% {
                right: -5px;
                bottom: -5px;
            }
        }

    }

</style>
