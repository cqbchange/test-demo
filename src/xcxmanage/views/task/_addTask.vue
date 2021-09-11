<!--
 * @Descripttion: 任务弹窗
 * @version: 1.0
 * @Author: Dulei
 * @Date: 2021-01-19 10:42:43
 * @LastEditors: WangChuan
 * @LastEditTime: 2021-08-30 16:37:46
-->
<template>
    <el-dialog :close-on-click-modal="false" :before-close="closeDialog" :title="dilogTitle" :visible.sync="value"
        custom-class="my-dialog" width="1400px" :append-to-body="true" style="margin-left: 210px;"
        :close-on-press-escape="false">
        <el-form :model="dataForm" size="medium">
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-form-item :label-width="formLabelWidth" label="标题:">
                        <el-input size="medium" autocomplete="off" v-model="dataForm.title" clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item :label-width="formLabelWidth" label="小标题:">
                        <el-input size="medium" autocomplete="off" v-model="dataForm.subtitle" clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item :label-width="formLabelWidth" label="按钮文字:">
                        <el-input size="medium" autocomplete="off" v-model="dataForm.button_text" clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item :label-width="formLabelWidth" label="气泡标题:">
                        <el-input size="medium" autocomplete="off" v-model="dataForm.bubble_title" clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item :label-width="formLabelWidth" label="cpc单价:">
                        <el-input size="medium" autocomplete="off" v-model="dataForm.cpc_money" clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item :label-width="formLabelWidth" label="描述:">
                        <el-input size="medium" autocomplete="off" v-model="dataForm.description" clearable></el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="8">
                    <el-form-item :label-width="formLabelWidth" label="小程序:">
                        <el-select size="medium" filterable multiple placeholder="小程序" @change="selectxcx"
                            v-model="dataForm.ads_id">
                            <el-option :key="item.id" :label="item.name" :value="item.id" v-for="item in xcxSlot">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>

                <el-col :span="8">
                    <el-form-item :label-width="formLabelWidth" label="分类:" :key="2" v-if="!isShow">
                        <el-select size="medium" filterable multiple placeholder="分类" @change="isSlotid"
                            v-model="dataForm.slot_id">
                            <el-option :key="item.id" :label="item.name" :value="item.id" v-for="item in adSlot">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <!-- v-if="isShow"   -->
                <el-col :span="8">
                    <el-form-item v-if="isShow" :label-width="formLabelWidth" label="分类:" :key="3">
                        <el-select size="medium" filterable multiple placeholder="分类" :value="['1']" :disabled="true">
                            <el-option label="特殊广告位" value="1"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item :label-width="formLabelWidth" label="排序:">
                        <el-input size="medium" autocomplete="off" v-model="dataForm.list_order" clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item :label-width="formLabelWidth" label="奖励类型:" :key="1">
                        <el-select size="medium" filterable placeholder="奖励类型" v-model="dataForm.reward_type"
                            @change="rewardTypeChange">
                            <el-option label="奖励金币" value="1"></el-option>
                            <el-option label="奖励步数" value="2" v-if="!isShow"></el-option>
                            <el-option label="奖励红包" value="3" v-if="!isShow"></el-option>
                            <el-option label="奖励集分宝" value="4"></el-option>
                            <el-option label="奖励心愿豆" value="5" v-if="!isShow"></el-option>
                            <el-option label="奖励幸运币" value="6" v-if="!isShow"></el-option>
                            <el-option label="奖励能量豆" value="7" v-if="!isShow"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item :label-width="formLabelWidth" label="奖励金币:" v-if="dataForm.reward_type === '1'">
                        <el-input size="medium" autocomplete="off" v-model="dataForm.integral" clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item :label-width="formLabelWidth" label="奖励步数:" v-if="dataForm.reward_type === '2'">
                        <el-input size="medium" autocomplete="off" v-model="dataForm.step" clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item :label-width="formLabelWidth" label="奖励红包:" v-if="dataForm.reward_type === '3'">
                        <el-input size="medium" autocomplete="off" v-model="dataForm.money" clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item :label-width="formLabelWidth" label="奖励集分宝:" v-if="dataForm.reward_type === '4'">
                        <el-input size="medium" autocomplete="off" v-model="dataForm.jfb" clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item :label-width="formLabelWidth" label="奖励心愿豆:" v-if="dataForm.reward_type === '5'">
                        <el-input size="medium" autocomplete="off" v-model="dataForm.wish_bean" clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item :label-width="formLabelWidth" label="奖励幸运币:" v-if="dataForm.reward_type === '6'">
                        <el-input size="medium" autocomplete="off" v-model="dataForm.lucky_coin" clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item :label-width="formLabelWidth" label="奖励能量豆:" v-if="dataForm.reward_type === '7'">
                        <el-input size="medium" autocomplete="off" v-model="dataForm.energy_bean" />
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item :label-width="formLabelWidth" label="备注:">
                        <el-input size="medium" autocomplete="off" v-model="dataForm.remark" clearable></el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="8">
                    <el-form-item :label-width="formLabelWidth" label="归属人:">
                        <!-- <el-input size="medium"  autocomplete="off" v-model="dataForm.owner" clearable ></el-input> -->
                        <el-select :disabled="dataForm.isedit" size="medium" filterable placeholder="归属人"
                            v-model="dataForm.owner" clearable @change="ownerChange()">
                            <el-option v-for="(val,key,i) in userList" :label="val" :value="val" :key="i"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item :label-width="formLabelWidth" label="机构:">
                        <!-- <el-input size="medium"  autocomplete="off" v-model="dataForm.owner" clearable ></el-input> -->
                        <!--  -->
                        <el-select size="medium" :disabled="dataForm.isedit" filterable placeholder="机构"
                            v-model="dataForm.company_id" clearable @change="companyChange()">
                            <el-option v-for="(item, i) in companyList" :label="item.name" :value="item.id" :key="i">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item :label-width="formLabelWidth" label="浏览时间:">
                        <el-select size="medium" filterable placeholder="浏览时间" v-model="dataForm.browse_time">
                            <el-option v-for="(item, index) in browseTime" :label="item.name" :value="item.num"
                                :key="index" />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item :label-width="formLabelWidth" label="起止日期:">
                        <el-date-picker size="medium" end-placeholder="结束日期" range-separator="至"
                            start-placeholder="开始日期" style="width:100%" type="daterange" v-model="dataForm.daterange"
                            value-format="timestamp" :picker-options="pickerOptions" />
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item :label-width="formLabelWidth" label="小描述:">
                        <el-input size="medium" autocomplete="off" v-model="dataForm.desc_title"
                            placeholder="(开心签到首页任务用)" clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item :label-width="formLabelWidth" label="商家名称:">
                        <el-input size="medium" autocomplete="off" v-model="dataForm.store_title"
                            placeholder="(开心签到首页任务用)" clearable></el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="24">
                    <el-form-item :label-width="formLabelWidth" label="起止时间:">
                        <div class="new_time_picker2" v-for="(item,index) in timesArr" :key="index">
                            <el-time-picker is-range v-model="timesArr[index]" start-placeholder="请选择"
                                end-placeholder="请选择" value-format="HH:mm:ss" placeholder="选择时间范围" format="HH:mm"
                                @change="chooseTime(timesArr[index],index)">
                            </el-time-picker>
                            <img class="delete" v-if="timesArr.length >1&&timesArr.length!==index+1"
                                @click="deleteArr(index)" width="20px" src="@img/task/task-del.png" alt="图片">
                            <img class="delete" v-if="timesArr.length ===index+1" @click="addTimesArr" width="20px"
                                src="@img/task/task-add.png" alt="图片">
                        </div>
                    </el-form-item>
                </el-col>
                <el-col :span="24" style="padding:0">
                    <el-col :span="8" class="upload-img-box">
                        <el-form-item :label-width="formLabelWidth" label="上传图片:">
                            <div style="width:44px;height:44px;"
                                :style="dataForm.image?'':'border:1px dotted #ccc;border-radius: 3px;'">
                                <img v-if="dataForm.image" width="44px" height="44px" :src="dataForm.image" alt="图片">
                            </div>
                        </el-form-item>
                        <el-upload :action="uploadUrl" :on-success="handleImgSuccess" :show-file-list="false"
                            class="upload-img" name="image">
                            <el-button size="medium" type="primary">点击上传</el-button>
                        </el-upload>
                    </el-col>
                    <el-col :span="8" class="upload-img-box">
                        <el-form-item :label-width="formLabelWidth" label="上传气泡图片:">
                            <div style="width:44px;height:44px;"
                                :style="dataForm.image_bubble?'':'border:1px dotted #ccc;border-radius: 3px;'">
                                <img v-if="dataForm.image_bubble" width="44px" height="34px"
                                    :src="dataForm.image_bubble" alt="图片">
                            </div>
                        </el-form-item>
                        <el-upload :action="uploadUrl" :on-success="handleImgSuccesss" :show-file-list="false"
                            class="upload-img" name="image">
                            <el-button size="medium" type="primary">点击上传</el-button>
                        </el-upload>
                    </el-col>
                    <el-col :span="8" class="upload-img-box"
                        v-if="dataForm.reward_type == 1 || dataForm.reward_type == 4">
                        <el-button size="medium" type="primary" @click="toggleShow">生成图</el-button>
                    </el-col>
                </el-col>
                <el-col :span="24" style="padding:0">
                    <el-col :span="8">
                        <el-form-item :label-width="formLabelWidth" label="每日点击数量:">
                            <el-input size="medium" autocomplete="off" v-model="dataForm.limit_click_amount" clearable>
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item :label-width="formLabelWidth" label="赠送比例:">
                            <el-input @keyup.native="handleInput" size="medium" autocomplete="off" v-model="rateCom"
                                clearable @blur="isFocus = false" @focus="isFocus = true"></el-input>
                            <span
                                style="color: #999;font-size:12px;position: absolute;bottom: -30px;left: 0;">每日累计点击数量：{{parseFloat(((parseFloat(dataForm.limit_click_amount)?parseFloat(dataForm.limit_click_amount):0)*(1+((parseFloat(rateCom)?parseFloat(rateCom):0)/100))).toPrecision(12))}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item :label-width="formLabelWidth" label="累积点击数量:">
                            <el-input size="medium" autocomplete="off" v-model="dataForm.limit_amount" clearable>
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-col>


                <el-col :span="8">
                    <el-row :gutter="20">
                        <el-col :span="13">
                            <el-form-item :label-width="formLabelWidth" label="类型:">
                                <el-select size="medium" placeholder="类型" v-model="dataForm.type" filterable>
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
                                    <el-option label="灯火商品" value="20"></el-option>
                                    <el-option label="顶部收藏" value="21"></el-option>
                                    <el-option label="2千任务" value="22"></el-option>
                                    <!-- <el-option label="阿里广告" value="16"></el-option>-->
                                    <!-- <el-option label="云猫猫" value="17"></el-option> -->
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="11">
                            <el-form-item label-width="80px" label="任务类型:">
                                <el-select size="medium" placeholder="类型" v-model="dataForm.put_type" filterable>
                                    <el-option v-for="(item, key) in putType" :label="item" :value="key" :key="key" />
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-col>

                <el-col :span="8">
                    <el-form-item :label-width="formLabelWidth" label="跳转地址:"
                        v-if="dataForm.type === '1' || dataForm.type === '5' || dataForm.type === '6' || dataForm.type === '7' || dataForm.type === '13' || dataForm.type === '14' || dataForm.type === '16' ">
                        <el-input size="medium" @paste.native="paste" autocomplete="off" v-model="dataForm.url"
                            clearable @clear="clearUrl"></el-input>
                        <span v-if="newAnchorId" style="color: #999;font-size:12px;">
                            <a :href="'https://tesi.m.taobao.com/app/mtb/daren-page-esr/pages/index/index.html?userId='+newAnchorId"
                                target="_blank" rel="noopener noreferrer">直播间ID：{{newAnchorId}}</a>
                        </span>
                    </el-form-item>
                </el-col>

                <el-col :span="8">
                    <el-form-item :label-width="formLabelWidth" label="APPID:"
                        v-if="dataForm.type === '2' || dataForm.type === '4'  || dataForm.type === '15' || dataForm.type === '16'">
                        <el-input size="medium" @paste.native="paste" autocomplete="off" v-model="dataForm.appid"
                            clearable></el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="8">
                    <el-form-item :label-width="formLabelWidth" label="路径:"
                        v-if="dataForm.type === '2' || dataForm.type === '3'">
                        <el-input size="medium" @paste.native="paste" autocomplete="off" v-model="dataForm.path"
                            clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item :label-width="formLabelWidth" label="参数:"
                        v-if="dataForm.type === '2' || dataForm.type === '3'">
                        <el-input size="medium" @paste.native="paste" autocomplete="off" v-model="dataForm.extra_data"
                            clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8" v-if="dataForm.type !== '17' && dataForm.type !== '18'">
                    <el-form-item :label-width="formLabelWidth" label="生活号组件id:">
                        <el-input size="medium" autocomplete="off" v-model="dataForm.life_id" clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item :label-width="formLabelWidth" label="主播名称:">
                        <el-input size="medium" autocomplete="off" v-model="dataForm.anchor_nickname" clearable>
                        </el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item :label-width="formLabelWidth" label="主播ID:">
                        <el-input size="medium" autocomplete="off" v-model="dataForm.anchor_id" clearable
                            :disabled="anchorIdInput">
                        </el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="24" style="padding:0" v-if="dataForm.type === '4' || dataForm.type === '15'">
                    <el-col :span="6">
                        <el-form-item :label-width="formLabelWidth" label="appid:">
                            <el-input size="medium" @paste.native="paste" autocomplete="off" v-model="dataForm.appID"
                                clearable></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item :label-width="formLabelWidth" label="秘钥:">
                            <el-input size="medium" @paste.native="paste" autocomplete="off"
                                v-model="dataForm.appPrivateKey" clearable></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item :label-width="formLabelWidth" label="公钥:">
                            <el-input size="medium" @paste.native="paste" autocomplete="off"
                                v-model="dataForm.appPublicKey" clearable></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item :label-width="formLabelWidth" label="campId:">
                            <el-input size="medium" @paste.native="paste" autocomplete="off" v-model="dataForm.campId"
                                clearable></el-input>
                        </el-form-item>
                    </el-col>
                </el-col>
                <el-col :span="24">
                    <el-col :span="6">
                        <el-form-item :label-width="formLabelWidth" label="任务类型:">
                            <el-radio-group v-model="dataForm.dev">
                                <el-radio :label="'0'">正式</el-radio>
                                <el-radio :label="'1'">内部</el-radio>
                                <el-radio :label="'2'">测试</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item :label-width="formLabelWidth" label="是否发布:">
                            <el-radio-group v-model="dataForm.status">
                                <el-radio :label="'1'">是</el-radio>
                                <el-radio :label="'0'">否</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item :label-width="formLabelWidth" label="单次任务:">
                            <el-radio-group v-model="dataForm.is_single">
                                <el-radio :label="'1'">是</el-radio>
                                <el-radio :label="'0'">否</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item :label-width="formLabelWidth" label="特殊显示:">
                            <el-radio-group v-model="dataForm.filter">
                                <el-radio :label="'1'">是</el-radio>
                                <el-radio :label="'0'">否</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item :label-width="formLabelWidth" label="阿里广告:">
                            <el-radio-group v-model="dataForm.open_ali_ad">
                                <el-radio :label="'1'">是</el-radio>
                                <el-radio :label="'0'">否</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>

                    <el-col :span="6" v-if="isActive">
                        <el-form-item :label-width="formLabelWidth" label="是否去重:">
                            <el-radio-group v-model="dataForm.is_repeat" @change="isRepeat">
                                <el-radio :label="'0'">是</el-radio>
                                <el-radio :label="'1'">否</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item :label-width="formLabelWidth" label="5分刷新:">
                            <el-radio-group v-model="dataForm.is_minute_repeat">
                                <el-radio :label="'1'">是</el-radio>
                                <el-radio :label="'0'">否</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item :label-width="formLabelWidth" label="平均投放">
                            <el-radio-group v-model="dataForm.is_avg_publish">
                                <el-radio :label="'1'">是</el-radio>
                                <el-radio :label="'0'">否</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item :label-width="formLabelWidth" label="第三方投放">
                            <el-radio-group v-model="dataForm.is_thirdparty">
                                <el-radio :label="'1'">是</el-radio>
                                <el-radio :label="'0'">否</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item :label-width="formLabelWidth" label="任务过滤">
                            <el-radio-group v-model="dataForm.is_hidden">
                                <el-radio :label="'1'">是</el-radio>
                                <el-radio :label="'0'">否</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item :label-width="formLabelWidth" label="信息流中转">
                            <el-radio-group v-model="is_tansfer" @change="isTansfer">
                                <el-radio :label="1">是</el-radio>
                                <el-radio :label="0">否</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                </el-col>
            </el-row>
        </el-form>
        <div class="dialog-footer" slot="footer">
            <el-button size="medium" :loading="!couldClick" @click="submitData" type="primary" class="my-blue-btn"
                v-if="dataForm.owner_id==0">确 定</el-button>
            <el-button size="medium" @click="closeDialog">取 消</el-button>
        </div>
        <up-loadimg field="image" @colseUpImgShow="colseUpImgShow" @crop-upload-success="cropUploadSuccess"
            @crop-upload-fail="cropUploadFail" v-model="showloadimg" :width="300" :height="300" :url="uploadUrl"
            :rewardType="parseInt(this.dataForm.reward_type)">
        </up-loadimg>

        <el-dialog title="生成信息流中转链接" :visible.sync="isTansferVisible" custom-class="my-dialog" width="26%"
            :append-to-body="true" :close-on-press-escape="false">
            <el-form :model="tansferInfo" size="medium">
                <el-form-item label="落地小程序:" :label-width="formLabelWidth">
                    <el-select size="medium" filterable placeholder="小程序" v-model="tansferInfo.ads_id"
                        @change="selectTansferXcx">
                        <el-option :key="ii" :label="item" :value="ii" v-for="(item,ii) in mList">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="落地路径:" :label-width="formLabelWidth">
                    <el-input size="medium" autocomplete="off" v-model="tansferInfo.path" clearable></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="setTansfer()">确 定</el-button>
                <el-button type="info" @click="isTansferVisible = false;is_tansfer = 0;">关 闭</el-button>
            </div>
        </el-dialog>
    </el-dialog>
</template>

<script>
    import axios from 'axios'
    import UploadImg from '@/components/UploadImg/upload.vue';
    String.prototype.myReplace = function (f, e) { //吧f替换成e
        let reg = new RegExp(f, 'g') //创建正则RegExp对象
        return this.replace(reg, e)
    }
    const defaultInfo = function () {
        return {
            name: '',
            tag: '',
            put_type: 0
        }
    }
    export default {
        name: 'addTask',
        components: {
            "up-loadimg": UploadImg
        },
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
            adSlot: {
                type: Array,
                default: [],
            }
        },
        data() {
            return {
                showloadimg: false,
                formLabelWidth: '100px',
                // adSlot: [],
                xcxSlot: [],
                timesArr: [null], //多段时间,
                browseTime: [], //浏览时间
                userList: {}, //归属人列表
                companyList: [], //机构列表
                putType: [], //任务类型
                couldClick: true, //弹窗确定按钮是否可点击
                selfList: [],
                isFocus: false,
                oldanchor_id: '', //初始的主播id
                firoldurl: '', //初始进入时记录最早的链接
                clearOldData: false, //是否在关弹窗时清除过初始数据
                anchorIdInput: true,
                sourceLine: null, //中断请求(搜索ID)
                is_tansfer: 0, //信息流中转
                isTansferVisible: false,
                transferXcx: [],
                tansferInfo: {
                    ads_id: '',
                    path: ''
                }
            }
        },
        methods: {
            toggleShow() {
                if (this.dataForm.reward_type != 1 && this.dataForm.reward_type != 4) {
                    this.$message.error('奖励类型是:金币/集分宝才能生成')
                } else {
                    this.showloadimg = !this.showloadimg;
                }
            },
            // 关闭上传
            colseUpImgShow() {
                this.showloadimg = false
            },
            // 上传成功
            cropUploadSuccess(jsonData, field) {
                if (field == 'task') {
                    this.$set(this.dataForm, 'image', jsonData.data)
                } else {
                    this.$set(this.dataForm, 'image_bubble', jsonData.data)
                }
            },
            // 上传失败
            cropUploadFail(status, field) {
                console.log('-------- upload fail --------');
                console.log(status);
                console.log('field: ' + field);

            },
            isSlotid() {
                if (this.dataForm.slot_id.length) {
                    this.$emit('iscloseShow', false)
                    this.dataForm.is_repeat = ''
                } else if (!this.dataForm.slot_id.length) {
                    this.$emit('iscloseShow', true)
                }
            },
            //是否去重
            isRepeat() {
                // this.dataForm.reward_type = '4'
                this.$emit('colseShow', true)

                // this.dataForm.gift_ratio = 15
            },
            isTansfer(e) {
                this.tansferInfo = {
                    ads_id: '',
                    path: ''
                }
                if (e == 1) {
                    this.isTansferVisible = true;
                } else {
                    this.isTansferVisible = false;
                }
            },
            selectTansferXcx() {
                this.tansferInfo.path = 'pages/index/index'
                if (this.tansferInfo.ads_id == 2021001167680229 || this.tansferInfo.ads_id == 2021002128612909 || this
                    .tansferInfo.ads_id == 2021002133640088) {
                    this.tansferInfo.path = 'pages/walk/walk'
                }
            },
            setTansfer() {
                if (this.tansferInfo.ads_id == '') {
                    this.$message.error('请选择落地小程序')
                    return
                } else if (this.tansferInfo.path == '') {
                    this.$message.error('请输入落地路径')
                    return
                } else {
                    let tansferData = Object.assign([], this.transferXcx);

                    // 拼接落地地址
                    let jurl = encodeURIComponent(
                        `alipays://platformapi/startapp?appId=${this.tansferInfo.ads_id}&page=` +
                        encodeURIComponent(this.tansferInfo.path))
                    // 排除已选ID
                    var index = tansferData.indexOf(this.tansferInfo.ads_id);
                    if (index > -1) {
                        tansferData.splice(index, 1);
                    }

                    let jurlId = tansferData[Math.floor(Math.random() * tansferData.length + 1) - 1];
                    // 随机取Jid
                    var index = tansferData.indexOf(jurlId);
                    if (index > -1) {
                        tansferData.splice(index, 1);
                    }
                    let jid = tansferData[Math.floor(Math.random() * tansferData.length + 1) - 1];
                    var index = tansferData.indexOf(jid);
                    if (index > -1) {
                        tansferData.splice(index, 1);
                    }
                    jid += ',' + tansferData[Math.floor(Math.random() * tansferData.length + 1) - 1];

                    // 拼接页面地址
                    let pages = encodeURIComponent('pages/index/transfer?jurl=' + jurl + '&jid=' + encodeURIComponent(
                        jid))

                    // pages/index/index
                    this.dataForm.url = encodeURIComponent(
                        `alipays://platformapi/startapp?appId=${jurlId}&page=${pages}`)
                    this.dataForm.type = '7'
                    this.dataForm.put_type = 0
                    this.isTansferVisible = false;
                }
            },
            //小程序
            selectxcx() {
                if (this.dataForm.ads_id.length) {
                    let ids = [];
                    if (this.dataForm.ads_id.indexOf(-1) >= 0) {
                        this.xcxSlot.forEach((item) => {
                            if (item.id != -1) {
                                ids.push(item.id)
                            }
                        })
                        this.dataForm.ads_id = ids
                    }
                    // this.dataForm.reward_type = '4'
                    if (this.dataForm.reward_type != '1' && this.dataForm.reward_type != '4') {
                        this.dataForm.reward_type = '1'
                    }
                    this.$emit('iscloseShow', true)
                    this.$emit('colseShow', true)
                    this.dataForm.slot_id = ''

                    // this.dataForm.gift_ratio = 15
                } else {
                    this.$emit('colseShow', false)
                    // this.dataForm.reward_type = '4'
                    if (this.dataForm.reward_type != '1' && this.dataForm.reward_type != '4') {
                        this.dataForm.reward_type = '1'
                    }
                    this.dataForm.is_repeat = ''
                    this.dataForm.slot_id = ''

                    // this.dataForm.gift_ratio = 20
                }
            },
            // 获取类型列表
            getPutType() {
                this.getRequest('/xcxTask/getPutType', {}).then((res) => {
                    if (res.code == 200) {
                        this.putType = res.data
                        // console.log(this.dataForm);
                    }
                })
            },
            // 获取归属人列表
            getUserList() {
                this.getRequest('/xcxTask/salesman', {}).then((res) => {
                    if (res.code == 200) {
                        if (res.data) {
                            this.userList = res.data

                            //机构回显归属人
                            if (Object.values(this.userList).length > 0) {
                                this.selfList = []
                                this.getRequest('/xcxTask/getCompanyListNews', {}).then((res) => {
                                    if (res.code == 200) {
                                        if (res.data) {
                                            this.selfList = res.data
                                        }
                                    }
                                })
                            };
                        }
                    } else {

                    }
                })
            },
            // 获取机构列表
            getCompanyList(name) {
                this.getRequest('/xcxTask/getCompanyList', {
                    name: name
                }).then((res) => {
                    if (res.code == 200) {
                        if (res.data) {
                            this.companyList = []
                            for (let key in res.data) {
                                let obj = {
                                    key: '',
                                    value: ''
                                }
                                obj.id = key
                                obj.name = res.data[key]
                                this.companyList.push(obj)
                            }
                        }
                    }
                })
            },
            ownerChange() {
                this.dataForm.company_id = ''
                this.getCompanyList(this.dataForm.owner)
            },
            //选机构回显归属人
            companyChange() {
                this.selfList.forEach(element => {
                    element.company.forEach(ele => {
                        if (this.dataForm.company_id === ele.id) {
                            this.dataForm.owner = element.user_name
                        }
                    });
                });
            },
            getBrowseTime() {
                this.getRequest('/XcxTask/getBrowseSecondTime').then((resp) => {
                    if (resp && resp.code === 200) {
                        this.browseTime = resp.data
                    }
                })
            },
            // 添加时间选择器
            addTimesArr() {
                this.timesArr.push(null)
            },
            //删除
            deleteArr(index) {
                this.timesArr.splice(index, 1)
            },
            // 多段时间选择确认
            chooseTime(val, arrindex) {
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
            // 上传图片
            handleImgSuccess(file, fileList) {
                if (file.code !== 200) {
                    this.$message.error(file.message)
                } else {
                    this.$set(this.dataForm, 'image', file.data)
                }
            },
            handleImgSuccesss(file, fileList) {
                if (file.code !== 200) {
                    this.$message.error(file.message)
                } else {
                    this.$set(this.dataForm, 'image_bubble', file.data)
                }
            },
            // 获取广告位
            // getData () {
            //   this.adSlot = []
            //   this.getRequest('/XcxTask/categorySelect', {mid: this.mid}).then(
            //     (resp) => {
            //       if (resp && resp.code === 200) {
            //         this.adSlot = resp.data
            //       }
            //     }
            //   )
            // },
            //获取小程序列表数据
            getXcxData() {
                var arr = [{
                    id: -1,
                    name: '全选'
                }]
                this.getRequest('/XcxTask/getFixedMiniList').then(
                    (resp) => {
                        if (resp && resp.code === 200) {
                            this.xcxSlot = resp.data
                            for (let i in this.xcxSlot) {
                                let o = {
                                    id: i,
                                    name: this.xcxSlot[i]
                                };
                                arr.push(o)
                            }
                            this.xcxSlot = arr
                        }
                    }
                )
            },
            getTransferXcx() {
                this.getRequest('/ChannelNewUser/getTransferXcx').then(
                    (resp) => {
                        if (resp && resp.code === 200) {
                            this.transferXcx = resp.data
                        }
                    }
                )

            },
            paste(e) {
                // this.dataForm.putType = 1;
                let str = e.clipboardData.getData('text').trim()
                if (str.substr(0, 9) == 'tbopen://' && str.substr(-10, 10) == 'taobaolive') {
                    this.dataForm.put_type = 1
                } else if (str.substr(0, 23) == 'https://h5.m.taobao.com') {
                    this.dataForm.put_type = 1
                } else if (str.indexOf("https://") !== 0 && str !== '' && str.indexOf("h5.m.taobao.com") === 0) {
                    this.dataForm.put_type = 1
                } else if (str.substr(0, 34) == 'https://detail.tmall.com/item.htm?' || str.substr(0, 35) ==
                    'https://item.taobao.com/item.htm?' || str.substr(0, 40) ==
                    'https://uland.taobao.com/coupon/edetail?') {
                    this.dataForm.put_type = 2
                } else if (str.substr(0, 180) ==
                    'tbopen://m.taobao.com/tbopen/index.html?&action=ali.open.nav&module=h5&bootImage=0&source=taobaolive&h5Url=https://market.m.taobao.com/app/tb-source-app/video-fullpage/pages/index?'
                ) {
                    this.dataForm.put_type = 3
                } else if (str.substr(0, 73) ==
                    'https://market.m.taobao.com/app/tb-source-app/video-fullpage/pages/index?') {
                    this.dataForm.put_type = 3
                    str =
                        'tbopen://m.taobao.com/tbopen/index.html?&action=ali.open.nav&module=h5&bootImage=0&source=taobaolive&h5Url=' +
                        encodeURIComponent(str)
                } else if (str.substr(0, 16) == 'https://m.tb.cn/') {
                    this.dataForm.put_type = 4
                } else {
                    this.dataForm.put_type = 0
                }

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
                    } else {
                        this.dataForm.url = encodeURIComponent(str)
                    }
                    return
                }
                if (str.substr(0, 10) == 'alipays://') {
                    e.preventDefault()
                    e.stopPropagation()
                    let query = str.substr(str.indexOf('?') + 1)
                    let params = this.parseQuery(query)
                    this.dataForm.appid = params.appId ? params.appId : ''
                    this.dataForm.path = decodeURIComponent(params.page ? params.page : '')
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
                    this.dataForm.url = encodeURIComponent('https://mobile.yhshapp.com/goods/tbJump?url=' +
                        encodeURIComponent(str))
                } else if (
                    str.substr(0, 57) ==
                    'https://render.alipay.com/p/h5/life_public/www/index.html'
                ) {
                    e.preventDefault()
                    e.stopPropagation()
                    this.dataForm.type = '6'
                    this.dataForm.url = str
                } else if ((str.substr(0, 43) == 'https://h5.m.taobao.com/taolive/video.html?') || (str.substr(0,
                        40) == 'https://m.taobao.com/taolive/video.html?')) {
                    e.preventDefault()
                    e.stopPropagation()
                    let string = str.match(/id=(\d*)(&|$)/);
                    if (string != null) {
                        this.dataForm.url =
                            'alipays://platformapi/startapp?appId=2019091867543618&page=pages%2Flive-room%2Flive-room%3Fid%3D' +
                            string[1] + '&enbsv=0.2.2106102249.59&chInfo=ch_share__chsub_Co'
                        this.dataForm.appid = '2019091867543618'
                        this.dataForm.path = decodeURIComponent('pages%2Flive-room%2Flive-room%3Fid%3D' + string[1])
                        this.dataForm.type = '2'
                        this.dataForm.put_type = 9
                        let userIds = str.match(/userId=(\d*)(&|$)/);
                        if (userIds != null) {
                            this.dataForm.anchor_id = userIds[1];
                        }
                    } else {
                        this.dataForm.type = '7'
                        this.dataForm.url = encodeURIComponent('https://mobile.yhshapp.com/goods/tbJump?url=' +
                            encodeURIComponent(
                                'tbopen://m.taobao.com/tbopen/index.html?&action=ali.open.nav&module=h5&bootImage=0&source=taobaolive&h5Url=' +
                                encodeURIComponent(str)))
                    }

                }
            },
            parseQuery(query) {
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
            submitData() {
                if (!this.couldClick) {
                    return;
                }
                // debugger
                // if(this.dataForm.ads_id.length > 0 && this.dataForm.is_repeat==''){
                //   this.dataForm.is_repeat = '0'
                // }else{
                //   this.dataForm.is_repeat = ''
                // }
                if (!this.dataForm.title) {
                    this.$message.error('请输入标题')
                    return
                }
                if (!this.dataForm.button_text) {
                    this.$message.error('请输入按钮文字')
                    return
                }
                if (this.dataForm.is_repeat && !this.dataForm.ads_id.length && !this.dataForm.slot_id.length) {
                    this.$message.error('请选择小程序')
                    return
                }
                if (!this.dataForm.owner) {
                    this.$message.error('请选择归属人')
                    return
                }
                if (!this.dataForm.company_id) {
                    this.$message.error('请选择机构')
                    return
                }
                if (this.newAnchorId !== '' && this.dataForm.anchor_nickname == '') {
                    this.$message.error('请输入主播昵称')
                    return;
                }

                this.couldClick = false;
                let url = '/XcxTask/addTask'
                if (this.dataForm.id > 0) {
                    url = '/XcxTask/editTask'
                }
                let options = Object.assign({}, this.dataForm)
                options.start_time = options.daterange[0] / 1000
                options.end_time = options.daterange[1] / 1000
                options.time_start = options.timerange[0] / 1000
                options.time_end = options.timerange[1] / 1000

                //多段时间处理
                for (let i = 0; i < this.timesArr.length; i++) {
                    if (this.timesArr[i] == null) {
                        this.$message.warning('多段时间不能为空')
                        this.couldClick = true
                        return
                    }
                }
                if (options.is_repeat == 0 && this.newAnchorId == 0) {
                    //options.is_minute_repeat = 0;
                }

                if (options.is_repeat == 1) {
                    //options.is_minute_repeat = 0;
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
            closeDialog() {
                this.$emit('input', false)
                this.$emit('colseShow', false)
                this.couldClick = true
                this.dataForm.slot_id = ''
                this.firoldurl = ''
                this.oldanchor_id = ''
                this.clearOldData = true
                this.is_tansfer = 0;
                this.timesArr = [null];
            },

            // 提示
            open1(msg) {
                this.$message({
                    showClose: true,
                    message: msg,
                })
            },
            open2(msg) {
                this.$message({
                    showClose: true,
                    message: msg,
                    type: 'success',
                })
            },
            open3(msg) {
                this.$message({
                    showClose: true,
                    message: msg,
                    type: 'warning',
                })
            },
            open4(msg) {
                this.$message({
                    showClose: true,
                    message: msg,
                    type: 'error',
                })
            },
            handleInput() {
                this.rateCom = String(this.rateCom).replace(/[^\.\d]/g, '')
                this.rateCom = String(this.rateCom).replace('.', '')
            },
            rewardTypeChange(val) {
                // if(val == '1'){
                //   this.dataForm.gift_ratio = 20
                // }else if(val == '4'){
                //   this.dataForm.gift_ratio = 15
                // }else{
                //   this.dataForm.gift_ratio = 0
                // }
                this.dataForm.gift_ratio = 0
            },
            clearUrl() {
                this.dataForm.put_type = 0
            },
            cancelRequest(str) {
                if (str == 'source') {
                    if (typeof this.source === 'function') {
                        this.source('请求中断1')
                    }
                } else if (str == 'sourceLine') {
                    if (typeof this.sourceLine === 'function') {
                        this.sourceLine('请求中断2')
                    }
                }

            },
            searchAnchorId(name) {
                const _this = this;
                this.anchorIdInput = true
                this.cancelRequest('sourceLine');

                this.getRequest('/XcxTask/getAnchorNickname', {
                        anchorName: name
                    },
                    new axios.CancelToken((c) => {
                        _this.sourceLine = c
                    }),
                ).then((res) => {
                    if (axios.isCancel(res)) {
                        // this.open2('未加载请求已被中断')
                        this.sourceLine = null
                        return
                    }
                    if (res.code == 200) {
                        if (res.data == null) {
                            this.dataForm.anchor_id = ''
                        } else {
                            this.dataForm.anchor_id = res.data
                        }
                    }
                    this.anchorIdInput = false
                })
            },
        },
        mounted() {
            this.getTransferXcx();
            this.getBrowseTime();
            this.getUserList();
            this.getXcxData()
            this.getPutType();
        },
        watch: {
            // mid: {
            // handler (val) {
            //   this.getData()
            // },
            // immediate: true,
            // },
            //多段时间回显
            dataForm: {
                handler: function (val) {
                    this.oldanchor_id = this.dataForm.anchor_id ? JSON.parse(JSON.stringify(this.dataForm
                        .anchor_id)) : '0'
                    this.firoldurl == '' ? this.dataForm.url ? this.firoldurl = JSON.parse(JSON.stringify(this
                        .dataForm.url)) : '' : '';
                    this.clearOldData = false

                    let pdArr = this.timesArr.filter(item => {
                        return item != null
                    })
                    val.time_list_str == undefined ? this.timesArr = [
                        [val.time_start_str, val.time_end_str]
                    ] : this.timesArr = JSON.parse(JSON.stringify(val.time_list_str))

                    // val.time_list_str == undefined ? (val.time_start_str == undefined || val.time_end_str ==
                    //     undefined) ? '' : this.timesArr = [
                    //     [val.time_start_str, val.time_end_str]
                    // ] : (pdArr.length == 0 && this.timesArr.length == 1) ? this.timesArr = JSON.parse(JSON
                    //     .stringify(val.time_list_str)) : '';
                },
                immediate: true,
            },
            value(val) {
                if (val) {
                    this.getCompanyList(this.dataForm.owner)
                }
            },
            'dataForm.type': {
                handler: function (val) {
                    // if (val == '7') {
                    //     if (this.newAnchorId != this.oldanchor_id && this.newAnchorId != '') {
                    //         this.open3('填入的链接直播间ID或主播ID已修改，恢复为原来的链接')
                    //         this.dataForm.url = this.firoldurl
                    //     }
                    //     else if(this.dataForm.url == '' && this.newAnchorId == ''){
                    //         this.dataForm.url = this.firoldurl
                    //     }
                    // }else{
                    //     this.dataForm.url = ''
                    // }

                    if (val == "17" || val == "18") {
                        this.dataForm.life_id == '' ? '' : this.dataForm.life_id = ''; //选择云猫猫时清除生活组件号
                    }
                },
            },
            'dataForm.anchor_nickname': {
                handler: function (val) {
                    if (val != '') {
                        this.searchAnchorId(val)
                    }
                },
            },
        },
        computed: {
            mList() {
                return this.$store.state.base.xcxList
            },
            dilogTitle() {
                return this.dataForm.id > 0 ? '编辑数据' : '增加数据'
            },
            uploadUrl() {
                return this.$store.state.base.uploadUrl
            },
            newAnchorId() {
                let str = ''
                if (this.dataForm.url.indexOf('userId%25253D') !== -1) {
                    str = decodeURIComponent(decodeURIComponent(decodeURIComponent(this.dataForm.url)))
                } else if (this.dataForm.url.indexOf('userId%253D') !== -1) {
                    str = decodeURIComponent(decodeURIComponent(this.dataForm.url))
                } else if (this.dataForm.url.indexOf('userId%3D') !== -1) {
                    str = decodeURIComponent(this.dataForm.url)
                } else {
                    str = this.dataForm.url
                }
                if (str.indexOf('userId=') !== -1) {
                    let num = 0
                    for (let i = str.indexOf('userId=') + 7; i < str.length; i++) {
                        if (!isNaN(str.charAt(i))) {
                            num = i
                        } else {
                            break;
                        }

                    }
                    this.dataForm.put_type = 1;
                    // return str.substring(str.indexOf('userId=') + 7, num + 1)
                    if (str.substring(str.indexOf('userId=') + 7, num + 1) == this.oldanchor_id) {
                        return str.substring(str.indexOf('userId=') + 7, num + 1)
                    } else {
                        if ((this.dataForm.type == 7 || this.dataForm.type == 9) && this.oldanchor_id != '0' && this
                            .clearOldData == false) {
                            this.clearOldData = false
                            this.open3('直播间ID或主播ID不可更改(链接可更改)')
                            // this.dataForm.url = this.firoldurl
                            this.dataForm.url = this.dataForm.url.split(
                                    `${this.dataForm.url.indexOf('userId%25253D') !== -1 ? 'userId%25253D' : this.dataForm.url.indexOf('userId%253D') !== -1 ? 'userId%253D' : this.dataForm.url.indexOf('userId%3D') !== -1 ? 'userId%3D' : ''}${str.substring(str.indexOf('userId=') + 7, num + 1)}`
                                )
                                .join(
                                    `${this.dataForm.url.indexOf('userId%25253D') !== -1 ? 'userId%25253D' : this.dataForm.url.indexOf('userId%253D') !== -1 ? 'userId%253D' : this.dataForm.url.indexOf('userId%3D') !== -1 ? 'userId%3D' : ''}${this.oldanchor_id}`
                                )
                            // 上面代码就是得这么长，不要回车功能会出错
                            return this.oldanchor_id
                        }
                        return str.substring(str.indexOf('userId=') + 7, num + 1)
                    }

                } else {
                    return ''
                }
            },
            pickerOptions() {
                let shortcuts = {
                    shortcuts: [{
                        text: '最近一周',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            end.setTime(start.getTime() + 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近一个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            end.setTime(start.getTime() + 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近三个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            end.setTime(start.getTime() + 3600 * 1000 * 24 * 90);
                            picker.$emit('pick', [start, end]);
                        }
                    }]
                }
                // return this.$store.state.base.pickerOptions;
                return shortcuts;
            },
            rateCom: {
                get() {
                    if (this.isFocus) {
                        return this.dataForm.gift_ratio
                    } else {
                        return this.dataForm.gift_ratio + '%'
                    }
                },
                set(val) {
                    if (isNaN(val)) {
                        this.dataForm.gift_ratio = 0
                    } else if (val > 20 && this.dataForm.reward_type == '4') {
                        this.dataForm.gift_ratio = 20
                    } else if (val > 30 && this.dataForm.reward_type == '1') {
                        this.dataForm.gift_ratio = 30
                    } else if (val > 100) {
                        this.dataForm.gift_ratio = 100
                    } else {
                        this.dataForm.gift_ratio = val ? val : ''
                    }
                }
            },
        },
    }

</script>

<style scoped lang="scss">
    .el-radio {
        margin-right: 0px !important;
    }

    .el-radio+.el-radio {
        margin-left: 15px;
    }

    .upload-demo {
        text-align: right;
    }

    .el-select {
        display: block;
    }

    //多段时间
    .new_time_picker2 {
        display: inline-block;
        margin: 0 0 10px 0;
        width: 33.3%;
        box-sizing: border-box;

        .el-date-editor {
            width: 371px;
        }

        .delete {
            display: inline-block;
            vertical-align: middle;
            margin-left: 5px;
        }

        .delete:hover {
            cursor: pointer;
        }
    }

    .new_time_picker2:nth-child(3n+2) {
        text-align: center;
    }

    .new_time_picker2:nth-child(3n+3) {
        text-align: right;
    }

</style>
