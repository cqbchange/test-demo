<template>
    <div class="card-box">
        <el-row type="flex" class="card-header">
            <el-col :span="21" class="card-header-title">{{title}}</el-col>
            <el-col
                :span="3"
                class="card-header-tisp bg-badge"
                :style="'background-color:'+bgColor"
                v-if="tips != ''"
            >{{tips}}</el-col>
        </el-row>
        <el-row type="flex" class="card-list">
            <el-col :span="24" class="big-font">{{values}}</el-col>
        </el-row>
    </div>
</template>

<script>
export default {
    props: {
        title: String,
        values: [String, Number],
        bgColor: {
            default: "#FF5722",
            type: String
        },
        tips: {
            default: "",
            type: String
        }
    }
};
</script>

<style>
.card-box {
    border-radius: 2px;
    background-color: #fff;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    cursor: pointer;
    border-radius: 5px;
}
.card-header {
    height: 42px;
    line-height: 42px;
    padding: 0 0 0 15px;
    border-bottom: 1px solid #f6f6f6;
    color: #333;
    border-radius: 2px 2px 0 0;
    font-size: 14px;
}

.card-header-tisp {
    display: flex;
    margin: 10px;
    text-align: center;
    justify-content: center;
    align-items: center;
    font-size: 12px;
}

.card-header span.card-header-tisp {
    width: 30px;
}

.card-header-tisp.active {
    color: #31b4e1;
}

.bg-badge {
    background-color: #ff5722;
    color: #fff;
    border-radius: 2px;
}

.bg-orange {
    background-color: #ffb800 !important;
}

.bg-blue {
    background-color: #1e9fff !important;
}

.card-list {
    padding: 12.5px;
}

.card-list .big-font {
    font-size: 36px;
    color: #666;
    line-height: 36px;
    padding: 5px 0 10px;
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-all;
    white-space: nowrap;
}
</style>
